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
    tempcanvas.width = screen.width;
    tempcanvas.height = screen.height;
    document.querySelector("meta[name=viewport]").setAttribute('content', 'width=device-width, user-scalable=no');

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

    perX:function(percentile){return Math.floor(canvas.width*0.01*percentile);},
    perY:function(percentile){return Math.floor(canvas.height*0.01*percentile);},

    mainScreen:function() {
        Game.resetGame();
        Component.particleSpray(3,{x:Screen.perX(50),y:0}, Screen.perX(120),0, 20, 1, 10);

        var startButton = new Button(Screen.perX(38), Screen.perY(50)-Screen.perX(4), Screen.perX(24), Screen.perX(8));
        startButton.canAct=true;
        startButton.code = function () { 
            const ash_interval = Screen.perX(25/30);
            for(let i=0; i<30; i++){
                for(let j=0; j<10; j++){
                    let e = new Particle(3, startButton.x+i*ash_interval, startButton.y+j*ash_interval);
                    e.ga=0;
                    e.w=ash_interval*1.7;
                    e.h=ash_interval*1.7;
                    e.vx*=ash_interval*0.05;
                    e.vy*=ash_interval*0.05;
                }
            }
            startButton.addAction(50,50,function(){Screen.selectScreen();});
            startButton.draw=function(){};
            startButton.code=function(){};
        };
        startButton.drawOption(null, "black", "START", Screen.perX(6), "black");

        new Text(Screen.perX(50),Screen.perY(62), "click here", Screen.perX(1.6),"black",null,-1,null);

        //decorate1
        new Text(Screen.perX(50),Screen.perY(92), "LEVEL10", Screen.perX(8),"rgb(35, 35, 40)",null,-1,false);
        new MapBlock(Screen.perX(5),Screen.perY(62),Screen.perX(15),Screen.perY(30));
        new MapBlock(Screen.perX(27),Screen.perY(70),Screen.perX(15),Screen.perY(50));
        new MapBlock(Screen.perX(58),Screen.perY(70),Screen.perX(15),Screen.perY(50));
        new MapBlock(Screen.perX(80),Screen.perY(62),Screen.perX(15),Screen.perY(30));
        new MapBlock(Screen.perX(8),Screen.perY(80),Screen.perX(84),Screen.perY(50));
        Component.shader("#657d87",0.2)
        // let fire=new Matter(0,Screen.perX(11),0)
        // fire.canRemoved=false;
        // fire.enlarge(2)
        // new Matter(0,Screen.perX(33),0).canRemoved=false;
        // new Matter(0,Screen.perX(65),0).canRemoved=false;
        // new Matter(0,Screen.perX(87),0).canRemoved=false;
    },

    selectScreen:function() {
        Game.resetGame();

        const space=Screen.perX(1);

        Component.particleSpray(3,{x:Screen.perX(50),y:0}, Screen.perX(120),0, 20, 2, 10);
        //BACK
        Component.backButton(function () { Screen.mainScreen() });
        //HELP BUTTON
        let helpButton = new Button(space, canvas.height-space-Screen.perX(3), Screen.perX(3), Screen.perX(3));
        helpButton.code = function () { Screen.helpScreen() };
        helpButton.drawOption(null, "white", "?", Screen.perX(3),"white");
        //MOBILE MODE BUTTON
        let mobileButton = new Button(canvas.width - space - Screen.perX(8), canvas.height - space - Screen.perX(3), Screen.perX(8), Screen.perX(3));
        mobileButton.code = function () {
            if(!Screen.isMobile){Input.convertToMobileMode(true);Screen.isMobile=true;}
            startFs(canvas);
            Screen.mainScreen();
            let full = new Button(Screen.perX(38), Screen.perY(50)-Screen.perX(4), Screen.perX(24), Screen.perX(8));
            full.code=function(){startFs(canvas);full.x=10000;Input.click((canvas.width - 300)/2+150, (canvas.height-100)/2+50);}
        };
        mobileButton.drawOption(null,"black","to mobile",Screen.perX(1.7),"black");
        //web app button
        let webappButton = new Button(canvas.width - space - Screen.perX(8), canvas.height - space*2 - Screen.perX(6), Screen.perX(8), Screen.perX(3));
        webappButton.code = function () {
            if(!Screen.isMobile){Input.convertToMobileMode(true);Screen.isMobile=true;}
            canvas.height=Math.floor(canvas.width*screen.height/screen.width);
            tempcanvas.height=canvas.height;
            Screen.mainScreen();
        };
        webappButton.drawOption(null,"black","web app",Screen.perX(1.7),"black");
        
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
        block.setStatic();
        for (let i = 1; i <= Level.playerLevel; i++) {
            let levelButton = new Button((canvas.width - Screen.perX(16)) /2, Screen.perX(16) + i * (space+Screen.perX(6)), Screen.perX(16), Screen.perX(4));
            levelButton.code = function () { Screen.gameScreen(i);};
            levelButton.drawOption("rgba("+(255-i*25)+","+(255-i*25)+","+(255-i*20)+",0.5)", "black", "LEVEL" + i, Screen.perX(3), "black");
            levelButton.ga = 0.01;
            levelButton.vy=10;
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
        let listStart=Game.channel[Game.BUTTON_CHANNEL].length();
        let listEnd;
        
        for (let i = 0; i < Magic.magicList.length; i++) {
            if(Magic.magicList[i][4]>Level.playerLevel)continue;
            Component.magicButton(Screen.perX(32), Screen.perX(20) + Screen.perX(10) * i,i,buttonSelector)
        }
        listEnd=Game.channel[Game.BUTTON_CHANNEL].length();
        Component.listScroll(32,16,listStart,listEnd);

        //TEST WORLD
        new MapBlock(canvas.width*5/9, 2*canvas.height/3, canvas.width-canvas.width/2, 2*canvas.height/3, "wall");
        Game.p=new Player(Screen.perX(70),0,10);
        Game.p.removeHandler=function(){this.life=100000;this.x=Screen.perX(70);this.y=0;this.vx=0;this.vy=0;return false;}
        Input.addMoveKey(Game.p, Input.KEY_MOVE[0]);
        Camera.cameraOn=false;
        
        let monster = new Monster(0, canvas.width-100, 0,false);
        monster.life = 0;
        monster.inv_mass=0;
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
        const customX=83
        let plusButton = new Button(Screen.perX(83), Screen.perX(6), Screen.perX(16), Screen.perX(3));
        plusButton.setStatic();
        plusButton.drawOption(null,"rgba(0,0,255,0.3)","+magic ("+Magic.customMagic.length+"/10)",Screen.perX(2.2),"rgba(0,0,255,0.3)");
        plusButton.code=function(){ 
            if(Magic.customMagic.length<10){
                Magic.addEmptyMagic();
                Component.magicButton(Screen.perX(customX),Screen.perX(10+6*Magic.customMagic.length),Magic.magicList.length-1,buttonSelector, function(btn){customMagicButtonCode(Magic.magicList.length-1);})
                plusButton.drawOption(null,"rgba(0,0,255,0.3)","+magic ("+Magic.customMagic.length+"/10)",Screen.perX(2.2),"rgba(0,0,255,0.3)");
            }
        };
        for(let i=Magic.basicMagic.length; i<Magic.magicList.length; i++)
            Component.magicButton(Screen.perX(customX),Screen.perX(10+4*(i-Magic.basicMagic.length)),i,buttonSelector,function(btn){customMagicButtonCode(i);})
        //BASIC MAGIC LIST
        const basicX=8;
        let list_start=Game.channel[Game.BUTTON_CHANNEL].length();
        for(let i=0; i<Magic.basicMagic.length; i++){
            if(Magic.magicList[i][4]>Level.playerLevel)break;
            Component.magicButton(Screen.perX(basicX),Screen.perX(10+6*i),i,buttonSelector,function(btn){basicMagicButtonCode(i);})
        }
        let list_end=Game.channel[Game.BUTTON_CHANNEL].length();
        Component.listScroll(basicX, 16, list_start, list_end);

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
        Game.p=new Player(Screen.perX(70),0,10);
        Game.p.removeHandler=function(){this.life=100000;this.x=Screen.perX(70);this.y=0;this.vx=0;this.vy=0;return false;}
        Input.addMoveKey(Game.p, Input.KEY_MOVE[0]);
        Camera.makeMovingCamera(Game.p,0,0,10);
        Camera.extension=1000/canvas.width;
        function makeTester(){let p=new Player(500, -100,10);p.removeHandler=function(){makeTester();return true;};}
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
        monsterPVPButton.code=function(){Screen.monsterPVPGameScreen()}
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
        let listStart=Game.channel[Game.BUTTON_CHANNEL].length();
        for (let i = 0; i < Magic.magicList.length; i++) {
            if(Magic.magicList[i][4]>Level.playerLevel)continue;
            Component.magicButton(Screen.perX(listX), Screen.perX(3) + Screen.perX(6) * i,i,buttonSelector)
        }
        let listEnd=Game.channel[Game.BUTTON_CHANNEL].length();
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
            winText.removeHandler=function(){Screen.localPVPScreen();return true;};
            player2.canRemoved=false;player1.canRemoved=false;
        }
        player1.removeHandler=function(){printWin("PLAYER 2  WIN");return true;}
        player2.removeHandler=function(){printWin("PLAYER 1  WIN");return true;}
        Input.addMoveKey(player1, Input.KEY_MOVE[1]);
        Input.addMoveKey(player2, Input.KEY_MOVE[0]);
        
        Camera.makeTwoTargetCamera(player1, player2, 0,0, 20);

        Component.playerStatusView(player1, 1, 11, "player1");
        Component.playerStatusView(player2, 57, 11, "player2");
        if (Screen.isMobile) Component.mobileButton(player1, Screen.perX(8));
        player1.setName("player 1", "green");
        player2.setName("player 2", "red");

        function countdown(textset, index){
            let text = new Text(Screen.perX(50),Screen.perY(50), textset[index], Screen.perX(20), "yellow", null,100,false);
            if(index==textset.length-1){Input.addSkillKey(player1, Input.KEY_SKILL[2]);Input.addSkillKey(player2, Input.KEY_SKILL[1]);
            }else text.removeHandler=function(){countdown(textset, index+1);return true;}
        }
        countdown(['3','2','1',"FIGHT"],0);
    },
    monsterPVPScreen(){

    },
    monsterPVPGameScreen(){
        Game.resetGame();
        Component.backButton(function(){Screen.pvpScreen()});
        Component.worldWall(2000,1000,300);
        let player1 = new Monster(4,1000-200,-60,false);
        let player2 = new Monster(5,1000+200,-60,false);
        player2.isRight=false;
        function printWin(text){
            let winText = new Text(Screen.perX(50),Screen.perY(50), text, Screen.perX(10), "yellow", null,300,false);
            winText.removeHandler=function(){Screen.pvpScreen();return true;};
            player2.canRemoved=false;player1.canRemoved=false;
        }
        player1.removeHandler=function(){printWin("PLAYER 2  WIN");return true;}
        player2.removeHandler=function(){printWin("PLAYER 1  WIN");return true;}
        player1.target=player2;
        player2.target=player1;
        if(player1.ga==0)Input.addFlyKey(player1, Input.KEY_MOVE[1]);
        else Input.addMoveKey(player1, Input.KEY_MOVE[1]);
        if(player2.ga==0)Input.addFlyKey(player2, Input.KEY_MOVE[0]);
        else Input.addMoveKey(player2, Input.KEY_MOVE[0]);

        Camera.makeTwoTargetCamera(player1, player2, 0,0, 20);

        Component.playerStatusView(player1, 1, 7, "player1");
        Component.playerStatusView(player2, 57, 7, "player2");

        function countdown(textset, index){
            let text = new Text(Screen.perX(50),Screen.perY(50), textset[index], Screen.perX(20), "yellow", null,100,false);
            if(index==textset.length-1){Input.addSkillKey(player1, Input.KEY_SKILL[2]);Input.addSkillKey(player2, Input.KEY_SKILL[1]);
            }else text.removeHandler=function(){countdown(textset, index+1);return true;}
        }
        countdown(['3','2','1',"FIGHT"],0);
    },

    gameScreen:function(level) {
        Game.resetGame();
        Game.keyboardOn=true;
        Component.backButton(function(){Screen.selectScreen()});
        //player
        let player = new Player(10, -60, Level.playerLevel);
        player.removeHandler=function(){
            Game.channel[Game.BUTTON_CHANNEL].clear();
            Game.channel[Game.TEXT_CHANNEL].clear();
            let text = new Text(Screen.perX(50),Screen.perY(50),"you die",Screen.perX(10),"red",null,200,false);
            text.removeHandler=function(){Screen.selectScreen();return true;};
            return true;
        };
        Input.addMoveKey(player, Input.KEY_MOVE[0]);
        Input.addSkillKey(player, Input.KEY_SKILL[0]);
        Camera.makeMovingCamera(player,0,0,10);
        Component.playerStatusView(player, 58,1.5);
        if (Screen.isMobile) Component.mobileButton(player, Screen.perX(8));
        Level.makeStage(level,player)
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
        Component.screenName("help");
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
                [2,"모바일 - 스크린 하단 Q,W,E,R 버튼"]
            ]
        }

        function create_magicCodePanel(){
            textPanel.texts=[
                [1,"물질 생성 마법"],
                [2,"생성할 수 있는 물질 - 불, 전기, 얼음, 화살, 에너지, 검격, 블럭, 트리거"],
                [2,"마법코드 - create(type, vx, vy, w, h)"],
                [0,1],
                [2,"type - FIRE,ELECTRICITY,ICE,ARROW,ENERGY,WIND,BLOCK,TRIGGER"],
                [2,"vx - 가로방향 속력(오른쪽방향이 플러스)"],
                [2,"vy - 세로방향 속력(위 방향이 플러스)"],
                [2,"w - 가로크기"],
                [2,"h - 세로크기"],
                [0,2],
                [2,"ex) create(FIRE,20,-10)"],
                [2,"   불(FIRE)을 생성하고 오른쪽으로 20, 아래쪽으로 -10만큼 속도를 지정한다."]
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
                [2,"setTrigger(t,f) - 트리거(t)와 충돌한 대상에게 할 행동(f)을 정한다."]
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
                [2,"front(n) - 플레이어가 보고있는 방향이 오른쪽이면 n, 왼쪽이면 -n을 반환"],
                [2,"player - 마법을 시전한 플레이어"]
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