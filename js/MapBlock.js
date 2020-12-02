class MapBlock extends Entity{ //안부숴지는
    static types=[{},{}];
    color;

    constructor(x,y,w,h,color = "#080808"){
        super(x,y);
        this.w=w;
        this.h=h;
        this.ga=0;
        this.color = color;
        this.overlap=false;
        this.canRemoved=false;
        this.collisionLevel=4;
    }

    update(){
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }


}