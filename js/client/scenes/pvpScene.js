const MULTI = new SimpleWebRTC("wss://"+localStorage.getItem("signaling"), "stun:stun.l.google.com:19302")

Game.setScene("pvp",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    SCREEN.renderer.camera.setScreenPos([SCREEN.perX(50), SCREEN.perY(35)])
    ReusedModule.createbackButton("select", ()=>{MULTI.reset()});
    MULTI.reset()
    MULTI.signaling="ws://"+localStorage.getItem("signaling");
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
        </div>
        <div style="text-align:center;color:gray;">server: ${localStorage.getItem("signaling")}</div>`    

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
        if(createRoomButton.classList.contains("room-button-click"))return
        MULTI.resetEvent()
        MULTI.createRoom();
        MULTI.onwebsocketclose = () => {
            alert("연결이 끊어졌습니다.(3)"); 
            Game.changeScene("pvp")
        }
        MULTI.onroomcreated = (id) => {
            if (id == -1) {
                alert("방이 꽉찼습니다.")
                Game.changeScene("pvp")
            }
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
    ReusedModule.createbackButton("pvp", () => { MULTI.reset() });
    const loader = ui.add("div", [perX(50) - perX(2), perY(50) - perX(2)], [perX(4), perX(4)], "loader")
    MULTI.ondatachannelclose = () => {
        alert("연결이 끊어졌습니다.(4)")
        Game.changeScene("pvp")
    }

    let magicList=[]
    let magicLoaded=false;
    let otherComplete=false;
    
    let message = JSON.stringify({ type: "magic", magic: MagicManager.getSelectedPrimitiveMagic() })
    TIME.addSchedule(0,undefined,0.5,()=>{MULTI.send(message)})
    TIME.addSchedule(0,undefined,0.01,()=>{
        if(magicLoaded&&otherComplete)Game.changeScene("pvp-game",{isHost:para.isHost, magicList: magicList})
    })
    
    MULTI.ondatachannelmessage = (m) => {
        if(m[0]!="{")return
        const data = JSON.parse(m)
        console.log("message type : ", data.type);
        if (data.type == "magic" && !magicLoaded) {
            const peerMagic = data.magic
            for(let i=0; i<peerMagic.length; i++){
                magicList.push(MagicManager.createMagicSkill(i, peerMagic[i]))
            }
            console.log("상대 마법 로딩 완료", peerMagic.length)
            magicLoaded=true
            MULTI.send(JSON.stringify({type:"complete"}))
            TIME.addSchedule(0,undefined,0.5,()=>{MULTI.send(JSON.stringify({type:"complete"}))})
        }
        if (data.type == "complete"){
            otherComplete=true
        }
    }
    SCREEN.renderer.camera.zoom=0.9;
    ReusedModule.fireflyWeather(50,20)
    SCREEN.renderer.bgColor="rgb(108, 141, 150)"
})










Game.setScene("pvp-game", function(para){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY = SCREEN.perY.bind(SCREEN);
    MULTI.resetEvent()
    ReusedModule.createbackButton("pvp", () => { MULTI.reset();MULTI_TIME.stop() });

    SCREEN.renderer.camera.zoom=0.9;
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
        TIME.addSchedule(2,2,undefined,()=>{MULTI.reset();MULTI_TIME.stop();Game.changeScene("pvp");});
    })
    P[OTHER].addEventListener("remove",()=>{
        let stageClearText=SCREEN.ui.add("div",[0,0],[SCREEN.perX(100),SCREEN.perY(100)],"stageClearText");
        stageClearText.innerText="YOU WIN";
        let clearTextY=0;
        TIME.addSchedule(0,4,undefined,function(){stageClearText.style.bottom=(clearTextY--)+"px"});
        TIME.addSchedule(4,4,undefined,()=>{MULTI.reset();MULTI_TIME.stop();Game.changeScene("pvp");});
    })
    P[ME].renderStatusBar([perX(10),perY(100)-perX(10)])
    P[OTHER].skillModule.skillList = para.magicList
    SCREEN.renderer.camera.addTarget(P[ME].body);


    const SYNC_TICK = 5; //n 틱마다 서로 동기화 메시지를 보냄
    let syncCode=0; //싱크 코드와 TIME.tick은 대칭이어야함
    let messageQueue=new Array(10)
    let isSync = true;
    let input = [['0','0','0','0','0','0','0','0'],['0','0','0','0','0','0','0','0']] //모든 입력은 SYNC_TICK이후 적용됨
    let meInput = ['0','0','0','0','0','0','0','0'] 
    function solveInput(){ //상대와 나의 입력 정보를 게임에 반영
        let message = ""
        for(let i=0; i<8; i++){
            for(let j=0; j<2; j++){
                if(input[j][i]=='1')P[j].onkeydown(i,[0,1,2,3],[4,5,6,7])
                else if(input[j][i]=='2')P[j].onkeyup(i,[0,1,2,3])
            }
            input[ME][i]=meInput[i]
            message+=meInput[i]
            meInput[i]='0'
        }
        //sync_code와 TIME.tick은 대칭 깨지면
        if((TIME.get()-1)%50!=syncCode*5)console.log("씨발ehdrlghk",TIME.get(), syncCode)
        //다음 입력 처리
        syncCode=(syncCode+1)%10
        messageQueue[syncCode]=message+syncCode
        messageQueue[(syncCode+1)%10]=null //10(syncCode) 전에 걸 보낼 수 있으니까 지움
        isSync=false //입력처리를 다하면 다음 입력을 받기 위해
    }
    //SYNC_TICK 틱마다 상대의 입력이 수신되었는지 확인하고 수신되지 않았으면 중지 FUcking robustic
    TIME.addSchedule(0.01,undefined,SYNC_TICK*0.01,()=>{if(isSync)solveInput()})
    TIME.addSchedule(0,undefined,SYNC_TICK*0.01, ()=>{if(!isSync)TIME.stop()})
    const MULTI_TIME = new GameTime(()=>{if(!isSync)MULTI.send("s"+syncCode)});
    MULTI_TIME.start()

    //사용자 물리적 입력
    ReusedModule.userInputMultiKeySet(meInput)
    if(localStorage.getItem("mobile")==='1')ReusedModule.multiMobileButton(P[ME],meInput)

    //데이터 채널 메시지 처리
    function isSyncedInputMessage(m){return m.length==9 && m[8] == syncCode && !isSync}
    function isSyncMessage(m){return m.length==2 && m[0]=='s'}
    MULTI.ondatachannelmessage = (m) => {
        if(isSyncedInputMessage(m)){
            for(let i=0; i<8; i++)input[OTHER][i]=m[i]
            isSync=true;
            TIME.start();
        }else if(isSyncMessage(m)){
            let mes=messageQueue[Number(m[1])]
            if(mes)MULTI.send(mes)
        }
        
    }

    MULTI.ondatachannelclose = () => {
        alert("연결이 끊어졌습니다.")
        MULTI.reset();
        MULTI_TIME.stop()
        Game.changeScene("pvp")
    }
})



