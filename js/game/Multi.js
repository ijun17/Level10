/*
송신 메시지 구조(클라이언트가 서버에게)
^(사람)(행위)(a)(b)...
<CLIENT>
구조 - ^(플레이어번호)(행위)(a)(b)...
플레이어번호 - n:미지정 0:0번 1:1번
행위 - 게임하지않을때(a:게임에참가요청 m:매직코드전송 )

수신 메시지 구조(서버가 클라이언트에게)
(행위)...
행위 - 송신메시지와 같고 메시지가 실패했는지 성공했는지, 상태가 어떤지 정보를 알려줌... +서버만 가지는 메시지 i(render image)

멀티플레이어 방식 - 서버는 엔진만, 클라이언트는 이미지 레더링만
이미지 렌더링에 필요한 것 x,y,w,h,image(Matter, Player),entityType(플레이어,블럭,맵블럭,매터,트리거,텍스트),isRight(player),isMoved(player)

*/

let Multi = {
    ws:null,
    connect:false,
    serverOn:false,
    gameOn:false,
    IP:"211.194.75.223",
    playerNum:'n', //n:익명 0:1번째플레이어 1:2번째플레이어
    makeWebSocket: function () {
        this.ws = new WebSocket("ws://"+Multi.IP+":777");
        // 연결이 수립되면 서버에 메시지를 전송한다
        this.ws.onopen = function (event) {
            Multi.serverOn=true;
        }
        // 서버로 부터 메시지를 수신한다
        this.ws.onmessage = function (event) {
            //console.log("SERVER: "+event.data);
            if(Multi.gameOn)Multi.requestHandlerGameOn(event.data);
            else Multi.requestHandlerGameOff(event.data);
        }
        // error event handler
        this.ws.onerror = function (event) {
            Multi.serverOn=false;
            if(Multi.connect)Multi.makeWebSocket();
        }
    },
    connectOn:function(){
        this.makeWebSocket();
        this.connect=true;
    },
    connectOff:function(){
        this.connect=false;
        if(this.ws!=null)this.ws.close();
        this.serverOn=false;
        this.resetMulti();
    },
    resetMulti:function(){
        this.gameOn=false;
        this.playerNum='n';
    },
    enterGame:function(){
        if(this.playerNum=='n')this.ws.send("^na");
    },
    requestHandlerGameOff:function(message){
        if(message[0]==="*")
        switch(message[2]){
            case "a":
                this.playerNum=message[1];
                if(this.playerNum!="n"){
                    console.log("게임에 참여했습니다.");
                    let text = new Text(Screen.perX(50), Screen.perY(70), "게임에 참여했습니다." ,Screen.perX(2), "black",null,100,false);
                    text.removeHandler=function(){new Text(Screen.perX(50), Screen.perY(70), "참가자를 기다리는 중..." ,Screen.perX(2), "black",null,-1,false);}
                    let magicList=[];
                    for(let i=0;i<4;i++){
                        let skillNum=Magic.skillNum[i];
                        if(skillNum<0)magicList[i]=null;
                        else magicList[i]=(skillNum<Magic.basicMagicCount?Magic.basicMagic[skillNum] : Magic.customMagic[skillNum-Magic.basicMagicCount]);
                    }
                    this.ws.send("^"+this.playerNum+"m"+JSON.stringify(magicList))
                }
                break;
            case "s":
                console.log("게임이 시작했습니다.");
                Game.channel[Game.TEXT_CHANNEL]=[];
                Camera.makeMovingCamera({x:0,y:0},0,0,movingDelay=20)
                this.gameOn=true;
                break;
            }
    },
    requestHandlerGameOn:function(message){
        if(message[0]==="*"){
            if(message[1]==="l"){
                console.log("게임이 끝났습니다.");
                let resultText;
                if(message[2]===this.playerNum)resultText = new Text(Screen.perX(50), Screen.perY(50),"WIN",Screen.perX(10),"yellow",null,200,false);
                else resultText = new Text(Screen.perX(50), Screen.perY(50),"YOU LOSE",Screen.perX(10),"red",null,200,false);
                resultText.removeHandler=function(){Game.channel[Game.PHYSICS_CHANNEL]=[]}
                this.resetMulti();
            }
        } else {//
            let imagers = JSON.parse(message);
            Camera.e.temp=imagers[Number(this.playerNum)];
            for (let i = imagers.length - 1; i >= 0; i--) {
                //draw imager
                let ei = imagers[i];
                switch (imagers[i].t) {
                    case 1://Block
                    ei.update = function () { ctx.fillStyle = "black"; Camera.fillRect(ei.x, ei.y, ei.w, ei.h); }
                    break;

                    case 2://MapBlock
                    ei.update = MapBlock.getTexture(ei.textureType);
                    break;

                    case 3://Matter
                    ei.img = new Image;
                    ei.img.src = "resource/matter/" + MATTERS[ei.typenum].name + ".png";
                    ei.draw=Matter.getDraw();
                    if(ei.typenum===0)ei.update = function(){ei.x+=ei.vx;ei.y-=ei.vy;ei.draw();if(Game.time%15==0){new Particle(1,ei.x,ei.y);new Particle(0,ei.x,ei.y);}}
                    else ei.update = function(){ei.x+=ei.vx;ei.y-=ei.vy;ei.draw();}
                    break;

                    case 4://Player
                    ei.animation = new Animation("resource/player/"+`player.png`,30,60,[1,1],function(){
                        if(ei.moveFlag)return 1;
                        else return 0;
                    });
                    ei.draw=Player.getDraw();
                    ei.update=function(){ei.x+=ei.vx;ei.y-=ei.vy;ei.draw();}
                    break;

                    case 5://Text
                    ei.update = function () {}   
                    break;                     
                    case 6://Trigger
                    ei.update = Trigger.getDraw();
                    break;
                }

            }
            Game.channel[Game.PHYSICS_CHANNEL]=imagers;
        }
    },
    setGameStatus:function(s){
        if(s===this.gameOn)return;
        this.gameOn=s;
        if(this.gameOn){
            
        }else{

        }
    },
    keyDownHandler:function(e){
        switch (e.keyCode) {
            case 39:Multi.ws.send("^"+Multi.playerNum+"d0");break;//right
            case 37:Multi.ws.send("^"+Multi.playerNum+"d1");break;//left
            case 38:Multi.ws.send("^"+Multi.playerNum+"d2");break;//up
            case 32:Multi.ws.send("^"+Multi.playerNum+"d2");break;//space
            case 81:Multi.ws.send("^"+Multi.playerNum+"dq");break; //q
            case 87:Multi.ws.send("^"+Multi.playerNum+"dw");break; //w
            case 69:Multi.ws.send("^"+Multi.playerNum+"de");break; //e
            case 82:Multi.ws.send("^"+Multi.playerNum+"dr");break; //r
        }
    },
    keyUpHandler:function(e){
        switch (e.keyCode) {
            case 39:Multi.ws.send("^"+Multi.playerNum+"u0");break;//right
            case 37:Multi.ws.send("^"+Multi.playerNum+"u1");break;//left
        }
    }
}