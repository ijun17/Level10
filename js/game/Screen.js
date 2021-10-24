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
        //Level Btn
        Component.buttonStack(42, 0, Level.playerLevel,false,function(i){
            let levelButton = new Button(0,0,Screen.perX(16), Screen.perX(4));
            levelButton.code = function () { Screen.gameScreen(i+1);};
            levelButton.drawOption("rgba("+(255-(i+1)*25)+","+(255-(i+1)*25)+","+(255-(i+1)*20)+",0.5)", "black", `LEVEL${i+1}`, Screen.perX(3), "black");
            return levelButton;
        })
    },

    selectMagicScreen:function() {
        Game.resetGame();

        Component.backButton(function(){Screen.selectScreen();})
        Component.screenName("select magic");

        let buttonSelector=Component.buttonSelector();
        let kb=Component.keyButton(1-32,10,['q','w','e','r'],Magic.skillNum,buttonSelector,"선택된 마법");
        kb.addAction(1,Screen.perX(2),function(){kb.moveComponent(16,0)})

        let magicView=new TextPanel(Screen.perX(53),Screen.perX(6),0,0);
        magicView.colors=[null, "black"];
        magicView.px=[0, Screen.perX(2.5)];
        magicView.texts=[[0,""]];

        let bs=Component.buttonStack(0,0,Magic.magicList.length,true,function(i){
            if(Magic.magicList[i][4]>Level.playerLevel)return null;
            else return Component.magicButton(0,0,i,buttonSelector,function(btn){
                magicView.texts=[[1,`<${Magic.magicList[btn.temp[0]][0]}>`],
                [1,`cooltime: ${Magic.magicList[btn.temp[0]][2]/100}`],
                [1,`mp: ${Magic.magicList[btn.temp[0]][3]}`]];
            })
        })
        bs.addAction(1,Screen.perX(2),function(){bs.moveComponent(16,0)})

        //TEST WORLD
        new MapBlock(canvas.width*5/9, 2*canvas.height/3, canvas.width-canvas.width/2, 2*canvas.height/3, "wall");
        Game.p=new Player(Screen.perX(63),0,10);
        Game.p.removeHandler=function(){this.life=100000;this.x=Screen.perX(70);this.y=0;this.vx=0;this.vy=0;return false;}
        Input.addMoveKey(Game.p, Input.KEY_MOVE[0]);
        Camera.cameraOn=false;
        
        let monster = new Monster(0,Screen.perX(87), 0,false);
        monster.life = 0;
        monster.inv_mass=0;
        monster.canRemoved = false;
    },

    makeMagicScreen:function(){
        Game.resetGame();
        //BACK
        Component.backButton(function () {Screen.selectScreen();tb.style.display="none"; });
        Component.screenName("create magic");
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
        //custom magic list
        let customMagicStackHead=Component.buttonStack(83,8,Magic.customMagic.length,false,function(i){
            return Component.magicButton(0,0,i+Magic.basicMagic.length,buttonSelector,function(btn){customMagicButtonCode(i+Magic.basicMagic.length)})
        })
        customMagicStackHead.drawOption(null,"rgba(0,0,255,0.3)","+magic ("+Magic.customMagic.length+"/10)",Screen.perX(2.2),"rgba(0,0,255,0.3)");
        customMagicStackHead.code=function(){ 
            if(Magic.customMagic.length<10){
                Magic.addEmptyMagic();
                customMagicStackHead.addStack(Component.magicButton(0,0,Magic.magicList.length-1,buttonSelector, function(btn){customMagicButtonCode(Magic.magicList.length-1);}))
                customMagicStackHead.drawOption(null,"rgba(0,0,255,0.3)","+magic ("+Magic.customMagic.length+"/10)",Screen.perX(2.2),"rgba(0,0,255,0.3)");
            }
        };
        //basic magic list
        Component.buttonStack(8,0,Magic.basicMagic.length,true,function(i){
            if(Magic.magicList[i][4]>Level.playerLevel)return null;
            return Component.magicButton(0,0,i,buttonSelector,function(){basicMagicButtonCode(i);})
        })

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
        Game.p=new Player(0,Screen.perY(200),1); 
        //Component.particleSpray(1,{x:Screen.perX(50),y:0}, Screen.perX(120),0, 15, 1, 10);
        //Component.particleSpray(0,{x:Screen.perX(50),y:0}, Screen.perX(120),0, 15, 1, 10);
        //Screen.bgColor="rgb(220,235,240)"
        //Component.shader("rgb(50,40,60)", globalAlpha=0.3);
        let magicSelector=Component.buttonSelector();
        
        let magicList=Component.buttonStack(0,0,Magic.magicList.length,true,function(i){
            if(Magic.magicList[i][4]>Level.playerLevel)return null;
            else return Component.magicButton(0,0,i,magicSelector)
        })
        let keyButton1=Component.keyButton(0,canvas.height,['r','t','y','u'],Magic.pvp_skillNum[0],magicSelector,"player1");
        let keyButton2=Component.keyButton(0,canvas.height,['0','1','2','3'],Magic.pvp_skillNum[1],magicSelector,"player2");

        let background=new Button(0,0,canvas.width,canvas.heigth);
        background.drawOption("rgba(0,0,0,0.85)");
        background.code=function(){
            this.w=0;this.h=0;
            magicList.moveComponent(Screen.perX(-30)-magicList.x,0)
            keyButton1.moveComponent(Screen.perX(37)-keyButton1.x,canvas.height-keyButton1.y+Screen.perX(5))
            keyButton2.moveComponent(Screen.perX(37)-keyButton2.x,canvas.height-keyButton2.y+Screen.perX(5))
        }
        background.code();

        let player1Selctor=Component.buttonSelector();
        let player2Selctor=Component.buttonSelector();

        function playerButton(num,selector){
            let btn = new Button(0,0,Screen.perX(16),Screen.perX(3.5));
            btn.drawOption(`rgba(65, 105, 225,0.8)`,"black","wizard",Screen.perX(3), "black")
            btn.code=function(){
                background.w=canvas.width;background.h=canvas.height;//검은 배경 생성
                magicList.addAction(1,Screen.perX(2),function(){magicList.moveComponent(20,0)})
                if(num===1)keyButton1.addAction(1,Screen.perX(2),function(){keyButton1.moveComponent(0,-23)})
                else keyButton2.addAction(1,Screen.perX(2),function(){keyButton2.moveComponent(0,-23)})
                selector.selectedBtn=this;
            }
            selector.selectedBtn=btn;
            btn.player_type=0;
            return btn;
        }

        function monsterButton(i,selector){
            let btn = new Button(0,0,Screen.perX(16),Screen.perX(3.5));
            btn.drawOption("rgba("+(255-i*25)+","+(255-i*25)+","+(255-i*20)+",0.5)","black",`LEVEL${i}`,Screen.perX(3), "black")
            btn.code=function(){
                selector.selectedBtn=this;
            }
            btn.player_type=i;
            return btn;
        }

        let player1List = Component.buttonStack(13,5,1+10,false,function(i){
            if(i-1>Level.playerLevel||i>MONSTERS.length)return false;
            else if(i===0)return playerButton(1,player1Selctor);
            else return monsterButton(i,player1Selctor);
        })
        player1List.drawOption(null,null,"player1",Screen.perX(2.5),"rgba(255,255,255,0.7)")

        let player2List = Component.buttonStack(32,5,1+10,false,function(i){
            if(i-1>Level.playerLevel||i>MONSTERS.length)return false;
            else if(i===0)return playerButton(2,player2Selctor);
            else return monsterButton(i,player2Selctor);
        })
        player2List.drawOption(null,null,"player2",Screen.perX(2.5),"rgba(255,255,255,0.7)")

        let startButton = new Button(Screen.perX(90), Screen.perY(10), Screen.perX(9), Screen.perY(90)-Screen.perX(1));
        startButton.drawOption("rgba(128, 0, 128,0.8)","white","START",Screen.perX(2),"white");
        startButton.code=function(){Screen.pvpGameScreen(player1Selctor.selectedBtn.player_type,player2Selctor.selectedBtn.player_type);}
        
    },
    pvpGameScreen:function(player1_type, player2_type){
        Game.resetGame();
        Component.backButton(function(){Screen.pvpScreen()});

        Component.worldWall(2000,1000,300);
        let player1 = (player1_type===0 ? new Player(1000-200,-60,10,Magic.pvp_skillNum[0]):new Monster(player1_type-1,1000-200,-60,false))
        let player2 = (player2_type===0 ? new Player(1000+200,-60,10,Magic.pvp_skillNum[1]):new Monster(player2_type-1,1000+200,-60,false))
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
        if(player1.isFlying)Input.addFlyKey(player1, Input.KEY_MOVE[1]);
        else Input.addMoveKey(player1, Input.KEY_MOVE[1]);
        if(player2.isFlying)Input.addFlyKey(player2, Input.KEY_MOVE[0]);
        else Input.addMoveKey(player2, Input.KEY_MOVE[0]);
        if(Screen.isMobile)Component.mobileButton(player1, Screen.perX(8));

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
        Component.playerStatusView(player, 10,1.5);
        if (Screen.isMobile) Component.mobileButton(player, Screen.perX(8));
        Level.makeStage(level,player)
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