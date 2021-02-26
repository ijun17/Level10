class MapBlock extends Entity{ 
    //안부숴지는
    constructor(x,y,w,h,textureType="wall",channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        this.w=w;
        this.h=h;
        this.ga=0;
        this.overlap=false;
        this.canRemoved=false;
        this.canAct=false;
        this.canMove=false;
        this.canInteract=false;
        this.draw = MapBlock.getTexture(textureType);
    }

    update(){
        this.draw();
    }

    static getTexture(textureType){
        switch(textureType){
            case "wall":
                return function(){ctx.fillStyle = "#303030";Camera.fillRect(this.x, this.y, this.w, this.h);};
            case "grass":
                return function(){
                            ctx.fillStyle="#2B650D";
                            Camera.fillRect(this.x,this.y,this.w,15);
                            ctx.fillStyle="#382113";
                            Camera.fillRect(this.x,this.y+15,this.w,this.h-15);
                        };
            case "ice":
                return function(){ctx.fillStyle = "rgb(92,150,212)";Camera.fillRect(this.x, this.y, this.w, this.h);}
            default:
                break;
        }
    }

    giveDamage(d, textColor=null){}
    giveForce(ax, ay) {}
    addAction(start, end, code) {}
}