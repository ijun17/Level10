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
        this.setGameStatus(false);
        this.playerNum='n';
    },
    enterGame:function(){
        if(Multi.playerNum==='n')Multi.ws.send("^na");
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
                }else{
                    let text = new Text(Screen.perX(50), Screen.perY(70), "게임이 진행중입니다." ,Screen.perX(2), "red",null,100,false);
                }
                break;
            case "s":
                console.log("게임이 시작했습니다.");
                Game.channel[Game.TEXT_CHANNEL]=[];
                //Camera.makeMovingCamera({x:0,y:0},0,0,movingDelay=20)
                Camera.cameraOn=true;
                this.setGameStatus(true);
                break;
            }
    },
    requestHandlerGameOn:function(message){
        if(message[0]==="*"){
            if(message[1]==="l"){
                console.log("게임이 끝났습니다.");
                let resultText;
                let loserNum = 1-Number(message[2]);
                if(message[2]===Multi.playerNum)resultText = new Text(Screen.perX(50), Screen.perY(50),"WIN",Screen.perX(10),"yellow",null,200,false);
                else resultText = new Text(Screen.perX(50), Screen.perY(50),"YOU LOSE",Screen.perX(10),"red",null,200,false);
                Game.channel[Game.PHYSICS_CHANNEL][loserNum].life=0;
                resultText.removeHandler=function(){Multi.setGameStatus(false);}
            }
        } else {//
            let imagers = JSON.parse(message);
            Camera.e=imagers[Number(this.playerNum)].camera;
            for (let i = imagers.length - 1; i >= 0; i--) {
                //draw imager
                let ei = imagers[i];
                switch (imagers[i].t) {
                    case 0:ei.update=function(){};break;

                    case 1://Block
                    ei.update = function () { ctx.fillStyle = "black"; Camera.fillRect(ei.x, ei.y, ei.w, ei.h); }
                    break;

                    case 2://MapBlock
                    ei.update = MapBlock.getTexture(ei.textureType);
                    break;

                    case 3://Matter
                    ei.draw=Matter.getDraw(ei);
                    if(ei.typenum===0)ei.update = function(){ei.draw();if(Game.time%15==0){new Particle(1,ei.x,ei.y);new Particle(0,ei.x,ei.y);}}
                    else ei.update = function(){ei.draw();}
                    break;

                    case 4://Player
                    ei.update=(ei.canDraw?Player.getDraw(ei):function(){});
                    break;

                    case 5://Text
                    ei.update = function(){
                        ctx.textBaseline = "middle";
                        ctx.textAlign = "center";
                        ctx.font = "bold 30px Arial";
                        const textX=Camera.getX(this.x);
                        const textY=Camera.getY(this.y);
                        ctx.strokeStyle = "black";
                        ctx.strokeText(ei.text, textX, textY);
                        ctx.fillStyle = "brown";
                        ctx.fillText(ei.text, textX, textY);
                    } 
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
        this.gameOn = s;
        if (s) {
            //Player View
            const viewTextSize = Screen.perX(1.5);
            const MAX_HP = 10000 * 10;
            const MAX_MP = 20000 * 10;
            const MP_restore = 1 *10;
            const PLAYER_NUM = Number(Multi.playerNum);
            
            let view = new Button(Screen.perX(55), Screen.perX(1), Screen.perX(45), Screen.perX(8), Game.TEXT_CHANNEL);
            view.drawCode = function () {
                let p=Game.channel[Game.PHYSICS_CHANNEL][PLAYER_NUM];
                if(p==undefined)p={life:MAX_HP,mp:MAX_MP,coolTime:[-1,-1,-1,-1]};
                ctx.strokeStyle = "black";
                ctx.strokeRect(view.x, view.y, Screen.perX(18), Screen.perX(2));
                ctx.strokeRect(view.x, view.y + Screen.perX(2.5), Screen.perX(18), Screen.perX(2));
                ctx.fillStyle = "brown";
                ctx.fillRect(view.x, view.y, Screen.perX(18) * (p.life / MAX_HP), Screen.perX(2));
                ctx.fillStyle = "royalblue";
                ctx.fillRect(view.x, view.y + Screen.perX(2.5), Screen.perX(18) * (p.mp / MAX_MP), Screen.perX(2));
                if (p.mp < MAX_MP) p.mp += MP_restore;
                else p.mp = MAX_MP;
                ctx.fillStyle = "black";
                ctx.font = "bold " + viewTextSize + "px Arial";
                ctx.textBaseline = "top";
                ctx.textAlign = "left";
                ctx.fillText(p.life, Screen.perX(55.5), Screen.perX(1.5));
                ctx.fillText(p.mp, Screen.perX(55.5), Screen.perX(4));
                for (let i = 0; i < 4; i++) {
                    if (Magic.skillNum[i] < 0) continue;
                    let magic = Magic.magicList[Magic.skillNum[i]];
                    ctx.fillText(magic[0] + "(" + magic[3] + "): " + (p.coolTime[i] > 0 ? (p.coolTime[i] / 100) : "ready"), Screen.perX(75), Screen.perX(1) + Screen.perX(2) * i);
                }
            }
            //Mobile Mode Button
            const mobileButtonSize=70;
            if (Screen.isMobile) {
                let p=Game.channel[Game.PHYSICS_CHANNEL][PLAYER_NUM];
                if(p==undefined)p={life:MAX_HP,mp:MAX_MP,coolTime:[-1,-1,-1,-1]};
                let leftButton = new Button(5, canvas.height - mobileButtonSize-5, mobileButtonSize, mobileButtonSize);
                leftButton.code = function () { Multi.keyDownHandler({keyCode:37})};
                leftButton.drawOption("rgba(61, 61, 61,0.5)", "black", "<", 80, "black");
                let upButton = new Button(10+mobileButtonSize, canvas.height - mobileButtonSize-5, mobileButtonSize, mobileButtonSize);
                upButton.code = function () { Multi.keyDownHandler({keyCode:38})};
                upButton.drawOption("rgba(61, 61, 61,0.5)", "black", "^", 80, "black");
                let rightButton = new Button(15+mobileButtonSize*2, canvas.height - mobileButtonSize-5, mobileButtonSize, mobileButtonSize);
                rightButton.code = function () {Multi.keyDownHandler({keyCode:39}) };
                rightButton.drawOption("rgba(61, 61, 61,0.5)", "black", ">", 80, "black");
                let keys=["Q","W","E","R"];
                let keyCodes=[81,87,69,82];
                for(let i=0; i<4; i++){
                    let keyButton = new Button(canvas.width-(5*4+mobileButtonSize*4)+i*(mobileButtonSize+5),canvas.height-mobileButtonSize-5,mobileButtonSize,mobileButtonSize);
                    keyButton.code=function(){Multi.keyDownHandler({keyCode:keyCodes[i]})};
                    keyButton.drawCode=function(){
                        ctx.fillStyle=(p.coolTime[i]<0 ?"rgb(121, 140, 205)" : "rgba(61, 61, 61,0.5)");//"rgba(61, 61, 61,0.5)";
                        ctx.fillRect(keyButton.x,keyButton.y,keyButton.w,keyButton.h);
                        ctx.strokeStyle="black";
                        ctx.strokeRect(keyButton.x,keyButton.y,keyButton.w,keyButton.h);
                        ctx.fillStyle="black";
                        ctx.font = "bold "+(mobileButtonSize-20)+"px Arial";
                        ctx.textBaseline = "middle";
                        ctx.textAlign = "center";
                        ctx.fillText(keys[i],keyButton.x+35,keyButton.y+43);
                        ctx.fillStyle="white";
                        ctx.font = "bold 15px Arial";
                        ctx.fillText(Magic.magicList[Magic.skillNum[i]][0],keyButton.x+35,keyButton.y+11);
                    }
                }
            }
        }else{
            Screen.multiplayScreen();
            this.playerNum='n';
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