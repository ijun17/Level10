class Block extends Entity{
    color;
    //brokenSound=new Audio();
    constructor(x,y,w,h,color = "#080808",channelLevel=Game.PHYSICS_CHANNEL){
        super(x,y,channelLevel);
        this.w=w;
        this.h=h;
        this.color = color;
        this.overlap=false;
        this.life=w*h*10;
        this.COR=1;
        this.inv_mass=20/(w*h);
        
    }

    draw(){
        ctx.fillStyle = this.color;
        Camera.fillRect(this.x,this.y,this.w,this.h);
    }

    collisionHandler(e,ct=[0,0]){
        if(!(e instanceof MapBlock)&&(ct[0]!==0&&ct[0]*this.vx>0||ct[1]!==0&&ct[1]*this.vy>0)){
            var damage = (Math.floor((this.w * this.h) * this.getVectorLength()) / 50);
            e.giveDamage(Math.floor(damage));
        }
        return true;
    }
    removeHandler(){
        let temp = this.w*this.h/10000  //Math.sqrt(Math.sqrt((Game.p.getX()-this.getX())**2+(Game.p.getY()-this.getY())**2))
        SoundManager.play(SoundManager.blockCrashing, temp);
        return true;
    }
}