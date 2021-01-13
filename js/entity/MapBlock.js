class MapBlock extends Entity{ //안부숴지는
    color;
    drawCode=function(){ctx.fillStyle = this.color;Camera.fillRect(this.x, this.y, this.w, this.h);}
    
    constructor(x,y,w,h,color = "rgb(48, 48, 48)",channelLevel=Game.PHYSICS_CHANNEL){
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

    update(){
        this.drawCode();
    }

    static getTexture(textureType){
        switch(textureType){
            case "wall":
                return function(){ctx.fillStyle = "#080808";Camera.fillRect(this.x, this.y, this.w, this.h);};
            case "grass":
                return function(){
                            ctx.fillStyle="#2B650D";
                            Camera.fillRect(this.x,this.y,this.w,15);
                            ctx.fillStyle="#382113";
                            Camera.fillRect(this.x,this.y+15,this.w,this.h-15);
                        };
            case "":
                return;
            default:
                break;
        }
    }

    damage(d, textColor=null){}
    giveForce(ax, ay) {}
    addAction(start, end, code) {}

    collisionHandler(){
        this.vx=0;
        this.vy=0;
    }
}