const Level= {
    playerLevel:0,
    loadLevel:function() {
        this.playerLevel = localStorage.playerLevel;
        if (this.playerLevel === undefined) {
            this.playerLevel = 1;
            this.saveLevel();
        }else this.playerLevel = Number(localStorage.playerLevel);
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
        let stageClearText=SCREEN.ui.add("div",[SCREEN.perX(50),SCREEN.perY(100)],[0,0],"stageClearText");
        stageClearText.innerText="CLEAR";
        //let clearTextY=SCREEN.perY(50);
        //let clearText = SCREEN.ui.add("div",[SCREEN.perX(50), clearTextY],[0,0],"levelClearText");
        //clearText.innerText="CLEAR";
        //TIME.addSchedule(0,3,undefined,()=>{clearText.style.bottom=(clearTextY++)+"px"});
        //TIME.addSchedule(3,3,undefined,()=>{Game.changeScene("select")});
    },

    createMainMonster:function(level,MonsterClass,x,y){
        let m=WORLD.add(new MonsterClass([x,y]));
        m.addEventListener("remove",function(){
            Level.clearLevel(level);
            // let entitys=World.channel[World.PHYSICS_CHANNEL].entitys;
            // for(let i=entitys.length; i>=0; i--){
            //     if(entitys[i] instanceof Monster)entitys[i].life=0;
            //     else if(entitys[i] instanceof Player)entitys[i].canRemoved=false;
            // }
            return true;
        })
        //Component.bossMonsterStatusView(m,59,1)
        return m;
    },

    makeStage:function(level,player) {
        //level에 따라 달라지는 변수
        SCREEN.bgColor="rgb("+(255-level*22)+","+(255-level*25)+","+(255-level*25)+")";
        
        switch (level) {
            case 1: 
                SCREEN.renderer.bgColor="dimgray";
                ReusedModule.createGameMap(1000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);
                ReusedModule.createParticleSpray(TYPE.snow, [0,1000],2200,10,0,0.05)
                Level.createMainMonster(1,MonsterMushroom, 500, 0);
                //EntityRenderer.makeShader("black",0.4);
                break;
            case 2: 
                SCREEN.renderer.bgColor="#cde5e4";
                ReusedModule.createGameMap(1000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);
                ReusedModule.createParticleSpray(TYPE.snow, [0,1000],2200,10,0,0.05)
                Level.createMainMonster(2,MonsterMonkey, 500, 0);
                break;
            // case 3: 
            //     Level.createMainMonster(TYPE.hellFly, 3000, -1000);
            //     for(let i=0; i<15; i++)new Monster(2, 200*i, -1000);
            //     ReusedModule.worldWall(3000,2000,300);
            //     ReusedModule.particleSpray(TYPE.snow,player,2000,-1000,10,1.5,5);
            //     break;
            // case 4:
            //     Level.createMainMonster(TYPE.wyvern,1000, -250);
            //     Screen.bgColor="rgb(35,5,5)";
            //     ReusedModule.worldWall(2000,1000,300);
            //     ReusedModule.particleSpray(TYPE.ember,player,2000,-1000,10,1.5,5);
            //     EntityRenderer.makeShader("rgb(1,1,7)",0.8);
            //     break;
            // case 5:
            //     Level.createMainMonster(TYPE.golem,Screen.perX(50), -400).addAction(1,100,function(){EntityRenderer.Camera.vibrate(10);});
            //     Screen.bgColor="#657d87";
            //     ReusedModule.worldWall(2000,1000,300);
            //     EntityRenderer.makeShader(Screen.bgColor,0.3);
            //     break;
            // case 6:
            //     Level.createMainMonster(TYPE.goldDragon,Screen.perX(50), -400);
            //     Screen.bgColor="rgb(5,5,35)";
            //     ReusedModule.worldWall(3000,2000,300);
            //     EntityRenderer.makeShader("rgb(1,1,7)",0.8);
            //     break;
            // case 7:
            //     ReusedModule.worldWall(2000,1000,300);
            //     Level.createMainMonster(TYPE.warrior,Screen.perX(50), -400);
            //     Screen.bgColor="rgb(100,100,100)";
            //     break;
            default:
                ReusedModule.createGameMap(1000,1000);
                WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
                WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);
                break;
        }
    }
}