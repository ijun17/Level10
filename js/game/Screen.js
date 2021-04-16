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
        return Math.floor(canvas.width/100*percentile);
    },
    perY:function(percentile){
        return Math.floor(canvas.height/100*percentile);
    },

    mainScreen:function() {
        Game.resetGame();

        let ashSpray = new Button(-100,-100,0,0,Game.BUTTON_CHENNEL);
        ashSpray.canAct=true;
        ashSpray.canInteraction=false;
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
            startButton.drawCode=function(){};
            startButton.code=function(){};
        };
        startButton.drawOption(null, "black", "START", Screen.perX(6), "black");
        //Camera.makeMovingCamera({x:Screen.perX(50), y:Screen.perY(50)},Screen.perY(50),Screen.perY(50), movingDelay=1);
        
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

        const space=(Screen.isMobile ? 5 : 10);

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
        let backButton = new Button(0, 0, Screen.perX(6), Screen.perX(6));
        backButton.code = function () { Screen.mainScreen() };
        backButton.drawOption(null, null, "<", Screen.perX(6), "black");
        //HELP BUTTON
        let helpButton = new Button(space, canvas.height-space-Screen.perX(3), Screen.perX(3), Screen.perX(3));
        helpButton.code = function () { Screen.helpScreen() };
        helpButton.drawOption(null, "white", "?", Screen.perX(3),"white");
        //MOBILE MODE BUTTON
        let mobileButton = new Button(canvas.width - space - Screen.perX(8), canvas.height - space - Screen.perX(3), Screen.perX(8), Screen.perX(3));
        mobileButton.code = function () {
            if(!Screen.isMobile){Game.convertMobileMode(true);}
            startFs(canvas);
            Screen.mainScreen();
            let full = new Button((canvas.width - 300)/2, (canvas.height-100)/2, 300, 100);
            full.code=function(){startFs(canvas);full.x=10000;Game.click((canvas.width - 300)/2+150, (canvas.height-100)/2+50);}
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
        //MULTIPLAY
        let multiplayButton =new Button(canvas.width - Screen.perX(16)-space, 3*space+Screen.perX(8),Screen.perX(16), Screen.perX(4));
        multiplayButton.code = function () { Screen.multiplayScreen(); };
        multiplayButton.drawOption(null, "purple", "multiplay", Screen.perX(2.5), "purple");//"rgb(65, 105, 225)"

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
        const space=(Screen.isMobile ? 5 : 10); //버튼 간격

        let backBtn = new Button(0, 0, Screen.perX(6), Screen.perX(6));
        backBtn.code = function () { Screen.selectScreen() };
        backBtn.drawOption(null, null, "<", Screen.perX(6), "black");

        let selectMagicText = new Text(Screen.perX(99),Screen.perX(1), "select magic", Screen.perX(3),"rgba(255,255,255,0.5)",null,-1,null);
        selectMagicText.textBaseline = "top";
        selectMagicText.textAlign="right";

        //KEYBORAD BUTTON
        let selectMagic = null;
        new Text(Screen.perX(6),Screen.perX(6.5),"선택된 마법",Screen.perX(2), "rgba(255,255,255,0.5)", null,-1,null);
        let key = ['Q', 'W', 'E', 'R'];
        let keyButtons = new Array(4);
        for (let i = 0; i < 4; i++) {
            let temp = new Button(Screen.perX(8)+space*2, Screen.perX(8)-Screen.perX(4) + (Screen.perX(8)+space) * i, Screen.perX(16), Screen.perX(4));
            //temp.drawOption("black");
            let keyBtn = new Button(space, Screen.perX(8) + (Screen.perX(8)+space) * i, Screen.perX(8), Screen.perX(8))
            keyBtn.code = function () {
                if (selectMagic != null && selectMagic.temp[1] != i) {
                    if (keyBtn.temp[0] != null) { //키버튼에 마법이 있으면
                        keyBtn.temp[0].x = space*8+Screen.perX(8)+Screen.perX(16);
                        keyBtn.temp[0].y = Screen.perX(4)*(Magic.basicMagicCount+Magic.customMagicCount+1);
                        keyBtn.temp[0].vy =0;
                        (keyBtn.temp[0]).temp[1] = null;//마법 기록 삭제
                    }
                    if (selectMagic.temp[1] != null) { //선택한 마법에 이미 키가 있으면
                        Magic.skillNum[selectMagic.temp[1]] = -1;
                        keyButtons[selectMagic.temp[1]].temp[0] = null;//이전 키버튼의 선택 기록 삭제
                    }
                    selectMagic.x = Screen.perX(8)+space*2; 
                    selectMagic.y = Screen.perX(8) + (Screen.perX(8)+space) * i+space;
                    Magic.skillNum[i] = selectMagic.temp[0];
                    selectMagic.temp[1] = i;
                    keyBtn.temp[0] = selectMagic;
                    selectMagic = null;
                }
                Magic.saveSkillNum();
                //console.log(Magic.skillNum);
            };
            keyBtn.drawOption("rgb(60, 60, 60)", "black", key[i],Screen.perX(7), "black");

            keyButtons[i] = keyBtn;
            keyBtn.temp.push(null); //temp[0] 은 선택된 마법을 의미
        }

        
        //
        
        
        new Button(0,0,0,0).drawCode=function(){
            if (selectMagic != null) {
                //선택된 마법의 색을 어둡게
                ctx.fillStyle = "rgba(0,0,0,0.5)";
                ctx.fillRect(selectMagic.x, selectMagic.y, selectMagic.w, selectMagic.h);
                
                //magic explanation
                let temp1=Screen.perX(53);
                let temp2=Screen.perX(2.4);
                ctx.fillStyle = "black";
                ctx.font = "bold "+temp2+"px Arial";
                ctx.textBaseline = "top";
                ctx.textAlign = "left";
                ctx.fillText("<"+Magic.magicList[selectMagic.temp[0]][0]+">", temp1, 10+temp2*2);

                ctx.fillText("cooltime: "+(Magic.magicList[selectMagic.temp[0]][2]/100)+"sec", temp1, 10+temp2*3);
                ctx.fillText("mp: "+(Magic.magicList[selectMagic.temp[0]][3]), temp1,10+temp2*4);
            }
        }

        //MAGIC LIST
        let listStart=Game.channel[Game.BUTTON_CHANNEL].length;
        let listEnd;
        for (let i = 0; i < Magic.magicList.length; i++) {
            if(Magic.magicList[i][4]>Level.playerLevel)continue;
            let magicBtn = new Button(space*8+Screen.perX(8)+Screen.perX(16), Screen.perX(3) + Screen.perX(4) * i, Screen.perX(16), Screen.perX(3));
            magicBtn.code = function () { selectMagic = magicBtn; (Magic.magicList[i][1])(Game.p); };
            let magicColor="rgba(119, 138, 202,0.8)";
            if(i>=Magic.basicMagicCount)magicColor="rgba(65, 105, 225,0.8)";
            magicBtn.drawOption(magicColor, "black", Magic.magicList[i][0], Screen.perX(2), "black");
            magicBtn.temp.push(i); //temp[0]=Magic.magicList
            magicBtn.temp.push(null); //temp[1] is keyButton index
            magicBtn.ga = 0.5;
            magicBtn.canInteract=true;
            magicBtn.canMove=true;

            let keyIndex = Magic.skillNum.findIndex(function (e) { return e == i; });
            if (keyIndex >= 0) {
                selectMagic = magicBtn;
                keyButtons[keyIndex].collisionHandler();
            }
        }
        listEnd=Game.channel[Game.BUTTON_CHANNEL].length;
        
        //MAGIC LIST SCROLL
        let magicList = new Button(space*8+Screen.perX(8)+Screen.perX(16), -Screen.perX(8), Screen.perX(16), Screen.perX(8)+space);
        magicList.drawCode = function () { 
            //magic list
                ctx.fillStyle = "rgba(0,0,0,0.2)";
                //ctx.fillRect(magicList.x-space,magicList.y,space*2+magicBtnW,40*(listEnd-listStart));
                ctx.fillRect(magicList.x-space,0,space*2+Screen.perX(16),canvas.height);

        }
        function move(d){
            for(let i=listStart;i<=listEnd;i++){
                if(Game.channel[Game.BUTTON_CHANNEL][i].temp[1]==null)Game.channel[Game.BUTTON_CHANNEL][i].y+=d;
            }
        }
        const MOVE_DISTANCE=Screen.perY(50);
        let upButton = new Button(space*9+Screen.perX(8)+Screen.perX(16)*2,0,Screen.perX(4),Screen.perX(4));
        upButton.drawOption("rgba(0,0,0,0.5)",null,"▲", Screen.perX(3),"white");
        upButton.code=function(){if(Game.channel[Game.BUTTON_CHANNEL][listEnd].y<-Screen.perX(8))move(MOVE_DISTANCE);};
        let downButton = new Button(space*9+Screen.perX(8)+Screen.perX(16)*2,canvas.height-Screen.perX(4),Screen.perX(4),Screen.perX(4));
        downButton.drawOption("rgba(0,0,0,0.5)",null,"▼", Screen.perX(3),"white");
        downButton.code=function(){if(Screen.perX(3)*(listEnd-listStart)+Screen.perX(8)+Game.channel[Game.BUTTON_CHANNEL][listEnd].y>canvas.height)move(-MOVE_DISTANCE);};

        //TEST WORLD
        new MapBlock(canvas.width*5/9, 2*canvas.height/3, canvas.width-canvas.width/2, 2*canvas.height/3, "wall");
        function makePlayer(){Game.p=new Player(canvas.width*5/9+20, 0);Game.p.magicList=[null,null,null,null];
            Camera.e.temp=Game.p;Game.p.removeHandler=function(){makePlayer();};}
        Camera.makeMovingCamera(Game.p,0,0,10);
        Camera.cameraOn=false;
        makePlayer();
        Game.keyboardOn=true;
        Game.p.mp=0; //스킬 못쓰게
        let monster = new Monster(0, canvas.width-100, 0);
        monster.life = 0;
        monster.action = [];
        monster.addAction(100,100,function(){monster.canMove=false;});
        monster.canRemoved = false;
    },

    makeMagicScreen:function(){
        Game.resetGame();
        //BACK
        let backButton = new Button(0, 0, Screen.perX(6), Screen.perX(6));
        backButton.drawOption(null, null, "<", Screen.perX(6), "black");
        backButton.code = function () { 
            Screen.selectScreen();
            tb.style.display="none"; 
        };
        let createMagicText = new Text(Screen.perX(99),Screen.perX(1), "create magic", Screen.perX(3),"rgba(255,255,255,0.5)",null,-1,null);
        createMagicText.textBaseline = "top";
        createMagicText.textAlign="right";

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
        
        //control system
        let cs=new Button(0,0,0,0);
        cs.temp=null;
        cs.drawCode=function(){
            if(cs.temp!=null){
                ctx.fillStyle="rgba(0, 0, 0,0.5)";
                ctx.fillRect(cs.temp.x,cs.temp.y,cs.temp.w,cs.temp.h);
            }
        };
        
        //MAKE MAGIC BUTTON FUNCTION
        function makeMagicButton(isCustom, x,y,num){
            let magicBtn = new Button(x,y,Screen.perX(16),Screen.perX(3));
            let color = (isCustom ? `rgba(65, 105, 225,0.8)` : `rgba(119, 138, 202,0.8)`); //119, 138, 202
            magicBtn.drawOption(color, "black", Magic.magicList[num][0], Screen.perX(2), "black");
            magicBtn.code = function () {
                (Magic.magicList[num][1]) (Game.p);
                if(isCustom){
                    namebox.value = Magic.customMagic[num-Magic.basicMagicCount][0];
                    textbox.value = Magic.customMagic[num-Magic.basicMagicCount][1];
                    cs.temp = magicBtn;
                    printInfo("", "cooltime: "+(Magic.magicList[num][2]/100)+"sec\nMP: "+Magic.magicList[num][3]);
                }else{
                    namebox.value = "(basic)"+Magic.basicMagic[num][0];
                    textbox.value = Magic.basicMagic[num][1];
                    cs.temp = null;
                    printInfo("Basic magic can not edit.", "cooltime: "+(Magic.magicList[num][2]/100)+"sec\nMP: "+Magic.magicList[num][3]);
                }
            }
            magicBtn.temp = num;
            magicBtn.ga = 0.5;
            magicBtn.vy = 20;
            magicBtn.canMove = true;
            magicBtn.canInteract = true;
        }
        const btnW=Screen.perX(16);
        const btnH=Screen.perX(2.2);
        //CUSTOM MAGIC LIST
        let plusButton = new Button(10, Screen.perX(6)+10, Screen.perX(16), Screen.perX(3));
        plusButton.drawOption(null,"rgba(0,0,255,0.3)","+magic ("+Magic.customMagicCount+"/10)",Screen.perX(2.2),"rgba(0,0,255,0.3)");
        plusButton.code=function(){ 
            if(Magic.customMagicCount<10){
                Magic.addEmptyMagic();
                makeMagicButton(true,10,1000,Magic.magicList.length-1);
                plusButton.drawOption(null,"rgba(0,0,255,0.3)","+magic ("+Magic.customMagicCount+"/10)",Screen.perX(2.2),"rgba(0,0,255,0.3)");
            }
        };
        for(let i=0; i<Magic.customMagic.length; i++)makeMagicButton(true,10,200+50*i,i+Magic.basicMagicCount);
        //BASIC MAGIC LIST
        let basic = new Button(canvas.width-210, Screen.perX(6)+10, Screen.perX(16),Screen.perX(3));
        basic.drawOption(null,null,"basic magic",25,"rgba(0,0,255,0.3)");
        for(let i=0; i<Magic.basicMagicCount; i++){
            if(Magic.magicList[i][4]>Level.playerLevel)break;
            makeMagicButton(false,canvas.width-210,300+50*i,i);
        }
        //COMPILE BUTTON CLICK EVENT
        compileBtn.onclick = function(){
            if(cs.temp==null)return;
            let cusMag=Magic.customMagic[cs.temp.temp-Magic.basicMagicCount];//현재 선택된 커스텀 매직
            let magic=Magic.convertMagictoJS(namebox.value, textbox.value);
            if(magic!=null){ //마법이 성공적으로 변환되면
                cusMag[0]=namebox.value;
                cusMag[1]=textbox.value;
                Magic.magicList[cs.temp.temp]=magic;
                Magic.saveMagic();
                cs.temp.drawOption("rgba(65, 105, 225,0.8)","black",namebox.value,Screen.perX(2),"black")
            }
        };
        
        //TEST MAP
        let mapSizeW=1000;
        let mapSizeH=500;
        let wallSize=200;
        new MapBlock(0,-wallSize-mapSizeH,mapSizeW,wallSize,"wall");//top
        new MapBlock(-wallSize, -wallSize-mapSizeH, wallSize, mapSizeH*2,"wall"); //left
        new MapBlock(mapSizeW, -wallSize-mapSizeH, wallSize, mapSizeH*2,"wall");//right
        new MapBlock(-wallSize,0,mapSizeW+wallSize*2,wallSize*2,"grass");
        Camera.makeMovingCamera(Game.p,0,0,10);
        Camera.cameraOn=true;
        function makePlayer(){Game.p=new Player(100, -100,10);Game.p.magicList=[null,null,null,null];
            Camera.e.temp=Game.p;Game.p.removeHandler=function(){makePlayer();};}
        function makeTester(){let p=new Player(500, -100,10);p.removeHandler=function(){makeTester();};}
        makePlayer();
        makeTester();
        Game.keyboardOn=true;
    },

    gameScreen:function() {
        Game.resetGame();
        Camera.cameraOn=true;
        Game.keyboardOn=true;
        let backButton = new Button(0, 0, Screen.perX(6), Screen.perX(6));
        backButton.code = function () { Screen.selectScreen() };
        backButton.drawOption(null, null, "<", Screen.perX(6), "black");
        //player
        Game.p = new Player(10, -60, Level.playerLevel);
        Game.p.removeHandler=function(){
            Game.channel[Game.BUTTON_CHANNEL]=[];
            Game.channel[Game.TEXT_CHANNEL]=[];
            let text = new Text(Screen.perX(50),Screen.perY(50),"you die",Screen.perX(10),"red",null,200,false);
            text.canAct=true;
            text.removeHandler=function(){Screen.selectScreen();};
            Magic.magicPoint=0;
            Level.stageMonsterCount=0;
        };
        Camera.makeMovingCamera(Game.p,0,0,10);
        //VIEW
        const viewTextSize=Screen.perX(1.5);
        const MAX_HP = 10000*Level.playerLevel;
        const MAX_MP = 30000*Level.playerLevel;
        let view = new Button(Screen.perX(55),Screen.perX(1),Screen.perX(45),Screen.perX(8),Game.TEXT_CHANNEL);
        view.drawCode=function(){
            ctx.strokeStyle="black";
            ctx.strokeRect(view.x,view.y,Screen.perX(18),Screen.perX(2));
            ctx.strokeRect(view.x,view.y+Screen.perX(2.5),Screen.perX(18),Screen.perX(2));
            ctx.fillStyle="brown";
            ctx.fillRect(view.x,view.y,Screen.perX(18)*(Game.p.life/MAX_HP),Screen.perX(2));
            ctx.fillStyle="royalblue";
            ctx.fillRect(view.x,view.y+Screen.perX(2.5),Screen.perX(18)*(Game.p.mp/MAX_MP),Screen.perX(2));
            ctx.fillStyle="black";
            ctx.font = "bold "+viewTextSize+"px Arial";
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillText(Game.p.life, Screen.perX(55.5),Screen.perX(1.5));
            ctx.fillText(Game.p.mp, Screen.perX(55.5),Screen.perX(4));
            for(let i=0; i<4; i++){
                if (Magic.skillNum[i] < 0) ctx.fillText("none", Screen.perX(75), Screen.perX(1) + Screen.perX(2) * i);
                else {
                    let coolT = Game.p.coolTime[i] - Game.time;
                    let magic = Game.p.magicList[i];
                    ctx.fillText(magic[0] + "(" + magic[3] + "): " + (coolT > 0 ? (coolT / 100) : "ready"), Screen.perX(75), Screen.perX(1) + Screen.perX(2) * i);
                }
            }
        }
        
        //MOBILE BUTTON 
        const mobileButtonSize=70;
        if (Screen.isMobile) {
            let leftButton = new Button(5, canvas.height - mobileButtonSize-5, mobileButtonSize, mobileButtonSize);
            leftButton.code = function () {  Game.p.moveFlag = true; Game.p.isRight = false; };
            leftButton.drawOption("rgba(61, 61, 61,0.5)", "black", "<", 80, "black");
            let upButton = new Button(10+mobileButtonSize, canvas.height - mobileButtonSize-5, mobileButtonSize, mobileButtonSize);
            upButton.code = function () { Game.p.jump()};
            upButton.drawOption("rgba(61, 61, 61,0.5)", "black", "^", 80, "black");
            let rightButton = new Button(15+mobileButtonSize*2, canvas.height - mobileButtonSize-5, mobileButtonSize, mobileButtonSize);
            rightButton.code = function () { Game.p.moveFlag = true; Game.p.isRight = true; };
            rightButton.drawOption("rgba(61, 61, 61,0.5)", "black", ">", 80, "black");
            let keys=["Q","W","E","R"];
            for(let i=0; i<4; i++){
                let keyButton = new Button(canvas.width-(5*4+mobileButtonSize*4)+i*(mobileButtonSize+5),canvas.height-mobileButtonSize-5,mobileButtonSize,mobileButtonSize);
                keyButton.code=function(){Game.p.castMagic(i);};
                keyButton.drawCode=function(){
                    ctx.fillStyle=(Game.p.coolTime[i]<Game.time ?"rgb(121, 140, 205)" : "rgba(61, 61, 61,0.5)");//"rgba(61, 61, 61,0.5)";
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
    },
    multiplayScreen:function(){
        Game.resetGame();
        let backButton = new Button(0, 0, Screen.perX(6), Screen.perX(6));
        backButton.code = function () { Screen.selectScreen();Multi.connectOff();Game.convertMultiMode(false)};
        backButton.drawOption(null, null, "<", Screen.perX(6), "black");
        
        let multiPlayText = new Text(Screen.perX(99),Screen.perX(1), "multi play", Screen.perX(3),"rgba(255,255,255,0.5)",null,-1,null);
        multiPlayText.textBaseline = "top";
        multiPlayText.textAlign="right";

        let serverOnView = new Button(Screen.perX(6),Screen.perX(1),Screen.perX(10),Screen.perX(2.5));
        serverOnView.drawOption(null,"brown","server off", Screen.perX(2),"brown",null);

        Multi.connectOn();
        Game.convertMultiMode(true);
        let playButton=new Button(Screen.perX(-100),Screen.perY(-100),Screen.perX(30),Screen.perX(8));
        playButton.drawOption("rgba(1, 1, 1,0.1)","black", "PLAY", Screen.perX(4), "black");
        playButton.code=function(){Multi.enterGame();};
        let serverChecker = new Entity(0,0,Game.BUTTON_CHANNEL);
        serverChecker.update=function(){
            //check server
            if(Game.time%20==0){
                if(Multi.serverOn&&Multi.gameOn==false){
                    playButton.x=Screen.perX(50)-playButton.w/2;
                    playButton.y=Screen.perY(50)-playButton.h/2;
                }else {
                    playButton.x=Screen.perX(-100);
                    playButton.y=Screen.perY(-100);
                }
                if(Multi.serverOn){serverOnView.drawOption(null,"green","server on", Screen.perX(2),"green",null);
                }else{serverOnView.drawOption(null,"brown","server off", Screen.perX(2),"brown",null);}
            }
        }

    },
    helpScreen:function(){
        Game.resetGame();
        //MENU BAR
        new MapBlock(0,0,Screen.perX(20), Screen.perY(100)); //어두운 바탕
        let backButton = new Button(0, 0, Screen.perX(6), Screen.perX(6));
        backButton.code = function () { Screen.selectScreen() };
        backButton.drawOption(null, null, "<", Screen.perX(6), "black");
        let howToText = new Text(Screen.perX(15), Screen.perY(5),"About",Screen.perX(2),"black",null,-1,false);
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


        //PANEL FUNCTION
        let nextLine=Screen.perX(3);
        function clearPanel(){
            Game.channel[Game.TEXT_CHANNEL]=[howToText];
            nextLine=Screen.perX(3);
        }
        function writeText(text, type){ //type은 제목인지(1) 본문인지(0)
            let textSize=(type==0 ? Screen.perX(2):Screen.perX(3));
            let textColor=(type==0 ? "black":"white");
            let textE = new Text(Screen.perX(25), nextLine, text, textSize, textColor,null,-1,false);
            textE.textBaseline = "top";
            textE.textAlign="left";
            nextLine+=(type==0 ? Screen.perX(3):Screen.perX(4));
        }

        function developerPanel(){
            clearPanel();
            // writeText("GAME INFO",1);
            // writeText("screen width: "+canvas.width,0);
            // writeText("screen height: "+canvas.height,0);
        }
        function howToCreateMagicPanel(){
            clearPanel();
            writeText("마법을 만드는 방법", 1);
            writeText("1. create magic 화면으로 이동",0);
            writeText("2. +magic 버튼을 클릭해서 빈 마법을 생성",0)
            writeText("3. 새로 만들어진 파란색 버튼 클릭",0)
            writeText("4. magic name 칸에 마법의 이름을 magic code 칸에 마법코드를 적음",0);
            writeText("5. 그 밑에 있는 create 버튼 클릭(성공해야 저장됨)",0);
            nextLine+=Screen.perX(2);
            writeText("*물질생성마법, 물질속성변환마법, 물질정보탐색마법을 참고하세요.",0);
            writeText("*create magic 화면에서 기본 마법의 코드를 볼 수 있습니다.",0);
            writeText("*모바일에서 이용하려면 모바일 모드로 바꾸지 말고 이용하세요.",0);
            writeText("*캐시 삭제를 하면 저장된 마법이 지워질 수 있습니다.",0);
        }
        function howToSelectMagicPanel(){
            clearPanel();
            writeText("마법을 선택하는 방법", 1);
            writeText("키 q,w,e,r에 원하는 마법을 지정할 수 있음",0)
            nextLine+=Screen.perX(1);
            writeText("1. select magic 화면으로 이동",0);
            writeText("2. 마법 버튼(파란색 또는 보라색 버튼)을 클릭",0);
            writeText("3. 키 버튼(Q,W,E,R)을 클릭",0);
            nextLine+=Screen.perX(2);
            writeText("*마법 버튼을 클릭하면 마법을 테스트할 수 있음",0);
        }

        function gameControlPanel(){
            clearPanel();
            writeText("이동하는법", 1);
            writeText("pc - 키보드 방향키",0);
            writeText("모바일 - 스크린 하단 방향 버튼",0);
            nextLine+=Screen.perX(3);
            writeText("마법을쓰는법", 1);
            writeText("pc - 키보드 q,w,e,r키",0);
            writeText("모바일 - 스크린 하단 Q,W,E,R 버튼",0);
            nextLine+=Screen.perX(3);
            writeText("문제가발생했을때", 1);
            writeText("새로고침하면 대부분의 문제가 해결됩니다",0);
            writeText("*중요 정보들은 저장됩니다",0);
        }

        function create_magicCodePanel(){
            clearPanel();
            writeText("물질 생성 마법",1);
            writeText("생성할 수 있는 물질 - 불, 전기, 얼음, 화살, 에너지, 검격, 블럭, 트리거",0)
            writeText("마법코드 - create(type, vx, vy, w, h)",0)
            nextLine+=Screen.perX(1);
            writeText("type - FIRE,ELECTRICITY,ICE,ARROW,ENERGY,SWORD,BLOCK,TRIGGER",0)
            writeText("vx - 가로방향 속력",0)
            writeText("vy - 세로방향 속력",0)
            writeText("w - 가로크기",0)
            writeText("h - 세로크기",0)
        }

        function magicCodePanel(){
            clearPanel();
            writeText("물질 속성 변환 마법",1);
            writeText("물질의 속성 - 속도, 위치, 가시성, 생명력, 행동 등",0);
            nextLine+=Screen.perX(2);
            writeText("giveForce(e,vx,vy) - 대상(e)을 vx, vy만큼 속력을 변화시킨다.",0)
            writeText("move(e,x,y) - 대상(e)을 현재 위치에서 x, y만큼 이동시킨다.",0)
            writeText("invisible(e,time) - 대상(e)을 time동안 보이지 않게 한다.",0)
            writeText("giveLife(e,life) - 대상(e)의 생명력을 life만큼 증가시킨다.",0)
            writeText("order(e,startT,endT,f) - 대상(e)에게 startT부터 endT까지 행동(f)을 시킨다.",0)
            writeText("setTrigger(t,f) - 트리거(t)에게 트리거를 발동 시킨 대상에게 할 행동(f)을 정한다.",0)
        }

        function info_magicCodePanel(){
            clearPanel();
            writeText("물질 정보 탐색 마법",1);
            writeText("얻을 수 있는 정보 - 속도, 위치, 플레이어 방향",0);
            nextLine+=Screen.perX(2);
            writeText("getVX(e) - 대상(e)의 x축 속도를 얻는다.",0);
            writeText("getVY(e) - 대상(e)의 y축 속도를 얻는다.",0);
            writeText("getX(e) - 플레이어를 기준으로 대상(e)의 x축 거리를 얻는다.",0);
            writeText("getY(e) - 플레이어를 기준으로 대상(e)의 y축 거리를 얻는다.",0);
            writeText("front() - 플레이어가 보고있는 방향이 오른쪽이면 1, 왼쪽이면 -1",0);
            writeText("player - 플레이어",0);
        }

        function prohibitedPanel(){
            clearPanel();
            writeText("금지어",1);
            writeText(`["new","function","let","var", "addMF", "setPlayer"]`,0);
            writeText(`["[",".","$"]`,0);
        }

        function magicEvaluationPanel(){
            clearPanel();
            writeText("마법 평가",1);
            writeText(`마법이 생성될 때 소비마나, 재사용대기시간이 자동으로 평가됩니다.`,0);
        }
    }
}