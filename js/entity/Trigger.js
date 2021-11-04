class Trigger extends Entity{
    code=function(e){};
    constructor(x,y,w,h,time,f){
        super(x,y,Game.PHYSICS_CHANNEL);
        this.w=w;
        this.h=h;
        this.life=time;
        this.code=f;
        this.ga=0;
        this.canRemoved = true;
        this.draw=Trigger.getDraw();
    }

    update() {
        super.update();
        this.life--;
    }
    static getDraw(){
        return function(){
            ctx.fillStyle = "rgba(65, 105, 225,0.1)";
            ctx.fillRect(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h));
        }
    }

    giveDamage(){}
    giveForce(){}

    collisionHandler(e){
        if(e.canMove==false)return false;
        this.code(e);
        this.life=0;
        this.code=function(){};
        return false;
    }
}