const Level= {
    playerLevel:0,
    monsters:[MonsterMushroom, MonsterMonkey, MonsterFly, MonsterSlime, MonsterGolem,MonsterWyvern,MonsterShark,MonsterDragon],
    loadLevel:function() {
        if (localStorage.playerLevel === undefined) this.saveLevel(0);
        else this.saveLevel(Number(localStorage.playerLevel));
    },
    saveLevel:function(level) {
        if(level>=0 && level<=10){
            this.playerLevel = level
            localStorage.playerLevel = this.playerLevel;
        }
    },
    clearLevel:function(stageLevel) {
        if (this.playerLevel < stageLevel + 1) this.saveLevel(stageLevel + 1);
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
        m.moveModule.moveDirection[0]=false;
        return m;
    },

    makeStage:function(level,player) {
        SCREEN.bgColor="rgb("+(255-level*22)+","+(255-level*25)+","+(255-level*25)+")";
        const GA = -0.327;
        const AIR = 0.01;
        switch (level) {
            case 0: 
                SCREEN.renderer.bgColor="dimgray";
                ReusedModule.createGameMap(2000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,GA]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],AIR);
                ReusedModule.snowWeather()
                Level.createMainMonster(level, [1500, 0]);
                break;
            case 1: 
                SCREEN.renderer.bgColor="#cde5e4";
                ReusedModule.createGameMap(3000,2000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,GA]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],AIR);
                ReusedModule.snowWeather()
                Level.createMainMonster(level,[1500, 0]);
                break;
            case 2:
                SCREEN.renderer.bgColor="#9fadad";
                ReusedModule.createGameMap(3000,3000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,GA]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],AIR);
                ReusedModule.fireWeader()
                Level.createMainMonster(level,[2000, 1000]);
                break;
            case 3: 
                SCREEN.renderer.bgColor="#222"
                ReusedModule.createGameMap(3000,3000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,GA]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],AIR);
                ReusedModule.snowWeather()
                Level.createMainMonster(level,[1500, 0]);
                break;
            case 4:
                SCREEN.renderer.bgColor="rgb(108, 141, 150)"
                ReusedModule.createGameMap(4000,2000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,GA]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],AIR);
                ReusedModule.fireflyWeather()
                Level.createMainMonster(level,[500, 0]);
                break;
            case 5:
                SCREEN.renderer.bgColor="#23191a"
                ReusedModule.createGameMap(4000,1500);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,GA]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],AIR);
                ReusedModule.fireWeader()
                Level.createMainMonster(level,[2000, 0]);
                break;
            case 6:
                SCREEN.renderer.bgColor="#17191c";
                SCREEN.renderer.bgColor="#456";
                SCREEN.renderer.bgColor="#567";
                // SCREEN.renderer.bgColor="#556";
                ReusedModule.createGameMap(5000,1500);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,GA]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],AIR);
                ReusedModule.rainWeather()
                Level.createMainMonster(level,[3000, 0]);
                break;
            case 7:
                SCREEN.renderer.bgColor="rgb(56, 56, 54)"//"rgb(104, 104, 99)"//"rgb(142, 142, 134)"//"rgb(216, 214, 190)"//
                SCREEN.renderer.bgColor="#101013"
                ReusedModule.createGameMap(4000,1500);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,GA]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],AIR);
                ReusedModule.sparkWeather()
                Level.createMainMonster(level,[2000, 0]);
                break;
            case 8:
                ReusedModule.createGameMap(2000,2000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,GA]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],AIR);
                ReusedModule.fireflyWeatherUp()

                
                break;
            default:
                SCREEN.renderer.camera.zoom = 0.5;
                ReusedModule.createGameMap(10000,10000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,GA]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],AIR);

                let i=0;
                TIME.addSchedule(0,1,0.1,()=>{
                    let m=WORLD.add(new this.monsters[0]([800+(++i)*50, 0]));
                    TIME.addSchedule(1,1,0,function(){m.activateAI()});
                    m.moveModule.moveDirection[0]=false;
                })
                //for(let i=0; i<10; i++)Level.createMainMonster(1,MonsterMushroom, 800+i*50, 0);
                break;
        }
    }
}