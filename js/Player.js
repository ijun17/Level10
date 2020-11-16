class Player extends Entity{
    lv=1;
    mp=40;
    pv=2;
    isRight=true;
    static dir="resource/player/";

    constructor(x,y){
        super(x,y);
        this.w=20;
        this.h=20;
        this.life=1000;
        this.img.src = Player.dir+`player_right.png`;
    }

    goRight(){
        this.isRight=true;
        this.img.src =Player.dir+`player_right.png`;
        this.vx=this.pv;

    }
    goLeft(){
        this.isRight=false;
        this.img.src =Player.dir+`player_left.png`;
        this.vx=-this.pv;
    }

    removeHandler(){
        console.log("player die");
    }

    
}