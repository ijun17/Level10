const particleTypes=[{name:"ember",setStatus:function(e){e.speed=1;e.ga=-0.01}},
    {name:"smoke",setStatus:function(e){e.speed=0.5;e.ga=-0.001}},
    {name:"cloud",setStatus:function(e){e.speed=0.2;e.ga=0;e.w=200;e.h=200;e.life=300}},
    {name:"snow",setStatus:function(e){e.speed=1;e.ga=-0.01}},
    {name:"ash",setStatus:function(e){e.speed=1;e.ga=-0.01}},
    {name:"magiceffect",setStatus:function(e){e.speed=0;e.ga=0}}];
    

class Particle extends Entity{
    img;
    type;
    speed;
    constructor(typeNum,x,y,channelLevel=Game.PARTICLE_CHANNEL){
        super(x,y,channelLevel);
        this.type=particleTypes[typeNum];
        this.w=10;
        this.h=10;
        this.life=50;
        this.img=ImageManager[this.type.name];
        this.type.setStatus(this);
        this.vx=(1-Math.random()*2)*this.speed;
        this.vy=(1-Math.random()*2)*this.speed;
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