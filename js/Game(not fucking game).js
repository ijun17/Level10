

class Game{
    static channel = [new Array(), new Array(), new Array()]; //button, phisics, particle
    static time=0;
    static p;

    static selectMagic=null;

    static clearEntitys(){entitys=[];}

    static startGame(){
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);
        canvas.addEventListener("click", this.clickHandler, false);

        // const today = new Date();
        // let hours = today.getHours();
        // if(hours>12)canvas.background = "rgb(65, 67, 95)";

        Level.loadLevel();
        this.menuScreen();
        Game.p=new Player(100,100);
        Game.p.ga=-0.01;
    }

    static keyDownHandler(e){
        switch(e.keyCode){
            case 39:
                Game.p.moveFlag=true;
                Game.p.isRight=true;
                break;
            case 37:
                Game.p.moveFlag=true;
                Game.p.isRight=false;
                break;
            case 38:
                Game.p.jump();
                break;
            case 81: //q
                Magic.doSkill(0);
                break;
            case 87: //w
                Magic.doSkill(1);
                break;
            case 69: //e
                Magic.doSkill(2);
                break;
            case 82: //r
                Magic.doSkill(3);
                break;
        }
    }

    static keyUpHandler(e) {
        if(e.keyCode == 39) {
            Game.p.moveFlag=false;
            //p.setVectorX(0);
        }
        else if(e.keyCode == 37) {
            Game.p.moveFlag=false;
            //p.setVectorX(0);
        }
    }

    static clickHandler(e){
        let clickE = new Block(e.layerX, e.layerY, 0, 0);
        clickE.life=1;
        clickE.overlap=true;
        clickE.collisionLevel=-8;
        clickE.canMove=false;
    }

    static updateWorld(){
        if(Game.p!=null&&Game.p.moveFlag){
            Game.p.go();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var e of entitys){e.update();}
        Game.time++;
    }

    static menuScreen(){
        Game.time=0;
        this.clearEntitys();
        var startButton = new Button((canvas.width-300)*0.5,250,300,100);
        startButton.code = function(){Game.selectScreen();};
        startButton.drawOption(null, "black", "START", 80, "black");
    }

    static selectScreen(){
        Game.time=0;
        this.clearEntitys();

        let backButton = new Button(0,0,80,80);
        backButton.code = function(){Game.menuScreen()};
        backButton.drawOption(null,null,"<",80,"black");

        let magicButton = new Button(canvas.width-210,10,200,50)
        magicButton.code = function(){Game.selectMagicScreen();};

        new Button((canvas.width-200)*0.5,0,200,10,null,function(){});
        for(let i=1; i<=Level.playerLevel; i++){
            let levelButton = new Button((canvas.width-200)*0.5,250+i*60,200,59);
            levelButton.code = function(){Game.gameScreen();Level.makeStage(i);};
            levelButton.drawOption("white","black","LEVEL"+i,40,"black");
            levelButton.ga=0.5;
        }
        magicButton.drawOption(null,"black","select magic",30,"black");
    }

    static selectMagicScreen(){
        Game.time=0;
        this.clearEntitys();
        Magic.clearCoolTime();
        let backButton = new Button(0,0,80,80);
        backButton.code = function(){Game.selectScreen()};
        backButton.drawOption(null,null,"<",80,"black");

        

        let key=['Q','W','E','R'];
        let keyButtons=new Array(4);
        for(let i=0; i<4; i++) {
            let temp = new Button(120,50+110*i,200,50);

            let keyButton = new Button(10,100+110*i,100,100)
            keyButton.code=function(){
                if(Game.selectMagic!=null&&Game.selectMagic.temp[1]!=i){
                    if(keyButton.temp[0] != null){ //키버튼에 마법이 있으면
                        keyButton.temp[0].x=400;
                        keyButton.temp[0].y=600;
                        (keyButton.temp[0]).temp[1]=null;//마법 기록 삭제
                    }
                    if(Game.selectMagic.temp[1]!=null){ //선택한 마법에 이미 키가 있으면
                        Magic.skillNum[Game.selectMagic.temp[1]]=0;
                        keyButtons[Game.selectMagic.temp[1]].temp[0]=null;//이전 키버튼의 선택 기록 삭제
                    }
                    Game.selectMagic.x=120;Game.selectMagic.y=100+110*i;
                    Magic.skillNum[i]=Game.selectMagic.temp[0];
                    Game.selectMagic.temp[1]=i;
                    keyButton.temp[0]=Game.selectMagic;
                    Game.selectMagic=null;
                }
                console.log(Magic.skillNum);
            };
            keyButton.drawOption("rgb(88, 88, 88)","black",key[i],80,"black");

            keyButtons[i]=keyButton;
            keyButton.temp.push(null); //temp[0] 은 선택된 마법을 의미
        }
        new Button(400,0,200,100,null,function(){});
        for(let i=1; i<Magic.basicMagic.length; i++){
            let magicButton = new Button(400,100+50*i,200,40);
            magicButton.code=function(){Game.selectMagic=magicButton;new (Magic.basicMagic[i][1]);};
            magicButton.drawOption("rgb(121, 140, 205)","black",Magic.basicMagic[i][0],30,"black");
            magicButton.temp.push(i); //temp[0]=Magic.basicMagic
            magicButton.temp.push(null); //temp[1] is keyButton index
            magicButton.ga=0.5;

            let keyIndex = Magic.skillNum.findIndex(function(e){return e==i;});
            if(keyIndex>=0){
                Game.selectMagic=magicButton;
                let clickE = new Block(0, 0, 0, 0);
                clickE.life=1;
                clickE.collisionLevel=-8;
                clickE.canMove=false;
                keyButtons[keyIndex].collisionHandler(clickE);
            }
        }
        
        let selectMagigButton = new Button(0,0,0,0);
        selectMagigButton.drawCode=function(){
            if(Game.selectMagic!=null){
                ctx.strokeStyle="white";
                ctx.strokeRect(Game.selectMagic.x, Game.selectMagic.y, Game.selectMagic.w, Game.selectMagic.h);
            }
        }

        //simulation
        new MapBlock(700,400,500,200,"rgb(35, 35, 35)");
        Game.p = new Player(720,0);
        let monster = new Monster(0,1100,0);
        monster.life=100000;
        monster.action=[];
        
    }

    static gameScreen(){
        Game.time=0;
        this.clearEntitys();
        Magic.clearCoolTime();

        let backButton = new Button(0,0,80,80);
        backButton.code = function(){Game.selectScreen()};
        backButton.drawOption(null,null,"<",80,"black");

        new MapBlock(-50,0,50,canvas.height); //left
        new MapBlock(canvas.width,0,50,canvas.height);//right
        new MapBlock(0,-50,canvas.width,50);//top
        new MapBlock(-200,canvas.height-100,canvas.width+400,20,"#2B650D");//bottom
        new MapBlock(0,canvas.height-90,canvas.width,90,"#54341E");
        Game.p = new Player(10,canvas.height-460);
    }
}