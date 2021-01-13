let Level= {
    playerLevel:0,
    stageMonsterCount:0,
    stageLevel:0,

    loadLevel:function() {
        this.playerLevel = localStorage.betalevel;
        if (this.playerLevel == undefined) {
            this.playerLevel = 1;
            this.saveLevel();
        }
    },
    saveLevel:function() {
        localStorage.betalevel = this.playerLevel;
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
        let clearBtn = new Button(Screen.perX(50)-2,0, 4, 4);
        clearBtn.code = function () { 
            Screen.selectScreen();
            if(isLevelUp){
                new Text(Screen.perX(50), Screen.perY(50),"Level Up",100,"yellow",null,100,false);
            }
        };
        clearBtn.drawCode = function(){
            ctx.font = "bold 200px Arial";
            ctx.fillStyle = "yellow";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText("CLEAR",Screen.perX(50), clearBtn.y);
        }
        clearBtn.vy=-1.5;
        clearBtn.canInteraction=true;
        clearBtn.canMove=true;

        let click = new Block(canvas.width / 2, canvas.height, 0, 0, "black", Game.BUTTON_CHANNEL);
        click.life = 1000;
        click.canInteraction = false;
        click.canMove=false;
    },


    makeStage:function(level) {
        this.stageLevel = level;
        //player
        Game.p = new Player(10, -60);
        Game.p.dieCode=function(){Screen.selectScreen();};
        Magic.magicPoint=10000*Level.playerLevel;
        //camera
        Camera.makeMovingCamera(Game.p,0,0,10);
        //준기의 탑 n층 text
        // let floorText = new Button(-400,200,0,0,Game.TEXT_CHANNEL);
        // floorText.life=200;
        // floorText.drawCode = function(){
        //     ctx.font = "bold 50px Arial";
        //     ctx.fillStyle = "white";
        //     ctx.textBaseline = "top";
        //     ctx.textAlign = "left";
        //     ctx.fillText("준기의탑 -"+level+"층",80,20);
        //     floorText.life--;
        // }
        //bgColor
        Screen.bgColor="rgb("+(255-level*22)+","+(255-level*25)+","+(255-level*25)+")";
        //map size
        let mapSizeW=1200;
        let mapSizeH=1000;
        let wallSize=100;

        switch (level) {
            case 1:
                new Monster(0, 1000, -1000);
                this.stageMonsterCount = 1;
                break;
            case 2:
                new Monster(0, 1000, -1000);
                new Monster(0, 900, -1000);
                new Monster(0, 800, -1000);
                new Monster(1, 700, -1000);
                this.stageMonsterCount = 4;
                break;
            case 3:
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                new Monster(2, 400, -300);
                this.stageMonsterCount = 5;
                break;
            case 4:
                new Monster(4,1000, -250);
                this.stageMonsterCount = 1;
                break;
            case 5:
                mapSizeW*=1;
                new Monster(5,Screen.perX(50), -400);
                this.stageMonsterCount = 1;
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

        //양 끝 맵블럭
        new MapBlock(0,-wallSize-mapSizeH,mapSizeW,wallSize,"rgb(48, 48, 48)");//top
        new MapBlock(-wallSize, -wallSize-mapSizeH, wallSize, mapSizeH*2,"rgb(48, 48, 48)"); //left
        new MapBlock(mapSizeW, -wallSize-mapSizeH, wallSize, mapSizeH*2,"rgb(48, 48, 48)");//right
        (new MapBlock(-wallSize,0,mapSizeW+wallSize*2,wallSize*2)).drawCode=MapBlock.getTexture("grass");
    }
}