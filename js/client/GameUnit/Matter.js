class Matter extends GameUnit{
    damage=0;
    damageType;
    lifeModule;
    constructor(pos,size,vel,damage,damageType){
        super(new UnitBody(pos, size));
        this.body.setVel(vel);
        this.body.overlap=true;
        this.physics=new UnitPhysics();
        this.physics.inv_mass=901/(size[0]*size[1]+1);
        this.damage=damage;
        this.damageType=damageType;
        this.addEventListener("collision", this.oncollision)
        this.lifeModule=new GameUnitLifeModule(50,0,0);
        this.lifeModule.update=function(){this.giveDamage();}
        this.lifeModule.giveDamage=function(){if(this.life>0)this.life--;else this.ondie();}
        this.lifeModule.ondie=function(){this.setState(0)}.bind(this);
    }
    update(){
        this.lifeModule.update();
    }
    oncollision(){}
}

class MatterFire extends Matter{
    animation;
    constructor(pos,vel){
        super(pos,[30,30],vel,500,TYPE.damageFire);
        this.animation=new UnitAnimation(Game.resource.getImage("matter_fire"), 10,10,[3],function(){return 0})
    }
    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body,{rotate:Math.atan2(this.body.vel[0], this.body.vel[1])});}
    oncollision(event){
        let other=event.other;
        if(other.lifeModule){
            other.lifeModule.giveDamage(this.damage,this.damageType);
        }
        if(other.physics)other.physics.addForce([0,0]);
    }
}

class MatterIce extends Matter{
    image;
    constructor(pos,vel){
        super(pos,[30,30],vel,500,TYPE.damageIce);
        this.image=Game.resource.getImage("matter_ice");
        this.physics.setCOF(0);
    }
    draw(r){r.drawImage(this.image,this.body,{rotate:Math.atan2(this.body.vel[0], this.body.vel[1])});}
    oncollision(event){
        if(event.other.lifeModule)event.other.lifeModule.giveDamage(this.damage,this.damageType);
        if(event.other.physics)event.other.physics.addForce([0,0]);
    }
}

class MatterElectricity extends Matter{
    animation;
    constructor(pos,vel){
        super(pos,[30,30],vel,500,TYPE.damageElectricity);
        this.animation=new UnitAnimation(Game.resource.getImage("matter_electricity"), 10,10,[3],function(){return 0})
        //this.physics.fixedGravity=true;
        //this.physics.setGravity([0,0])
    }
    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body);}
    oncollision(event){
        let other=event.other;
        if(other.lifeModule)other.lifeModule.giveDamage(this.damage,this.damageType);
        other.body.setVel([other.body.vel[0]*0.5,other.body.vel[1]*0.5]);
        return false;
    }
}

class MatterArrow extends Matter{
    image;
    constructor(pos,vel){
        super(pos,[30,30],vel,500,TYPE.damageNormal);
        this.image=Game.resource.getImage("matter_arrow")
    }
    draw(r){r.drawImage(this.image,this.body,{rotate:Math.atan2(this.body.vel[0], this.body.vel[1])});}
    oncollision(event){
        let relVel=this.body.getRelativeVel(event.other.body);
        let damage=(relVel[0]**2+relVel[1]**2)*10;
        if(event.other.lifeModule)event.other.lifeModule.giveDamage(this.damage+damage,this.damageType);
        //if(event.other.physics)event.other.physics.addForce(relVel);
    }
}

class MatterEnergy extends Matter{
    image;
    constructor(pos,vel){
        super(pos,[30,30],vel,500,TYPE.damageNormal);
        this.image=Game.resource.getImage("matter_energy")
    }
    draw(r){r.drawImage(this.image,this.body);}
    oncollision(event){
        if(event.other.lifeModule)event.other.lifeModule.giveDamage(this.damage,this.damageType);
        if(event.other.physics)event.other.physics.addForce([0,0]);
    }
}

class MatterWind extends Matter{
    image;
    constructor(pos,vel){
        super(pos,[0,0],vel,0,TYPE.damageNormal);
        let w=(this.body.vel[0]*this.body.vel[0]+this.body.vel[1]*this.body.vel[1])*0.1+30;
        this.body.setPos([w,w])
        this.image=Game.resource.getImage("matter_wind")
        this.physics.fixedGravity=true;
        this.physics.setGravity([0,0]);
        this.physics.inv_mass=0.1;
    }
    update(){
        super.update();
        if(this.body.vel[0]==0&&this.body.vel[1]==0)this.setState(0);
    }
    draw(r){r.drawImage(this.image,this.body,{rotate:Math.atan2(this.body.vel[0], this.body.vel[1])});}
    oncollision(event){
        let relVel=event.other.body.getRelativeVel(this.body);
        if(event.other.lifeModule)event.other.lifeModule.giveDamage(this.damage,this.damageType);
        if(event.other.physics)event.other.physics.addForce(relVel);
    }
}


class MatterExplosion extends Matter{
    image;
    constructor(pos){
        super(pos,[100,100],vel,1000,TYPE.damageFire);
        this.image=Game.resource.getImage("matter_explosion");
        this.physics.fixedGravity=true;
        this.physics.setGravity([0,0]);
        this.physics.inv_mass=0;
        this.life=50;
    }
    draw(r){r.drawImage(this.image,this.body);}
    oncollision(event){
        if(event.other.lifeModule)event.other.lifeModule.giveDamage(this.damage,this.damageType);
        if(event.other.physics)event.other.physics.addForce([0,0]);
    }
}

class MatterLightning extends Matter{
    image;
    constructor(pos){
        super(pos,[100,400],vel,1000,TYPE.damageElectricity);
        this.image=Game.resource.getImage("matter_lightning");
        this.physics.fixedGravity=true;
        this.physics.setGravity([0,0]);
        this.physics.inv_mass=0;
        this.life=50;
    }
    draw(r){r.drawImage(this.image,this.body);}
    oncollision(event){
        if(event.other.lifeModule)event.other.lifeModule.giveDamage(this.damage,this.damageType);
        if(event.other.physics)event.other.physics.addForce([0,0]);
    }
}