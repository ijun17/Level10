const MonsterSkill={
    /*

    Mushroom

    */
    "pingpong":function(m){m.body.addVel([m.front(5),8])},
    /*
    
    Monkey
    
    */
    "clouddash":function(m){
        m.canDraw=false;
        m.moveModule.moveType=1
        TIME.addSchedule(0,5,0.05,()=>{
            const cloud = WORLD.add(new Particle([m.body.midX-150,m.body.midY-150], [300,300], TYPE.cloud));
            cloud.life=50
        },()=>{return m.getState()==0})
        TIME.addTimer(5,()=>{
            m.canDraw=true;
            m.moveModule.moveType=0
        },()=>{return m.getState()==0})
    },
    "iceshot":function(m){
        let i=0;
        TIME.addSchedule(0,5,0.01,()=>{
            let dir=[Math.cos(Math.PI/10*i), Math.sin(Math.PI/10*i)]
            let ice = m.createMatter(MatterIce,[m.front(dir[0]), dir[1]],dir)
            ice.physics.setGravity(dir,true);
            ice.damage=1000;
            i++;
        },()=>{return m.getState()==0})
    },
    /*
    
    fly
    
    */
    "createslave":(m)=>{
        for(let i=m.slaveList.length; i<m.MAX_SLAVE_COUNT; i++){
            let slave=WORLD.add(new MonsterFly(pos,false));
            slave.setTarget(m.target);
            slave.activateAI();
            slave.addEventListener("remove",()=>{
                for(let i=0; i<m.slaveList.length; i++){
                    if(slave===m.slaveList[i]){
                        m.slaveList.splice(i,1);
                        break
                    }
                }
                return true
            })
            m.slaveList.push(slave);
        }
    },
    "speedup":function(m){
        m.moveModule.moveSpeed=30;
        m.power=666;
        TIME.addSchedule(0.5,0.5,0,function(){
            m.moveModule.moveSpeed=10;
            m.power=66;
        },function(){return m.getState()==0;})
    },
    /*
    
    slime
    
    */
    "hardjump":function(m){m.body.addVel([m.front(5),10])},
    "harddash":function(m){
        if(!m.canTarget())return;
        let b=m.body, tb=m.target.body;
        let vx = tb.midX-b.midX;
        let vy = tb.midY-b.midY;
        let power = 30/Math.sqrt(vx**2+vy**2);
        b.setVel([vx*power, vy*power+1]);
    },
    /*
    
    golem
    
    */
    "teldown":function(e){
        if(!e.canTarget())return;
        let b=e.body, tb=e.target.body;
        b.setPos([tb.midX-b.size[0]/2, tb.midY+700]);
        b.setVel([0,-10]);
        WORLD.add(new Particle([b.midX-100, b.midY-100], [300, 300], TYPE.magicEffect));
        e.power=9999;
        TIME.addSchedule(1,1,0,function(){e.power=4000});
    },
    "frontdash":function(e){
        if(!e.canTarget())return;
        let b=e.body, vel=e.getTargetDirX()*5;
        e.antiMatterFlag=true;
        TIME.addSchedule(0.5, 1, 0, function(){b.vel[0]+=vel;});
        TIME.addSchedule(1, 1, 0, function(){e.antiMatterFlag=false;});
        WORLD.add(new Particle([b.midX-100, b.midY-100], [300, 300], TYPE.magicEffect));
    },
    "TURRET":(m)=>{
        const mx=m.body.midX, my=m.body.midY
        let pos=[[mx, my+400], [mx-400, my+300], [mx+400, my+300]];
        for(let i=0; i<pos.length; i++){
            let effect1 = WORLD.add(new Particle([pos[i][0]-150, pos[i][1]-150], [300, 300], TYPE.magicEffect));
            effect1.life=500;
            let effect2 = WORLD.add(new Particle([pos[i][0]-200, pos[i][1]-200], [400, 400], TYPE.magicEffect));
            effect2.life=500;
        }
        TIME.addSchedule(1,5,0.1,()=>{
            if(!m.canTarget())return;
            for(let i=0; i<pos.length; i++){
                let ene = WORLD.add(new MatterEnergy([pos[i][0] - 25, pos[i][1] - 25], [0, 0]))
                ene.body.setSize([70, 70])
                ene.damage = 2000
                ene.physics.setCOR(0)
                let ga = ene.body.getUnitVector(m.target.body.midPos)
                ene.body.setVel([ga[0] * 10, ga[1] * 10])
                ene.physics.setGravity([ga[0]*2, ga[1]*2], true);
            }
        })
    },
    /*
    
    wyvern
    
    */
    "fireball":function(m){
        if(!m.canTarget())return;
        let fire=m.createMatterToTarget(MatterFire,[1.2,0],10);
        fire.lifeModule.life=500;
        fire.physics.setGravity([0,0],true);
        fire.physics.setCOD(0)
        fire.damage=1000;
        fire.body.setSize([60,60]);
        fire.addEventListener("collision", (e)=>{fire.explode()});
    },
    "explodelain":function(m){
        for(let i=0; i<10; i++){
            (m.createMatter(MatterFire,[2+i*0.4, 2+i*0.1],[0,-30])).life=100;
            (m.createMatter(MatterFire,[2+i*0.4, 1.5+i*0.1],[0,-30])).life=100;
            (m.createMatter(MatterFire,[2+i*0.4, 2.5+i*0.1],[0,-30])).life=100;
        }
    },
    "firetornado":function(m){
        let fires=[];
        let x=m.body.midX;
        let speed=8
        let dir = m.front();
        let pos=m.body.pos
        for(let i=0; i<200; i++){
            let color=`rgba(${255},${(200-i*2>0 ? 200-i*2 : 0)},0,0.4)`//`rgba(255,${(170-i>0 ? 170-i*2 : 0)},0,0.4)`
            let fire=WORLD.add(new Block([pos[0]+i,pos[1]+i],[60,60],color));
            fire.lifeModule.life=10000000;
            fire.id=128743612;
            fire.physics.setCOR(1);
            fire.physics.enableEnvironment=false;
            fires.push(fire);
            fire.eventManager.oncollision=(e)=>{
                if(e.other==m)return false;
                if(e.other.id==128743612)return true;
                if(e.other instanceof Matter && e.other.damageType != TYPE.damageFire){
                    e.other.setState(0);
                    return;
                }
                if(e.other.lifeModule)e.other.lifeModule.giveDamage(1000,TYPE.damageFire);
                e.other.body.setVel([(x-e.other.body.pos[0])*1,0.5+e.other.body.vel[1]]);
                return !(e.other instanceof Actor)
            }
        }
        TIME.addSchedule(0,3,0,function(){
            for(let i=fires.length-1; i>=0; i--)fires[i].body.vel[0]+=(x-fires[i].body.midX);
            x+=speed*dir;
            speed+=0.1;

            SCREEN.renderer.camera.vibrate(10);
        },()=>{return m.getState()==0})
        TIME.addSchedule(3.5,3.5,0,function(){
            for(let i=fires.length-1; i>=0; i--)fires[i].setState(0);
            SCREEN.renderer.camera.vibrate(100);
        },()=>{return m.getState()==0});
        m.addEventListener("remove",()=>{
            for(let i=fires.length-1; i>=0; i--)fires[i].setState(0);
        })
    },
    "firebreath":function(m){
        if(!m.canTarget())return;
        let fires=[];
        let speed = 55
        for(let i=0; i<200; i++){
            let color=`rgba(255,${(255-i*1.5>0 ? 255-i*1.5 : 0)},0,0.4)`
            let fire=WORLD.add(new Block(m.body.midPos,[60,60],color));
            fire.lifeModule.life=100000000;
            fire.id=128743612;
            fire.physics.addForce = ()=>{}
            fire.physics.inv_mass =0.1
            fire.physics.enableEnvironment=false;
            fires.push(fire);
            let dir = fire.body.getUnitVector(m.target.body.midPos)
            fire.body.setVel([dir[0]*speed, dir[1]*speed])
            fire.eventManager.oncollision=(e)=>{
                if(e.other==m)return false;
                if(e.other.id==128743612)return true;
                if(e.other instanceof Matter && e.other.damageType != TYPE.damageFire){
                    e.other.setState(0);
                    return false;
                }
                if(e.other instanceof Matter && e.other.damageType == TYPE.damageFire){
                    return true;
                }   
                if(e.other.lifeModule)e.other.lifeModule.giveDamage(9999,TYPE.damageFire);
                fire.body.setPos(m.body.midPos)
                let dir = fire.body.getUnitVector(m.target.body.midPos)
                fire.body.setVel([dir[0]*speed, dir[1]*speed])
                return true//!(e.other instanceof Actor)
            }
        }
        TIME.addSchedule(0,7,0.1,function(){
            SCREEN.renderer.camera.vibrate(10);
        },()=>{return m.getState()==0})
        TIME.addSchedule(7,7,0,function(){
            for(let i=fires.length-1; i>=0; i--)fires[i].setState(0);
            SCREEN.renderer.camera.vibrate(100);
        },()=>{return m.getState()==0});
        m.addEventListener("remove",()=>{
            for(let i=fires.length-1; i>=0; i--)fires[i].setState(0);
        })
    },
    /*
    
    dragon
    
    */
    "thunder":(m)=>{
        let dir=m.front(60)
        let x=m.body.midX+dir;
        let y=m.body.midY;
        let i=0;
        TIME.addSchedule(0.5, 2, 0.05, () => {
            let ltn = WORLD.add(new MatterLightning([x + dir * i - 150, y-600]));
            ltn.addEventListener("collision", (e) => {
                if (e.other!=m && e.other.skillModule) {
                    const CT=e.other.skillModule.coolTime
                    for (let i = 0; i < CT.length; i++) if (CT[i] < 100) CT[i] = 100
                }
                return true;
            })
            dir*=-1;
            i++;
        },()=>{return m.getState(0)==0})
    },
    "electricball":(m)=>{
        if(!m.canTarget())return;
        let x=m.body.midX;
        let y=m.body.midY;
        let tb=m.target.body;
        let speed=20;
        let dir = m.body.getUnitVector(m.target.body.midPos)
        let vel=[dir[0]*speed, dir[1]*speed];
        let elecs=[];
        for(let i=0; i<100; i++){
            let color=`rgba(255,255,${(200-i*3>0 ? 200-i*3 : 0)},0.4)`
            let elec=WORLD.add(new Block([x+i,y+i],[50,50],color));
            elec.lifeModule.life=100000;
            elec.id=252362436;
            elec.physics.setCOR(1);
            elec.physics.setCOF(0);
            elec.physics.enableEnvironment=false;
            elec.physics.inv_mass=1;
            elecs.push(elec);
            elec.eventManager.oncollision=(e)=>{
                if(e.other==m)return false;
                if(e.other.id==252362436)return true;
                if(e.other.lifeModule)e.other.lifeModule.giveDamage(1000,TYPE.damageElectricity);
                if(e.other instanceof Matter){
                    if(e.other.damageType!==TYPE.damageElectricity)e.other.setState(0);
                    return false;
                }
                e.other.body.setVel([(x-e.other.body.midX),(y-e.other.body.midY)]);
                return !(e.other instanceof Actor)
            }
        }
        TIME.addSchedule(0,2,0,function(){
            for(let i=elecs.length-1; i>=0; i--)elecs[i].body.addVel([x-elecs[i].body.midX, y-elecs[i].body.midY]);
            x+=vel[0];
            y+=vel[1];
            SCREEN.renderer.camera.vibrate(5);
        },()=>{return m.getState()==0})
        TIME.addSchedule(2.1,2.1,0,function(){for(let i=elecs.length-1; i>=0; i--)elecs[i].setState(0);},()=>{return m.getState()==0});
        m.addEventListener("remove",()=>{for(let i=elecs.length-1; i>=0; i--)elecs[i].setState(0);})
    },
    "BLUE":(m)=>{
        let elecs=[];
        for(let i=0; i<100; i++){
            let color=`rgba(${(200-i*3>0 ? 200-i*3 : 0)},${(255-i*3>0 ? 255-i*3 : 0)},255,0.3)`
            let elec=WORLD.add(new Block([m.body.midX+i,m.body.midY+i],[50,50],color));
            elec.lifeModule.life=10000000;
            elec.id=252362436;
            elec.physics.setCOR(1);
            elec.physics.setCOF(0);
            elec.physics.inv_mass=1;
            elec.physics.enableEnvironment=false;
            elecs.push(elec);
            elec.eventManager.oncollision=(e)=>{
                let o=e.other;
                if(o==m)return false;
                if(o.id==252362436)return true;
                if(o instanceof Matter){
                    if(o.damageType!==TYPE.damageElectricity)o.setState(0);
                    return false;
                }
                if(o.lifeModule)o.lifeModule.giveDamage(1000,TYPE.damageElectricity);

                o.body.setVel([(m.body.midX-o.body.midX),(m.body.midY-o.body.midY)]);
                return !(e.other instanceof Actor)
            }
        }
        m.canDraw=false;
        m.canInteract=false;
        m.moveModule.moveSpeed=30;
        TIME.addSchedule(0,4,0,function(){
            let b=m.body;
            for(let i=elecs.length-1; i>=0; i--)
                elecs[i].body.addVel([(b.midX-elecs[i].body.midX), (b.midY-elecs[i].body.midY)]);
        },()=>{return m.getState()==0})
        TIME.addSchedule(4.1,4.1,0,function(){
            for(let elec of elecs)elec.setState(0);
            m.moveModule.moveSpeed=3;
            m.canDraw=true;
            m.canInteract=true;
        },()=>{return m.getState()==0});
        m.addEventListener("remove",()=>{for(let i=elecs.length-1; i>=0; i--)elecs[i].setState(0);})
    }
}