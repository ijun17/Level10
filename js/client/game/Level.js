const Level= {
    playerLevel:0,
    monsters:[MonsterMushroom, MonsterMonkey, MonsterFly, MonsterSlime, MonsterGolem,MonsterWyvern,MonsterDragon],
    loadLevel:function() {
        this.playerLevel = localStorage.playerLevel;
        if (this.playerLevel === undefined) {
            this.playerLevel = 0;
            this.saveLevel();
        }else this.playerLevel = Number(this.playerLevel);
    },
    saveLevel:function() {
        localStorage.playerLevel = this.playerLevel;
    },

    clearLevel:function(stageLevel) {
        let isLevelUp = false;
        if (this.playerLevel < stageLevel + 1) {
            this.playerLevel = stageLevel + 1;
            this.saveLevel();
            isLevelUp = true;
        }
        let stageClearText=SCREEN.ui.add("div",[0,0],[SCREEN.perX(100),SCREEN.perY(100)],"stageClearText");
        stageClearText.innerText="CLEAR";
        let clearTextY=0;
        TIME.addSchedule(0,4,undefined,function(){stageClearText.style.bottom=(clearTextY--)+"px"});
        TIME.addSchedule(4,4,undefined,()=>{Game.changeScene("select")});
    },

    createMainMonster:function(level,pos){
        let m=WORLD.add(new this.monsters[level](pos));
        m.renderStatusBar("LEVEL"+level,[SCREEN.perX(59), SCREEN.perY(100)-SCREEN.perX(8.5)]);
        m.addEventListener("remove",function(){Level.clearLevel(level);return true;})
        TIME.addSchedule(1,1,0,function(){m.activateAI()});
        return m;
    },

    makeStage:function(level,player) {
        SCREEN.bgColor="rgb("+(255-level*22)+","+(255-level*25)+","+(255-level*25)+")";
        SCREEN.renderer.camera.zoom=0.9;
        switch (level) {
            case 0: 
                SCREEN.renderer.bgColor="dimgray";
                ReusedModule.createGameMap(1000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.01);
                ReusedModule.snowWeather()
                Level.createMainMonster(level, [800, 0]);
                break;
            case 1: 
                SCREEN.renderer.bgColor="#cde5e4";
                ReusedModule.createGameMap(2000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.01);
                ReusedModule.snowWeather()
                Level.createMainMonster(level,[1500, 0]);
                break;
            case 2:
                ReusedModule.createGameMap(2000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.01);
                ReusedModule.snowWeather()
                Level.createMainMonster(level,[2000, 1000]);
                break;
            case 3: 
                ReusedModule.createGameMap(2000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.01);
                ReusedModule.snowWeather()
                Level.createMainMonster(level,[1500, 0]);
                break;
            case 4:
                SCREEN.renderer.bgColor="rgb(108, 141, 150)"
                ReusedModule.createGameMap(2000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.01);
                ReusedModule.fireflyWeather()
                Level.createMainMonster(level,[500, 0]);
                break;
            case 5:
                SCREEN.renderer.bgColor="rgb(100, 90, 90)"
                ReusedModule.createGameMap(4000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.01);
                ReusedModule.fireWeader()
                Level.createMainMonster(level,[2000, 0]);
                break;
            case 6:
                SCREEN.renderer.bgColor="rgb(104, 104, 99)"//"rgb(142, 142, 134)"//"rgb(216, 214, 190)"//
                ReusedModule.createGameMap(4000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.01);
                ReusedModule.sparkWeather()
                Level.createMainMonster(level,[2000, 0]);
                break;
            default:
                ReusedModule.createGameMap(10000,10000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.01);

                let i=0;
                TIME.addSchedule(0,1,0.1,function(){Level.createMainMonster(0,[800+(i++)*50, 0]);})
                //for(let i=0; i<10; i++)Level.createMainMonster(1,MonsterMushroom, 800+i*50, 0);
                break;
        }
    }
}