

class Game{
    // static entitys = new Array();
    // static time=0;
    // static p;

    static selectMagic=null;

    static clearEntitys(){entitys=[];}

    static startGame(){
        this.menuScreen();
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);
        canvas.addEventListener("click", this.clickHandler, false);
        p=new Player(100,100);
    }

    static keyDownHandler(e){
        switch(e.keyCode){
            case 39:
                p.moveFlag=true;
                p.isRight=true;
                break;
            case 37:
                p.moveFlag=true;
                p.isRight=false;
                break;
            case 38:
                p.jump();
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
            p.moveFlag=false;
            p.setVectorX(0);
        }
        else if(e.keyCode == 37) {
            p.moveFlag=false;
            p.setVectorX(0);
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
        if(p!=null&&p.moveFlag){
            p.go();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var e of entitys){e.update();}
        time++;
    }

    static menuScreen(){
        time=0;
        this.clearEntitys();
        var startButton = new Button((canvas.width-300)*0.5,250,300,100,null,function(){Game.selectScreen();});
        startButton.drawCode=function(){
            let thisBtn=startButton;
            ctx.beginPath();
            ctx.strokeRect(thisBtn.x, thisBtn.y, thisBtn.w, thisBtn.h);
            ctx.font="bold 80px Arial";
            ctx.fillStyle = "black";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText("START",thisBtn.x+150,thisBtn.y+55);
            ctx.closePath();
        }
    }

    static selectScreen(){
        time=0;
        this.clearEntitys();
        var magicButton = new Button(canvas.width-210,10,200,50,null,function(){Game.selectMagicScreen();});
        var backButton = new Button(0,0,80,80,"back.png",function(){Game.menuScreen();});
        new Button((canvas.width-200)*0.5,0,200,10,null,function(){});
        for(let i=0; i<10; i++){
            let level1Button = new Button((canvas.width-200)*0.5,250+i*60,200,59,null,function(){Game.gameScreen();});
            level1Button.ga=-0.1;
            level1Button.drawCode=function(){
                let thisBtn=level1Button;
                ctx.beginPath();
                ctx.strokeRect(thisBtn.x, thisBtn.y, thisBtn.w, thisBtn.h-10);
                ctx.fillStyle = "white";
                ctx.fillRect(thisBtn.x, thisBtn.y, thisBtn.w, thisBtn.h-10);
                ctx.font="bold 40px Arial";
                ctx.fillStyle = "black";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText("LEVEL"+(i+1),thisBtn.x+100,thisBtn.y+30);
                ctx.closePath();
            }
        }
        
        magicButton.drawCode=function(){
            let thisBtn=magicButton;
            ctx.beginPath();
            ctx.strokeRect(thisBtn.x, thisBtn.y, thisBtn.w, thisBtn.h);
            ctx.fillStyle = "white";
            ctx.fillRect(thisBtn.x, thisBtn.y, thisBtn.w, thisBtn.h);
            ctx.font="bold 30px Arial";
            ctx.fillStyle = "black";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText("select magic",thisBtn.x+100,thisBtn.y+25);
            ctx.closePath();
        }
    }

    static selectMagicScreen(){
        time=0;
        this.clearEntitys();
        Magic.clearCoolTime();
        let backButton = new Button(0,0,80,80,"back.png",function(){Game.selectScreen();});

        let key=['Q','W','E','R'];
        let keyButtons=new Array(4);
        for(let i=0; i<4; i++) {
            new Button(10,50+110*i,200,50,null,function(){});
            let keyButton = new Button(10,100+110*i,100,100,null,function(){
                if(Game.selectMagic!=null){
                    Game.selectMagic.x=120;Game.selectMagic.y=100+110*i;
                    Magic.skillNum[i]=Game.selectMagic.life;
                    if(keyButton.friction != null){
                        keyButton.friction.x=400;
                        keyButton.friction.y=600;
                    }
                    keyButton.friction=Game.selectMagic;
                    Game.selectMagic=null;
                }
                console.log(Magic.skillNum);
            });
            keyButton.drawCode=function(){
                let thisBtn=keyButton;
                ctx.beginPath();
                ctx.fillStyle = "rgb(88, 88, 88)";
                ctx.fillRect(thisBtn.x, thisBtn.y, thisBtn.w, thisBtn.h);
                ctx.strokeRect(thisBtn.x, thisBtn.y, thisBtn.w, thisBtn.h);
                ctx.font="bold 80px Arial";
                ctx.fillStyle = "black";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(key[i],thisBtn.x+50,thisBtn.y+55);
                ctx.closePath();
            }

            keyButtons[i]=keyButton;
            keyButton.friction = null; //friction 은 선택된 마법을 의미
        }
        new Button(400,0,200,100,null,function(){});
        for(let i=0; i<Magic.basicMagic.length; i++){
            let magicButton = new Button(400,100+50*i,200,40,null,function(){});
            magicButton.code=function(){Game.selectMagic=magicButton;new (Magic.basicMagic[i][1]);};
            magicButton.life=i;
            magicButton.drawCode=function(){
                let thisBtn=magicButton;
                ctx.beginPath();
                ctx.fillStyle = "rgb(126, 197, 238)";
                ctx.fillRect(thisBtn.x, thisBtn.y, thisBtn.w, thisBtn.h);
                ctx.strokeRect(thisBtn.x, thisBtn.y, thisBtn.w, thisBtn.h);
                ctx.font="bold 30px Arial";
                ctx.fillStyle = "black";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(Magic.basicMagic[i][0],thisBtn.x+100,thisBtn.y+20);
                ctx.closePath();
            }
            magicButton.ga=-0.5;
            var keyIndex = Magic.skillNum.findIndex(function(e){return e==i;});
            if(keyIndex>=0){
                Game.selectMagic=magicButton;
                let clickE = new Block(0, 0, 0, 0);
                clickE.life=1;
                clickE.collisionLevel=-8;
                clickE.canMove=false;
                keyButtons[keyIndex].collisionHandler(clickE);
            }
        }

        //simulation
        new MapBlock(700,400,500,200,"rgb(35, 35, 35)");
        p = new Player(700,0);
        
    }

    static gameScreen(){
        time=0;
        this.clearEntitys();
        Magic.clearCoolTime();
        var backButton = new Button(0,0,80,80,"back.png",function(){Game.selectScreen();});
        new MapBlock(-10,0,10,canvas.height); //left
        new MapBlock(canvas.width,0,10,canvas.height);//right
        new MapBlock(0,-10,canvas.width,10);//top
        new MapBlock(-200,canvas.height-50,canvas.width+400,10,"#2B650D");//bottom
        new MapBlock(0,canvas.height-40,canvas.width,40,"#54341E");
        p = new Player(10,canvas.height-460);
        
        new Monster(0,900, 200);
        new Monster(0,800, 200);
        new Monster(0,700, 200);
        new Monster(3,800, 0);
        
    }
}