class Player extends Entity{
    lv=1;
    mp=40;
    pv=4;
    isRight=true;
    moveFlag=false;
    canJump=true;
    totalDamage=0;
    dieCode=function(){Screen.selectScreen();};

    constructor(x,y,channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        this.w=27;
        this.h=60;
        this.life=10000*Level.playerLevel;
        this.img.src = "resource/player/"+`player2.png`;
        this.overlap=false;
        this.ga=-0.2;
        this.friction=0.4;
    }

    draw(){
        if(this.isRight){
            if(this.moveFlag)ctx.drawImage(this.img,0,60,30,60, Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
            else ctx.drawImage(this.img,0,0,30,60, Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
        }else {
            if(this.moveFlag)ctx.drawImage(this.img,30,60,30,60, Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
            else ctx.drawImage(this.img,30,0,30,60, Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
        }
        
        ctx.font="bold 20px Arial";
        ctx.fillStyle="black"
        ctx.fillText("hp: "+(Math.floor(this.life)),Camera.getX(this.x),Camera.getY(this.y-20));
        //damage
        if (this.totalDamage > 0) {
            let textSize = 50;
            let damageText = new Button(this.x + this.w / 2, this.y - textSize, 0, 0, Game.TEXT_CHANNEL);
            damageText.life = 40;
            let td=this.totalDamage;
            damageText.drawCode = function () {
                ctx.font = "bold 30px Arial";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
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
        new (this.dieCode);
    }

    damage(d) {
        d=Math.floor(d);
        this.totalDamage += d;
    }
}