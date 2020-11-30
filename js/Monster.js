class Monster extends Entity{
    static dir="resource/monster/";
    static types=[{name:"crazymushroom",w:30,h:30,life:2000,damage:20,speed:3},
    {name:"crazyclam",w:100,h:100,life:10000,damage:10, speed:2}, 
    {name:"오세안",w:142,h:297,life:20000,damage:40, speed:2},
    {name:"crazymonkey",w:125,h:200,life:20000,damage:60, speed:4}];

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
        this.target=p;
        var temp = this;

        this.addAction(100-time%10,100-time%10,function(){temp.AI();});
        
        if(typenum==0){
            //this.addAction(100-time%10,100-time%10,function(){temp.skill();});
            this.addAction(100-time%10,100-time%10,function(){temp.skill3();});
        }
        if(typenum==2){
            this.addAction(100,100,function(){temp.skill();});
            this.addAction(999,999,function(){temp.skill2();});
        }
        if(typenum==3){
            this.addAction(100,100,function(){temp.skill();});
            this.addAction(999,999,function(){temp.skill2();});
        }
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y);
        ctx.font="20px";
        ctx.strokeText("hp: "+this.life,this.x,this.y-20);
    }

    collisionHandler(e,ct,isActor){
        if(isActor&&this.y+this.h<=e.y)this.canJump=true;
        //공격
        if(!(e instanceof Monster)&&e.canMove&&time%10==0){
            e.life-=this.type.damage;
            if(!(e instanceof Block)){
                e.vx=this.type.damage/10*(this.vx);
                e.vy=1;
            }
            else e.life-=500;
            
        }
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

    skill(){
        //if(p.y>200){
            this.x=p.x-this.w/2;
            this.y=0;
            this.vy=-5;
        //}
        var temp=this;

        this.addAction(500,500,function(){temp.skill();});
    }

    skill2(){
        var monster = this;
        var ice;
        var temp=-1;
        if(this.x+this.w/2 < p.x+p.w/2)temp=1;
        ice=new Matter(2,monster.x+monster.w/2+(monster.w+80)/2*temp, monster.y+monster.h/2,0, 0);
        ice.vx=(p.x-ice.x)/40;
        ice.vy=-(p.y-ice.y)/40;
        
        this.addAction(200,200,function(){monster.skill2();});
    }

    skill3(){
        //this.x=p.x;
        //this.y=p.y+60;
        var monster = this;
        this.addAction(1,1,function(){monster.visibility=false;});
        this.addAction(50,50,function(){monster.visibility=true;});
        this.addAction(100,100,function(){monster.skill3();});

    }
}