const MAPBLOCKS=[
{
    name:"none",
    setup:function(e){e.draw=function(){}}
},
{
    name:"wall",
    setup:function(e){e.draw=function(){ctx.fillStyle = "#303030";Camera.fillRect(this.x, this.y, this.w, this.h);};}
},
{
    name:"grass",
    setup:function(e){e.draw=function(){ctx.fillStyle="#2B650D";Camera.fillRect(this.x,this.y,this.w,15);ctx.fillStyle="#382113";Camera.fillRect(this.x,this.y+15,this.w,this.h-15);}}
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
        // let temp= this;
        // this.addEventListener("collision", function(e,ct){
        //     if(ct[0]!==0&&ct[0]*temp.vx>0||ct[1]!==0&&ct[1]*temp.vy>0){
        //         e.giveDamage(Math.floor((temp.w * temp.h) * temp.getVectorLength()*0.02));
        //     }
        //     return true;
        // })
    }

    draw(){
        ctx.fillStyle = this.color;
        Camera.fillRect(this.x,this.y,this.w,this.h);
    }

    collisionHandler(e,ct=[0,0]){
        if(ct[0]!==0&&ct[0]*this.vx>0||ct[1]!==0&&ct[1]*this.vy>0){
            e.giveDamage(Math.floor((this.w * this.h) * this.getVectorLength()*0.02));
        }
        return true;
    }
    removeHandler(){
        let temp = this.w*this.h*0.0001;
        SoundManager.play(SoundManager.blockCrashing, temp);
        return true;
    }
    setMapBlock(type=0){
        this.ga=0;
        this.inv_mass=0;
        this.COR=0;
        this.canRemoved=false;
        this.canAct=false;
        this.canMove=false;
        MAPBLOCKS[type].setup(this);
        this.update=function(){this.draw()};
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