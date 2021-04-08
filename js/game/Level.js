let Level= {
    playerLevel:0,
    stageMonsterCount:0,
    stageLevel:0,

    loadLevel:function() {
        this.playerLevel = localStorage.betalevel2;
        if (this.playerLevel == undefined) {
            this.playerLevel = 1;
            this.saveLevel();
        }
    },
    saveLevel:function() {
        localStorage.betalevel2 = this.playerLevel;
    },

    clearLevel:function() {
        let isLevelUp = false;
        if (this.playerLevel < this.stageLevel + 1) {
            this.playerLevel = this.stageLevel + 1;
            this.saveLevel();
            isLevelUp = true;
        }
        this.stageLevel = 0;
        this.stageMonster = 0;
        //animation
        Game.p.canRemoved=false;
        let clearText = new Text(Screen.perX(50),Screen.perY(0), "CLEAR", Screen.perX(20), "yellow", null,300,false);
        clearText.vy=-Screen.perY(100)/300;
        clearText.removeHandler=function(){Screen.selectScreen();};
    },

    makeStage:function(level) {
        this.stageLevel = level;
        function printMonsterName(name=""){
            let textE = new Text(Screen.perX(10),Screen.perY(3),"vs "+name,Screen.perX(3), "black", null, 400, false);
            textE.textBaseline = "top";
            textE.textAlign="left";
        }
        function makeSuperMob(e, hp = 2, size = 2, power = 2, speed = 2) {
            e.life *= hp;
            e.w *= size; e.h = e.w;
            e.inv_mass /= size * size;
            e.power *= power;
            e.speed *= speed;
        }
        //level에 따라 달라지는 변수
        Screen.bgColor="rgb("+(255-level*22)+","+(255-level*25)+","+(255-level*25)+")";
        let mapSizeW=2000;
        let mapSizeH=1000;
        let wallSize=300;
        let mainMonster={name:"Coming soon"};
        let weatherNum=3;
        switch (level) {
            case 1:
                this.stageMonsterCount = 1;
                mainMonster=new Monster(0, 1000, -1000);
                makeSuperMob(mainMonster,2.5,2,5,1)
                break;
            case 2:
                this.stageMonsterCount = 4;
                new Monster(0, 1000, -1000);
                new Monster(0, 900, -1000);
                new Monster(0, 800, -1000);
                mainMonster=new Monster(1, 700, -1000);
                break;
            case 3:
                this.stageMonsterCount = 16;
                mapSizeW=3000;
                mainMonster=new Monster(2, 3000, -1000);
                for(let i=0; i<15; i++){//10마리 추가
                    new Monster(2, 200*i, -1000);
                }
                break;
            case 4:
                this.stageMonsterCount = 1;
                mainMonster=new Monster(3,1000, -250);
                break;
            case 5:
                this.stageMonsterCount = 1;
                mainMonster=new Monster(4,Screen.perX(50), -400)
                mainMonster.addAction(1,100,function(){Camera.vibrate(10);});
                weatherNum=0;
                break;
            case 6:
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                break;
            case 10:
                break;
            default:
                let clearBtn = new Button(canvas.width / 2 - 150, 0, 300, 100);
                clearBtn.canAct = true;
                clearBtn.addAction(400, 400, function () { Screen.selectScreen(); });
                clearBtn.drawOption(null, null, "없어 꺼졍", 100, "black");
                clearBtn.vy = -1.5;
                break;
        }
        //vs text코드 출력
        printMonsterName(mainMonster.name);
        //날씨 뿌리기
        let ashSpray = new Button(-100,-100,0,0,Game.BUTTON_CHENNEL);
        ashSpray.canAct=true;
        ashSpray.canInteract=false;
        ashSpray.addAction(1,1000000,function(){
            if(Game.time%5==0){
                let r = Math.random()*2000;
                let ash=new Particle(weatherNum,Game.p.x-1000+r,-Game.p.y-600);
                ash.life=300;
                ash.vy-=1.5;
            }
        });
        //양 끝 맵블럭
        new MapBlock(0,-wallSize-mapSizeH,mapSizeW,wallSize,"wall");//top
        new MapBlock(-wallSize, -wallSize-mapSizeH, wallSize, mapSizeH*2+1000,"wall"); //left
        new MapBlock(mapSizeW, -wallSize-mapSizeH, wallSize, mapSizeH*2+1000,"wall");//right
        new MapBlock(-wallSize,0,mapSizeW+wallSize*2,wallSize*2,"grass");
    }
}