const MATTERS=[
    {
        name:"fire",
        setStatus:function(e){
            e.power=500;
            e.addAction(1,10000,function (){if(Game.time%15==0){new Particle(1,e.x,e.y);new Particle(0,e.x,e.y);}});
        },
        effect:function(e,v){v.giveDamage(e.power);v.giveForce(e.vx/e.inv_mass,(e.vy+1)/e.inv_mass);}
    },
    {
        name:"electricity",
        setStatus:function(e){e.power=150;},
        effect:function(e,v){v.giveDamage(e.power);v.vx=0;v.vy=0;}
    },
    {
        name:"ice",
        setStatus:function(e){e.power=200;},
        effect:function(e,v){
            v.giveDamage(Math.floor(this.getVectorLength())+e.power);
            v.addAction(1,150,function(){v.vx=0;v.vy=0;ctx.fillStyle="rgba(92,150,212,0.5)";Camera.fillRect(v.x,v.y,v.w,v.h);});
        }
    },
    {
        name:"arrow",
        setStatus:function(e){e.power=100;},
        effect:function(e,v){v.giveDamage(Math.floor(e.getVectorLength()*e.power));v.giveForce(e.vx/e.inv_mass,(e.vy+1)/e.inv_mass);}
    },
    {
        name:"energy",
        setStatus:function(e){e.power=1000;e.inv_mass=0.5;e.ga=-0.01;e.friction=0;},
        effect:function(e,v){
            if(v instanceof Matter&&v.typenum==4){
                e.life+=v.life+1;v.life=0; //생명 합
                e.x=(e.x*e.w+v.x*v.w)/(e.w+v.w);   e.y=(e.y*e.h+v.y*v.h)/(e.h+v.h); //좌표 조정
                e.w=Math.sqrt(e.w**2+v.w**2);e.h=e.w;//크기 합체
                e.inv_mass=e.inv_mass*v.inv_mass/(e.inv_mass+v.inv_mass) //질량 합
                e.giveForce(v.vx/v.inv_mass, v.vy/v.inv_mass); //힘 합
                e.power=Math.floor((e.power+v.power)); //파워 합
                v.y=10000; //제거
            }else{
                v.giveDamage(e.power);
                v.giveForce(e.vx/e.inv_mass+(e.getX()<v.getX()?e.w/10:-e.w/10), e.vy/e.inv_mass+1);
            }
        }
    },
    {
        name:"sword",
        setStatus:function(e){e.power=20;e.w=e.getVectorLength()+30;e.h=e.w;},
        effect:function(e,v){
            v.giveDamage(e.w*e.power);
            v.giveForce(e.vx,e.vy+1);
        }
    }
];

class Matter extends Entity {
    typenum;
    power;
    effect=function(e){};
    constructor(typenum, x, y, vx = 0, vy = 0,channelLevel=Game.PHYSICS_CHANNEL) {
        super(x, y,channelLevel);
        this.vx = vx;
        this.vy = vy;
        this.w = 30;
        this.h = 30;
        this.ga = -0.02;
        this.inv_mass=4;
        let type=MATTERS[typenum];
        this.typenum=typenum;
        type.setStatus(this);
        this.effect=type.effect;
        this.draw=Matter.getDraw(this);
    }

    static getDraw(e) {
        if(e.typenum===0||e.typenum===1){
            e.animation=new Animation("resource/matter/" + MATTERS[e.typenum].name + ".png",10,10,[3],function(){return 0;});
            return function (){
                var r = Math.atan2(this.vx, this.vy);
                ctx.save();
                ctx.translate(Camera.getX(this.x + this.w / 2), Camera.getY(this.y + this.h / 2));
                ctx.rotate(r);
                this.animation.draw(Camera.getS(-this.w / 2), Camera.getS(-this.h / 2), Camera.getS(this.w), Camera.getS(this.h));
                ctx.restore();
            }
        } else {
            e.img = new Image();
            e.img.src = "resource/matter/" + MATTERS[e.typenum].name + ".png";
            return function () {
                var r = Math.atan2(this.vx, this.vy);
                ctx.save();
                ctx.translate(Camera.getX(this.x + this.w / 2), Camera.getY(this.y + this.h / 2));
                ctx.rotate(r);
                ctx.drawImage(this.img, Camera.getS(-this.w / 2), Camera.getS(-this.h / 2), Camera.getS(this.w), Camera.getS(this.h));
                ctx.restore();
            }
        }
    }

    giveDamage(){
        this.life--;
    }

    collisionHandler(e) {
        if(!e.canCollision)return;
        this.life--;
        this.effect(this,e);
    }
}