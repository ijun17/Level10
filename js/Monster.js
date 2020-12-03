class Monster extends Entity{
    static dir="resource/monster/";
    static types=[{name:"crazymushroom",w:30,h:30,life:10000,damage:20,speed:3},
    {name:"crazyclam",w:100,h:100,life:10000,damage:10, speed:2}, 
    {name:"오세안",w:142,h:297,life:20000,damage:40, speed:2},
    {name:"crazymonkey",w:125,h:200,life:50000,damage:60, speed:4}];

    type;
    target;
    canJump=true;
    //speed=50;

    //temp
    bossMode=0;

    constructor(typenum,x,y){
        super(x,y);
        this.type=Monster.types[typenum];
        this.w=this.type.w;
        this.h=this.type.h;
        this.life=this.type.life;
        this.img.src = Monster.dir+this.type.name+".png";
        this.target=Game.p;
        var temp = this;

        this.addAction(100,100,function(){temp.AI();});
        
        if(typenum==0){
            //this.addAction(100-time%10,100-time%10,function(){temp.skill();});
            this.addAction(100,100,function(){temp.skill3();});
        }
        if(typenum==2){
            this.addAction(100,100,function(){temp.skill(500);});
            this.addAction(999,999,function(){temp.skill2();});
        }
        if(typenum==3){
            this.addAction(100,100,function(){temp.skill(500);});
            this.addAction(999,999,function(){temp.skill2();});
        }
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y);
        ctx.font="bold 20px Arial";
        ctx.fillStyle="black"
        ctx.fillText("hp: "+(Math.floor(this.life)),this.x,this.y-20);
    }

    collisionHandler(e,ct,isActor){
        if(isActor&&this.y+this.h<=e.y)this.canJump=true;
        //공격
        if(this.collisionLevel+e.collisionLevel>=0){
            if(!(e instanceof Monster||e instanceof MapBlock)){
                e.life-=this.type.damage;
                if(!(e instanceof Block)){
                    if(e.x+e.w/2>this.x+this.w/2)e.vx=Math.sqrt(this.type.damage)/2;
                    else e.vx=-(Math.sqrt(this.type.damage))/2;
                    e.vy=2;
                }else e.life-=500;

                if(this.type.name=="crazymonkey"){
                    this.img.src= Monster.dir+this.type.name+"_attack.png";
                    let m = this;
                    this.addAction(10,10,function(){m.img.src= Monster.dir+m.type.name+".png";});
                }
            }
        }
    }

    removeHandler(){
        //console.log(Level.stageMonsterCounter);
        Level.stageMonsterCount--;
        if(Level.stageMonsterCount==0)Level.clearLevel();
    }

    AI(){
        var tx = this.target.x;
        var ty = this.target.y;
        if(this.x<tx)this.vx = this.type.speed;
        else this.vx = -this.type.speed;
        if(this.canJump){
            this.canJump=false;
            this.vy=this.type.speed-0.5;
        }
        var temp = this;
        this.addAction(50,50,function(){temp.AI();});
    }

    skill(time){
        this.x=this.target.x+this.target.w/2-this.w/2;
        this.y=0;
        this.vx=0;
        this.vy=-6;
        var temp=this;
        this.addAction(time,time,function(){temp.skill(time);});
    }

    skill2(){
        var monster = this;
        var ice;
        var temp=-1;
        if(this.x+this.w/2 < this.target.x+this.target.w/2)temp=1;
        ice=new Matter(2,monster.x+monster.w/2+(monster.w+80)/2*temp, monster.y+monster.h/2,0, 0);
        ice.vx=(this.target.x-ice.x)/30;
        ice.vy=-(this.target.y-ice.y)/30;
        
        this.addAction(200,200,function(){monster.skill2();});
    }

    skill3(){
        var monster = this;
        this.addAction(1,1,function(){monster.visibility=false;});
        this.addAction(50,50,function(){monster.visibility=true;});
        this.addAction(100,100,function(){monster.skill3();});

    }
}