const particleTypes=[{name:"ember",speed:1,ga:-0.01},
    {name:"smoke",speed:0.5,ga:-0.001},
    {name:"spark",speed:1,ga:-0.01},
    {name:"snow",speed:1,ga:-0.01},
    {name:"ash",speed:1,ga:-0.01},
    {name:"magiceffect",speed:0,ga:0}];
    

class Particle extends Entity{
    img=new Image();
    type;
    constructor(typeNum,x,y,channelLevel=Game.PARTICLE_CHANNEL){
        super(x,y,channelLevel);
        this.type=particleTypes[typeNum];
        this.w=10;
        this.h=10;
        this.ga=this.type.ga;
        this.life=50;
        this.img.src="resource/particle/"+this.type.name+".png";
        this.vx=(1-Math.random()*2)*this.type.speed;
        this.vy=(1-Math.random()*2)*this.type.speed;
    }

    update(){
        this.draw();
        this.life--;
        this.x+=this.vx;
        this.y-=this.vy;
        this.vy+=this.ga;
    }
    draw(){
        Camera.drawImage(this.img, this.x,this.y,this.w,this.h);
    }
}