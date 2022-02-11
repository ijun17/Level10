const MAPBLOCKS=[
{
    name:"none",
    setup:function(e){e.draw=function(){}}
},
{
    name:"wall",
    setup:function(e){e.draw=function(r){r.fillRect("#303030",this);};}
},
{
    name:"grass",
    setup:function(e){e.draw=function(r){r.fillRect("#382113",this);r.fillRect("#2B650D",{x:this.x,y:this.y,w:this.w,h:15})}}
}
]


class Block extends Entity{
    color;
    constructor(x,y,w,h,color = "#080808",channelLevel=World.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        this.w=w;
        this.h=h;
        this.color = color;
        this.overlap=false;
        this.life=w*h*10;
        this.COR=1;
        this.inv_mass=20/(w*h);
        this.addEventListener("collision",function(e){
            if(e.vector[0]!==0&&e.vector[0]*this.vx>0||e.vector[1]!==0&&e.vector[1]*this.vy>0){
                e.other.giveDamage(Math.floor((this.w * this.h) * this.getVectorLength()*0.02));
            }
        }.bind(this));
        this.addEventListener("remove",function(e){SoundManager.play(SoundManager.blockCrashing, this.w*this.h*0.0001);})
    }

    draw(r){
        r.fillRect(this.color,this);
        r.drawLight(this)
    }
    setMapBlock(type=0){
        this.ga=0;
        this.inv_mass=0;
        this.COR=0;
        this.canRemoved=false;
        this.canAct=false;
        this.canMove=false;
        MAPBLOCKS[type].setup(this);
        //this.update=this.draw;
        this.giveDamage=function(){}
        this.giveForce=function() {}
        this.addAction=function() {}
        this.collisionHandler=function(){return true;};
    }
    // setTrigger(code){
    //     this.color="rgba(65, 105, 225,0.1)";
    //     let temp=this;
    //     this.addEventListener("collision", function(e){
    //         if(e.canRemoved){
    //             code(e);
    //             temp.throw();
    //             temp.removeEventListener("collision",0);
    //         }
    //         return false;
    //     },0)
    // }
}