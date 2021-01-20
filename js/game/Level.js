let Level= {
    playerLevel:0,
    stageMonsterCount:0,
    stageLevel:0,

    loadLevel:function() {
        this.playerLevel = localStorage.betalevel2;
        if (this.playerLevel == undefined) {
            this.playerLevel = 1;
            this.saveLevel();
        }
    },
    saveLevel:function() {
        localStorage.betalevel2 = this.playerLevel;
    },

    clearLevel:function() {
        let isLevelUp = false;
        if (this.playerLevel < this.stageLevel + 1) {
            this.playerLevel = this.stageLevel + 1;
            this.saveLevel();
            isLevelUp = true;
        }
        this.stageLevel = 0;
        this.stageMonster = 0;
        //animation
        Game.p.canRemoved=false;
        let clearText = new Text(Screen.perX(50),Screen.perY(0), "CLEAR", Screen.perX(20), "yellow", null,300,false);
        clearText.vy=-Screen.perY(100)/300;
        clearText.removeHandler=function(){Screen.selectScreen();};
    },


    makeStage:function(level) {
        this.stageLevel = level;
        //player
        Game.p = new Player(10, -60);
        Game.p.removeHandler=function(){
            Game.channel[Game.BUTTON_CHANNEL]=[];
            Game.channel[Game.TEXT_CHANNEL]=[];
            let text = new Text(Screen.perX(50),Screen.perY(50),"you die",Screen.perX(10),"red",null,200,false);
            text.canAct=true;
            text.removeHandler=function(){Screen.selectScreen();};
            Magic.magicPoint=0;
            Level.stageMonsterCount=0;
        };
        Magic.magicPoint=20000*Level.playerLevel;
        Camera.makeMovingCamera(Game.p,0,0,10);

        function printMonsterName(name=""){
            let textE = new Text(Screen.perX(10),Screen.perY(3),"vs "+name,Screen.perX(3), "black", null, 400, false);
            textE.textBaseline = "top";
            textE.textAlign="left";
        }
        //level에 따라 달라지는 변수
        Screen.bgColor="rgb("+(255-level*22)+","+(255-level*25)+","+(255-level*25)+")";
        let mapSizeW=2000;
        let mapSizeH=1000;
        let wallSize=200;
        let mainMonster={name:"Coming soon"};
        let weatherNum=3;
        switch (level) {
            case 1:
                this.stageMonsterCount = 1;
                mainMonster=new Monster(0, 1000, -1000);
                break;
            case 2:
                this.stageMonsterCount = 4;
                new Monster(0, 1000, -1000);
                new Monster(0, 900, -1000);
                new Monster(0, 800, -1000);
                mainMonster=new Monster(1, 700, -1000);
                break;
            case 3:
                this.stageMonsterCount = 11;
                mainMonster=new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                break;
            case 4:
                this.stageMonsterCount = 1;
                mainMonster=new Monster(3,1000, -250);
                break;
            case 5:
                this.stageMonsterCount = 1;
                mainMonster=new Monster(4,Screen.perX(50), -400)
                mainMonster.addAction(1,100,function(){Camera.vibrate(10);});
                weatherNum=0;
                
                // for(let i=1; i<10; i++){
                //     new MapBlock(50*i,-40*i,50,30);//.drawCode=MapBlock.getTexture("grass");
                //     (new MapBlock(500*i,-400,350,30)).drawCode=MapBlock.getTexture("grass");
                // }
                break;
            case 6:
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                break;
            case 10:
                break;
            default:
                let clearBtn = new Button(canvas.width / 2 - 150, 0, 300, 100);
                clearBtn.canAct = true;
                clearBtn.addAction(400, 400, function () { Screen.selectScreen(); });
                clearBtn.drawOption(null, null, "없어 꺼졍", 100, "black");
                clearBtn.vy = -1.5;
                break;
        }
        //vs text코드 출력
        printMonsterName(mainMonster.name);
        //날씨 뿌리기
        let ashSpray = new Button(-100,-100,0,0,Game.BUTTON_CHENNEL);
        ashSpray.canAct=true;
        ashSpray.canInteract=false;
        ashSpray.addAction(1,1000000,function(){
            if(Game.time%5==0){
                let r = Math.random()*2000;
                let ash=new Particle(weatherNum,Game.p.x-1000+r,-Game.p.y-600);
                ash.life=300;
                ash.vy-=1.5;
            }
        });
        //양 끝 맵블럭
        new MapBlock(0,-wallSize-mapSizeH,mapSizeW,wallSize,"rgb(48, 48, 48)");//top
        new MapBlock(-wallSize, -wallSize-mapSizeH, wallSize, mapSizeH*2,"rgb(48, 48, 48)"); //left
        new MapBlock(mapSizeW, -wallSize-mapSizeH, wallSize, mapSizeH*2,"rgb(48, 48, 48)");//right
        (new MapBlock(-wallSize,0,mapSizeW+wallSize*2,wallSize*2)).drawCode=MapBlock.getTexture("grass");
    }
}