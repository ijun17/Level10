const MATTERS=[
    {
        name:"fire",
        setStatus:function(e){
            e.power=500;
            e.addAction(1,10000,function (){if(Game.time%15==0){new Particle(1,e.x,e.y);new Particle(0,e.x,e.y);}});
        },
        effect:function(e,v){
            if(v instanceof Matter&&(v.typenum==0||v.typenum==6)){
                let explosion = new Matter(6, e.x-35, e.y-35,0,0);
                e.throw();
                if(v.typenum==0)v.throw();
                if(v.typenum==6){
                    v.power+=1000;
                };
            }else{
                v.giveDamage(e.power);v.giveForce(e.vx/e.inv_mass,(e.vy+1)/e.inv_mass);
            }
        }
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
            if(v instanceof Matter && v.typenum==0){
                for(let i=0 ;i<3; i++){
                    let cloud = new Particle(2, e.x + 15 - 100, e.y + 15 - 100);
                    cloud.w = 200;
                    cloud.h = 200;
                    cloud.life=300;
                }
                
                e.throw();
                v.throw();
            }else{
                v.giveDamage(Math.floor(this.getVectorLength())+e.power);
            v.addAction(1,150,function(){v.vx=0;v.vy=0;ctx.fillStyle="rgba(92,150,212,0.5)";Camera.fillRect(v.x,v.y,v.w,v.h);});
            }
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
                v.throw();
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
    },
    {
        name:"explosion",
        setStatus:function(e){e.power=1000;e.w=100;e.h=100;e.ga=0;e.life=150;e.inv_mass=0;e.act=function(){e.life--;};},
        effect:function(e,v){v.giveDamage(e.power);++e.life;}
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
        switch (e.typenum) {
            case 0: //애니메이션이고 방향성이 있음 : 불
                e.animation = new Animation("resource/matter/" + MATTERS[e.typenum].name + ".png", 10, 10, [3], function () { return 0; });
                return function () {
                    var r = Math.atan2(this.vx, this.vy);
                    ctx.save();
                    ctx.translate(Camera.getX(this.x + this.w / 2), Camera.getY(this.y + this.h / 2));
                    ctx.rotate(r);
                    this.animation.draw(Camera.getS(-this.w / 2), Camera.getS(-this.h / 2), Camera.getS(this.w), Camera.getS(this.h));
                    ctx.restore();
                }
                break;
            case 1: //애니메이션이고 방향성 없음 : 전기
                e.animation = new Animation("resource/matter/" + MATTERS[e.typenum].name + ".png", 10, 10, [3], function () { return 0; });
                return function () {
                    this.animation.draw(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
                }
                break;
            case 2: case 3: case 5: //그림이고 방향성 있음 : 얼음, 화살, 검격
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
                break;
            case 4: case 6: //그림이고 방향 없음 : 에너지, 폭발
                e.img = new Image();
                e.img.src = "resource/matter/" + MATTERS[e.typenum].name + ".png";
                return function () {
                    ctx.drawImage(this.img, Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
                }
                break;
        }
    }

    giveDamage(){
        --this.life;
    }

    collisionHandler(e) {
        if(!e.canCollision)return;
        --this.life;
        this.effect(this,e);
    }
}