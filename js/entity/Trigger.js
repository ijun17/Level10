class Trigger extends Entity{
    code=function(e){};
    constructor(x,y,w,h,time,f){
        super(x,y,World.PHYSICS_CHANNEL);
        this.w=w;
        this.h=h;
        this.life=time;
        this.code=f;
        this.ga=0;
        this.canRemoved = true;
        this.draw=Trigger.getDraw();
        this.addEventListener("collision", function(e){if(e.other.canMove==false)return false;
            this.code(e.other);
            this.life=0;
            this.code=function(){};
        }.bind(this))
    }

    update() {
        super.update();
        this.life--;
    }
    static getDraw(){
        return function(r){
            r.fillRect("rgba(65, 105, 225,0.1)", this)
        }
    }

    giveDamage(){}
    giveForce(){}
}