class Player extends Entity{
    lv=1;
    mp=40;
    pv=4;
    isRight=true;
    moveFlag=false;
    canJump=true;
    static dir="resource/player/";
    
    qCT=0;
    wCT=0;
    eCT=0;
    rCT=0;

    constructor(x,y){
        super(x,y);
        this.w=27;
        this.h=60;
        this.life=1000;
        this.img.src = Player.dir+`player2_right.png`;
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y);
        ctx.font="20px";
        ctx.strokeText("hp: "+this.life,this.x,this.y-20);
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

    goRight(){
        this.isRight=true;
        this.img.src =Player.dir+`player2_right.png`;
        this.vx=this.pv;

    }
    goLeft(){
        this.isRight=false;
        this.img.src =Player.dir+`player2_left.png`;
        this.vx=-this.pv;
    }
    jump(){
        if(this.canJump){
            p.setVectorY(this.pv);
            this.canJump=false;
        }
    }

    collisionHandler(e,ct){
        if(ct=='D'&&!this.canJump)this.canJump=true;
    }

    removeHandler(){
        console.log("player die");
        Game.levelSelectedScreen();
    }

    
}