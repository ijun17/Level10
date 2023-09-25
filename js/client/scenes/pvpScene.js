const MULTI = new SimpleWebRTC("wss://port-0-webrtc-test-eg4e2alkj86xoo.sel4.cloudtype.app/", "stun:stun.l.google.com:19302")


Game.setScene("pvp",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select", ()=>{MULTI.reset()});
    MULTI.reset()
    const roomFormSize=[perX(45),perX(30)];

    const roomForm = ui.add("div",[perX(50)-roomFormSize[0]*0.5,perY(50)-roomFormSize[1]*0.5],roomFormSize,"room-form")
    roomForm.innerHTML=`
        <div class="room-button-container">
            <button class="create-room-button">방 만들기</button>
            <button class="enter-room-button">방 들어가기</button>
        </div>
        <div class="room-input-container">
            <div class="create-room-input-container">
                <input class="create-room-input" placeholder="로딩 중" readonly>
                <p>다른 사람에게 이 코드를 보여주세요</p>
            </div>
            <div class="enter-room-input-container">
                <input class="enter-room-input" placeholder="방 아이디">
                <p>방 아이디를 입력하세요</p>
            </div>
        </div>`    

    const createRoomButton = document.querySelector(".create-room-button")
    const enterRoomButton = document.querySelector(".enter-room-button")
    const createRoomInputContainer = document.querySelector(".create-room-input-container");
    const enterRoomInputContainer = document.querySelector(".enter-room-input-container");
    const createRoomInput = document.querySelector(".create-room-input")
    const enterRoomInput = document.querySelector(".enter-room-input")

    enterRoomButton.onclick = () => {
        MULTI.resetEvent()
        MULTI.disconnectToSignalingServer();
        createRoomButton.classList.remove("room-button-click");
        enterRoomButton.classList.add("room-button-click");
        createRoomInputContainer.style.display = "none";
        enterRoomInputContainer.style.display = "block";
        enterRoomInput.value = "";
    }

    enterRoomInput.onkeyup = (event) => { 
        if (event.key === 'Enter') {
            MULTI.enterRoom(Number(enterRoomInput.value))
            enterRoomInputContainer.style.display = "none";
            MULTI.onroomenterfail = () => {alert("연결을 실패했습니다.(1)");Game.changeScene("pvp")}
            MULTI.onwebsocketclose = () => {alert("연결을 실패했습니다.(2)");Game.changeScene("pvp")}
            MULTI.ondatachannelopen = () => { Game.changeScene("pvp-loading",{isHost:false}) }
        }
    }

    createRoomButton.onclick = () => {
        MULTI.resetEvent()
        MULTI.createRoom();
        MULTI.onwebsocketclose = () => {alert("연결이 끊어졌습니다.(3)")}
        MULTI.onroomcreated = (id) => {
            if (id == -1) alert("방이 꽉찼습니다.")
            else createRoomInput.value = id;
        }
        MULTI.ondatachannelopen = () => { Game.changeScene("pvp-loading",{isHost:true}) }

        createRoomButton.classList.add("room-button-click");
        enterRoomButton.classList.remove("room-button-click");
        createRoomInputContainer.style.display = "block";
        enterRoomInputContainer.style.display = "none";
        createRoomInput.value = "";
    }

    enterRoomButton.click()
})










Game.setScene("pvp-loading",function(para){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY = SCREEN.perY.bind(SCREEN);
    MULTI.resetEvent()
    ReusedModule.createbackButton("select", () => { MULTI.reset() });
    const loader = ui.add("div", [perX(50) - perX(2), perY(50) - perX(2)], [perX(4), perX(4)], "loader")
    MULTI.ondatachannelclose = () => {
        alert("연결이 끊어졌습니다.(4)")
        Game.changeScene("pvp")
    }
    
    let message = JSON.stringify({ type: "magic", magic: MagicManager.getSelectedPrimitiveMagic() })
    MULTI.send(message)
    //TIME.addSchedule(0,undefined,1,()=>{MULTI.send(message)})

    MULTI.ondatachannelmessage = (m) => {
        console.log("peer : ", m);
        const data = JSON.parse(m)
        if (data.type == "magic") {
            const peerMagic = data.magic
            console.log("상대 마법 로딩 완료", peerMagic)
            let magicList=[]
            for(let i=0; i<peerMagic.length; i++){
                magicList.push(MagicManager.createMagicSkill(i, peerMagic[i]))
            }
            Game.changeScene("pvp-game",{isHost:para.isHost, magicList: magicList})
        }
    }
})










