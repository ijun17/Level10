class Level {
    static playerLevel;
    static stageMonsterCount;
    static stageLevel;

    static loadLevel() {
        this.playerLevel = localStorage.betalevel;
        if (this.playerLevel == undefined) {
            this.playerLevel = 1;
            this.saveLevel();
        }
    }
    static saveLevel() {
        localStorage.betalevel = this.playerLevel;
    }

    static clearLevel() {
        if (this.playerLevel < this.stageLevel + 1) {
            this.playerLevel = this.stageLevel + 1;
            this.saveLevel();
        }
        this.stageLevel = 0;
        this.stageMonster = 0;
        //animation
        let clearBtn = new Button(Screen.perX(50)-2,0, 4, 4);
        clearBtn.code = function () { Screen.selectScreen();};
        clearBtn.drawCode = function(){
            ctx.font = "bold 200px Arial";
            ctx.fillStyle = "yellow";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText("CLEAR",Screen.perX(50), clearBtn.y);
        }
        clearBtn.vy=-1.5;

        let click = new Block(canvas.width / 2, canvas.height, 0, 0, "black", Game.BUTTON_CHANNEL);
        click.life = 1000;
        click.canInteraction = false;
    }


    static makeStage(level) {
        this.stageLevel = level;
        //준기의 탑 n층
        let floorText = new Button(-400,200,0,0,Game.TEXT_CHANNEL);
        floorText.life=200;
        floorText.drawCode = function(){
            ctx.font = "bold 50px Arial";
            ctx.fillStyle = "white";
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillText("준기의탑 -"+level+"층",80,20);
            floorText.life--;
        }
        //bgColor
        Screen.bgColor="rgb("+(255-level*22)+","+(255-level*25)+","+(255-level*25)+")";
        //map size
        let mapSize=1200;

        switch (level) {
            case 1:
                new Monster(0, 1000, 0);
                this.stageMonsterCount = 1;
                break;
            case 2:
                new Monster(0, 1000, 0);
                new Monster(0, 900, 0);
                new Monster(0, 800, 0);
                new Monster(1, 700, 0);
                this.stageMonsterCount = 4;
                break;
            case 3:
                new Monster(2, 1100, 50);
                new Monster(2, 900, 50);
                new Monster(2, 700, 50);
                new Monster(2, 500, 50);
                new Monster(2, 300, 50);
                this.stageMonsterCount = 5;
                break;
            case 4:
                mapSize*=2;
                new Monster(3,2060, 250);
                this.stageMonsterCount = 1;
                break;
            case 5:
                
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
        new MapBlock(0,-1000,mapSize,100,"rgb(48, 48, 48)");
        new MapBlock(-100, -1000, 100, 600+2000,"rgb(48, 48, 48)"); //left
        new MapBlock(mapSize, -1000, 100, 600+2000,"rgb(48, 48, 48)");//right
        new MapBlock(-10, 600 - 100, mapSize + 20, 20, "#2B650D");//bottom
        new MapBlock(0, 600 - 80, mapSize, 100, "#54341E");
    }
}