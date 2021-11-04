class Player extends Actor{
    lv=1;
    damageTick=0;

    constructor(x,y,lv=1,skillNum=Magic.skillNum,channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        //default
        this.w=30;
        this.h=60;
        this.ga=-0.2;
        this.friction=0.4;
        this.inv_mass=1;
        this.COR=0;
        this.overlap=true;
        this.brightness=0.2
        this.speed=4;
        this.jumpSpeed=5;
        //magic
        for(let i=0; i<4; i++){
            this.skillList[i]=(skillNum[i]>=0?Magic.magicList[skillNum[i]]:["none", function(){},0,0,0]);
            this.coolTime[i]=0;
        }
        //lv
        this.lv=Number(lv);
        this.life=this.lv*10000;
        this.mp=this.lv*30000;
        //draw
        let temp = this;
        this.animation = new Animation(ImageManager.player,30,60,[1,1],function(){
            if(temp.isMovingX)return 1;
            else return 0;
        });
        //damage
        this.createDamageText=function(){new Text(this.getX(), this.y - 50,Math.floor(this.totalDamage),40,"brown","black",40).vy=1;}
        this.totalDamageHandler=function(){
            if(this.damageTick>0){
                this.totalDamage=0;
                this.damageTick--;
                return false;
            }else if(this.totalDamage > 0){
                this.damageTick=10;
                Camera.vibrate((this.totalDamage<10000 ? this.totalDamage*0.02 : 200)+5);
                //Camera.vibrate((this.totalDamage<10000 ? this.totalDamage*0.02 : 200)+5); 적당한 타격감
                return true;
            }
        }
    }

    update() {
        super.update();
        (this.mp<this.lv*30000 ? this.mp+=this.lv<<1 : this.mp=this.lv*30000)
    }

    castSkill(num){
        //num 0:q 1:w 2:e 3:r
        if(this.coolTime[num]<Game.time&&this.mp>this.skillList[num][3]){
            let magicEffect = new Particle(5, this.x+this.w/2-this.h/2, this.y);
            magicEffect.w=this.h;
            magicEffect.h=this.h;
            this.skillList[num][1](this);
            this.coolTime[num]=this.skillList[num][2]+Game.time;
            this.mp-=this.skillList[num][3];
        }
    }
    flyMode(){
        this.isFlying=true;
        Input.addFlyKey(this,Input.KEY_MOVE[0])
    }
}