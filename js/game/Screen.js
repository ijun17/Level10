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

        var startButton = new Button((canvas.width - 300)/2, (canvas.height-100)/2, 300, 100);
        startButton.canAct=true;
        startButton.code = function () { 
            for(let i=0; i<30; i++){
                for(let j=0; j<10; j++){
                    let e = new Particle(3, startButton.x+i*10, startButton.y+j*10);
                    e.ga=0;
                    e.w=15;
                    e.h=15;
                    e.vx/=2;
                    e.vy/=2;
                }
            }
            startButton.addAction(50,50,function(){Screen.selectScreen();});
            startButton.drawCode=function(){};
        };
        startButton.drawOption(null, "black", "START", 80, "black");
        
        let clickHereText = new Button(Screen.perX(50),Screen.perY(62),0,0);
        clickHereText.drawOption(null, null, "click here",20,"black");
    },

    selectScreen:function() {
        Game.resetGame();

        let space=10;
        let backBtnW=80;
        let levelBtnW=200;
        let levelBtnH=50;
        let toMobileBtnW=100;
        let toMobileBtnH=40;
        let selectMagicButtonW=200;
        let selectMagicButtonH=50;
        let backBtnTextSize=80;
        let levelBtnTextSize=40;
        let selectMagicBtnTextSize=30;
        let mobileBtnTextSize=20;
        let fullBtnTextSize=15;

        if(Screen.isMobile){
            space=5;
            backBtnW=Screen.perX(100/14);
            levelBtnW=Screen.perX(100/5);
            levelBtnH=Screen.perX(100/20);
            toMobileBtnW=Screen.perX(100/12);
            toMobileBtnH=Screen.perX(100/26);
            selectMagicButtonW=Screen.perX(100/6);
            selectMagicButtonH=Screen.perX(100/24);

            backBtnTextSize=Screen.perX(100/14);
            levelBtnTextSize=24;
            selectMagicBtnTextSize=15;
            mobileBtnTextSize=15;
            fullBtnTextSize=10;
        }

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
        //back button
        let backButton = new Button(0, 0, backBtnW, backBtnW);
        backButton.code = function () { Screen.mainScreen() };
        backButton.drawOption(null, null, "<", backBtnTextSize, "black");

        //mobile button
        let mobileButton = new Button(canvas.width - space - toMobileBtnW, canvas.height - space - toMobileBtnH, toMobileBtnW, toMobileBtnH);
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
        mobileButton.drawOption(null,"black","to mobile",mobileBtnTextSize,"black");
        //select magic button
        let selectMagicButton = new Button(canvas.width - selectMagicButtonW-space, space, selectMagicButtonW, selectMagicButtonH);
        selectMagicButton.code = function () { Screen.selectMagicScreen(); };
        selectMagicButton.drawOption(null, "black", "select magic", selectMagicBtnTextSize, "black");//"rgb(119, 138, 202)"
        //make magic button
        let makeMagicButton = new Button(canvas.width - selectMagicButtonW-space, 2*space+selectMagicButtonH, selectMagicButtonW, selectMagicButtonH);
        makeMagicButton.code = function () { Screen.makeMagicScreen(); };
        makeMagicButton.drawOption(null, "black", "create magic", selectMagicBtnTextSize, "black");//"rgb(65, 105, 225)"

        //level button
        let block = new Button((canvas.width - levelBtnW) /2, 0, levelBtnW, space);
        block.canInteraction=true;
        for (let i = 1; i <= Level.playerLevel; i++) {
            let levelButton = new Button((canvas.width - levelBtnW) /2, levelBtnW + i * (space+levelBtnH), levelBtnW, levelBtnH);
            levelButton.code = function () { Screen.gameScreen(); Level.makeStage(i); };
            levelButton.drawOption("rgb("+(255-i*25)+","+(255-i*25)+","+(255-i*20)+")", "black", "LEVEL" + i, levelBtnTextSize, "black");
            levelButton.ga = 0.5;
            levelButton.canInteraction=true;
            levelButton.canMove=true;
        }
    },

    selectMagicScreen:function() {
        Game.resetGame();
        let space=10; //버튼간 간격
        let backBtnW=80;
        let keyBtnW=100;
        let magicBtnW=200;
        let magicBtnH=40;

        let backBtnTextSize=80;
        let keyBtnTextSize=80;
        let magicBtnTextSize=30;

        if(Screen.isMobile){
            space=5;
            backBtnW=Screen.perX(100/14);
            keyBtnW=Screen.perX(100/12);
            magicBtnW=Screen.perX(100/6);
            magicBtnH=Screen.perX(100/30);

            backBtnTextSize=Screen.perX(100/14);
            keyBtnTextSize=60;
            magicBtnTextSize=15;
        }

        let backButton = new Button(0, 0, backBtnW, backBtnW);
        backButton.code = function () { Screen.selectScreen() };
        backButton.drawOption(null, null, "<", backBtnTextSize, "black");

        let key = ['Q', 'W', 'E', 'R'];
        let keyButtons = new Array(4);
        for (let i = 0; i < 4; i++) {
            let temp = new Button(keyBtnW+space*2, keyBtnW-magicBtnH + (keyBtnW+space) * i, magicBtnW, magicBtnH);

            let keyButton = new Button(space, keyBtnW + (keyBtnW+space) * i, keyBtnW, keyBtnW)
            keyButton.code = function () {
                if (Screen.selectMagic != null && Screen.selectMagic.temp[1] != i) {
                    if (keyButton.temp[0] != null) { //키버튼에 마법이 있으면
                        keyButton.temp[0].x = space*8+keyBtnW+magicBtnW;
                        keyButton.temp[0].y = 5000;
                        keyButton.temp[0].vy = 100;
                        (keyButton.temp[0]).temp[1] = null;//마법 기록 삭제
                    }
                    if (Screen.selectMagic.temp[1] != null) { //선택한 마법에 이미 키가 있으면
                        Magic.skillNum[Screen.selectMagic.temp[1]] = 0;
                        keyButtons[Screen.selectMagic.temp[1]].temp[0] = null;//이전 키버튼의 선택 기록 삭제
                    }
                    Screen.selectMagic.x = keyBtnW+space*2; Screen.selectMagic.y = keyBtnW + (keyBtnW+space) * i;
                    Magic.skillNum[i] = Screen.selectMagic.temp[0];
                    Screen.selectMagic.temp[1] = i;
                    keyButton.temp[0] = Screen.selectMagic;
                    Screen.selectMagic = null;
                }
                console.log(Magic.skillNum);
            };
            keyButton.drawOption("rgb(88, 88, 88)", "black", key[i], keyBtnTextSize, "black");

            keyButtons[i] = keyButton;
            keyButton.temp.push(null); //temp[0] 은 선택된 마법을 의미
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
                ctx.fillStyle = "black";
                ctx.font = "bold 20px Arial";
                ctx.textBaseline = "top";
                ctx.textAlign = "left";
                ctx.fillText("name: "+Magic.magicList[Screen.selectMagic.temp[0]][0], canvas.width-200, 10);
                ctx.fillText("cooltime: "+(Magic.magicList[Screen.selectMagic.temp[0]][2]/100)+"s", canvas.width-200, 30);
                ctx.fillText("mana: "+(Magic.magicList[Screen.selectMagic.temp[0]][3]), canvas.width-200,50);
            }
        }

        //매직 list
        for (let i = 1; i < Magic.magicList.length; i++) {
            if(Magic.magicList[i][4]>Level.playerLevel)continue;
            if(listStart==-1)listStart=Game.channel[Game.BUTTON_CHANNEL].length;
            let magicButton = new Button(space*8+keyBtnW+magicBtnW, keyBtnW + 50 * i, magicBtnW, magicBtnH);
            magicButton.code = function () { Screen.selectMagic = magicButton; (Magic.magicList[i][1])(Game.p); };
            let magicColor="rgba(119, 138, 202,0.8)";
            if(i>Magic.basicMagicCount)magicColor="rgba(65, 105, 225,0.8)";
            magicButton.drawOption(magicColor, "black", Magic.magicList[i][0], magicBtnTextSize, "black");
            magicButton.temp.push(i); //temp[0]=Magic.magicList
            magicButton.temp.push(null); //temp[1] is keyButton index
            magicButton.ga = 0.5;
            magicButton.canInteraction=true;
            magicButton.canMove=true;

            let keyIndex = Magic.skillNum.findIndex(function (e) { return e == i; });
            if (keyIndex >= 0) {
                Screen.selectMagic = magicButton;
                let clickE = new Block(0, 0, 0, 0);
                clickE.life = 1;
                clickE.collisionLevel = -8;
                clickE.canMove = false;
                keyButtons[keyIndex].collisionHandler(clickE);
            }
        }
        listEnd=Game.channel[Game.BUTTON_CHANNEL].length;
        
        //magic list
        let magicList = new Button(space*8+keyBtnW+magicBtnW, 0, magicBtnW, 10);
        magicList.drawCode = function () { 
            //magic list
                ctx.fillStyle = "rgba(0,0,0,0.2)";
                //ctx.fillRect(magicList.x-space,magicList.y,space*2+magicBtnW,40*(listEnd-listStart));
                ctx.fillRect(magicList.x-space,0,space*2+magicBtnW,canvas.height);

        }
        function move(d){
            for(let i=listStart;i<=listEnd;i++){
                if(Game.channel[Game.BUTTON_CHANNEL][i].temp[1]==null)Game.channel[Game.BUTTON_CHANNEL][i].y+=d;
            }
        }
        let upButton = new Button(space*9+keyBtnW+magicBtnW*2,0,keyBtnW/2,keyBtnW/2);
        upButton.drawOption("rgba(0,0,0,0.5)",null,"▲", magicBtnTextSize,"white");
        upButton.code=function(){if(Game.channel[Game.BUTTON_CHANNEL][listEnd].y<0)move(200);};
        let downButton = new Button(space*9+keyBtnW+magicBtnW*2,canvas.height-keyBtnW/2,keyBtnW/2,keyBtnW/2);
        downButton.drawOption("rgba(0,0,0,0.5)",null,"▼", magicBtnTextSize,"white");
        downButton.code=function(){if(40*(listEnd-listStart)+Game.channel[Game.BUTTON_CHANNEL][listEnd].y>canvas.height)move(-200);};

        //simulation
        new MapBlock(canvas.width*5/9, 2*canvas.height/3, canvas.width-canvas.width/2, 2*canvas.height/3, "rgb(35, 35, 35)");
        function makePlayer(){Game.p=new Player(canvas.width*5/9+20, 0);Camera.e.temp=Game.p;Game.p.dieCode=function(){makePlayer();}}
        makePlayer();
        let monster = new Monster(0, canvas.width-100, 0);
        monster.life = 1000000;
        monster.action = [];
        monster.addAction(100,100,function(){monster.canMove=false;});
        
        //키보드 눌러도 스킬 안되게
        //Magic.coolTime=[99999999,99999999,99999999,99999999];
        Magic.magicPoint=0;
    },

    makeMagicScreen:function(){
        Game.resetGame();
        let backBtnW=80;
        let backBtnTextSize=80;

        //백버튼
        let backButton = new Button(0, 0, backBtnW, backBtnW);
        backButton.code = function () { Screen.selectScreen();tb.style.display="none"; };
        backButton.drawOption(null, null, "<", backBtnTextSize, "black");

        //모바일이면 나감
        if(Screen.isMobile){
            //backBtnW=Screen.perX(100/14);
            //backBtnTextSize=Screen.perX(100/14);
            let text = new Button(canvas.width/2,canvas.height/2,0,0);
            text.drawOption(null, null, "make magic not work mobile mode", 20, "black");
            return;
        }
        const namebox=document.querySelector(".namebox");
        const textbox=document.querySelector(".textbox");
        const compileBtn=document.querySelector(".compilebutton");
        

        //전체화면 해제
        //exitFs(document);
        //텍스트박스 생성
        tb.style.display="block";
        //키보드 눌러도 스킬 안되게
        //Magic.coolTime=[99999999,99999999,99999999,99999999];
        Magic.magicPoint=0;
        
        //control system
        let cs=new Button(0,0,0,0);
        cs.temp=null;
        cs.drawCode=function(){
            if(cs.temp!=null){
                ctx.fillStyle="rgba(0, 0, 0,0.5)";
                ctx.fillRect(cs.temp.x,cs.temp.y,200,40);
            }
        };
        
        //스킬 리스트
        function makeMagicButton(isCustom, x,y,num){
            let magicBtn = new Button(x,y,200,40);
            magicBtn.drawCode=function(){
                if(isCustom)ctx.fillStyle="rgba(65, 105, 225,0.8)";
                else ctx.fillStyle="rgba(119, 138, 202,0.8)";
                ctx.fillRect(magicBtn.x, magicBtn.y, magicBtn.w, magicBtn.h);
                ctx.strokeStyle="black";
                ctx.strokeRect(magicBtn.x, magicBtn.y, magicBtn.w, magicBtn.h);
                ctx.fillStyle="black";
                ctx.font = "bold 30px Arial";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(Magic.magicList[num][0],magicBtn.x+magicBtn.w/2, magicBtn.y+magicBtn.h/2);
            }
            magicBtn.code = function () {
                (Magic.magicList[num][1]) (Game.p);
                if(isCustom){
                    namebox.value = Magic.customMagic[num-Magic.basicMagicCount-1][0];
                    textbox.value = Magic.customMagic[num-Magic.basicMagicCount-1][1];
                    cs.temp = magicBtn;
                }else{
                    namebox.value = "(basic)"+Magic.basicMagic[num-1][0];
                    textbox.value = Magic.basicMagic[num-1][1];
                    cs.temp = null;
                }
                
            }
            magicBtn.temp = num;
            magicBtn.ga = 0.5;
            magicBtn.vy = 20;
            magicBtn.canMove = true;
            magicBtn.canInteraction = true;
            
        }
        let plusButton = new Button(10, backBtnTextSize+10, 200, 40);
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
            makeMagicButton(false,canvas.width-210,200+50*i,i+1);
        }
        //compile button click event
        compileBtn.onclick = function(){
            if(cs.temp==null)return;
            let cusMag=Magic.customMagic[cs.temp.temp-Magic.basicMagicCount-1];//현재 선택된 커스텀 매직
            let magic=Magic.convertMagictoJS(namebox.value, textbox.value);
            if(magic!=null){ //마법이 성공적으로 변환되면
                cusMag[0]=namebox.value;
                cusMag[1]=textbox.value;
                Magic.magicList[cs.temp.temp]=magic;
                Magic.saveMagic();
            }
        };
        
        //test map
        new MapBlock(0,canvas.height-80,canvas.width,80).drawCode=MapBlock.getTexture("grass");
        function makePlayer(){Game.p=new Player(canvas.width/2, 0);Camera.e.temp=Game.p;Game.p.dieCode=function(){makePlayer();}}
        makePlayer();
        
    },

    gameScreen:function() {
        Game.resetGame();
        Camera.cameraOn=true;
        let backBtnW=80;
        let backBtnTextSize=80;
        if(Screen.isMobile){
            backBtnW=Screen.perX(100/14);
            backBtnTextSize=Screen.perX(100/14);
        }
        

        let backButton = new Button(0, 0, backBtnW, backBtnW);
        backButton.code = function () { Screen.selectScreen() };
        backButton.drawOption(null, null, "<", backBtnTextSize, "black");

        let mobileButtonSize=80;

        let ashSpray = new Button(-100,-100,0,0,Game.BUTTON_CHENNEL);
        ashSpray.canAct=true;
        ashSpray.canInteraction=false;
        ashSpray.addAction(1,1000000,function(){
            if(Game.time%5==0){
                let r = Math.random()*2000;
                let ash=new Particle(3,Game.p.x-1000+r,-Game.p.y-600);
                //ash.w=20;
                //ash.h=20;
                ash.life=300;
                ash.vy-=1.5;
            }
        });

        //hp mp view 200px
        let hpGage = new Button(canvas.width-450,10,200,20,Game.TEXT_CHANNEL);
        hpGage.drawCode=function(){
            ctx.fillStyle="brown";
            ctx.fillRect(canvas.width-450,10,200*(Game.p.life/Level.playerLevel/10000),20);
            ctx.strokeStyle="black";
            ctx.strokeRect(canvas.width-450,10,200,20);
        }
        let mpGage = new Button(canvas.width-450,35,200,20,Game.TEXT_CHANNEL);
        const MAX_MP = 10000*Level.playerLevel;
        mpGage.drawCode=function(){
            if(Magic.magicPoint<MAX_MP)Magic.magicPoint+=3;
            ctx.fillStyle="royalblue";
            ctx.fillRect(canvas.width-450,35,200*(Magic.magicPoint/MAX_MP),20);
            ctx.strokeStyle="black";
            ctx.strokeRect(canvas.width-450,35,200,20);
        }

        //cooltime view
        let coolTimeView = new Button(canvas.width - 150, 10, 0, 0, Game.TEXT_CHANNEL);
        coolTimeView.drawCode = function () {
            ctx.fillStyle = "black";
            ctx.font = "bold 20px Arial";
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            let coolT = Magic.coolTime[0] - Game.time;
            ctx.fillText(Magic.magicList[Magic.skillNum[0]][0] + ": " + (coolT > 0 ? (coolT / 100) : "ready"), canvas.width-200, 10);
            coolT = Magic.coolTime[1] - Game.time;
            ctx.fillText(Magic.magicList[Magic.skillNum[1]][0] + ": " + (coolT > 0 ? (coolT / 100) : "ready"), canvas.width-200, 30);
            coolT = Magic.coolTime[2] - Game.time;
            ctx.fillText(Magic.magicList[Magic.skillNum[2]][0] + ": " + (coolT > 0 ? (coolT / 100) : "ready"), canvas.width-200, 50);
            coolT = Magic.coolTime[3] - Game.time;
            ctx.fillText(Magic.magicList[Magic.skillNum[3]][0] + ": " + (coolT > 0 ? (coolT / 100) : "ready"), canvas.width-200, 70);
        };
        //mobile button
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
    }
}