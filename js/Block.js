class Block extends Entity{
    color;
    constructor(x,y,w,h,color = "#080808"){
        super(x,y);
        this.w=w;
        this.h=h;
        this.life=1000;
        this.color = color;
        this.overlap=false;
    }

    draw(){
        this.life--;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    collisionHandler(e){
        if(e.canRemoved){
            var damage=this.w*this.h*Math.sqrt(this.vx*this.vx+this.vy*this.vy)/20;
            e.life -= damage;
            console.log(damage);
        }
    }
}