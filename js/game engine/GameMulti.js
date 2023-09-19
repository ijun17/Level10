class GameMulti{
    webrtc;
    constructor(signalingServerUrl, stunServerUrl){
        this.webrtc=new SimpleWebRTC(signalingServerUrl, stunServerUrl);
    }
    
}