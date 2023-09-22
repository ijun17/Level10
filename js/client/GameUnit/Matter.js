class Matter extends GameUnit{
    damage=0;
    damageType;
    lifeModule;
    constructor(pos,size,vel,damage,damageType){
        super(new UnitBody(pos, size));
        this.body.setVel(vel);
        this.body.overlap=true;
        this.physics=new UnitPhysics();
        this.physics.inv_mass=1;
        this.damage=damage;
        this.damageType=damageType;
        this.addEventListener("collision", this.oncollision)
        this.lifeModule=new GameUnitLifeModule(50,0,0);
        this.lifeModule.update=function(){if(this.life--<0)this.ondie();}
        this.lifeModule.giveDamage=function(d,dt){if(this.ondamage(d,dt))this.life--;}
        this.lifeModule.ondie=function(){this.setState(0)}.bind(this);
    }
    update(){
        this.lifeModule.update();
    }
    oncollision(){}
}

class MatterFire extends Matter{
    animation;
    isExploded=false;
    constructor(pos,vel){
        super(pos,[30,30],vel,500,TYPE.damageFire);
        this.animation=new UnitAnimation(Game.resource.getImage("matter_fire"), 10,10,[3],function(){return 0})
        this.lifeModule.ondamage=function(damage,damageType){
            switch(damageType){
                case TYPE.damageIce:
                    this.setState(0);
                    return false;
                case TYPE.damageFire:
                    this.explode();
                    return false;
                default:
                    return true;
            }
        }.bind(this)
    }
    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body,{rotate:Math.atan2(this.body.vel[0], this.body.vel[1])});}
    oncollision(event){
        let other=event.other;
        if(other.lifeModule){other.lifeModule.giveDamage(this.damage,this.damageType);}
    }
    explode(){
        if(this.isExploded)return;
        this.isExploded=true;
        const BEFORE_SIZE=this.body.size[0]
        this.body.addPos([-BEFORE_SIZE-5, -BEFORE_SIZE-5])
        this.body.setSize([BEFORE_SIZE*3+10,BEFORE_SIZE*3+10])
        this.body.setVel([0,0])
        this.body.fixedPos=true;
        this.damage=3000
        this.image=Game.resource.getImage("matter_explosion");
        this.physics.setGravity([0,0],true);
        //this.physics.inv_mass=0;
        SCREEN.renderer.camera.vibrate(40);
        this.lifeModule.setLife(50)
        this.lifeModule.ondamage=function(d,dt){return false;}
        this.draw=(r)=>{r.drawImage(this.image,this.body);}
        this.oncollision=(event)=>{
            const o=event.other
            if(o.lifeModule)o.lifeModule.giveDamage(this.damage,this.damageType);
            if(o.physics)o.physics.addForce([(o.body.midX-this.body.midX)*0.01,(o.body.midY-this.body.midY)*0.01]);
        }
    }
}

class MatterIce extends Matter{
    image;
    constructor(pos,vel){
        super(pos,[30,30],vel,500,TYPE.damageIce);
        this.image=Game.resource.getImage("matter_ice");
        this.physics.setCOF(0);
        this.lifeModule.ondamage=(damage,damageType)=>{
            if(damageType===TYPE.damageFire){
                this.setState(0);
                WORLD.add(new Particle([this.body.midX-100,this.body.midY-100], [200,200], TYPE.cloud));
                WORLD.add(new Particle([this.body.midX-100,this.body.midY-100], [200,200], TYPE.cloud));
                return false;
            }
            return true;
        }
    }
    draw(r){r.drawImage(this.image,this.body,{rotate:Math.atan2(this.body.vel[0], this.body.vel[1])});}
    oncollision(event){
        if(event.other.lifeModule)event.other.lifeModule.giveDamage(this.damage,this.damageType);
        if(event.other.statusEffectModule)event.other.statusEffectModule.set(event.other,TYPE.iceEffect,1,1)
    }
}

