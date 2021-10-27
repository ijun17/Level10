let Level= {
    playerLevel:0,

    loadLevel:function() {
        this.playerLevel = Number(localStorage.betalevel2);
        if (this.playerLevel == undefined) {
            this.playerLevel = 1;
            this.saveLevel();
        }
    },
    saveLevel:function() {
        localStorage.betalevel2 = this.playerLevel;
    },

    clearLevel:function(stageLevel) {
        let isLevelUp = false;
        if (this.playerLevel < stageLevel + 1) {
            this.playerLevel = stageLevel + 1;
            this.saveLevel();
            isLevelUp = true;
        }
        //animation
        let clearText = new Text(Screen.perX(50),Screen.perY(0), "CLEAR", Screen.perX(20), "yellow", null,300,false);
        clearText.vy=-Screen.perY(100)/300;
        clearText.removeHandler=function(){Screen.selectScreen();return true;};
    },

    createMainMonster:function(typenum,x,y){
        let m=new Monster(typenum,x,y);
        m.isRight=false;
        m.removeHandler=function(){
            Level.clearLevel(typenum+1);
            for(let i=this.w/10; i>=0; i--){
                for(let j=this.h/10; j>=0; j--){
                    let e = new Particle(1, this.x + i * 10, this.y + j * 10);
                    e.ga = 0;
                    e.vx *= 4;
                    e.vy *= 4;
                }
            }
            let entitys=Game.channel[Game.PHYSICS_CHANNEL].entitys;
            for(let i=entitys.length; i>=0; i--){
                if(entitys[i] instanceof Monster)entitys[i].life=0;
                else if(entitys[i] instanceof Player)entitys[i].canRemoved=false;
            }
            Camera.vibrate(50);
            return true;
        }
        Component.bossMonsterStatusView(m,59,1)
        return m;
    },

    makeStage:function(level,player) {
        function makeSuperMob(e, hp = 2, size = 2, power = 2, speed = 2) {
            e.life *= hp;e.w *= size; e.h = e.w;e.inv_mass /= size * size;e.power *= power;e.speed *= speed;
        }
        //level에 따라 달라지는 변수
        Screen.bgColor="rgb("+(255-level*22)+","+(255-level*25)+","+(255-level*25)+")";
        
        switch (level) {
            case 1: 
                Level.createMainMonster(TYPE.crazyMushroom, 1000, -1000);
                Component.worldWall(1000,1000,300);
                break;
            case 2: 
                Level.createMainMonster(TYPE.crazyMonkey, 700, -1000);
                //new Monster(0, 1000, -1000);
                //new Monster(0, 900, -1000);
                //new Monster(0, 800, -1000);
                Component.worldWall(2000,1000,300);
                Component.particleSpray(TYPE.snow,player,2000,-1000,10,1.5,5)
                Screen.bgColor="#cde5e4";
                break;
            case 3: 
                Level.createMainMonster(TYPE.hellFly, 3000, -1000);
                for(let i=0; i<15; i++)new Monster(2, 200*i, -1000);
                Component.worldWall(3000,2000,300);
                //Screen.bgColor="#424146";
                Component.particleSpray(TYPE.snow,player,2000,-1000,10,1.5,5);
                //Component.shader("white",0);
                break;
            case 4:
                Level.createMainMonster(TYPE.wyvern,1000, -250);
                Screen.bgColor="rgb(35,5,5)"//"#424146";
                Component.worldWall(2000,1000,300);
                Component.particleSpray(TYPE.ember,player,2000,-1000,10,1.5,5);
                Component.shader(background="rgb(1,1,7)", globalAlpha=0.9);
                break;
            case 5:
                Level.createMainMonster(TYPE.golem,Screen.perX(50), -400).addAction(1,100,function(){Camera.vibrate(10);});
                Screen.bgColor="#657d87";
                Component.worldWall(2000,1000,300);
                Component.shader(Screen.bgColor,0.3);
                break;
            case 6:
                Level.createMainMonster(TYPE.goldDragon,Screen.perX(50), -400);
                Screen.bgColor="rgb(5,5,35)";
                Component.worldWall(3000,2000,300);
                Component.shader();
                break;
            case 7:
                Component.worldWall(2000,1000,300);
                Level.createMainMonster(TYPE.warrior,Screen.perX(50), -400);
                Screen.bgColor="rgb(100,100,100)";
                //Component.shader();
                break;
            case 8:
                Component.worldWall(2000,1000,300);
                break;
            case 9:
                Component.worldWall(2000,1000,300);
                Screen.bgColor="white"
                Component.shader(background="rgb(5,5,15)", globalAlpha=0.8);
                break;
            case 10:
                Component.worldWall(2000,1000,300);
                Screen.bgColor="rgb(5,5,35)"
                Component.shader(background="rgb(5,5,15)", globalAlpha=0.9);
                break;
            default:
                break;
        }
    }
}