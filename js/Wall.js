class Wall extends Entity{
    color = "#080808";

    constructor(x,y,w,h){
        super(x,y);
        this.w=w;
        this.h=h;
        this.ga=0;
    }

    draw(){
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}