class MatterElectricity extends Matter{
    animation;
    electricPoint=0;
    constructor(pos,vel){
        super(pos,[30,30],vel,200,TYPE.damageElectricity);
        this.animation=new UnitAnimation(Game.resource.getImage("matter_electricity"), 10,10,[3],function(){return 0})
        this.physics.fixedGravity=true;
        this.physics.setGravity([0,0]);
        this.lifeModule.ondamage=(d,dt)=>{
            if(dt == TYPE.damageElectricity)return false
            return true
        }
    }
    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body);}
    oncollision(event){
        let other=event.other;
        if(other.lifeModule)other.lifeModule.giveDamage(this.damage,this.damageType);
        if(other instanceof MatterElectricity){
            if(this.electricPoint>=other.electricPoint)this.electricPoint++;
            else this.electricPoint=0;
            if(this.electricPoint>10000 && this.getState()!=0){
                WORLD.add(new MatterLightning([this.body.midX-150,this.body.midY]));
                this.setState(0);
            }
        }else this.electricPoint=0;
        other.body.setVel([0,0])
        return false;
    }
}

class MatterArrow extends Matter{
    image;
    constructor(pos,vel){
        super(pos,[30,30],vel,500,TYPE.damageEnergy);
        this.image=Game.resource.getImage("matter_arrow")
        this.physics.inv_mass*=0.5;
        this.physics.setCOR(0.3)
    }
    draw(r){r.drawImage(this.image,this.body,{rotate:Math.atan2(this.body.vel[0], this.body.vel[1])});}
    oncollision(event){
        let relVel=event.other.body.getRelativeVel(this.body);
        let damage=(relVel[0]**2+relVel[1]**2)*2;
        if(event.other.lifeModule)event.other.lifeModule.giveDamage(this.damage+damage,this.damageType);
    }
}

class MatterEnergy extends Matter{
    image;
    constructor(pos,vel){
        super(pos,[30,30],vel,500,TYPE.damageEnergy);
        this.image=Game.resource.getImage("matter_energy")
        this.physics.setGravity([0,0],true);
        this.physics.inv_mass=0.1
        this.physics.setCOR(0.5)

    }
    draw(r){r.drawImage(this.image,this.body);}
    oncollision(event){
        if(event.other.lifeModule)event.other.lifeModule.giveDamage(this.damage,this.damageType);
        SCREEN.renderer.camera.vibrate(5);
    }
}

class MatterWind extends Matter{
    image;
    constructor(pos,vel){
        super(pos,[0,0],vel,0,TYPE.damageWind);
        let w=(this.body.vel[0]*this.body.vel[0]+this.body.vel[1]*this.body.vel[1])*0.1+30;
        this.body.setSize([w,w])
        this.image=Game.resource.getImage("matter_wind")
        this.physics.fixedGravity=true;
        this.physics.setGravity([0,0]);
        this.physics.inv_mass=0.1;
        this.physics.setCOR(0);
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


// class MatterExplosion extends Matter{
//     image;
//     constructor(pos){
//         super(pos,[100,100],[0,0],3000,TYPE.damageFire);
//         this.image=Game.resource.getImage("matter_explosion");
//         this.physics.setGravity([0,0],true);
//         this.physics.inv_mass=0;
//         SCREEN.renderer.camera.vibrate(30);
//         this.lifeModule.ondamage=function(d,dt){return false;}
//     }
//     draw(r){r.drawImage(this.image,this.body);}
//     oncollision(event){
//         if(event.other.lifeModule)event.other.lifeModule.giveDamage(this.damage,this.damageType);
//         if(event.other.physics)event.other.physics.addForce([(event.other.body.midX-this.body.midX)*0.01,(event.other.body.midY-this.body.midY)*0.01]);
//     }
// }

class MatterLightning extends Matter{
    animation;
    constructor(pos){
        super(pos,[300,1200],[0,0],10000,TYPE.damageElectricity);
        this.animation=new UnitAnimation(Game.resource.getImage("matter_lightning"), 100,400,[3],function(){return 0})
        this.animation.fps=16;
        this.body.fixedPos=true;
        this.physics.fixedGravity=true;
        this.physics.setGravity([0,0]);
        this.lifeModule.ondamage=(d,dt)=>{return false}
    }
    update(){
        super.update();
        SCREEN.renderer.camera.vibrate(20);
    }
    draw(r){r.drawAnimation(this.animation,this.body);}
    oncollision(event){
        if(this.getState()==0)return false;
        if(event.other instanceof MatterElectricity){
            event.other.setState(0);
            this.damage+=event.other.damage;
            this.life++;
        }
        if(event.other.lifeModule)event.other.lifeModule.giveDamage(this.damage,this.damageType);
        return false;
    }
}