class Particle extends Entity{
    static types=[{name:"ember",speed:1,ga:-0.01},
    {name:"spark",speed:1,ga:-0.01},
    {name:"smoke",speed:0.5,ga:-0.001}];
    static particleDir="resource/particle/";
    type;
    constructor(typeNum,x,y){
        super(x,y);
        this.type=Particle.types[typeNum];
        this.w=10;
        this.h=10;
        this.canAct=false;
        this.ga=this.type.ga;
        this.life=50;
        this.collisionLevel=-4;
        this.img.src=Particle.particleDir+this.type.name+".png";
        this.vx=(1-Math.random()*2)*this.type.speed;
        this.vy=(1-Math.random()*2)*this.type.speed;
    }

    update(){
        this.life--;
        //draw
        ctx.drawImage(this.img, this.x-5, this.y-5);
        //move
        this.x+=this.vx;
        this.y-=this.vy;
        this.vy+=this.ga;
        //remove
        if(this.life<1)this.removeEntity();
    }
}