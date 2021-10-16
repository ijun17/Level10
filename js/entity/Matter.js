const MATTERS=[
    {
        name:"fire",
        setStatus:function(e){
            e.power=500;e.brightness=1;
            e.addAction(1,10000,function (){if(Game.time%15==0){new Particle(1,e.x,e.y);new Particle(0,e.x,e.y);}});
        },
        effect:function(e,v){
            --this.life;
            if(v instanceof Matter&&(v.typenum==0||v.typenum==6)){
                Sound.play(Sound.audios.explosion,0.2);
                let explosion = new Matter(6, e.x-35, e.y-35,0,0);
                e.throw();
                if(v.typenum==0)v.throw();
                if(v.typenum==6){
                    v.power+=1000;
                };
            }else{
                v.giveDamage(e.power);v.giveForce(e.vx/e.inv_mass,(e.vy+1)/e.inv_mass);
            }
            return true;
        }
    },
    {
        name:"electricity",
        setStatus:function(e){e.power=110;e.brightness=1;e.ga=0;e.inv_mass=0;e.lightningPoint=0;e.addAction(0,99999999,function(){--e.life;})},
        effect:function(e,v){
            v.giveDamage(e.power);v.vx=0;v.vy=0;
            if(v instanceof Matter && v.typenum==1){
                if(++e.lightningPoint>8000){
                    if(e.lightningPoint==10000){
                        Sound.play(Sound.audios.explosion,1);
                        Sound.play(Sound.audios.blockCrashing,1);
                        new Matter(7, e.x+e.w/2-150,e.y-900);
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
        setStatus:function(e){e.power=110;},
        effect:function(e,v){
            --this.life;
            if(v instanceof Matter){
                if(v.typenum==0){
                    for (let i = 0; i < 3; i++) {
                        let cloud = new Particle(2, e.x + 15 - 100, e.y + 15 - 100);
                        cloud.w = 200;
                        cloud.h = 200;
                        cloud.life = 300;
                    }
                    e.throw();
                    v.throw();
                }
            }else{
                v.giveDamage(Math.floor(this.getVectorLength())+e.power);
                v.addAction(1,150,function(){v.vx=0;v.vy=0;ctx.fillStyle="rgba(92,150,212,0.5)";Camera.fillRect(v.x,v.y,v.w,v.h);});
            }
            return true;
        }
    },
    {
        name:"arrow",
        setStatus:function(e){e.power=100;},
        effect:function(e,v){--this.life;v.giveDamage(Math.floor(e.getVectorLength()*e.power));v.giveForce(e.vx/e.inv_mass,(e.vy)/e.inv_mass);return true;}
    },
    {
        name:"energy",
        setStatus:function(e){e.power=1000;e.brightness=2;e.inv_mass=0.5;e.ga=-0.01;e.friction=0;},
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
        setStatus:function(e){e.power=0;e.w=(e.vx*e.vx+e.vy*e.vy)*0.1+30;e.h=e.w;e.ga=0;e.inv_mass=0.1;e.addAction(0,99999999,function(){--e.life;})},
        effect:function(e,v){
            v.giveForce(e.vx-v.vx,e.vy-v.vy+1);
            v.giveDamage(e.power);
            if(e.vx==0&&e.vy==0)e.throw();
            return true;
        }
    },
    {
        name:"explosion",
        setStatus:function(e){e.power=3000;e.brightness=3;e.w=100;e.h=100;e.ga=0;e.life=50;e.inv_mass=0;e.addAction(0,99999999,function(){--e.life;})},
        effect:function(e,v){
            v.giveDamage(e.power);
            v.giveForce((e.getX()<v.getX()?1:-1), (e.getY()<v.getY()?1:-1));
            return false;
        }
    },
    {
        name: "lightning",
        setStatus:function(e){
            e.power=1000;e.brightness=10;e.w=300;e.h=1200;e.inv_mass=0;e.life=50;e.move=function(){};
            e.addAction(0,99999999,function(){--e.life;Camera.vibrate(5);});
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
        this.overlap=true;
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
            case 7:
                e.animation = new Animation("resource/matter/" + MATTERS[e.typenum].name + ".png", 100, 400, [3], function () { return 0; });
                e.animation.fps=4;
                return function () {
                    this.animation.draw(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
                }
                break;
        }
    }

    giveDamage(){
        return;
    }

    collisionHandler(e) {
        return this.effect(this,e);
    }
}