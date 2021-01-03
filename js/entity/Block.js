class Block extends Entity{
    color;
    constructor(x,y,w,h,color = "#080808",channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        this.w=w;
        this.h=h;
        this.color = color;
        this.overlap=false;
        this.life=w*h*2;
    }

    draw(){
        this.life--;
        ctx.fillStyle = this.color;
        ctx.fillRect(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
    }

    collisionHandler(e){
        var damage=this.w*this.h*Math.sqrt(this.vx*this.vx+this.vy*this.vy)/10;
        e.damage(damage);
        e.giveForce(this.vx/5, this.vy/5);
    }

    giveForce(ax,ay){}
}