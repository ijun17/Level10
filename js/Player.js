class Player extends Entity{
    lv=1;
    mp=40;
    pv=3.5;
    isRight=true;
    moveFlag=false;
    canJump=true;
    totalDamage=0;
    static dir="resource/player/";

    constructor(x,y,channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        this.w=27;
        this.h=60;
        this.life=10000*Level.playerLevel;
        this.img.src = Player.dir+`player2_right.png`;
        this.overlap=false;
        this.ga=-0.2;
    }

    draw(){
        ctx.drawImage(this.img, Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
        ctx.font="bold 20px Arial";
        ctx.fillStyle="black"
        ctx.fillText("hp: "+(Math.floor(this.life)),Camera.getX(this.x),Camera.getY(this.y-20));
        //damage
        if (this.totalDamage > 0) {
            let textSize = 50;
            let damageText = new Button(this.x + this.w / 2, this.y - textSize, 0, 0, Game.TEXT_CHANNEL);
            damageText.life = 40;
            damageText.canInteraction = false;
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

    go(){
        if(this.isRight){
            this.img.src =Player.dir+`player2_right.png`;
            this.vx=this.pv;
        }else{
            this.img.src =Player.dir+`player2_left.png`;
            this.vx=-this.pv;
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
        console.log("player die");
        Screen.selectScreen();
    }

    damage(d) {
        d=Math.floor(d);
        this.totalDamage += d;
    }
}