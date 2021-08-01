class Player extends Entity{
    lv=1;
    mp=40;
    speed=4; 
    magicList=[];
    coolTime=[0,0,0,0];
    isRight=true;
    isMoving=false;
    canJump=true;
    totalDamage=0;
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
        //magic
        for(let i=0; i<4; i++){
            this.magicList[i]=(skillNum[i]>=0?Magic.magicList[skillNum[i]]:["none", function(){},0,0,0]);
        }
        //lv
        this.lv=Number(lv);
        this.life=this.lv*10000;
        this.mp=this.lv*30000;
        //draw
        this.draw=Player.getDraw(this);
    }

    update() {
        super.update();
        //damage
        if (this.totalDamage > 0) {
            new Text(this.x + this.w / 2, this.y - 50,this.totalDamage,30,"red","black",40);
            this.life -= this.totalDamage;
            this.totalDamage = 0;
            this.damageTick=10;
        }
        (this.mp<this.lv*30000 ? this.mp+=this.lv*2 : this.mp=this.lv*30000)
        if(this.damageTick>0)this.damageTick--;
    }
    static getDraw(p){
        let animation = new Animation("resource/player/"+`player.png`,30,60,[1,1],function(){
            if(p.isMoving)return 1;
            else return 0;
        });
        return function(){
            animation.draw(Camera.getX(p.x), Camera.getY(p.y), Camera.getS(p.w), Camera.getS(p.h),p.isRight);
        }
    }
    
    move(){
        super.move();
        this.move_run();
    }   

    move_run(){
        if (this.isMoving) {
            if (this.isRight && this.vx <= this.speed) this.vx++;
            else if (!this.isRight && this.vx >= -this.speed) this.vx--;
        }
    }

    jump(){
        if(this.canJump){
            this.vy=this.speed+1;
            this.canJump=false;
        }
    }

    collisionHandler(e,ct){
        if(ct==-2&&!this.canJump)this.canJump=true;
        return true;
    }

    giveDamage(d) {
        if(this.damageTick==0&&Math.floor(d)>0){
            this.totalDamage += Math.floor(d);
            Camera.vibrate((d<20000 ? d/200 : 50)+5);
        }
    }

    castSkill(num){
        //num 0:q 1:w 2:e 3:r
        if(this.coolTime[num]<Game.time&&this.mp>this.magicList[num][3]){
            let magicEffect = new Particle(5, this.x+this.w/2-this.h/2, this.y);
            magicEffect.w=this.h;
            magicEffect.h=this.h;
            this.magicList[num][1](this);
            this.coolTime[num]=this.magicList[num][2]+Game.time;
            this.mp-=this.magicList[num][3];
        }
    }
}