class Particle{
    constructor(pos,size,type){
        super(new UnitBody(pos, size));
        this.setLayer(PARTICLE_LAYER);
        this.interaction=false;
        this.physics=new UnitPhysics();
        PARTICLE_TYPE[type].setStatus(this);
    }
}

const PARTICLE_TYPE=[{name:"ember",setStatus:function(e){e.randomSpeed=1;e.physics.ga=-0.01}},
    {name:"smoke",setStatus:function(e){e.randomSpeed=0.5;e.physics.ga=-0.001}},
    {name:"cloud",setStatus:function(e){e.randomSpeed=0.2;e.physics.ga=0;e.body.size=[200,200];e.life=300}},
    {name:"snow",setStatus:function(e){e.randomSpeed=1;e.physics.ga=0}},
    {name:"ash",setStatus:function(e){e.randomSpeed=1;e.physics.ga=-0.01}},
    {name:"magiceffect",setStatus:function(e){e.randomSpeed=0;e.physics.ga=0}}];