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
        if(stun)this.rtcConfiguration={iceServers: [{ urls: stun }]}
    }
    createRoom() {
        this.connectToSignalingServer();
        this.ws.onopen = () => {
            console.log("ws.onopen")
            this.createWebRTC();
            this.ws.send(JSON.stringify({type:"host"}))
            this.setLocal(this.pc.createOffer());
        }
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
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
            console.log("ws.onopen")
            this.createWebRTC();
            this.ws.send(JSON.stringify({ type: "guest", id:id}))
        }
        this.ws.onmessage = (event) => {
            const data=JSON.parse(event.data);
            //console.log(data);
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
        this.ws.onclose = () => { console.log("ws.onclose"); this.onwebsocketclose();}
        this.ws.onerror = (error) => { console.log("ws.onerror:", error); }
    }
    disconnectToSignalingServer(){
        if(this.ws)this.ws.close();
    }
    createWebRTC(){
        if(this.pc)this.pc.close();
        if(this.dc)this.dc.close()
        this.pc = new RTCPeerConnection(this.rtcConfiguration);
        
        this.pc.ondatachannel = (event) =>{
            this.dc=event.channel;
            console.log("pc.ondatachannel")
            this.dc.onopen = () => {console.log("dc.onopen");this.ondatachannelopen();this.disconnectToSignalingServer(); };
            this.dc.onmessage = (event) => {this.ondatachannelmessage(event.data)}
            this.dc.onclose = () => {this.ondatachannelclose();}
        }
        this.pc.onicecandidate = (event) =>{
            if(event.candidate){
                console.log("create ice");
                if(this.isWebSocketOpen()) this.ws.send(JSON.stringify({type:"ice", ice:event.candidate}))
                else if(this.isDataChannelOpen()) this.dc.send(JSON.stringify({type:"ice", ice:event.candidate}))
            }
        }
        this.pc.addEventListener('connectionstatechange', event => {
            console.log('Connection state changed to:', this.pc.connectionState);
        });
        this.dc=this.pc.createDataChannel("dataChannel", { reliable: true , ordered: true});
        this.dc.onopen = () => {console.log("dc.onopen");this.ondatachannelopen();this.disconnectToSignalingServer(); };
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
        this.dc.send(message);
        return this.isDataChannelOpen();
    }
    setLocal(sdpPromise){
        sdpPromise.then((sdp)=>{
            console.log("setLocal")
            this.ws.send(JSON.stringify({type:"sdp",sdp:sdp})) // 시그널링 서버에 로컬 sdp 전송
            this.pc.setLocalDescription(sdp)
                .catch((e)=>{console.log(e,sdp)});
        }).catch((e)=>{console.log(e);})
    }
    setRemote(sdpObject){
        console.log("setRemote")
        try{
            this.pc.setRemoteDescription(new RTCSessionDescription(sdpObject))
                .catch((e)=>{console.log(e, sdpObject)})
        }catch(e){
            console.log(e, sdpObject)
        }
    }
    reset(){
        this.resetEvent()
        if(this.pc)this.pc.close()
        this.disconnectToSignalingServer()
    }
    resetEvent(){
        this.onroomcreated=()=>{};
        this.ondatachannelopen=()=>{};
        this.ondatachannelclose=()=>{};
        this.ondatachannelmessage=()=>{};
        this.onwebsocketclose=()=>{};
        this.onroomenterfail=()=>{};
    }
}