Game.setScene("pvp-game", function(para){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY = SCREEN.perY.bind(SCREEN);
    MULTI.resetEvent()
    ReusedModule.createbackButton("select", () => { MULTI.reset() });

    ReusedModule.createGameMap(2000,1000)
    WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
    WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.01);
    ReusedModule.fireflyWeather()
    SCREEN.renderer.bgColor="rgb(108, 141, 150)"

    const P = [WORLD.add(new Player([100,0],10)), WORLD.add(new Player([1900,0],10))]
    P[1].moveModule.moveDirection[0]=false;
    const ME = (para.isHost ? 0 : 1) //나 인덱스
    const OTHER = (para.isHost ? 1 : 0) //상대 인덱스
    P[ME].addEventListener("remove",()=>{
        let stageClearText=SCREEN.ui.add("div",[0,0],[SCREEN.perX(100),SCREEN.perY(100)],"playerDieText");
        stageClearText.innerText="YOU LOSE";
        TIME.addSchedule(2,2,undefined,()=>{Game.changeScene("pvp");MULTI.reset()});
    })
    P[OTHER].addEventListener("remove",()=>{
        let stageClearText=SCREEN.ui.add("div",[0,0],[SCREEN.perX(100),SCREEN.perY(100)],"stageClearText");
        stageClearText.innerText="YOU WIN";
        let clearTextY=0;
        TIME.addSchedule(0,4,undefined,function(){stageClearText.style.bottom=(clearTextY--)+"px"});
        TIME.addSchedule(4,4,undefined,()=>{Game.changeScene("pvp");MULTI.reset()});
    })
    P[ME].renderStatusBar([perX(10),perY(100)-perX(10)])
    P[OTHER].skillModule.skillList = para.magicList
    SCREEN.renderer.camera.addTarget(P[ME].body);

    const SYNC_TICK = 3; //n 틱마다 서로 동기화 메시지를 보냄
    let isSync = true;
    let input = [['0','0','0','0','0','0','0','0'],['0','0','0','0','0','0','0','0']] //모든 입력은 SYNC_TICK이후 적용됨
    let meInput = ['0','0','0','0','0','0','0','0']

    function solveInput(){
        let message = ""
        for(let i=0; i<8; i++){
            if(input[0][i]=='1')P[0].onkeydown(i,[0,1,2,3],[4,5,6,7])
            else if(input[0][i]=='2')P[0].onkeyup(i,[0,1,2,3])
            if(input[1][i]=='1')P[1].onkeydown(i,[0,1,2,3],[4,5,6,7])
            else if(input[1][i]=='2')P[1].onkeyup(i,[0,1,2,3])
            input[ME][i]=meInput[i]
            message+=meInput[i]
            meInput[i]='0'
        }
        //입력처리
        isSync=false
        MULTI.send(message)
    }

    TIME.addSchedule(0,undefined,SYNC_TICK*0.01, ()=>{
        //SYNC_TICK 틱마다 상대의 입력이 수신되었는지 확인하고 수신되지 않았으면 중지
        if(isSync){
            solveInput()
        }else{
            TIME.stop()
        }
    })


    USER_INPUT.addEventListener("keydown", (e, para)=>{ // moveKey=[39, 37, 38, 40], skillKey=[81, 87, 69, 82]
        switch(e.keyCode){
            case 39: meInput[0]='1'; break;
            case 37: meInput[1]='1'; break;
            case 38: meInput[2]='1'; break;
            case 40: meInput[3]='1'; break;
            case 81: meInput[4]='1'; break;
            case 87: meInput[5]='1'; break;
            case 69: meInput[6]='1'; break;
            case 82: meInput[7]='1'; break;
        }
    })
    USER_INPUT.addEventListener("keyup", (e, para)=>{
        switch(e.keyCode){
            case 39: meInput[0]='2'; break;
            case 37: meInput[1]='2'; break;
            case 38: meInput[2]='2'; break;
            case 40: meInput[3]='2'; break;
        }
    })

    if(localStorage.getItem("mobile")==='1'){
        const BTN_W=perX(10);
        const BTN_SIZE=[BTN_W,BTN_W];
        const MOVE_RUN=(P[ME].moveModule.moveType===0)
        const MOVE_BUTTON_TEXT=(MOVE_RUN?['<','^','>']:['<','v','>','^']);
        const MOVE_BUTTON_POS=(MOVE_RUN?[[perX(1),perX(1)],[perX(2)+BTN_W,perX(1)],[perX(3)+BTN_W*2,perX(1)]]: [[perX(1),perX(1)],[perX(2)+BTN_W,perX(1)],[perX(3)+BTN_W*2,perX(1)],[perX(2)+BTN_W,perX(2)+BTN_W]])
        const MOVE_HANDLER_CODE=(MOVE_RUN?[1,2,0]:[1,3,0,2]);
        for(let i=0; i<MOVE_BUTTON_TEXT.length; i++){
            let btn = WORLD.add(new Button(MOVE_BUTTON_POS[i],BTN_SIZE,"white",MOVE_BUTTON_TEXT[i]))
            btn.ontouchstart=()=>{meInput[MOVE_HANDLER_CODE[i]]='1'}
            btn.ontouchmove=()=>{meInput[MOVE_HANDLER_CODE[i]]='1'}
            btn.ontouchend=()=>{meInput[MOVE_HANDLER_CODE[i]]='2'}
            P[ME].addEventListener("remove",()=>{btn.setState(0);return true})
        }
        
        const SKILL_BUTTON_TEXT=['Q','W','E','R'];
        const SKILL_BUTTON_POS=[[perX(96)-BTN_W*4,perX(1)],[perX(97)-BTN_W*3,perX(1)],[perX(98)-BTN_W*2,perX(1)],[perX(99)-BTN_W,perX(1)]]
        for(let i=0; i<4; i++){
            let btn = WORLD.add(new Button(SKILL_BUTTON_POS[i],BTN_SIZE,"white",SKILL_BUTTON_TEXT[i]))
            btn.ontouchstart=()=>{meInput[4+i]='1'}
            btn.update=()=>{btn.color=P[ME].skillModule.canCast(i) ? "royalblue" : "white"}
            P[ME].addEventListener("remove",()=>{btn.setState(0);return true})
        }
        ReusedModule.userInputTouchSet()
    }

    

    function isValidMessage(m){
        return m.length==8;
    }
    MULTI.ondatachannelmessage = (m) => {
        if(!isValidMessage(m))return;
        for(let i=0; i<8; i++)input[OTHER][i]=m[i]
        isSync=true;
        TIME.isStop=false;
    }

    MULTI.ondatachannelclose = () => {
        alert("연결이 끊어졌습니다.")
        Game.changeScene("pvp")
    }
})