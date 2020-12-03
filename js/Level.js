class Level {
    static playerLevel;
    static stageMonsterCounter;
    static stageLevel;

    static loadLevel() {
        this.playerLevel = localStorage.level;
        if(this.playerLevel==undefined){
            this.playerLevel=1;
            this.saveLevel();
        }
    }
    static saveLevel(){
        localStorage.level = this.playerLevel;
    }

    static clearLevel(){
        if(this.playerLevel<this.stageLevel+1){
            this.playerLevel=this.stageLevel+1;
            this.saveLevel();
        }
        this.stageLevel=0;
        this.stageMonster=0;
        //animation
        let clickE = new Block(canvas.width/2, canvas.height, 0,0);
        clickE.canMove=false;
        clickE.life = 100000;
        clickE.visibility=false;
        let clearBtn = new Button(canvas.width/2-150, 0, 300, 100)
        clearBtn.code = function(){Game.selectScreen();};
        clearBtn.drawOption(null,null,"CLEAR",300,"yellow");
        clearBtn.vy=-1.5;
    }

    static makeStage(level) {
        this.stageLevel=level;
        switch (level) {
            case 1:
                new Monster(0, 900, 200);
                this.stageMonsterCounter=1;
                break;
            case 2:
                new Monster(0, 900, 200);
                new Monster(0, 800, 200);
                new Monster(0, 700, 200);
                new Monster(3, 800, 0);
                this.stageMonsterCounter=4;
                break;
            case 3:
                break;

        }
    }
}