class Level {
    static playerLevel;
    static stageMonsterCount;
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
        let clearBtn = new Button(canvas.width/2-150, 0, 300, 100);
        clearBtn.canAct=true;
        clearBtn.addAction(400,400,function(){Screen.selectScreen();});
        clearBtn.drawOption(null,null,"CLEAR",300,"yellow");
        clearBtn.vy=-1.5;
    }

    static makeStage(level) {
        this.stageLevel=level;
        switch (level) {
            case 1:
                new Monster(0, 900, 200);
                this.stageMonsterCount=1;
                break;
            case 2:
                new Monster(0, 900, 200);
                new Monster(0, 800, 200);
                new Monster(0, 700, 200);
                new Monster(3, 800, 0);
                this.stageMonsterCount=4;
                break;
            case 3:
                break;

        }
    }
}