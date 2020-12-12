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
        let clearBtn = new Button(canvas.width / 2-2,0, 4, 4);
        clearBtn.code = function () { Screen.selectScreen(); };
        //if (Screen.isMobile) clearBtn.drawOption(null, null, "CLEAR", 100, "yellow");
        //else clearBtn.drawOption(null, null, "CLEAR", 300, "yellow");
        clearBtn.drawCode = function(){
            ctx.font = "bold 300px Arial";
            ctx.fillStyle = "yellow";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            //ctx.fillText("CLEAR",clearBtn.x+clearBtn.w / 2,clearBtn.y);
            ctx.fillText("CLEAR",Camera.getX(clearBtn.x+clearBtn.w / 2), Camera.getY(clearBtn.y));
        }
        clearBtn.vy=-1.5;
        //Camera.e=clearBtn;

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
            ctx.fillStyle = "grey";
            ctx.fillText("준기의탑 -"+level+"층",Camera.getX(-400),Camera.getY(200));
            floorText.life--;
        }
        switch (level) {
            case 1:
                new Monster(0, Screen.perX(90), Screen.perY(10));
                this.stageMonsterCount = 1;
                break;
            case 2:
                new Monster(0, Screen.perX(90), Screen.perY(10));
                new Monster(0, Screen.perX(80), Screen.perY(10));
                new Monster(0, Screen.perX(70), Screen.perY(10));
                new Monster(3, Screen.perX(80), Screen.perY(0));
                this.stageMonsterCount = 4;
                break;
            case 3:
                new Monster(4, Screen.perX(90), Screen.perY(10));
                new Monster(4, Screen.perX(70), Screen.perY(10));
                new Monster(4, Screen.perX(50), Screen.perY(10));
                new Monster(4, Screen.perX(30), Screen.perY(10));
                new Monster(4, Screen.perX(10), Screen.perY(10));
                this.stageMonsterCount = 5;
                break;
            case 4:
                new Monster(6,Screen.perX(80), Screen.perY(50));
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
    }
}