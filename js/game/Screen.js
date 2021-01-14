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
    selectMagic : null,
    bgColor : "black",

    perX:function(percentile){
        return canvas.width/100*percentile;
    },
    perY:function(percentile){
        return canvas.height/100*percentile;
    },

    btnSize(size){
        if(Screen.isMobile){
            return Screen.perX(100/1200*size);
        }else {
            return size;
        }
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

        var startButton = new Button((canvas.width - Screen.btnSize(300))/2, (canvas.height-Screen.btnSize(100))/2, Screen.btnSize(300), Screen.btnSize(100));
        startButton.canAct=true;
        startButton.code = function () { 
            const ash_interval = Screen.btnSize(300)/30;
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
        };
        startButton.drawOption(null, "black", "START", Screen.btnSize(80), "black");
        
        let clickHereText = new Button(Screen.perX(50),Screen.perY(62),0,0);
        clickHereText.drawOption(null, null, "click here",Screen.btnSize(20),"black");
    },

    selectScreen:function() {
        Game.resetGame();

        const space=(Screen.isMobile ? 5 : 10);

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
        //BACK
        let backButton = new Button(0, 0, Screen.btnSize(80), Screen.btnSize(80));
        backButton.code = function () { Screen.mainScreen() };
        backButton.drawOption(null, null, "<", Screen.btnSize(80), "black");
        //HELP BUTTON
        let helpButton = new Button(space, canvas.height-space-Screen.btnSize(40), Screen.btnSize(40), Screen.btnSize(40));
        helpButton.code = function () { Screen.helpScreen() };
        helpButton.drawOption(null, "white", "?", Screen.btnSize(40),"white");

        //MOBILE MODE BUTTON
        let mobileButton = new Button(canvas.width - space - Screen.btnSize(100), canvas.height - space - Screen.btnSize(40), Screen.btnSize(100), Screen.btnSize(40));
        mobileButton.code = function () {
            if(!Screen.isMobile){Game.convertMobileMode(true);Camera.extension=0.7;}
            startFs(canvas);
            if(canvas.width == Screen.CANVAS_W)Camera.extension=1;//전체화면에 실패했을때 그대로
            Screen.mainScreen();
            let full = new Button((canvas.width - 300)/2, (canvas.height-100)/2, 300, 100);
            full.code=function(){
                startFs(canvas);
                full.x=10000;
                Game.click((canvas.width - 300)/2+150, (canvas.height-100)/2+50);
            }
        };
        mobileButton.drawOption(null,"black","to mobile",Screen.btnSize(20),"black");
        //SELECT MAGIC BUTTON
        let selectMagicButton = new Button(canvas.width - Screen.btnSize(200)-space, space, Screen.btnSize(200), Screen.btnSize(50));
        selectMagicButton.code = function () { Screen.selectMagicScreen(); };
        selectMagicButton.drawOption(null, "black", "select magic", Screen.btnSize(30), "black");//"rgb(119, 138, 202)"
        //MAKE MAGIC BUTTON
        let makeMagicButton = new Button(canvas.width - Screen.btnSize(200)-space, 2*space+Screen.btnSize(50), Screen.btnSize(200), Screen.btnSize(50));
        makeMagicButton.code = function () { Screen.makeMagicScreen(); };
        makeMagicButton.drawOption(null, "black", "create magic", Screen.btnSize(30), "black");//"rgb(65, 105, 225)"

        //LEVEL BUTTON
        let block = new Button((canvas.width - Screen.btnSize(200)) /2, 0, Screen.btnSize(200), space);
        block.canInteraction=true;
        for (let i = 1; i <= Level.playerLevel; i++) {
            let levelButton = new Button((canvas.width - Screen.btnSize(200)) /2, Screen.btnSize(200) + i * (space+Screen.btnSize(50)), Screen.btnSize(200), Screen.btnSize(50));
            levelButton.code = function () { Screen.gameScreen(); Level.makeStage(i); };
            levelButton.drawOption("rgba("+(255-i*25)+","+(255-i*25)+","+(255-i*20)+",0.5)", "black", "LEVEL" + i, Screen.btnSize(40), "black");
            levelButton.ga = 0.5;
            levelButton.canInteraction=true;
            levelButton.canMove=true;
        }
    },

    selectMagicScreen:function() {
        Game.resetGame();
        const space=(Screen.isMobile ? 5 : 10); //버튼 간격

        let backBtn = new Button(0, 0, Screen.btnSize(80), Screen.btnSize(80));
        backBtn.code = function () { Screen.selectScreen() };
        backBtn.drawOption(null, null, "<", Screen.btnSize(80), "black");

        //KEYBORAD BUTTON
        let key = ['Q', 'W', 'E', 'R'];
        let keyButtons = new Array(4);
        for (let i = 0; i < 4; i++) {
            let temp = new Button(Screen.btnSize(100)+space*2, Screen.btnSize(100)-Screen.btnSize(40) + (Screen.btnSize(100)+space) * i, Screen.btnSize(200), Screen.btnSize(40));

            let keyBtn = new Button(space, Screen.btnSize(100) + (Screen.btnSize(100)+space) * i, Screen.btnSize(100), Screen.btnSize(100))
            keyBtn.code = function () {
                if (Screen.selectMagic != null && Screen.selectMagic.temp[1] != i) {
                    if (keyBtn.temp[0] != null) { //키버튼에 마법이 있으면
                        keyBtn.temp[0].x = space*8+Screen.btnSize(100)+Screen.btnSize(200);
                        keyBtn.temp[0].y = Screen.btnSize(40)*(Magic.basicMagicCount+Magic.customMagicCount+1);
                        keyBtn.temp[0].vy =0;
                        (keyBtn.temp[0]).temp[1] = null;//마법 기록 삭제
                    }
                    if (Screen.selectMagic.temp[1] != null) { //선택한 마법에 이미 키가 있으면
                        Magic.skillNum[Screen.selectMagic.temp[1]] = 0;
                        keyButtons[Screen.selectMagic.temp[1]].temp[0] = null;//이전 키버튼의 선택 기록 삭제
                    }
                    Screen.selectMagic.x = Screen.btnSize(100)+space*2; Screen.selectMagic.y = Screen.btnSize(100) + (Screen.btnSize(100)+space) * i;
                    Magic.skillNum[i] = Screen.selectMagic.temp[0];
                    Screen.selectMagic.temp[1] = i;
                    keyBtn.temp[0] = Screen.selectMagic;
                    Screen.selectMagic = null;
                }
                console.log(Magic.skillNum);
            };
            keyBtn.drawOption("rgb(88, 88, 88)", "black", key[i], Screen.btnSize(80), "black");

            keyButtons[i] = keyBtn;
            keyBtn.temp.push(null); //temp[0] 은 선택된 마법을 의미
        }

        let listStart=-1;
        let listEnd=-1;
        //
        
        new Button(0,0,0,0).drawCode=function(){
            if (Screen.selectMagic != null) {
                //선택된 마법의 색을 어둡게
                ctx.fillStyle = "rgba(0,0,0,0.5)";
                ctx.fillRect(Screen.selectMagic.x, Screen.selectMagic.y, Screen.selectMagic.w, Screen.selectMagic.h);
                
                //magic explanation
                let temp1=Screen.btnSize(300);
                let temp2=Screen.btnSize(30);
                ctx.fillStyle = "black";
                ctx.font = "bold "+temp2+"px Arial";
                ctx.textBaseline = "top";
                ctx.textAlign = "left";
                ctx.fillText("<"+Magic.magicList[Screen.selectMagic.temp[0]][0]+">", canvas.width-temp1, 10);

                ctx.fillText("cooltime: "+(Magic.magicList[Screen.selectMagic.temp[0]][2]/100)+"sec", canvas.width-temp1, 10+temp2);
                ctx.fillText("mp: "+(Magic.magicList[Screen.selectMagic.temp[0]][3]), canvas.width-temp1,10+temp2*2);
            }
        }

        //MAGIC LIST
        for (let i = 1; i < Magic.magicList.length; i++) {
            if(Magic.magicList[i][4]>Level.playerLevel)continue;
            if(listStart==-1)listStart=Game.channel[Game.BUTTON_CHANNEL].length;
            let magicBtn = new Button(space*8+Screen.btnSize(100)+Screen.btnSize(200), Screen.btnSize(100) + 50 * i, Screen.btnSize(200), Screen.btnSize(40));
            magicBtn.code = function () { Screen.selectMagic = magicBtn; (Magic.magicList[i][1])(Game.p); };
            let magicColor="rgba(119, 138, 202,0.8)";
            if(i>Magic.basicMagicCount)magicColor="rgba(65, 105, 225,0.8)";
            magicBtn.drawOption(magicColor, "black", Magic.magicList[i][0], Screen.btnSize(30), "black");
            magicBtn.temp.push(i); //temp[0]=Magic.magicList
            magicBtn.temp.push(null); //temp[1] is keyButton index
            magicBtn.ga = 0.5;
            magicBtn.canInteraction=true;
            magicBtn.canMove=true;

            let keyIndex = Magic.skillNum.findIndex(function (e) { return e == i; });
            if (keyIndex >= 0) {
                Screen.selectMagic = magicBtn;
                keyButtons[keyIndex].collisionHandler();
            }
        }
        listEnd=Game.channel[Game.BUTTON_CHANNEL].length;
        
        //MAGIC LIST SCROLL
        let magicList = new Button(space*8+Screen.btnSize(100)+Screen.btnSize(200), -Screen.btnSize(100), Screen.btnSize(200), Screen.btnSize(100)+space);
        magicList.drawCode = function () { 
            //magic list
                ctx.fillStyle = "rgba(0,0,0,0.2)";
                //ctx.fillRect(magicList.x-space,magicList.y,space*2+magicBtnW,40*(listEnd-listStart));
                ctx.fillRect(magicList.x-space,0,space*2+Screen.btnSize(200),canvas.height);

        }
        function move(d){
            for(let i=listStart;i<=listEnd;i++){
                if(Game.channel[Game.BUTTON_CHANNEL][i].temp[1]==null)Game.channel[Game.BUTTON_CHANNEL][i].y+=d;
            }
        }
        let upButton = new Button(space*9+Screen.btnSize(100)+Screen.btnSize(200)*2,0,Screen.btnSize(50),Screen.btnSize(50));
        upButton.drawOption("rgba(0,0,0,0.5)",null,"▲", Screen.btnSize(40),"white");
        upButton.code=function(){if(Game.channel[Game.BUTTON_CHANNEL][listEnd].y<0)move(200);};
        let downButton = new Button(space*9+Screen.btnSize(100)+Screen.btnSize(200)*2,canvas.height-Screen.btnSize(50),Screen.btnSize(50),Screen.btnSize(50));
        downButton.drawOption("rgba(0,0,0,0.5)",null,"▼", Screen.btnSize(40),"white");
        downButton.code=function(){if(40*(listEnd-listStart)+Game.channel[Game.BUTTON_CHANNEL][listEnd].y>canvas.height)move(-200);};

        //TEST WORLD
        new MapBlock(canvas.width*5/9, 2*canvas.height/3, canvas.width-canvas.width/2, 2*canvas.height/3, "rgb(35, 35, 35)");
        function makePlayer(){Game.p=new Player(canvas.width*5/9+20, 0);Camera.e.temp=Game.p;Game.p.dieCode=function(){makePlayer();}}
        makePlayer();
        Magic.magicPoint=0; //스킬 못쓰게
        let monster = new Monster(0, canvas.width-100, 0);
        monster.life = 1000000;
        monster.action = [];
        monster.addAction(100,100,function(){monster.canMove=false;});
    },

    makeMagicScreen:function(){
        Game.resetGame();
        const namebox=document.querySelector(".namebox");
        const textbox=document.querySelector(".textbox");
        const compileBtn=document.querySelector(".compilebutton");
        const successInfo=document.querySelector(".successInfo");
        const magicInfo = document.querySelector(".magicInfo");
        function printInfo(text1="", text2=""){
            successInfo.innerText = text1;
            magicInfo.innerText = text2;
        }

        //BACK
        let backButton = new Button(0, 0, Screen.btnSize(80), Screen.btnSize(80));
        backButton.code = function () { 
            namebox.value="";
            textbox.value="";
            successInfo.innerText="";
            magicInfo.innerText="";
            Screen.selectScreen();
            tb.style.display="none"; 
        };
        backButton.drawOption(null, null, "<", Screen.btnSize(80), "black");

        //모바일 모드이면 엘레멘트 생성 중단
        if(Screen.isMobile){
            let text = new Button(canvas.width/2,canvas.height/2,0,0);
            text.drawOption(null, null, "not work on mobile mode", 20, "black");
            return;
        }
        
        //텍스트박스 생성
        tb.style.display="block";
        
        //control system
        let cs=new Button(0,0,0,0);
        cs.temp=null;
        cs.drawCode=function(){
            if(cs.temp!=null){
                ctx.fillStyle="rgba(0, 0, 0,0.5)";
                ctx.fillRect(cs.temp.x,cs.temp.y,200,40);
            }
        };
        
        //MAGIC LIST
        function makeMagicButton(isCustom, x,y,num){
            let magicBtn = new Button(x,y,200,40);
            let color = "rgba(119, 138, 202,0.8)";
            if(isCustom) color = "rgba(65, 105, 225,0.8)";
            magicBtn.drawOption(color,"black",Magic.magicList[num][0],30,"black");

            magicBtn.code = function () {
                (Magic.magicList[num][1]) (Game.p);
                if(isCustom){
                    namebox.value = Magic.customMagic[num-Magic.basicMagicCount-1][0];
                    textbox.value = Magic.customMagic[num-Magic.basicMagicCount-1][1];
                    cs.temp = magicBtn;
                    printInfo("", "cooltime: "+(Magic.magicList[num][2]/100)+"sec\nMP: "+Magic.magicList[num][3]);
                }else{
                    namebox.value = "(basic)"+Magic.basicMagic[num-1][0];
                    textbox.value = Magic.basicMagic[num-1][1];
                    cs.temp = null;
                    printInfo("Basic magic can not edit.", "cooltime: "+(Magic.magicList[num][2]/100)+"sec\nMP: "+Magic.magicList[num][3]);
                }
                
            }
            magicBtn.temp = num;
            magicBtn.ga = 0.5;
            magicBtn.vy = 20;
            magicBtn.canMove = true;
            magicBtn.canInteraction = true;
            
        }
        let plusButton = new Button(10, Screen.btnSize(80)+10, 200, 40);
        plusButton.drawOption(null,"black","+ magic",30,"black");
        plusButton.code=function(){ 
            if(Magic.customMagicCount<10){
                Magic.addEmptyMagic();
                makeMagicButton(Magic.customMagic,10,1000,Magic.magicList.length-1);
            }
        };
        for(let i=0; i<Magic.customMagic.length; i++){
            makeMagicButton(true,10,200+50*i,i+Magic.basicMagicCount+1);
        }
        let basic = new Button(canvas.width-210, 10, 200, 60);
        basic.drawOption(null,null,"basic",30,"black");
        for(let i=0; i<Magic.basicMagicCount; i++){
            if(Magic.magicList[i+1][4]>Level.playerLevel)continue;
            makeMagicButton(false,canvas.width-210,200+50*i,i+1);
        }
        //COMPILE BUTTON CLICK EVENT
        compileBtn.onclick = function(){
            if(cs.temp==null)return;
            let cusMag=Magic.customMagic[cs.temp.temp-Magic.basicMagicCount-1];//현재 선택된 커스텀 매직
            let magic=Magic.convertMagictoJS(namebox.value, textbox.value);
            if(magic!=null){ //마법이 성공적으로 변환되면
                cusMag[0]=namebox.value;
                cusMag[1]=textbox.value;
                Magic.magicList[cs.temp.temp]=magic;
                Magic.saveMagic();
                cs.temp.drawOption("rgba(65, 105, 225,0.8)","black",namebox.value,30,"black")
                printInfo("SUCCESS", "cooltime: "+(magic[2]/100)+"sec\nMP: "+magic[3]);
            }
        };
        
        //TEST MAP
        Magic.magicPoint=0;
        new MapBlock(0,canvas.height-80,canvas.width,80).drawCode=MapBlock.getTexture("grass");
        function makePlayer(){Game.p=new Player(canvas.width/2, 0);Camera.e.temp=Game.p;Game.p.dieCode=function(){makePlayer();}}
        makePlayer();
        
    },

    gameScreen:function() {
        Game.resetGame();
        Camera.cameraOn=true;

        let backButton = new Button(0, 0, Screen.btnSize(80), Screen.btnSize(80));
        backButton.code = function () { Screen.selectScreen() };
        backButton.drawOption(null, null, "<", Screen.btnSize(80), "black");

        let ashSpray = new Button(-100,-100,0,0,Game.BUTTON_CHENNEL);
        ashSpray.canAct=true;
        ashSpray.canInteraction=false;
        ashSpray.addAction(1,1000000,function(){
            if(Game.time%5==0){
                let r = Math.random()*2000;
                let ash=new Particle(3,Game.p.x-1000+r,-Game.p.y-600);
                ash.life=300;
                ash.vy-=1.5;
            }
        });

        //HP, MP GAGE
        let hpGage = new Button(canvas.width-450,10,200,20,Game.TEXT_CHANNEL);
        hpGage.drawCode=function(){
            ctx.fillStyle="brown";
            ctx.fillRect(canvas.width-450,10,200*(Game.p.life/Level.playerLevel/10000),20);
            ctx.strokeStyle="black";
            ctx.strokeRect(canvas.width-450,10,200,20);
        }
        let mpGage = new Button(canvas.width-450,35,200,20,Game.TEXT_CHANNEL);
        const MAX_MP = 10000*Level.playerLevel;
        const plusMP = Level.playerLevel*1; //*1 to Equalize number format of Magic.magicPoint 
        
        mpGage.drawCode=function(){
            if(Magic.magicPoint<MAX_MP){
                Magic.magicPoint+=plusMP;
            }
            ctx.fillStyle="royalblue";
            ctx.fillRect(canvas.width-450,35,200*(Magic.magicPoint/MAX_MP),20);
            ctx.strokeStyle="black";
            ctx.strokeRect(canvas.width-450,35,200,20);
        }

        //COOLTIME VIEW
        let coolTimeView = new Button(canvas.width - 150, 10, 0, 0, Game.TEXT_CHANNEL);
        coolTimeView.drawCode = function () {
            ctx.fillStyle = "black";
            ctx.font = "bold 20px Arial";
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            
            for(let i=0; i<4; i++){
                if(Magic.skillNum[i]==0)continue;
                let coolT = Magic.coolTime[i] - Game.time;
                ctx.fillText(Magic.magicList[Magic.skillNum[i]][0] + ": " + (coolT > 0 ? (coolT / 100) : "ready"), canvas.width-200, 10+20*i);
                
            }
        };
        //MOBILE BUTTON 
        let mobileButtonSize=70;
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
                keyButton.code=function(){Magic.doSkill(Game.p,i);};
                keyButton.drawCode=function(){
                    ctx.fillStyle=(Magic.coolTime[i]<Game.time ?"rgb(121, 140, 205)" : "rgba(61, 61, 61,0.5)");//"rgba(61, 61, 61,0.5)";
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
    helpScreen:function(){
        Game.resetGame();
        let backButton = new Button(0, 0, Screen.btnSize(80), Screen.btnSize(80));
        backButton.code = function () { Screen.selectScreen() };
        backButton.drawOption(null, null, "<", Screen.btnSize(80), "black");

        let hs=40; //head size
        let bs=30; //body size

        let nextLine=Screen.perX(5);

        new Text(Screen.perX(50), nextLine, "1.create magic",Screen.btnSize(hs),"black", null,-1,false);
        nextLine+=Screen.btnSize(hs);
        new Text(Screen.perX(50), nextLine, "How to create magic: click '+magic' button -> click blue button ->",Screen.btnSize(bs),"black", null,-1,false);
        nextLine+=Screen.btnSize(bs+10);
        new Text(Screen.perX(50), nextLine, " write name and code -> click compile button",Screen.btnSize(bs),"black", null,-1,false);
        nextLine+=Screen.btnSize(bs+10);

        nextLine+=Screen.btnSize(hs);

        new Text(Screen.perX(50), nextLine, "2.select magic",Screen.btnSize(hs),"black", null,-1,false);
        nextLine+=Screen.btnSize(hs);
        new Text(Screen.perX(50), nextLine, "How to select magic: click magic button(blue ans purple button) ->",Screen.btnSize(bs),"black", null,-1,false);
        nextLine+=Screen.btnSize(bs);
        new Text(Screen.perX(50), nextLine, "click keyborad Button(Q,W,E,R)",Screen.btnSize(bs),"black", null,-1,false);
        nextLine+=Screen.btnSize(bs);

        nextLine+=Screen.btnSize(60);

        new Text(Screen.perX(50), nextLine, "3.fight",Screen.btnSize(hs),"black", null,-1,false);
        nextLine+=Screen.btnSize(hs);
        new Text(Screen.perX(50), nextLine, "How to move: left(<), jump(^), right(>)",Screen.btnSize(bs),"black", null,-1,false);
        nextLine+=Screen.btnSize(bs);
        new Text(Screen.perX(50), nextLine, "How to use magic: click keyboard q,w,e,r",Screen.btnSize(bs),"black", null,-1,false);
        nextLine+=Screen.btnSize(bs);
    }
}