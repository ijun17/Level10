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
        //animation
        //let clearText = new Text(Screen.perX(50),Screen.perY(0), "CLEAR", Screen.perX(20), "yellow", null,300,false);
        //clearText.vy=-Screen.perY(100)/300;
        //clearText.addEventListener("remove", function(){Screen.setScreen("select");return true;})
        let clearTextY=SCREEN.perY(50);
        let clearText = SCREEN.ui.add("div",[SCREEN.perX(50), clearTextY],[0,0],"levelClearText");
        clearText.innerText="CLEAR";
        TIME.addSchedule(0,3,undefined,()=>{clearText.style.bottom=(clearTextY++)+"px"});
        TIME.addSchedule(3,3,undefined,()=>{Game.changeScene("select")});
    },

    createMainMonster:function(typenum,x,y){
        let m=new Monster(typenum,x,y);
        m.isRight=false;
        m.addEventListener("remove",function(){
            Level.clearLevel(typenum+1);
            let entitys=World.channel[World.PHYSICS_CHANNEL].entitys;
            for(let i=entitys.length; i>=0; i--){
                if(entitys[i] instanceof Monster)entitys[i].life=0;
                else if(entitys[i] instanceof Player)entitys[i].canRemoved=false;
            }
            return true;
        })
        Component.bossMonsterStatusView(m,59,1)
        return m;
    },

    makeStage:function(level,player) {
        //level에 따라 달라지는 변수
        Screen.bgColor="rgb("+(255-level*22)+","+(255-level*25)+","+(255-level*25)+")";
        
        switch (level) {
            case 1: 
                Screen.bgColor="dimgray";
                Level.createMainMonster(TYPE.crazyMushroom, 1000, -1000);
                Component.worldWall(1000,1000,300);
                EntityRenderer.makeShader("black",0.4);
                break;
            case 2: 
                Screen.bgColor="#cde5e4";
                Level.createMainMonster(TYPE.crazyMonkey, 1600, -1000);
                Component.worldWall(2000,1000,300);
                Component.particleSpray(TYPE.snow,player,2000,-1000,10,1.5,5)
                EntityRenderer.makeShader("rgb(10, 18, 33)",0.5);
                break;
            case 3: 
                Level.createMainMonster(TYPE.hellFly, 3000, -1000);
                for(let i=0; i<15; i++)new Monster(2, 200*i, -1000);
                Component.worldWall(3000,2000,300);
                Component.particleSpray(TYPE.snow,player,2000,-1000,10,1.5,5);
                break;
            case 4:
                Level.createMainMonster(TYPE.wyvern,1000, -250);
                Screen.bgColor="rgb(35,5,5)";
                Component.worldWall(2000,1000,300);
                Component.particleSpray(TYPE.ember,player,2000,-1000,10,1.5,5);
                EntityRenderer.makeShader("rgb(1,1,7)",0.8);
                break;
            case 5:
                Level.createMainMonster(TYPE.golem,Screen.perX(50), -400).addAction(1,100,function(){EntityRenderer.Camera.vibrate(10);});
                Screen.bgColor="#657d87";
                Component.worldWall(2000,1000,300);
                EntityRenderer.makeShader(Screen.bgColor,0.3);
                break;
            case 6:
                Level.createMainMonster(TYPE.goldDragon,Screen.perX(50), -400);
                Screen.bgColor="rgb(5,5,35)";
                Component.worldWall(3000,2000,300);
                EntityRenderer.makeShader("rgb(1,1,7)",0.8);
                break;
            case 7:
                Component.worldWall(2000,1000,300);
                Level.createMainMonster(TYPE.warrior,Screen.perX(50), -400);
                Screen.bgColor="rgb(100,100,100)";
                break;
            case 8:
                player.flyMode();
                let chainList =[];
                for(let i=0; i<10; i++){
                    let block=new Block(200*i+300, -1000,50,50,`rgb(${200-i*20},${200-i*10},${200-i*20})`);
                    block.canRemoved=false;
                    chainList.push(block);
                    //block.inv_mass=1;
                }
                chainList[0].inv_mass=0;
                chainList[0].canMove=false;
                Component.chain(chainList,100,3,10)

                //chainList=[new Monster(TYPE.crazyMushroom,500,-1000),new Block(600,-1000,150,150),new Block(600,-1000,200,200),new Block(600,-1000,150,150),new Block(700,-1000,100,100)]
                //chainList[0].inv_mass=0.000001
                //Component.chain(chainList, 60,1,1)

                Component.worldWall(2000,1000,300);
                break;
            case 9:
                Component.worldWall(2000,1000,300);
                break;
            case 10:
                Component.worldWall(2000,1000,300);
                Screen.bgColor="rgb(5,5,35)"
                EntityRenderer.makeShader("rgb(5,5,15)",0.9)
                break;
            default:
                break;
        }
    }
}