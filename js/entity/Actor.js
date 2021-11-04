/*
creature은 몬스터와 플레이어로 자의식을 갖고 움직일수있고, 스킬을 쓸 수 있으며, 데미지를 입을 수 있다. 

*/

class Actor extends Entity{
    animation;
    getNameTag=function(){return `HP:${this.life}`}
    createDamageText=function(){new Text(this.getX(), this.y - 50,Math.floor(this.totalDamage),40,"orange","black",40).vy=1;}
    loop=function(){}
    totalDamage=0;
    noDamageTick=0;
    
    skillList=[];
    coolTime=[];
    mp=0;
    MAX_MP=0;

    totalDamage=0;

    isMoving=true;//액터가 자신의 의지로 움직일 수 있는지
    speed=1;
    jumpSpeed=1;
    canJump = false;
    isRight=true;
    isUp=true;
    isMovingX=false;
    isMovingY=false;
    isFlying=false;//CONST

    totalDamageHandler=function(){return true;}
    castSkillHandler=function(){return true;}

    constructor(x,y,channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel=Game.PHYSICS_CHANNEL)
    }

    update() {
        super.update();
        //damage
        if (this.totalDamageHandler()&&this.totalDamage > 0) {
            this.createDamageText()
            //Camera.vibrate((this.totalDamage<10000 ? this.totalDamage/500 : 20)+5);
            this.life -= Math.floor(this.totalDamage);
            this.totalDamage = 0;
        }
    }

    castSkill(num){
        //num 0:q 1:w 2:e 3:r
        //Monstet skillList[0] is skill to Move
        if(this.skillList.length>num&&this.coolTime[num]<Game.time){
            this.coolTime[num]=this.skillList[num][1](this)+Game.time;
            this.castSkillHandler();
        }
    }
    draw() {
        this.animation.draw(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h),this.isRight);
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "bold 15px Arial";
        ctx.fillStyle = "black";
        Camera.fillText(this.getNameTag(), this.getX(), this.y - 20);
    }
    move(){
        super.move();
        if(this.isMoving){
            this.moveX();
            if(this.isFlying)this.moveY();
        }
    }
    moveX(){
        if (this.isMovingX) {
            if (this.isRight && this.vx <= this.speed) this.vx++;
            else if (!this.isRight && this.vx >= -this.speed) this.vx--;
        }
    }
    moveY(){
        if (this.isMovingY) {
            if (this.isUp && this.vy <= this.speed) ++this.vy;
            else if (!this.isUp && this.vy >= -this.speed) --this.vy;
            this.vy-=this.ga;
        }
    }
    jump(){
        if (this.isMoving&&this.canJump) {
            this.canJump = false;
            this.vy = this.jumpSpeed;
        }
    }
    collisionHandler(e,ct){
        if (ct[1]===-1) this.canJump = true;
        return true;
    }

    giveDamage(d) {
        if(d>this.defense){
            this.totalDamage += d;
            return true;
        }
        return false;
    }
}