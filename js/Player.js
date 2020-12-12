class Player extends Entity{
    lv=1;
    mp=40;
    pv=3;
    isRight=true;
    moveFlag=false;
    canJump=true;
    static dir="resource/player/";

    constructor(x,y,channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        this.w=27;
        this.h=60;
        this.life=10000*Level.playerLevel;
        this.img.src = Player.dir+`player2_right.png`;
        this.overlap=false;
    }

    draw(){
        ctx.drawImage(this.img, Camera.getX(this.x), Camera.getY(this.y));
        ctx.font="bold 20px Arial";
        ctx.fillStyle="black"
        ctx.fillText("hp: "+(Math.floor(this.life)),Camera.getX(this.x),Camera.getY(this.y-20));
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

    
}