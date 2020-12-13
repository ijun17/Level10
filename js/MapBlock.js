class MapBlock extends Entity{ //안부숴지는
    static types=[{},{}];
    color;

    constructor(x,y,w,h,color = "#080808",channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
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
        ctx.fillRect(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
    }

    damage(d, textColor=null){return;}
    giveForce(ax, ay) {return;}
    addAction(start, end, code) {return;}

    collisionHandler(){
        this.vx=0;
        this.vy=0;
    }
}