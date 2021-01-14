class Block extends Entity{
    color;
    brokenSound=new Audio();
    constructor(x,y,w,h,color = "#080808",channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        this.w=w;
        this.h=h;
        this.color = color;
        this.overlap=false;
        this.life=w*h*2;
        this.brokenSound.src="resource/sound/broken.mp3";
        
    }

    draw(){
        this.life--;
        ctx.fillStyle = this.color;
        ctx.fillRect(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
    }

    collisionHandler(e){
        var damage=this.w*this.h*Math.sqrt(this.vx*this.vx+this.vy*this.vy)/20;
        e.damage(damage);
        e.giveForce(this.vx/5, this.vy/5);
        
    }
    removeHandler(){
        let temp = this.w*this.h/1000/Math.sqrt((Game.p.x+Game.p.w/2-this.x-this.w/2)**2+(Game.p.y+Game.p.h/2-this.y-this.h/2)**2)
        this.brokenSound.volume=(temp > 1 ? 1 :temp);
        console.log(this.brokenSound.volume);
        this.brokenSound.pause();
        this.brokenSound.currentTime = 0;
        this.brokenSound.play();
    }

    giveForce(ax,ay){}
}