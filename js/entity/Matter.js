const MATTERS=[
    {
        name:"fire",
        drawOption:function(e){
            e.animation=new Animation(ImageManager.fire, 10,10,[3],function(){return 0})
            e.draw=function(){this.drawRotate(function(){e.animation.draw(-Camera.getS(e.w>>1), -Camera.getS(e.h>>1), Camera.getS(e.w), Camera.getS(e.h))},Math.atan2(this.vx, this.vy));}
        },
        setup:function(e){
            e.power=500;e.brightness=1;
            e.addAction(1,10000,function (){if(Time.time%15==0){new Particle(TYPE.ember,e.x,e.y);new Particle(TYPE.smoke,e.x,e.y);}});
        },
        effect:function(e,v){
            --this.life;
            if(v instanceof Matter&&(v.typenum==0||v.typenum==6)){
                new Matter(TYPE.explosion, e.x-35, e.y-35,0,0);
                e.throw();
                if(v.typenum==0)v.throw();
                else v.power+=500;
            }else{
                v.giveDamage(e.power);v.giveForce(e.vx/e.inv_mass,(e.vy+0.5)/e.inv_mass);
            }
            return true;
        }
    },
    {
        name:"electricity",
        drawOption:function(e){
            e.animation=new Animation(ImageManager.electricity, 10,10,[3],function(){return 0})
            e.draw=function(){this.animation.draw(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h))}
        },
        setup:function(e){e.power=50;e.brightness=1;e.ga=0;e.inv_mass=1;e.lightningPoint=0;e.addAction(0,99999999,function(){--e.life;})},
        effect:function(e,v){
            v.giveDamage(e.power);v.vx*=0.5;v.vy*=0.5;
            if(v instanceof Matter && v.typenum==1){
                if(++e.lightningPoint>8000){
                    if(e.lightningPoint==10000){
                        new Matter(TYPE.lightning, e.getX()-150,e.y-900);
                        e.throw();
                        v.throw();
                    }else if(e.lightningPoint==8001){
                        e.w=60;e.h=60;
                        e.x-=15;e.y-=15;
                    }
                }
            }
            return true;
        }
    },
    {
        name:"ice",
        drawOption:function(e){
            e.draw=function(){this.drawRotate(function(){ctx.drawImage(ImageManager.ice,-Camera.getS(e.w>>1),-Camera.getS(e.h>>1),Camera.getS(e.w),Camera.getS(e.h))},Math.atan2(this.vx, this.vy));}
        },
        setup: function (e) { e.power = 110; },
        effect: function (e, v) {
            --this.life;
            if (v instanceof Matter && v.typenum == 0) {
                new Particle(TYPE.cloud, e.x + 15 - 100, e.y + 15 - 100);
                new Particle(TYPE.cloud, e.x + 15 - 100, e.y + 15 - 100);
                new Particle(TYPE.cloud, e.x + 15 - 100, e.y + 15 - 100);
                e.throw();
                v.throw();
            } else {
                v.giveDamage(Math.floor(this.getVectorLength())+e.power);
                v.giveForce(e.vx/e.inv_mass,e.vy/e.inv_mass);
                if(v instanceof Actor&&v.isMoving===true){
                    v.isMoving=false;
                    v.addAction(1,100,function(){ctx.fillStyle="rgba(92,150,212,0.5)";Camera.fillRect(v.x,v.y,v.w,v.h);});
                    v.addAction(101,101,function(){v.isMoving=true;});
                }
            }
            return true;
        }
    },
    {
        name:"arrow",
        drawOption:function(e){
            e.draw=function(){this.drawRotate(function(){ctx.drawImage(ImageManager.arrow,-Camera.getS(e.w>>1),-Camera.getS(e.h>>1),Camera.getS(e.w),Camera.getS(e.h))},Math.atan2(this.vx, this.vy));}
        },
        setup:function(e){e.power=100;e.inv_mass=2},
        effect:function(e,v){--this.life;v.giveDamage(Math.floor(e.getVectorLength()*e.power));v.giveForce(e.vx/e.inv_mass,(e.vy)/e.inv_mass);return true;}
    },
    {
        name:"energy",
        drawOption:function(e){
            e.draw=function(){Camera.drawImage(ImageManager.energy,this.x,this.y,this.w,this.h)}
        },
        setup:function(e){e.power=1000;e.brightness=2;e.inv_mass=0.5;e.ga=-0.01;e.friction=0;},
        effect:function(e,v){
            --this.life;
            if(e.life<1)return;//e와 v의 collisionHandler가 중복해서 실행되는걸 방지
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
                v.giveForce(e.vx/e.inv_mass+(e.getX()<v.getX()?e.w/10:-e.w/10), e.vy/e.inv_mass+(e.getY()<v.getY()?e.h/10:-e.h/10)+1);
            }
            return true;
        }
    },
    {
        name:"wind",
        drawOption:function(e){
            e.draw=function(){this.drawRotate(function(){ctx.drawImage(ImageManager.wind,-Camera.getS(e.w>>1),-Camera.getS(e.h>>1),Camera.getS(e.w),Camera.getS(e.h))},Math.atan2(this.vx, this.vy));}
        },
        setup:function(e){e.power=0;e.w=(e.vx*e.vx+e.vy*e.vy)*0.1+30;e.h=e.w;e.ga=0;e.inv_mass=0.1;e.addAction(0,99999999,function(){--e.life;})},
        effect:function(e,v){
            v.giveForce(e.vx-v.vx,e.vy-v.vy+1);
            v.giveDamage(e.power);
            if(e.vx==0&&e.vy==0)e.throw();
            return true;
        }
    },
    {
        name:"explosion",
        drawOption:function(e){
            e.draw=function(){Camera.drawImage(ImageManager.explosion,this.x,this.y,this.w,this.h)}
        },
        setup:function(e){
            e.power=1000;e.brightness=3;e.w=100;e.h=100;e.ga=0;e.life=50;e.inv_mass=0;e.addAction(0,99999999,function(){--e.life;})
            SoundManager.play(SoundManager.explosion,0.2);
            Camera.vibrate(5);
        },
        effect:function(e,v){
            v.giveDamage(e.power);
            v.giveForce((e.getX()<v.getX()?1:-1), (e.getY()>v.getY()?0.3:0.3));
            return false;
        }
    },
    {
        name: "lightning",
        drawOption:function(e){
            e.animation=new Animation(ImageManager.lightning, 100,400,[3],function(){return 0})
            e.draw=function(){this.animation.draw(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h))}
        },
        setup:function(e){
            e.power=1000;e.brightness=10;e.w=300;e.h=1200;e.inv_mass=0;e.life=50;e.move=function(){};
            e.addAction(0,99999999,function(){--e.life;Camera.vibrate(5);});
            SoundManager.play(SoundManager.explosion,1);
            SoundManager.play(SoundManager.blockCrashing,1);
        },
        effect:function(e,v){
            if(v instanceof Matter && (v.typenum==1)){
                v.throw();
                e.power+=v.power;
            }else{
                v.giveDamage(e.power);
            }
            return false;
        }
    }
];

class Matter extends Entity {
    image;
    typenum;
    power;
    effect=function(e){};
    constructor(typenum, x, y, vx = 0, vy = 0,channelLevel=World.PHYSICS_CHANNEL) {
        super(x, y,channelLevel);
        this.vx = vx;
        this.vy = vy;
        this.w = 30;
        this.h = 30;
        this.ga = -0.02;
        this.inv_mass=3;
        this.overlap=true;
        let type=MATTERS[typenum];
        this.typenum=typenum;
        type.setup(this);
        this.effect=type.effect;
        type.drawOption(this);
    }

    drawRotate(code, r){
        ctx.save();
        ctx.translate(Camera.getX(this.getX()), Camera.getY(this.getY()));
        ctx.rotate(r);
        code();
        ctx.restore();
    }

    giveDamage(){
        return;
    }

    collisionHandler(e) {
        return this.effect(this,e);
    }
}