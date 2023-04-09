class Particle extends GameUnit{
    randomSpeed;
    image;
    life;
    constructor(pos,size,type){
        super(new UnitBody(pos, size));
        this.setLayer(PARTICLE_LAYER);
        this.physics=new UnitPhysics();
        PARTICLE_TYPE[type].setStatus(this);
        this.body.addVel([(1-Math.random()*2)*this.randomSpeed,(1-Math.random()*2)*this.randomSpeed])
        this.image=Game.resource.getImage(PARTICLE_TYPE[type].name);
        this.physics.inv_mass=10;
        this.life=100;
    }
    update(){
        if(this.life>0)this.life--;
        else this.state=0;
    }
    draw(r){
        r.drawImage(this.image,this.body);
    }
}

const PARTICLE_TYPE=[{name:"particle_ember",setStatus:function(e){e.randomSpeed=1;}},
    {name:"particle_smoke",setStatus:function(e){e.randomSpeed=0.5;}},
    {name:"particle_cloud",setStatus:function(e){e.randomSpeed=0.2;e.physics.fixedGravity=true;e.body.size=[200,200];e.life=300}},
    {name:"particle_snow",setStatus:function(e){e.randomSpeed=1;e.physics.ga=0}},
    {name:"particle_ash",setStatus:function(e){e.randomSpeed=1;e.physics.ga=-0.01}},
    {name:"particle_magiceffect",setStatus:function(e){e.randomSpeed=0;e.physics.fixedGravity=true;}}];