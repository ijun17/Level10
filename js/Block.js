class Block extends Entity{
    color;
    mass=1;
    constructor(x,y,w,h,color = "#080808", channelLevel=0){
        super(x,y,channelLevel);
        this.w=w;
        this.h=h;
        this.color = color;
        this.overlap=false;
    }

    draw(){
        this.life--;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    collisionHandler(e,ct,isActor){
        if(e.canRemoved&&isActor){
            var damage=this.w*this.h*Math.sqrt(this.vx*this.vx+this.vy*this.vy)*this.mass/40;
            e.life -= damage;
        }
    }
}