class Block extends Entity{
    color;
    //brokenSound=new Audio();
    constructor(x,y,w,h,color = "#080808",channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        this.w=w;
        this.h=h;
        this.color = color;
        this.overlap=false;
        this.life=w*h*10;
        //this.brokenSound.src="resource/sound/broken.mp3";
        
    }

    draw(){
        ctx.fillStyle = this.color;
        Camera.fillRect(this.x,this.y,this.w,this.h);
    }

    collisionHandler(e){
        this.life--;
        var damage=(this.w*this.h)*(this.getVectorLength()**1.2+0.5)/10;
        e.giveDamage(damage);
        e.giveForce(this.vx/2, this.vy/2);
        
    }
    removeHandler(){
        //let temp = this.w*this.h/1000/Math.sqrt((Game.p.x+Game.p.w/2-this.x-this.w/2)**2+(Game.p.y+Game.p.h/2-this.y-this.h/2)**2)
        //this.brokenSound.volume=(temp > 1 ? 1 :temp);
        // if(this.brokenSound.volume>0.01){
        //     this.brokenSound.pause();
        //     this.brokenSound.currentTime = 0;
        //     this.brokenSound.play();
        // }
    }

    giveForce(ax,ay){}
}