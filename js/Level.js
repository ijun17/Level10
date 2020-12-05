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

    static perX(percentile){
        return canvas.width/100*percentile;
    }
    static perY(percentile){
        return canvas.height/100*percentile;
    }

    static makeStage(level) {
        this.stageLevel=level;
        switch (level) {
            case 1:
                new Monster(0, Level.perX(90), Level.perY(10));
                this.stageMonsterCount=1;
                break;
            case 2:
                new Monster(0, Level.perX(90), Level.perY(10));
                new Monster(0, Level.perX(80), Level.perY(10));
                new Monster(0, Level.perX(70), Level.perY(10));
                new Monster(3, Level.perX(80), Level.perY(0));
                this.stageMonsterCount=4;
                break;
            case 3:
                break;

        }
    }
}