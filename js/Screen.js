function startFs(element) {
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.webkitRequestFullScreen ) {
        element.webkitRequestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen(); // IE
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




class Screen {
    //const
    static CANVAS_W=1200;
    static CANVAS_H=600;
    static M_100BUTTON=80;

    //screen status
    static isMobile = false;
    static selectMagic = null;

    static perX(percentile){
        return canvas.width/100*percentile;
    }
    static perY(percentile){
        return canvas.height/100*percentile;
    }

    static mainScreen() {
        Game.restartGame();

        let ashSpray = new MapBlock(-100,-100,0,0,"black",Game.BUTTON_CHENNEL);
        ashSpray.canAct=true;
        ashSpray.canMove=false;
        ashSpray.addAction(1,1000000,function(){
            if(Game.time%10==0){
                let r = Math.random()*canvas.width;
                let ash=new Particle(0,r,0);
                ash.life=200;
                ash.vy-=2;
            }
        });

        var startButton = new Button((canvas.width - 300)/2, (canvas.height-100)/2, 300, 100);
        startButton.canAct=true;
        startButton.code = function () { 
            for(let i=0; i<30; i++){
                for(let j=0; j<10; j++){
                    let e = new Particle(2, startButton.x+i*10, startButton.y+j*10);
                    e.ga=0;
                }
            }
            startButton.addAction(50,50,function(){Screen.selectScreen();});
            startButton.drawCode=function(){};
        };
        startButton.drawOption(null, "black", "START", 80, "black");
    }

    static selectScreen() {
        Game.time = 0;
        Game.restartGame();

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

        let ashSpray = new MapBlock(-100,-100,0,0,"black",Game.BUTTON_CHENNEL);
        ashSpray.canAct=true;
        ashSpray.canMove=false;
        ashSpray.addAction(1,1000000,function(){
            if(Game.time%10==0){
                let r = Math.random()*canvas.width;
                let ash=new Particle(0,r,0);
                ash.life=200;
                ash.vy-=2;
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
            Game.channel[Game.BUTTON_CHENNEL].unshift(full);
            full.code=function(){
                startFs(canvas);
                full.x=-1000;
                Game.click((canvas.width - 300)/2+150, (canvas.height-100)/2+50);
            }
        };
        fullScreenButton.drawOption(null, "black", "to full screen", fullBtnTextSize, "black");
        //mobile button
        let mobileButton = new Button(canvas.width - space - toMobileBtnW, canvas.height - space - toMobileBtnH, toMobileBtnW, toMobileBtnH);
        mobileButton.code = function () {if(!Screen.isMobile){Game.convertMobileMode(true);Screen.selectScreen();}};
        mobileButton.drawOption(null,"black","to mobile",mobileBtnTextSize,"black");
        //select magic button
        let magicButton = new Button(canvas.width - selectMagicButtonW-space, space, selectMagicButtonW, selectMagicButtonH);
        magicButton.code = function () { Screen.selectMagicScreen(); };
        magicButton.drawOption(null, "black", "select magic", selectMagicBtnTextSize, "black");

        //level button
        new Button((canvas.width - levelBtnW) /2, 0, levelBtnW, space);
        for (let i = 1; i <= Level.playerLevel; i++) {
            let levelButton = new Button((canvas.width - levelBtnW) /2, levelBtnW + i * (space+levelBtnH), levelBtnW, levelBtnH);
            levelButton.code = function () { Screen.gameScreen(); Level.makeStage(i); };
            levelButton.drawOption("white", "black", "LEVEL" + i, levelBtnTextSize, "black");
            levelButton.ga = 0.5;
        }
    }

    static selectMagicScreen() {
        Game.time = 0;
        Game.restartGame();

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

            backBtnTextSize=60;
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
        new Button(space*8+keyBtnW+magicBtnW, 0, magicBtnW, keyBtnW);
        for (let i = 1; i < Magic.basicMagic.length; i++) {
            let magicButton = new Button(space*8+keyBtnW+magicBtnW, keyBtnW + 50 * i, magicBtnW, magicBtnH);
            magicButton.code = function () { Screen.selectMagic = magicButton; new (Magic.basicMagic[i][1]); };
            magicButton.drawOption("rgb(121, 140, 205)", "black", Magic.basicMagic[i][0], magicBtnTextSize, "black");
            magicButton.temp.push(i); //temp[0]=Magic.basicMagic
            magicButton.temp.push(null); //temp[1] is keyButton index
            magicButton.ga = 0.5;

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

        let selectMagigButton = new Button(0, 0, 0, 0);
        selectMagigButton.drawCode = function () {
            if (Screen.selectMagic != null) {
                ctx.strokeStyle = "white";
                ctx.strokeRect(Screen.selectMagic.x, Screen.selectMagic.y, Screen.selectMagic.w, Screen.selectMagic.h);
            }
        }

        //simulation
        new MapBlock(canvas.width*5/9, 2*canvas.height/3, canvas.width-canvas.width/2, 2*canvas.height/3, "rgb(35, 35, 35)");
        Game.p = new Player(canvas.width*5/9+20, 0);
        let monster = new Monster(0, canvas.width-100, 0);
        monster.life = 100000;
        monster.action = [];

    }

    static gameScreen() {
        Game.time = 0;
        Game.restartGame();
        Magic.clearCoolTime();

        let backButton = new Button(0, 0, 80, 80);
        backButton.code = function () { Screen.selectScreen() };
        backButton.drawOption(null, null, "<", 80, "black");

        let mobileButtonSize=70;

        new MapBlock(-50, -1000, 50, canvas.height+1000); //left
        new MapBlock(canvas.width, -1000, 50, canvas.height+1000);//right
        new MapBlock(-10, canvas.height - mobileButtonSize-30, canvas.width + 20, 20, "#2B650D");//bottom
        new MapBlock(0, canvas.height - mobileButtonSize-10, canvas.width, 100, "#54341E");

        if (Screen.isMobile) {
            let leftButton = new Button(5, canvas.height - mobileButtonSize-5, mobileButtonSize, mobileButtonSize);
            leftButton.code = function () {  Game.p.moveFlag = true; Game.p.isRight = false; };
            leftButton.drawOption("rgb(61, 61, 61)", "black", "<", 80, "black");
            let upButton = new Button(10+mobileButtonSize, canvas.height - mobileButtonSize-5, mobileButtonSize, mobileButtonSize);
            upButton.code = function () { Game.p.jump()};
            upButton.drawOption("rgb(61, 61, 61)", "black", "^", 80, "black");
            let rightButton = new Button(15+mobileButtonSize*2, canvas.height - mobileButtonSize-5, mobileButtonSize, mobileButtonSize);
            rightButton.code = function () { Game.p.moveFlag = true; Game.p.isRight = true; };
            rightButton.drawOption("rgb(61, 61, 61)", "black", ">", 80, "black");

            let keys=["Q","W","E","R"];
            for(let i=0; i<4; i++){
                let keyButton = new Button(canvas.width-(5*4+mobileButtonSize*4)+i*(mobileButtonSize+5),canvas.height-mobileButtonSize-5,mobileButtonSize,mobileButtonSize);
                keyButton.code=function(){Magic.doSkill(i);};
                keyButton.drawCode=function(){
                    ctx.fillStyle="rgb(61, 61, 61)";
                    ctx.fillRect(keyButton.x,keyButton.y,keyButton.w,keyButton.h);
                    ctx.strokeStyle="black";
                    ctx.strokeRect(keyButton.x,keyButton.y,keyButton.w,keyButton.h);
                    ctx.fillStyle="black";
                    ctx.font = "bold "+(mobileButtonSize-20)+"px Arial";
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    ctx.fillText(keys[i],keyButton.x+30,keyButton.y+40);
                    ctx.fillStyle="rgb(121, 140, 205)";
                    ctx.font = "bold 15px Arial";
                    ctx.fillText(Magic.basicMagic[Magic.skillNum[i]][0],keyButton.x+30,keyButton.y+10);
                }
            }
        }
        Game.p = new Player(10, canvas.height - 460);

        
    }
}