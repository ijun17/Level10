function startFs(element) {
    //canvas.requestFullScreen();
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.webkitRequestFullScreen ) {
        element.webkitRequestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen(); // IE
    } else {
        return;
    }
    canvas.width = screen.width;
    canvas.height = screen.height;
}

function exitFs(element) {		
    if (element.exitFullscreen){
        element.exitFullscreen();
    }else if(element.cancelFullScreen) {
        element.cancelFullScreen();
    } else if(element.webkitCancelFullScreen ) {
        element.webkitCancelFullScreen();
    } else if(element.mozCancelFullScreen) {
        element.mozCancelFullScreen();
    } else if (element.msExitFullscreen) {
        element.msExitFullscreen(); // IE        
    }
    canvas.width = Screen.CANVAS_W;
    canvas.height = Screen.CANVAS_H;
}




let Screen= {
    //const
    CANVAS_W:1200,
    CANVAS_H:600,

    //screen status
    isMobile : false,
    bgColor : "black",

    perX:function(percentile){
        return Math.floor(canvas.width*0.01*percentile);
    },
    perY:function(percentile){
        return Math.floor(canvas.height*0.01*percentile);
    },

    mainScreen:function() {
        Game.resetGame();
        Component.particleSpray(3,{x:Screen.perX(50),y:0}, Screen.perX(120), 20, 1, 10);

        var startButton = new Button((canvas.width - Screen.perX(25))/2, (canvas.height-Screen.perX(8))/2, Screen.perX(25), Screen.perX(8));
        startButton.canAct=true;
        startButton.code = function () { 
            const ash_interval = Screen.perX(25/30);
            for(let i=0; i<30; i++){
                for(let j=0; j<10; j++){
                    let e = new Particle(3, startButton.x+i*ash_interval, startButton.y+j*ash_interval);
                    e.ga=0;
                    e.w=ash_interval*1.7;
                    e.h=ash_interval*1.7;
                    e.vx/=20/ash_interval;
                    e.vy/=20/ash_interval;
                }
            }
            startButton.addAction(50,50,function(){Screen.selectScreen();});
            startButton.draw=function(){};
            startButton.code=function(){};
        };
        startButton.drawOption(null, "black", "START", Screen.perX(6), "black");
        
        let clickHereText = new Button(Screen.perX(50),Screen.perY(62),0,0);
        clickHereText.drawOption(null, null, "click here",Screen.perX(1.6),"black");
        //decorate1
        new Text(Screen.perX(50),Screen.perY(90), "Magic & Monster & Arena", Screen.perX(5),"rgb(42, 42, 42)",null,-1,false);
        new MapBlock(Screen.perX(5),Screen.perY(62),Screen.perX(15),Screen.perY(30));
        new MapBlock(Screen.perX(27),Screen.perY(70),Screen.perX(15),Screen.perY(50));
        new MapBlock(Screen.perX(58),Screen.perY(70),Screen.perX(15),Screen.perY(50));
        new MapBlock(Screen.perX(80),Screen.perY(62),Screen.perX(15),Screen.perY(30));
        new MapBlock(Screen.perX(8),Screen.perY(80),Screen.perX(84),Screen.perY(50));
    },

    selectScreen:function() {
        Game.resetGame();

        const space=Screen.perX(1);

        let ashSpray = new Button(-100,-100,0,0,Game.BUTTON_CHENNEL);
        ashSpray.canAct=true;
        ashSpray.canInteract=false;
        ashSpray.addAction(1,1000000,function(){
            if(Game.time%10==0){
                let r = Math.random()*canvas.width;
                let ash=new Particle(3,r,0);
                ash.w=20;
                ash.h=20;
                ash.life=400;
                ash.vy-=1.5;
            }
        });
        //BACK
        Component.backButton(function () { Screen.mainScreen() });
        //HELP BUTTON
        let helpButton = new Button(space, canvas.height-space-Screen.perX(3), Screen.perX(3), Screen.perX(3));
        helpButton.code = function () { Screen.helpScreen() };
        helpButton.drawOption(null, "white", "?", Screen.perX(3),"white");
        //MOBILE MODE BUTTON
        let mobileButton = new Button(canvas.width - space - Screen.perX(8), canvas.height - space - Screen.perX(3), Screen.perX(8), Screen.perX(3));
        mobileButton.code = function () {
            if(!Screen.isMobile){Input.convertToMobileMode(true);}
            startFs(canvas);
            Screen.isMobile=true;
            Screen.mainScreen();
            let full = new Button((canvas.width - 300)/2, (canvas.height-100)/2, 300, 100);
            full.code=function(){startFs(canvas);full.x=10000;Input.click((canvas.width - 300)/2+150, (canvas.height-100)/2+50);}
        };
        mobileButton.drawOption(null,"black","to mobile",Screen.perX(1.7),"black");
        //SELECT MAGIC BUTTON
        let selectMagicButton = new Button(canvas.width - Screen.perX(16)-space, space, Screen.perX(16), Screen.perX(4));
        selectMagicButton.code = function () { Screen.selectMagicScreen(); };
        selectMagicButton.drawOption(null, "black", "select magic", Screen.perX(2.5), "black");//"rgb(119, 138, 202)"
        //MAKE MAGIC BUTTON
        let makeMagicButton = new Button(canvas.width - Screen.perX(16)-space, 2*space+Screen.perX(4), Screen.perX(16), Screen.perX(4));
        makeMagicButton.code = function () { Screen.makeMagicScreen(); };
        makeMagicButton.drawOption(null, "black", "create magic", Screen.perX(2.5), "black");//"rgb(65, 105, 225)"
        //PVP
        let multiplayButton =new Button(canvas.width - Screen.perX(16)-space, 3*space+Screen.perX(8),Screen.perX(16), Screen.perX(4));
        multiplayButton.code = function () { Screen.pvpScreen(); };
        multiplayButton.drawOption(null, "purple", "PVP", Screen.perX(2.5), "purple");//"rgb(65, 105, 225)"

        //LEVEL BUTTON
        let block = new Button((canvas.width - Screen.perX(16)) /2, -100, Screen.perX(16), space+100);
        block.canInteract=true;
        for (let i = 1; i <= Level.playerLevel; i++) {
            let levelButton = new Button((canvas.width - Screen.perX(16)) /2, Screen.perX(16) + i * (space+Screen.perX(4)), Screen.perX(16), Screen.perX(4));
            levelButton.code = function () { Screen.gameScreen(); Level.makeStage(i); };
            levelButton.drawOption("rgba("+(255-i*25)+","+(255-i*25)+","+(255-i*20)+",0.5)", "black", "LEVEL" + i, Screen.perX(3), "black");
            levelButton.ga = 0.5;
            levelButton.canInteract=true;
            levelButton.canMove=true;
        }
    },

    selectMagicScreen:function() {
        Game.resetGame();

        Component.backButton(function(){Screen.selectScreen();})
        Component.screenName("select magic");

        let buttonSelector=Component.buttonSelector();
        Component.keyButton(1,10,['q','w','e','r'],Magic.skillNum,buttonSelector,"선택된 마법");
        
        new Entity(0,0,Game.BUTTON_CHANNEL).update=function(){
            //magic explanation
            if(buttonSelector.selectedBtn==null)return;
            let temp1 = Screen.perX(53);
            let temp2 = Screen.perX(2.4);
            ctx.fillStyle = "black";
            ctx.font = "bold " + temp2 + "px Arial";
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillText("<" + Magic.magicList[buttonSelector.selectedBtn.temp[0]][0] + ">", temp1, 10 + temp2 * 2);
            ctx.fillText("cooltime: " + (Magic.magicList[buttonSelector.selectedBtn.temp[0]][2] / 100) + "sec", temp1, 10 + temp2 * 3);
            ctx.fillText("mp: " + (Magic.magicList[buttonSelector.selectedBtn.temp[0]][3]), temp1, 10 + temp2 * 4);
        }

        //사용자가 사용할 수 있는 모든 마법들
        let listStart=Game.channel[Game.BUTTON_CHANNEL].length;
        let listEnd;
        for (let i = 0; i < Magic.magicList.length; i++) {
            if(Magic.magicList[i][4]>Level.playerLevel)continue;
            Component.magicButton(Screen.perX(32), Screen.perX(3) + Screen.perX(4) * i,i,buttonSelector)
        }
        listEnd=Game.channel[Game.BUTTON_CHANNEL].length;
        Component.listScroll(32,16,listStart,listEnd);

        //TEST WORLD
        new MapBlock(canvas.width*5/9, 2*canvas.height/3, canvas.width-canvas.width/2, 2*canvas.height/3, "wall");
        function makePlayer(){Game.p=new Player(canvas.width*5/9+20, 0);Game.p.magicList=[null,null,null,null];Game.p.removeHandler=function(){makePlayer();};}
        Camera.cameraOn=false;
        makePlayer();
        Input.addMoveKey(Game.p, Input.KEY_MOVE[0]);
        let monster = new Monster(0, canvas.width-100, 0);
        monster.life = 0;
        monster.action = [];
        monster.addAction(100,100,function(){monster.canMove=false;});
        monster.canRemoved = false;
    },

    makeMagicScreen:function(){
        Game.resetGame();
        //BACK
        Component.backButton(function () {Screen.selectScreen();tb.style.display="none"; });
        Component.screenName("create magic");

        //모바일 모드이면 엘레멘트 생성 중단
        if(Screen.isMobile){
            new Text(Screen.perX(50),Screen.perY(50), "모바일 모드에서 동작하지 않습니다", Screen.perX(3),"black",null,-1,null);
            return;
        }

        //텍스트박스 생성
        tb.style.display="block";
        const namebox=document.querySelector(".namebox");
        const textbox=document.querySelector(".textbox");
        const compileBtn=document.querySelector(".compilebutton");
        const successInfo=document.querySelector(".successInfo");
        const magicInfo = document.querySelector(".magicInfo");
        function printInfo(text1="", text2=""){
            successInfo.innerText = text1;
            successInfo.style.color="royalblue";
            magicInfo.innerText = text2;
        }
        printInfo("","");
        namebox.value="";
        textbox.value="";
        
        let buttonSelector = Component.buttonSelector();

        let basicMagicButtonCode = function (magicListIndex) {
            namebox.value = "(basic)" + Magic.basicMagic[magicListIndex][0];
            textbox.value = Magic.basicMagic[magicListIndex][1];
            printInfo("Basic magic can not edit.", "cooltime: " + (Magic.magicList[magicListIndex][2] / 100) + "sec\nMP: " + Magic.magicList[magicListIndex][3]);
        }
        let customMagicButtonCode = function (magicListIndex) {
            namebox.value = Magic.customMagic[magicListIndex - Magic.basicMagic.length][0];
            textbox.value = Magic.customMagic[magicListIndex - Magic.basicMagic.length][1];
            printInfo("", "cooltime: " + (Magic.magicList[magicListIndex][2] / 100) + "sec\nMP: " + Magic.magicList[magicListIndex][3]);
        }
        //CUSTOM MAGIC LIST
        let plusButton = new Button(Screen.perX(83), Screen.perX(6), Screen.perX(16), Screen.perX(3));
        plusButton.drawOption(null,"rgba(0,0,255,0.3)","+magic ("+Magic.customMagic.length+"/10)",Screen.perX(2.2),"rgba(0,0,255,0.3)");
        plusButton.code=function(){ 
            if(Magic.customMagic.length<10){
                Magic.addEmptyMagic();
                Component.magicButton(83,200,Magic.magicList.length-1,buttonSelector, function(btn){customMagicButtonCode(Magic.magicList.length-1);})
                plusButton.drawOption(null,"rgba(0,0,255,0.3)","+magic ("+Magic.customMagic.length+"/10)",Screen.perX(2.2),"rgba(0,0,255,0.3)");
            }
        };
        for(let i=Magic.basicMagic.length; i<Magic.magicList.length; i++)
            Component.magicButton(Screen.perX(83),Screen.perX(10+4*(i-Magic.basicMagic.length)),i,buttonSelector,function(btn){customMagicButtonCode(i);})
        //BASIC MAGIC LIST
        const list_x=8;
        let list_start=Game.channel[Game.BUTTON_CHANNEL].length;
        for(let i=0; i<Magic.basicMagic.length; i++){
            if(Magic.magicList[i][4]>Level.playerLevel)break;
            Component.magicButton(Screen.perX(list_x),Screen.perX(10+4*i),i,buttonSelector,function(btn){basicMagicButtonCode(i);})
        }
        let list_end=Game.channel[Game.BUTTON_CHANNEL].length;
        Component.listScroll(list_x, 16, list_start, list_end);

        //COMPILE BUTTON CLICK EVENT
        compileBtn.onclick = function(){
            let selectMagic=buttonSelector.selectedBtn;
            if(selectMagic.temp[0]<Magic.basicMagic.length)return;
            let cusMag=Magic.customMagic[selectMagic.temp[0]-Magic.basicMagic.length];//현재 선택된 커스텀 매직
            let magic=Magic.convertMagictoJS(namebox.value, textbox.value);
            if(magic!=null){ //마법이 성공적으로 변환되면
                cusMag[0]=namebox.value;
                cusMag[1]=textbox.value;
                Magic.magicList[selectMagic.temp[0]]=magic;
                Magic.saveMagic();
                selectMagic.drawOption("rgba(65, 105, 225,0.8)","black",namebox.value,Screen.perX(2),"black")
            }
        };
        
        //TEST MAP
        Component.worldWall(1000,500,200);
        Camera.makeMovingCamera(Game.p,0,0,10);
        Camera.extension=1000/canvas.width;
        function makePlayer(){Game.p=new Player(100, -100,10);Game.p.magicList=[null,null,null,null];
            Camera.e.temp=Game.p;Game.p.removeHandler=function(){makePlayer();};}
        function makeTester(){let p=new Player(500, -100,10);p.removeHandler=function(){makeTester();};}
        makePlayer();
        makeTester();
        Input.addMoveKey(Game.p, Input.KEY_MOVE[0]);
    },
    pvpScreen:function(){
        Game.resetGame();
        Component.backButton(function(){Screen.selectScreen()});
        Component.screenName("PVP","rgba(128, 0, 128,0.5)");
        //Component.serverConnectionChecker();
        
        const btnW=Screen.perX(33);
        const btnH=Screen.perX(10);
        const btnDistance=Screen.perX(1);
        const textSize=Screen.perX(4);
        let localPVPButton = new Button(Screen.perX(50)-btnW/2, Screen.perY(49)-btnH,btnW,btnH);
        localPVPButton.drawOption(`rgba(119, 138, 202,0.8)`,"white","로컬 PVP",textSize,`rgba(245, 245, 245,1)`);
        localPVPButton.code=function(){Screen.localPVPScreen()}
        let monsterPVPButton = new Button(Screen.perX(50)-btnW/2, Screen.perY(51),btnW,btnH);
        monsterPVPButton.drawOption(`rgba(119, 138, 202,0.8)`,"white","MONSTER PVP",textSize,`rgba(245, 245, 245,1)`);
        monsterPVPButton.code=function(){Screen.localPVPScreen()}
        // let onlinePVPButton = new Button(Screen.perX(50)-btnW/2, Screen.perY(40), btnW, btnH);
        // onlinePVPButton.drawOption(`rgba(119, 138, 202,0.8)`,"white","온라인 PVP",textSize,`rgba(245, 245, 245,1)`);
        // onlinePVPButton.code=function(){
        //     if(Multi.serverOn){}else{new Text(Screen.perX(50),Screen.perY(50), "서버와 연결되어 있지 않습니다.", Screen.perX(4), "black", null,300,false);}
        // }
        new Text(Screen.perX(50),localPVPButton.y+Screen.perX(8.7), "한개의 pc로 두명이서 플레이", Screen.perX(1.5), "lightgray", null,-1,false);
        new Text(Screen.perX(50),monsterPVPButton.y+Screen.perX(8.7), "몬스터가 되어 플레이", Screen.perX(1.5), "lightgray", null,-1,false);

        
    },
    localPVPScreen:function(){
        Game.resetGame();
        Component.backButton(function(){Screen.pvpScreen()});
        Component.screenName("Local PVP","rgba(128, 0, 128,0.5)");

        let buttonSelector=Component.buttonSelector();
        Component.keyButton(32,9,['r','t','y','u'],Magic.pvp_skillNum[0],buttonSelector,"player1");
        Component.keyButton(60,9,['0','1','2','3'],Magic.pvp_skillNum[1],buttonSelector,"player2");

        Game.p=new Player(0,Screen.perY(200),1);
        const listX=10;
        let listStart=Game.channel[Game.BUTTON_CHANNEL].length;
        for (let i = 0; i < Magic.magicList.length; i++) {
            if(Magic.magicList[i][4]>Level.playerLevel)continue;
            Component.magicButton(Screen.perX(listX), Screen.perX(3) + Screen.perX(4) * i,i,buttonSelector)
        }
        let listEnd=Game.channel[Game.BUTTON_CHANNEL].length;
        Component.listScroll(listX,16,listStart,listEnd);

        let startButton = new Button(Screen.perX(90), Screen.perY(10), Screen.perX(9), Screen.perY(90)-Screen.perX(1));
        startButton.drawOption("rgba(128, 0, 128,0.8)","white","START",Screen.perX(2),"white");
        startButton.code=function(){Screen.localPVPGameScreen();}
    },

    localPVPGameScreen:function(){
        Game.resetGame();
        Component.backButton(function(){Screen.localPVPScreen()});
        Component.worldWall(2000,1000,300);
        let player1 = new Player(1000-200,-60,10,Magic.pvp_skillNum[0]);
        let player2 = new Player(1000+200,-60,10,Magic.pvp_skillNum[1]);
        player2.isRight=false;
        function printWin(text){
            let winText = new Text(Screen.perX(50),Screen.perY(50), text, Screen.perX(10), "yellow", null,300,false);
            winText.removeHandler=function(){Screen.localPVPScreen();};
            player2.canRemoved=false;player1.canRemoved=false;
        }
        player1.removeHandler=function(){printWin("PLAYER 2  WIN");}
        player2.removeHandler=function(){printWin("PLAYER 1  WIN");}
        Input.addMoveKey(player1, Input.KEY_MOVE[1]);
        Input.addMoveKey(player2, Input.KEY_MOVE[0]);
        
        Camera.makeTwoTargetCamera(player1, player2, 0,0, 20);

        Component.playerStatusView(player1, 1, 11, "player1");
        Component.playerStatusView(player2, 57, 11, "player2");

        let nameTag=new Entity(0,-10000,Game.PHYSICS_CHANNEL).update=function(){
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.font="bold 15px Arial";
            ctx.fillStyle="green";
            Camera.fillText("player1",player1.x+player1.w/2,player1.y-20);
            ctx.fillStyle="red";
            Camera.fillText("player2",player2.x+player2.w/2,player2.y-20);
        }
        nameTag.canInteract=false;

        function countdown(textset, index){
            let text = new Text(Screen.perX(50),Screen.perY(50), textset[index], Screen.perX(20), "yellow", null,100,false);
            if(index==textset.length-1){Input.addSkillKey(player1, Input.KEY_SKILL[2]);Input.addSkillKey(player2, Input.KEY_SKILL[1]);
            }else text.removeHandler=function(){countdown(textset, index+1);}
        }
        countdown(['3','2','1',"FIGHT"],0);
    },

    gameScreen:function() {
        Game.resetGame();
        Game.keyboardOn=true;
        Component.backButton(function(){Screen.selectScreen()});
        //player
        Game.p = new Player(10, -60, Level.playerLevel);
        //Game.p=new Monster(4,10, -200,false)//
        //Game.p.attackFilter = function(e){return (e instanceof Block|| e instanceof Player || e instanceof Monster)}
        Game.p.removeHandler=function(){
            Game.channel[Game.BUTTON_CHANNEL]=[];
            Game.channel[Game.TEXT_CHANNEL]=[];
            let text = new Text(Screen.perX(50),Screen.perY(50),"you die",Screen.perX(10),"red",null,200,false);
            text.canAct=true;
            text.removeHandler=function(){Screen.selectScreen();};
            Level.stageMonsterCount=0;
        };
        Input.addMoveKey(Game.p, Input.KEY_MOVE[0]);
        Input.addSkillKey(Game.p, Input.KEY_SKILL[0]);

        Camera.makeMovingCamera(Game.p,0,0,10);
        //VIEW
        Component.playerStatusView(Game.p, 58,1.5);
        
        //MOBILE BUTTON 
        if (Screen.isMobile) Component.mobileButton(Game.p, 70);
    },
    multiplayScreen:function(){
        Game.resetGame();
        Component.backButton(function(){Screen.selectScreen()});
        
        let multiPlayText = new Text(Screen.perX(99),Screen.perX(1), "multi play", Screen.perX(3),"rgba(255,255,255,0.5)",null,-1,null);
        multiPlayText.textBaseline = "top";
        multiPlayText.textAlign="right";

        Game.convertMultiMode(true);
        let playButton=new Button(Screen.perX(-100),Screen.perY(-100),Screen.perX(30),Screen.perX(8));
        playButton.drawOption("rgba(1, 1, 1,0.1)","black", "PLAY", Screen.perX(4), "black");
        playButton.code=function(){Multi.enterGame();};

        let serverOnView = Component.serverConnectionChecker();
    },
    helpScreen:function(){
        Game.resetGame();
        //MENU BAR
        new MapBlock(0,0,Screen.perX(20), Screen.perY(100)); //어두운 바탕
        Component.backButton(function(){Screen.selectScreen();})
        let helpText=Component.screenName("help");
        //let howToText = new Text(Screen.perX(15), Screen.perY(5),"About",Screen.perX(2),"black",null,-1,false);
        let nextBtnY=Screen.perX(6);
        function makeMenuButton(text,f=function(){clearPanel();},isEmphasis=true){
            let btn = new Button(0,nextBtnY,Screen.perX(20),Screen.perX(4));
            if(isEmphasis){
                btn.drawOption(null,null,text, Screen.perX(2.5), "white");
                nextBtnY+=Screen.perX(4);
            }
            else {
                btn.drawOption(null,null,text,Screen.perX(2),"grey");
                nextBtnY+=Screen.perX(2.5);
            }
            btn.code=f;
            
        }
        makeMenuButton("조작법",gameControlPanel);
        //makeMenuButton("마법을쓰는법",howToUseMagic);
        makeMenuButton("마법을선택하는법",howToSelectMagicPanel);
        makeMenuButton("마법을만드는법",howToCreateMagicPanel);
        makeMenuButton("물질 생성 마법",create_magicCodePanel,false);
        makeMenuButton("물질 속성 변환 마법",magicCodePanel,false);
        makeMenuButton("물질 정보 탐색 마법",info_magicCodePanel,false);
        makeMenuButton("prohibited code",prohibitedPanel,false);
        makeMenuButton("magic evaluation",magicEvaluationPanel,false);
        nextBtnY += Screen.perX(8);
        makeMenuButton("",developerPanel);

        let textPanel = new TextPanel(Screen.perX(25),Screen.perX(3),0,0);
            textPanel.colors=[null, "white", "black"];
            textPanel.px=[Screen.perX(1), Screen.perX(3), Screen.perX(2)];
        function developerPanel(){
            textPanel.texts=[];
        }
        function howToCreateMagicPanel(){
            textPanel.texts=[
                [1,"마법을 만드는 방법"],
                [2,"1. create magic 화면으로 이동"],
                [2,"2. +magic 버튼을 클릭해서 빈 마법을 생성"],
                [2,"3. 새로 만들어진 파란색 버튼 클릭"],
                [2,"4. magic name 칸에 마법의 이름을 magic code 칸에 마법코드를 적음"],
                [2,"5. 그 밑에 있는 create 버튼 클릭(성공해야 저장됨)"],
                [0,2],
                [2,"*물질생성마법, 물질속성변환마법, 물질정보탐색마법을 참고하세요."],
                [2,"*create magic 화면에서 기본 마법의 코드를 볼 수 있습니다."],
                [2,"*모바일에서 이용하려면 모바일 모드로 바꾸지 말고 이용하세요."],
                [2,"*캐시 삭제를 하면 저장된 마법이 지워질 수 있습니다."]
            ];
        }
        function howToSelectMagicPanel(){
            textPanel.texts=[
                [1,"마법을 선택하는 방법"],
                [2,"키 q,w,e,r에 원하는 마법을 지정할 수 있음"],
                [0,1],
                [2,"1. select magic 화면으로 이동"],
                [2,"2. 마법 버튼(파란색 또는 보라색 버튼)을 클릭"],
                [2,"3. 키 버튼(Q,W,E,R)을 클릭"],
                [0,2],
                [2,"*마법 버튼을 클릭하면 마법을 테스트할 수 있음"]
            ]
        }

        function gameControlPanel(){
            textPanel.texts=[
                [1,"이동하는법"],
                [2,"pc - 키보드 방향키"],
                [2,"모바일 - 스크린 하단 방향 버튼"],
                [0,3],
                [1,"마법을쓰는법"],
                [2,"pc - 키보드 q,w,e,r키"],
                [2,"모바일 - 스크린 하단 Q,W,E,R 버튼"],
                [0,3],
                [1,"문제가발생했을때"],
                [2,"새로고침하면 대부분의 문제가 해결됩니다"],
                [2,"*중요 정보들은 저장됩니다"]
            ]
        }

        function create_magicCodePanel(){
            textPanel.texts=[
                [1,"물질 생성 마법"],
                [2,"생성할 수 있는 물질 - 불, 전기, 얼음, 화살, 에너지, 검격, 블럭, 트리거"],
                [2,"마법코드 - create(type, vx, vy, w, h)"],
                [0,1],
                [2,"type - FIRE,ELECTRICITY,ICE,ARROW,ENERGY,WIND,BLOCK,TRIGGER"],
                [2,"vx - 가로방향 속력"],
                [2,"vy - 세로방향 속력"],
                [2,"w - 가로크기"],
                [2,"h - 세로크기"]
            ]
        }

        function magicCodePanel(){
            textPanel.texts=[
                [1,"물질 속성 변환 마법"],
                [2,"물질의 속성 - 속도, 위치, 가시성, 생명력, 행동 등"],
                [0,2],
                [2,"giveForce(e,vx,vy) - 대상(e)을 vx, vy만큼 속력을 변화시킨다."],
                [2,"move(e,x,y) - 대상(e)을 현재 위치에서 x, y만큼 이동시킨다."],
                [2,"invisible(e,time) - 대상(e)을 time동안 보이지 않게 한다."],
                [2,"giveLife(e,life) - 대상(e)의 생명력을 life만큼 증가시킨다."],
                [2,"order(e,startT,endT,f) - 대상(e)에게 startT부터 endT까지 행동(f)을 시킨다."],
                [2,"setTrigger(t,f) - 트리거(t)에게 트리거를 발동 시킨 대상에게 할 행동(f)을 정한다."]
            ]
        }

        function info_magicCodePanel(){
            textPanel.texts=[
                [1,"물질 정보 탐색 마법"],
                [2,"얻을 수 있는 정보 - 속도, 위치, 플레이어 방향"],
                [0,2],
                [2,"getVX(e) - 대상(e)의 x축 속도를 얻는다."],
                [2,"getVY(e) - 대상(e)의 y축 속도를 얻는다."],
                [2,"getX(e) - 플레이어를 기준으로 대상(e)의 x축 거리를 얻는다."],
                [2,"getY(e) - 플레이어를 기준으로 대상(e)의 y축 거리를 얻는다."],
                [2,"front() - 플레이어가 보고있는 방향이 오른쪽이면 1, 왼쪽이면 -1"],
                [2,"player - 플레이어"]
            ]
        }

        function prohibitedPanel(){
            textPanel.texts=[
                [1,"금지어"],
                [2,JSON.stringify(MAGIC_DATA.prohibitedWord)],
                [2,JSON.stringify(MAGIC_DATA.prohibitedSymbol)]
            ]
        }

        function magicEvaluationPanel(){
            textPanel.texts=[
                [1,"마법 평가"],
                [2,"마법이 생성될 때 소비마나, 재사용 대기시간이 자동으로 평가됩니다."]
            ]
        }
    }
}