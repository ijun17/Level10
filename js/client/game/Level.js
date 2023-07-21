const Level= {
    playerLevel:1,
    loadLevel:function() {
        this.playerLevel = localStorage.playerLevel;
        if (this.playerLevel === undefined) {
            this.playerLevel = 1;
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

    createMainMonster:function(level,MonsterClass,pos){
        let m=WORLD.add(new MonsterClass(pos));
        m.renderStatusBar([SCREEN.perX(59), SCREEN.perY(100)-SCREEN.perX(8.5)]);
        m.addEventListener("remove",function(){Level.clearLevel(level);return true;})
        TIME.addSchedule(1,1,0,function(){m.activateAI()});
        return m;
    },

    makeStage:function(level,player) {
        SCREEN.bgColor="rgb("+(255-level*22)+","+(255-level*25)+","+(255-level*25)+")";
        SCREEN.renderer.camera.zoom=1;
        switch (level) {
            case 1: 
                SCREEN.renderer.bgColor="dimgray";
                ReusedModule.createGameMap(1000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);
                ReusedModule.createParticleSpray(TYPE.snow, [0,1000],2200,10,0,0.05)
                Level.createMainMonster(level,MonsterMushroom, [800, 0]);
                //EntityRenderer.makeShader("black",0.4);
                break;
            case 2: 
                SCREEN.renderer.bgColor="#cde5e4";
                ReusedModule.createGameMap(2000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);
                ReusedModule.createParticleSpray(TYPE.snow, [0,1000],2200,10,0,0.05)
                Level.createMainMonster(level,MonsterMonkey, [500, 0]);
                break;
            case 3:
                ReusedModule.createGameMap(2000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);
                ReusedModule.createParticleSpray(TYPE.snow, [0,1000],2200,10,0,0.05)
                Level.createMainMonster(level,MonsterFly, [2000, 1000]);
                break;
            case 4: 
                ReusedModule.createGameMap(2000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);
                ReusedModule.createParticleSpray(TYPE.snow, [0,1000],2200,10,0,0.05)
                Level.createMainMonster(level,MonsterSlime, [1500, 0]);
                break;
            case 5:
                ReusedModule.createGameMap(2000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);
                ReusedModule.createParticleSpray(TYPE.snow, [0,1000],2200,10,0,0.05)
                Level.createMainMonster(level,MonsterGolem, [500, 0]);
                break;
            case 6:
                ReusedModule.createGameMap(4000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);
                ReusedModule.createParticleSpray(TYPE.snow, [0,1000],2200,10,0,0.05)
                Level.createMainMonster(level,MonsterWyvern, [2000, 0]);
                break;
            case 7:
                SCREEN.renderer.bgColor="rgb(216, 214, 190)"
                ReusedModule.createGameMap(4000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);
                ReusedModule.createParticleSpray(TYPE.snow, [0,1000],2200,10,0,0.05)
                Level.createMainMonster(level,MonsterDragon, [2000, 0]);
                break;
            case 8:
                ReusedModule.createGameMap(4000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);
                ReusedModule.createParticleSpray(TYPE.snow, [0,1000],2200,10,0,0.05)
                let m1 = Level.createMainMonster(level,MonsterWyvern, [1000, 0]);
                let m2 = Level.createMainMonster(level,MonsterDragon, [2000, 0]);
                m1.target=m2;
                m2.target=m1;
                player.setObserver();
                SCREEN.renderer.camera.zoom=0.5;
                break;
            default:
                ReusedModule.createGameMap(10000,10000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);

                let i=0;
                TIME.addSchedule(0,1,0.1,function(){Level.createMainMonster(1,MonsterMushroom, [800+(i++)*50, 0]);})
                //for(let i=0; i<10; i++)Level.createMainMonster(1,MonsterMushroom, 800+i*50, 0);
                break;
        }
    }
}