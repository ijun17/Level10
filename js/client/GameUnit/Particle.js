class Particle extends GameUnit{
    randomSpeed=1;
    image;
    life;
    constructor(pos,size,type){
        super(new UnitBody(pos, size));
        this.setLayer(PARTICLE_LAYER);
        this.physics=new UnitPhysics();
        this.physics.inv_mass=10;
        this.physics.setCOD(0.2);
        this.life=100;
        PARTICLE_TYPE[type].setStatus(this);
        this.body.addVel([(1-Math.random()*2)*this.randomSpeed,(1-Math.random()*2)*this.randomSpeed])
        this.image=Game.resource.getImage(PARTICLE_TYPE[type].name);
        
    }
    update(){
        if(this.life--<0)this.state=0;
    }
    draw(r){
        r.drawImage(this.image,this.body);
    }
}

const PARTICLE_TYPE=[{name:"particle_ember",setStatus:(e)=>{e.randomSpeed=1;}},
    {name:"particle_smoke",setStatus:(e)=>{e.randomSpeed=0.5;}},
    {name:"particle_cloud",setStatus:(e)=>{e.randomSpeed=1;e.physics.fixedGravity=true;e.life=300}},
    {name:"particle_snow",setStatus:(e)=>{e.randomSpeed=1;e.physics.ga=0;e.physics.setCOD(0.5);}},
    {name:"particle_ash",setStatus:(e)=>{e.randomSpeed=1;e.physics.ga=-0.01}},
    {name:"particle_magic_effect",setStatus:(e)=>{e.randomSpeed=0;e.physics.fixedGravity=true;}},
    {name:"particle_firefly",setStatus:(e)=>{e.randomSpeed=1;e.physics.ga=0;e.physics.setCOD(0.5);}},
    {name:"particle_spark",setStatus:(e)=>{e.randomSpeed=1;e.physics.ga=0;e.physics.setCOD(0.5);}}
];