/*
creature은 몬스터와 플레이어로 자의식을 갖고 움직일수있고, 스킬을 쓸 수 있으며, 데미지를 입을 수 있다. 

*/

class Creature extends Entity{
    animation;
    nameTag=function(){return this.life}
    
    skillList=[];
    coolTime=[];
    mp=0;

    totalDamage=0;

    speed=1;
    canJump = true;
    isRight=false;
    isUp=false;
    isMoving=false;
    isFlying=false;
    constructor(x,y,channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel=Game.PHYSICS_CHANNEL)
    }

    castSkill(num){
        //num 0:q 1:w 2:e 3:r
        //Monstet skillList[0] is skill to Move
        if(this.skillList.length>num&&this.coolTime[num]<Game.time){
            this.coolTime[num]=this.skillList[num][1](this)+Game.time;
        }
    }
    draw() {
        this.animation.draw(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h),this.isRight);
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "bold 15px Arial";
        ctx.fillStyle = "black";
        Camera.fillText(this.nameTag(), this.getX(), this.y - 20);
    }
    move(){
        super.move();
        if(this.isFlying)this.move_fly();
        else this.move_run();
    }
    move_run(){
        if (this.isMoving) {
            if (this.isRight && this.vx <= this.speed) this.vx++;
            else if (!this.isRight && this.vx >= -this.speed) this.vx--;
        }
    }
    move_fly(){
        if (this.isFlying) {
            this.vy=this.isUp?this.speed:-this.speed;
        }else this.vy=0;
    }
    jump(s=(this.speed-0.5)){
        if (this.canJump) {
            this.canJump = false;
            this.vy = s;
        }
    }
}