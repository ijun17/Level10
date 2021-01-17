class Player extends Entity{
    lv=1;
    mp=40;
    pv=4;
    isRight=true;
    moveFlag=false;
    canJump=true;
    totalDamage=0;
    damageTick=0;

    constructor(x,y,channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        this.w=30;
        this.h=60;
        this.life=10000*Level.playerLevel;
        //this.overlap=false;
        this.ga=-0.2;
        this.friction=0.4;
        let p=this;
        this.animation = new Animation("resource/player/"+`player.png`,30,60,[1,1],function(){
            if(p.moveFlag)return 1;
            else return 0;
        });
    }

    draw(){
        this.animation.draw(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h),this.isRight);
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font="bold 20px Arial";
        ctx.fillStyle="black"
        ctx.fillText("hp: "+(Math.floor(this.life)),Camera.getX(this.x),Camera.getY(this.y-20));
        //damage
        if (this.totalDamage > 0) {
            new Text(this.x + this.w / 2, this.y - 50,this.totalDamage,30,"red","black",40);
            this.life -= this.totalDamage;
            this.totalDamage = 0;
        }
        if(this.damageTick>0)this.damageTick--;
    }
    // giveForce(){
    //     if(this.damageTick=0)super.giveForce();
    // }
    move(){
        this.x += this.vx;
        this.y -= this.vy;
        this.vy += this.ga;
        if (this.moveFlag) {
            if (this.isRight && this.vx <= this.pv) this.vx = this.pv;
            else if (!this.isRight && this.vx >= -this.pv) this.vx = -this.pv;
        }
    }

    jump(){
        if(this.canJump){
            this.vy=this.pv;
            this.canJump=false;
        }
    }

    collisionHandler(e,ct){
        if(ct=='D'&&!this.canJump)this.canJump=true;
    }

    damage(d) {
        if(this.damageTick==0){
            this.totalDamage += Math.floor(d);
            if(d>0)this.damageTick=20;
            Camera.vibrate((d<4000 ? d/200 : 20)+5);
        }
    }
}