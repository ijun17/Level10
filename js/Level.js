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
            ctx.fillText("CLEAR",Screen.perX(50), Camera.getY(clearBtn.y));
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

        let mapWSize=1200;

        switch (level) {
            case 1:
                new Monster(0, 1000, 0);
                this.stageMonsterCount = 1;
                break;
            case 2:
                new Monster(0, 1000, 0);
                new Monster(0, 900, 0);
                new Monster(0, 800, 0);
                new Monster(3, 700, 0);
                this.stageMonsterCount = 4;
                break;
            case 3:
                mapWSize*=2;
                new Monster(4, 1100, 50);
                new Monster(4, 900, 50);
                new Monster(4, 700, 50);
                new Monster(4, 500, 50);
                new Monster(4, 300, 50);
                this.stageMonsterCount = 5;
                break;
            case 4:
                new Monster(6,860, 250);
                this.stageMonsterCount = 1;
                break;
            case 5:
                
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
        new MapBlock(0,-1000,mapWSize,100,"rgb(48, 48, 48)");
        new MapBlock(-100, -1000, 100, 600+2000,"rgb(48, 48, 48)"); //left
        new MapBlock(mapWSize, -1000, 100, 600+2000,"rgb(48, 48, 48)");//right
        new MapBlock(-10, 600 - 100, mapWSize + 20, 20, "#2B650D");//bottom
        new MapBlock(0, 600 - 80, mapWSize, 100, "#54341E");
    }
}