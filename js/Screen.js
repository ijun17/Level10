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
        //full screen button
        let fullScreenButton =new Button(canvas.width - space-toMobileBtnW, canvas.height - toMobileBtnH*2-space*2, toMobileBtnW, toMobileBtnH);
        fullScreenButton.code = function () {
            startFs(canvas);
            Screen.mainScreen();
            let full = new Button((canvas.width - 300)/2, (canvas.height-100)/2, 300, 100);
            full.code=function(){
                startFs(canvas);
                full.x=10000;
                Game.click((canvas.width - 300)/2+150, (canvas.height-100)/2+50);
            }
        };
       

        fullScreenButton.drawOption(null, "black", "to full screen", fullBtnTextSize, "black");
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
        selectMagicButton.drawOption(null, "black", "select magic", selectMagicBtnTextSize, "black");
        //make magic button
        let makeMagicButton = new Button(canvas.width - selectMagicButtonW-space, 2*space+selectMagicButtonH, selectMagicButtonW, selectMagicButtonH);
        makeMagicButton.code = function () { Screen.makeMagicScreen(); };
        makeMagicButton.drawOption(null, "black", "make magic", selectMagicBtnTextSize, "black");

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
                        keyButton.temp[0].y = canvas.height;
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
        let block = new Button(space*8+keyBtnW+magicBtnW, 0, magicBtnW, keyBtnW);
        for (let i = 1; i < Magic.basicMagic.length; i++) {
            if(Magic.basicMagic[i][3]>Level.playerLevel)continue;
            let magicButton = new Button(space*8+keyBtnW+magicBtnW, keyBtnW + 50 * i, magicBtnW, magicBtnH);
            magicButton.code = function () { Screen.selectMagic = magicButton; new (Magic.basicMagic[i][1])(Game.p); };
            let magicColor;
            if(Magic.basicMagic[i][2]<1000)magicColor="rgba(255, 255, 255,0.5)";
            else if(Magic.basicMagic[i][2]<2000)magicColor="rgba(121, 140, 205,1)";
            else magicColor="rgba(243, 168, 60,1)";
            magicButton.drawOption(magicColor, "black", Magic.basicMagic[i][0], magicBtnTextSize, "black");
            magicButton.temp.push(i); //temp[0]=Magic.basicMagic
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

        block.drawCode = function () { //선택된 마법의 색을 어둡게
            if (Screen.selectMagic != null) {
                ctx.fillStyle = "black";
                ctx.globalAlpha = "0.5";
                ctx.fillRect(Screen.selectMagic.x, Screen.selectMagic.y, Screen.selectMagic.w, Screen.selectMagic.h);
                ctx.globalAlpha = "1";
            }
        }

        //simulation
        new MapBlock(canvas.width*5/9, 2*canvas.height/3, canvas.width-canvas.width/2, 2*canvas.height/3, "rgb(35, 35, 35)");
        Game.p = new Player(canvas.width*5/9+20, 0);
        let monster = new Monster(0, canvas.width-100, 0);
        monster.life = 100000;
        monster.action = [];

    },

    makeMagicScreen:function(){
        Game.resetGame();
        let backBtnW=80;
        let backBtnTextSize=80;
        
        //모바일이면 나감
        if(Screen.isMobile){
            backBtnW=Screen.perX(100/14);
            backBtnTextSize=Screen.perX(100/14);
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
        Magic.coolTime=[99999999,99999999,99999999,99999999];
        //백버튼
        let backButton = new Button(0, 0, backBtnW, backBtnW);
        backButton.code = function () { Screen.selectScreen();tb.style.display="none"; };
        backButton.drawOption(null, null, "<", backBtnTextSize, "black");
        //control system
        let cs=new Button(0,0,0,0);
        cs.temp=null;
        cs.drawCode=function(){if(cs.temp!=null){ctx.fillStyle="rgba(0, 0, 0,0.5)";ctx.fillRect(cs.temp.x,cs.temp.y,200,40);} };
        
        //스킬 리스트
        function makeMagicButton(x,y,num){
            let magicBtn = new Button(x,y,200,40);
            magicBtn.drawCode=function(){
                ctx.fillStyle="rgb(104, 194, 255)";
                ctx.fillRect(magicBtn.x, magicBtn.y, magicBtn.w, magicBtn.h);
                ctx.strokeStyle="black";
                ctx.strokeRect(magicBtn.x, magicBtn.y, magicBtn.w, magicBtn.h);
                ctx.fillStyle="black";
                ctx.font = "bold 30px Arial";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(Magic.customMagic[num][0],magicBtn.x+magicBtn.w/2, magicBtn.y+magicBtn.h/2);
            }
            magicBtn.code = function () {
                (Magic.basicMagic[num + Magic.basicMagicCount][1]) (Game.p);
                namebox.value = Magic.customMagic[num][0];
                textbox.value = Magic.customMagic[num][1];
                cs.temp = magicBtn;
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
            makeMagicButton(10,1000,Magic.customMagic.length-1);
            }
        };
        for(let i=0; i<Magic.customMagic.length; i++){
            makeMagicButton(10,200+50*i,i);
        }
        //compile button click event
        compileBtn.onclick = function(){
            if(cs.temp==null)return;
            let cusMag=Magic.customMagic[cs.temp.temp];//현재 선택된 커스텀 매직
            let magic=Magic.convertMagictoJS(namebox.value, textbox.value);
            if(magic!=null){ //마법이 성공적으로 변환되면
                cusMag[0]=namebox.value;
                cusMag[1]=textbox.value;
                Magic.basicMagic[Magic.basicMagicCount+cs.temp.temp]=magic;
                Magic.saveMagic();
            }
        };
        
        //test map
        new MapBlock(0,canvas.height-80,canvas.width,80).drawCode=MapBlock.getTexture("grass");
        Game.p=new Player(canvas.width/2,0);
        Game.p.dieCode=function(){};

        
        
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

        //cooltime view
        for(let i=0; i<4; i++){
            let coolTimeView = new Button(canvas.width-200, 10+i*20, 0,0, Game.TEXT_CHANNEL);
            coolTimeView.drawCode=function(){
                ctx.fillStyle="black";
                ctx.font = "bold 20px Arial";
                ctx.textBaseline = "top";
                ctx.textAlign = "left";
                let coolT = Magic.coolTime[i]-Game.time;
                ctx.fillText(Magic.basicMagic[Magic.skillNum[i]][0]+": "+(coolT>0 ? (coolT/100) : "ready"), coolTimeView.x, coolTimeView.y);
            };
        } 
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
                    ctx.fillText(Magic.basicMagic[Magic.skillNum[i]][0],keyButton.x+35,keyButton.y+11);
                }
            }
        }
    }
}