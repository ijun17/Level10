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
        this.canAct=false;
        this.canMove=false;
        this.canInteraction=false;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    collisionHandler(){
        this.vx=0;
        this.vy=0;
    }
}