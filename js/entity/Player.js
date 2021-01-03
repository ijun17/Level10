class Player extends Entity{
    lv=1;
    mp=40;
    pv=4;
    isRight=true;
    moveFlag=false;
    canJump=true;
    totalDamage=0;
    dieCode=function(){};

    constructor(x,y,channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        this.w=30;
        this.h=60;
        this.life=10000*Level.playerLevel;
        this.overlap=false;
        this.ga=-0.2;
        this.friction=0.4;
        let p=this;
        this.animation = new Animation("resource/player/"+`player.png`,30,60,function(){
            if(p.moveFlag){
                if(p.isRight)return 2;
                else return 3;
            }else{
                if(p.isRight)return 0;
                else return 1;
            }
        });
    }

    draw(){
        this.animation.draw(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font="bold 20px Arial";
        ctx.fillStyle="black"
        ctx.fillText("hp: "+(Math.floor(this.life)),Camera.getX(this.x),Camera.getY(this.y-20));
        //damage
        if (this.totalDamage > 0) {
            let textSize = 50;
            let damageText = new Button(this.x + this.w / 2, this.y - textSize, 0, 0, Game.TEXT_CHANNEL);
            damageText.canRemoved=true;
            damageText.life = 40;
            let td=this.totalDamage;
            damageText.drawCode = function () {
                ctx.font = "bold 30px Arial";
                
                ctx.fillStyle = "red";
                ctx.fillText(td, Camera.getX(damageText.x), Camera.getY(damageText.y));
                ctx.strokeStyle = "black";
                ctx.strokeText(td, Camera.getX(damageText.x), Camera.getY(damageText.y));
                damageText.life--;
            }
            this.life -= this.totalDamage;
            this.totalDamage = 0;
        }
    }
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

    removeHandler(){
        this.dieCode();
    }

    damage(d) {
        d=Math.floor(d);
        this.totalDamage += d;
    }
}