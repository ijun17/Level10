class SimpleWebRTC{
    signaling;
    rtcConfiguration=null;
    ws;
    pc;
    dc;
    onroomcreated(){}
    ondatachannelopen(){}
    ondatachannelclose(){}
    ondatachannelmessage(){}
    onwebsocketclose(){}
    onroomenterfail(){}
    constructor(signaling,stun){
        this.signaling=signaling;

        this.rtcConfiguration = {
            bundlePolicy: "max-bundle",
            iceCandidatePoolSize: 0,
            iceTransportPolicy: "all"
        };
        if(stun)this.rtcConfiguration.iceServers=[{urls: stun}]
    }
    createRoom() {
        this.connectToSignalingServer();
        this.ws.onopen = () => {
            console.log("signaling: connect")
            this.createWebRTC(true);
            this.ws.send(JSON.stringify({type:"host"}))
            this.setLocal(this.pc.createOffer());
        }
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("signaling: onmessage",data);
            this.sendLog(data.type)
            switch(data.type){
                case "hostid" : this.onroomcreated(data.id); break;
                case "sdp"    : this.setRemote(data.sdp); break;
                case "ice"    : this.pc.addIceCandidate(new RTCIceCandidate(data.ice)); break;
                default       : this.ws.close(); 
            }
        }
    }
    enterRoom(id){
        this.connectToSignalingServer();
        this.ws.onopen = (event) => {
            console.log("signaling: connect")
            this.createWebRTC(false);
            this.ws.send(JSON.stringify({ type: "guest", id:id}))
        }
        this.ws.onmessage = (event) => {
            const data=JSON.parse(event.data);
            console.log("signaling: onmessage",data);
            this.sendLog(data.type)
            switch(data.type){
                case "sdp":
                    this.setRemote(data.sdp);
                    this.setLocal(this.pc.createAnswer());
                    break;
                case "ice":
                    this.pc.addIceCandidate(new RTCIceCandidate(data.ice));
                    break;
                default :
                    this.onroomenterfail();
                    break;
            }
        }
    }
    connectToSignalingServer(){
        this.disconnectToSignalingServer();
        this.ws = new WebSocket(this.signaling);
        this.ws.onclose = () => { console.log("signaling: close"); this.onwebsocketclose();}
        this.ws.onerror = (error) => { console.log("signaling: websocket error:", error) }
    }
    disconnectToSignalingServer(){
        if(this.ws)this.ws.close();
    }
    disconnectPeerConnection(){
        if(this.pc)this.pc.close();
        if(this.dc)this.dc.close();
        this.pc=null;
        this.dc=null;
    }
    createWebRTC(isHost){
        this.disconnectPeerConnection();
        this.pc = new RTCPeerConnection(this.rtcConfiguration);
        if(!isHost)
            this.pc.ondatachannel = (event) =>{
                this.dc=event.channel;
                this.applyDatachannelEvent();
            };
        this.pc.onicecandidate = (event) =>{
            if(event.candidate){
                console.log("peerconnection: onicecandidate",event.candidate)
                const candidateInfo = {candidate:event.candidate.candidate, sdpMLineIndex:event.candidate.sdpMLineIndex, sdpMid:event.candidate.sdpMid}
                console.log(candidateInfo)
                if(this.isWebSocketOpen()) this.ws.send(JSON.stringify({type:"ice", ice:candidateInfo}))
                else if(this.isDataChannelOpen()) this.dc.send(JSON.stringify({type:"ice", ice:candidateInfo}))
            }
        }
        this.pc.addEventListener("connectionstatechange", (event) => {
            console.log("peerconnection: connectionstatechange:",this.pc.connectionState)
            if(this.pc.connectionState=="disconnected") {
                this.ondatachannelclose();
                this.disconnectPeerConnection();
            }
        });
        this.pc.oniceconnectionstatechange = (e) => {
            console.log('peerconnection: oniceconnectionstatechange:', this.pc.iceConnectionState);
            if (this.pc.iceConnectionState === 'connected' || this.pc.iceConnectionState === 'completed') {
                // 선택된 ICE 후보를 출력
                // const selectedCandidatePair = this.pc.getSenders[0].transport.iceTransport.getSelectedCandidatePair();
                // if (selectedCandidatePair) {
                //     console.log('Selected ICE candidates:', selectedCandidatePair);
                // }
            }
        };
        if(isHost){
            this.dc = this.pc.createDataChannel("dataChannel", { reliable: true , ordered: true});
            this.applyDatachannelEvent();
        }
    }
    applyDatachannelEvent(){
        this.dc.onopen = () => {this.ondatachannelopen();  console.log("datachannel: open"); this.disconnectToSignalingServer();};
        this.dc.onmessage = (event) => {this.ondatachannelmessage(event.data)}
        this.dc.onclose = () => {this.ondatachannelclose();}
    }
    isWebSocketOpen() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
    isDataChannelOpen(){
        return this.dc && this.dc.readyState === 'open';
    }
    send(message){
        try{
            this.dc.send(message);
        }catch(e){
            console.error(e);
        }
        return this.isDataChannelOpen();
    }
    sendLog(log){
        if(this.isWebSocketOpen())this.ws.send(JSON.stringify({type:"log", log:log}))
    }
    setLocal(sdpPromise){
        sdpPromise.then((sdp)=>{
            console.log("peerconnection: setLocalDescription")
            this.ws.send(JSON.stringify({type:"sdp",sdp:sdp})) // 시그널링 서버에 로컬 sdp 전송
            this.pc.setLocalDescription(sdp)
                .catch((e)=>{console.error("peerconnection: setLocalDescription error",e,sdp)});
        }).catch((e)=>{console.error("peerconnection: setLocalDescription error",e);})
    }
    setRemote(sdpObject){
        console.log("peerconnection: setRemoteDescription")
        try{
            this.pc.setRemoteDescription(new RTCSessionDescription(sdpObject))
                .catch((e)=>{console.error("peerconnection: setRemoteDescription error",e, sdpObject)})
        }catch(e){
            console.error("peerconnection: setRemoteDescription error",e, sdpObject)
        }
    }

    resetEvent(){
        this.onroomcreated=()=>{};
        this.ondatachannelopen=()=>{};
        this.ondatachannelclose=()=>{};
        this.ondatachannelmessage=()=>{};
        this.onwebsocketclose=()=>{};
        this.onroomenterfail=()=>{};
    }

    reset(){
        this.resetEvent()
        if(this.pc)this.pc.close()
        this.disconnectToSignalingServer()
    }
}