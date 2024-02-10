class Monster extends Actor{
    target=null;
    power=0;
    attackTick=0;
    statusBarInfo;

    ai_move_cycle=0.5;
    ai_skill_cycle=0.3;
    
    constructor(pos,size,power=0,moveModule,lifeModule,skillModule){
        super(pos,size,moveModule,lifeModule,skillModule);
        this.power=power;
        this.addEventListener("collision", function(e){if(this.canAttack(e.other))this.attack(e.other);})
        this.addEventListener("remove", function(e){
            let b=this.body;
            for(let i=b.size[0]/20; i>=0; i--){
                for(let j=b.size[1]/20; j>=0; j--){
                    let par = WORLD.add(new Particle([b.pos[0] + i * 20, b.pos[1] + j * 20],[15,15],TYPE.ash));
                    par.physics.setGravity([0,0],true);
                }
            }
            SCREEN.renderer.camera.vibrate(50);
        })

        
    }
    update(){
        super.update();
        if(this.attackTick>0)this.attackTick--;
    }
    canAttack(unit){
        if(unit==this.target || unit instanceof Block || unit instanceof Matter)return true;
        else if(this.target==null)this.searchTarget()
        return false;
    }
    attack(unit){
        unit.lifeModule.giveDamage(this.power);
        if(this.animation)this.attackTick = this.animation.fps*this.animation.MAX_X[1];
        let knockback=(unit.body.midX > this.body.midX?1:-1)*((this.power+1000)>>9);
        if(Math.abs(unit.body.vel[0]) < Math.abs(knockback))
            unit.physics.addForce([knockback,0.5]);
    }
    setTarget(target){this.target=target}
    canTarget(){return (this.target!=null&&this.target.canDraw&&this.target.lifeModule.life>0)}
    searchTarget(){
        let layer=WORLD.layer[PHYSICS_LAYER].gameUnitList;
        for(let i=layer.length-1; i>=0; i--){
            if(layer[i] instanceof Player){
                this.setTarget(layer[i]);
                break;
            }
        }
    }
    getTargetDirX(unit=this.target){
        if(this.canTarget())return (this.body.midX < unit.body.midX ? 1 : -1);
        else return (Math.random()>0.5 ? 1 : -1);
    }
    getTargetDirY(unit=this.target){
        if(this.canTarget())return (this.body.midY < unit.body.midY ? 1 : -1);
        else return (Math.random()>0.5 ? 1 : -1);
    }
    front(n=1){return (this.moveModule.moveDirection[0]?n:-n)}
    createMatterToTarget(MatterClass,dir,power){
        let b=this.body, tb=this.target.body;
        let matter_x = b.midX+((b.size[0]>>1)+15)*dir[0]*this.getTargetDirX()-15;
        let matter_y = b.midY+((b.size[1]>>1)+15)*dir[1]*this.getTargetDirY()-15;
        let matter_vx = tb.midX-matter_x;
        let matter_vy = tb.midY-matter_y;
        let vector_length = Math.hypot(matter_vx, matter_vy);
        return  WORLD.add(new MatterClass([matter_x, matter_y], [matter_vx*power/vector_length, matter_vy*power/vector_length]));
    }
    createMatter(MatterClass,dir,vel){
        let matter_x = this.body.midX+((this.body.size[0]>>1)+15)*dir[0]*(this.moveModule.moveDirection[0]?1:-1)-15;
        let matter_y = this.body.midY+((this.body.size[1]>>1)+15)*dir[1]-15;
        return  WORLD.add(new MatterClass([matter_x, matter_y],vel));
    }
    activateAI(){
        TIME.addSchedule(0,undefined,this.ai_move_cycle,function(){this.moveAI();}.bind(this),function(){return this.getState()==0}.bind(this))
        TIME.addSchedule(0,undefined,this.ai_skill_cycle,function(){this.skillAI();}.bind(this),function(){return this.getState()==0}.bind(this))
    }
    moveAI() {
        this.moveModule.keyDownHandler(this.getTargetDirX()==1 ? 0 : 1);
        if(Math.random()<0.05)this.moveModule.moveDirection[0]=!this.moveModule.moveDirection[0];
        
        if(this.moveModule.moveType==0)this.moveModule.keyDownHandler(2);
        else{
            this.moveModule.keyDownHandler(this.getTargetDirY()==1 ? 2 : 3);
            if(Math.random()<0.05)this.moveModule.moveDirection[1]=!this.moveModule.moveDirection[1]
        }
    }
    skillAI(){
        for(let i=0; i<this.skillModule.getSkillCount(); i++){
            if(this.skillModule.castSkill(this,i))break;
        }
    }
    renderStatusBar(name,pos,stopCondition=()=>{return false}){
        const perX=SCREEN.perX.bind(SCREEN);
        const perY=SCREEN.perY.bind(SCREEN);
        const sbx=pos[0];
        const sby=pos[1];
        this.statusBarInfo={
            draw:true,
            name:name,
            pos:[sbx,sby],
            backgroundBody: {pos:[sbx,sby], size:[perX(40),perX(7.5)]},
            strokeHPBody: {pos:[sbx+perX(1),sby+perX(1)],size:[perX(38), perX(3)]},
            playerNameBody: {pos:[sbx+perX(1),sby+perX(6.5)],size:[0,0]},
            playerNameFont: "bold " + perX(1.8) + "px Arial",
            hpTextFont: perX(1.4) + "px Arial",
            fillHPTextBody: {pos:[sbx+perX(1.5),sby+perX(3)],size:[0,0]}
        };
        TIME.addSchedule(0,undefined,undefined,function(){this.drawStatusBar(SCREEN.renderer)}.bind(this),stopCondition)
    }
    drawStatusBar(r) {
        const perX=SCREEN.perX.bind(SCREEN);
        const perY=SCREEN.perY.bind(SCREEN);
        const SBI=this.statusBarInfo;
        const DRAW_OPTION = {cameraOn:false};

        let fillHPBody = {pos:SBI.strokeHPBody.pos, size:[perX(38) * (this.lifeModule.life / this.lifeModule.MAX_LIFE), perX(3)]}

        r.ctx.lineWidth = 3;
        r.fillRect("rgba(0,0,0,0.2)",SBI.backgroundBody,DRAW_OPTION);
        r.strokeRect("white",SBI.strokeHPBody,DRAW_OPTION);
        r.fillRect("DarkSlateBlue",fillHPBody,DRAW_OPTION);
        r.ctx.textBaseline = "top";
        r.ctx.textAlign = "left";
        r.ctx.font = SBI.playerNameFont;
        r.ctx.fillStyle = "white";
        r.fillText(SBI.name, SBI.playerNameBody,DRAW_OPTION);
        r.ctx.font = SBI.hpTextFont;
        r.fillText(this.lifeModule.life, SBI.fillHPTextBody,DRAW_OPTION);
    }
}









class MonsterMushroom extends Monster{
    animation
    constructor(pos){
        super(pos,[180,180],500,new GameUnitMoveModule(0,3,3), new GameUnitLifeModule(100000,50,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("jump",function(m){m.body.addVel([m.front(5),8])},500))

        this.physics.setCOR(0.6)
        this.animation=new UnitAnimation(IMAGES.monster_mushroom,60,60,[3, 3],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.animation.fps=16;
        this.body.overlap=true;
        this.physics.inv_mass=0.2;

    }
    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]})}   
}








class MonsterMonkey extends Monster{
    animation
    constructor(pos){
        super(pos,[120,200],1000,new GameUnitMoveModule(0,10,4), new GameUnitLifeModule(1000000,50,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("cloud",function(m){
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
        },700))
        this.skillModule.addSkill(new MagicSkill("iceshot", function (m) {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    let ice = m.createMatter(MatterIce,[m.front(i*0.1),2-j*0.1],[0,-80])
                    ice.damage=500;
                    ice.body.setSize([40,40])
                    ice.lifeModule.setLife(600)
                    ice.physics.setCOR(1)
                }
            }
        },1500))
        this.skillModule.addSkill(new MagicSkill("ice",function(m){
            let i=0;
            TIME.addSchedule(0,4,0.01,()=>{
                let dir=[Math.cos(Math.PI/10*i), Math.sin(Math.PI/10*i)]
                let ice = m.createMatter(MatterIce,[m.front(dir[0]), dir[1]],dir)
                ice.physics.setGravity(dir,true);
                ice.damage=1000;
                ice.body.setSize([40,40])
                i++;
            },()=>{return m.getState()==0})
        },2100))
        
        this.ai_move_cycle=0.1
        this.animation=new UnitAnimation(IMAGES.monster_monkey,120,200,[1, 1],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.animation.fps=16;
        this.body.overlap=true;
        this.physics.inv_mass=0.05;

        this.lifeModule.ondamage=(d,dt)=>{return dt!=TYPE.damageIce;}
        this.statusEffectModule.oneffect=(type)=>{return TYPE.iceEffect!=type}
    }
    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]})}   
}








class MonsterFly extends Monster{
    animation;
    isMaster;
    slaveList=[];
    MAX_SLAVE_COUNT=66;
    constructor(pos,isMaster=true){
        super(pos,[30,30],66,new GameUnitMoveModule(1,10), new GameUnitLifeModule(100000,100,5), new GameUnitSkillModule(0));
        if(isMaster)this.skillModule.addSkill(new MagicSkill("SLAVE",(m)=>{
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
        },20000))
        this.skillModule.addSkill(new MagicSkill("speedup",function(m){
            m.moveModule.moveSpeed=30;
            m.power=666;
            TIME.addSchedule(1,1,0,function(){
                m.moveModule.moveSpeed=10;
                m.power=66;
            },function(){return m.getState()==0;})
        },800))
        this.body.overlap=true;
        this.physics.inv_mass=0.5;
        this.ai_move_cycle=0.04;
        this.physics.setCOR(0.2);
        this.physics.setCOF(0);
        this.animation=new UnitAnimation(IMAGES.monster_hellfly,30,30,[1, 1],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.isMaster=isMaster;

        this.addEventListener("remove",()=>{
            for(let m of this.slaveList)m.setState(0)
        })
        this.lifeModule.ondamage=(d,dt)=>{
            if(this.slaveList.length>0){
                this.slaveList[0].lifeModule.giveDamage(d,dt)
                return false
            }
            return true
        }
    }
    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]})} 
    setTarget(target){
        super.setTarget(target);
        if(this.isMaster)for(let s of this.slaveList)s.setTarget(target);
    }
}








class MonsterSlime extends Monster{
    slaveList=[];
    phase=1;
    constructor(pos){
        super(pos,[160,160],1000,new GameUnitMoveModule(0,4,4), new GameUnitLifeModule(2000000,50,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("jump",function(m){m.body.addVel([m.front(5),10])},500))
        this.skillModule.addSkill(new MagicSkill("dash",function(m){
            if(!m.canTarget())return;
            let b=m.body, tb=m.target.body;
            let vx = tb.midX-b.midX;
            let vy = tb.midY-b.midY;
            let power = 30/Math.sqrt(vx**2+vy**2);
            b.setVel([vx*power, vy*power+1]);
        },1000))
        this.physics.inv_mass=0.0001;
        this.physics.setCOR(0.8)
        let slaveSize=45;
        for(let i=0; i<10; i++)for(let j=0; j<10; j++){
            let block = WORLD.add(new Block([this.body.pos[0]+i,this.body.pos[1]+j],[slaveSize,slaveSize],`rgba(0,0,0,0.7)`))
            this.slaveList.push(block);
            block.lifeModule.defense=1000000;
            block.physics.enableEnvironment=false;
            block.physics.inv_mass=1;
            block.physics.setCOF(0);
            block.eventManager.oncollision=function(e){
                if(this.canAttack(e.other))e.other.lifeModule.giveDamage(666);
                return true;
            }.bind(this)
        }
        this.addEventListener("remove",function(){
            let midX=this.body.midX;
            let midY=this.body.midY;
            for(let slave of this.slaveList){
                slave.body.addVel([(midX-slave.body.midX),(midY-slave.body.midY)])
            } 
            TIME.addSchedule(2,2,undefined,function(){
                for(let slave of this.slaveList){
                    slave.setState(0)
                }
            }.bind(this))
            return true;
        })
    }
    update(){
        super.update();
        let midX=this.body.midX;
        let midY=this.body.midY;
        for(let slave of this.slaveList){
            slave.body.addVel([(midX-slave.body.midX)*0.01,(midY-slave.body.midY)*0.01])
        } 
        if(this.phase==1 && this.lifeModule.life<this.lifeModule.MAX_LIFE*0.5){ //PHASE 2
            this.phase=2;
            for(let slave of this.slaveList)slave.physics.setCOR(0.8);
            this.moveModule.moveType=1;
            this.moveModule.moveSpeed=10;
        }
    }
    draw(r){r.fillRect("maroon", this.body)}
}








class MonsterGolem extends Monster{
    animation;
    phase=1;
    antiMatterFlag=false;//투사체삭제모드
    invincible=false;//무적모드
    constructor(pos){
        super(pos,[300,300],4000,new GameUnitMoveModule(0,1,2), new GameUnitLifeModule(5000000,100,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("down",function(e){
            if(!e.canTarget())return;
            let b=e.body, tb=e.target.body;
            b.setPos([tb.midX-b.size[0]/2, tb.midY+700]);
            b.setVel([0,-15]);
            WORLD.add(new Particle([b.midX-100, b.midY-100], [300, 300], TYPE.magicEffect));
            e.power=9999;
            TIME.addSchedule(1,1,0,function(){e.power=4000});
        },501));
        this.skillModule.addSkill(new MagicSkill("front",function(e){
            if(!e.canTarget())return;
            let b=e.body, vel=e.getTargetDirX()*6;
            e.antiMatterFlag=true;
            TIME.addSchedule(0.5, 1, 0, function(){b.vel[0]+=vel;});
            TIME.addSchedule(1, 1, 0, function(){e.antiMatterFlag=false;});
            WORLD.add(new Particle([b.midX-100, b.midY-100], [300, 300], TYPE.magicEffect));
        },888));

        this.addEventListener("collision", function(e){if(this.antiMatterFlag && e.other instanceof Matter)e.other.setState(0);})
        this.lifeModule.ondamage=(d,dt)=>{return !this.invincible&&dt!=TYPE.damageEnergy;}
        this.animation=new UnitAnimation(IMAGES.monster_golem,128,128,[4, 2],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.animation.fps=32;
        this.body.overlap=false;
        this.physics.inv_mass=0.0001;
        this.physics.setGravity([0,-0.5]);
        this.physics.fixedGravity=true;
    }

    update(){
        super.update();
        this.animation.update();
        if(this.phase==1 && this.lifeModule.life<this.lifeModule.MAX_LIFE*0.5){ //PHASE 2
            this.phase=2;
            this.skillModule.addSkill(new MagicSkill("TURRET",(m)=>{
                const x=m.body.pos[0], y=m.body.pos[1];
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
                        ene.lifeModule.setLife(300)
                        ene.body.setSize([80, 80])
                        ene.damage=3000
                        let ga = ene.body.getUnitVector(m.target.body.midPos)
                        ene.body.setVel([ga[0] * 10, ga[1] * 10])
                        ene.physics.setGravity([ga[0]*2, ga[1]*2], true);
                    }
                })

                this.invincible=true;
                TIME.addTimer(5,()=>{this.invincible=false;})

                TIME.addSchedule(0,5,undefined,()=>{
                    this.body.setPos([x,y])
                })
                
            },1300))
        }
    }
    draw(r){r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]})}   
}








class MonsterWyvern extends Monster{
    phase=1
    animation
    constructor(pos){
        super(pos,[400,400],1000,new GameUnitMoveModule(1,3), new GameUnitLifeModule(10000000,100,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("FIRE BALL",function(m){
            if(!m.canTarget())return;
            let fire=m.createMatterToTarget(MatterFire,[1.2,0],10);
            fire.lifeModule.life=500;
            fire.physics.setGravity([0,0],true);
            fire.physics.setCOD(0)
            fire.damage=1000;
            fire.body.setSize([60,60]);
            fire.addEventListener("collision", (e)=>{fire.explode()});
        },80))
        this.skillModule.addSkill(new MagicSkill("EXPLS",function(m){
            for(let i=0; i<10; i++){
                (m.createMatter(MatterFire,[2+i*0.4, 2+i*0.1],[0,-30])).life=100;
                (m.createMatter(MatterFire,[2+i*0.4, 1.5+i*0.1],[0,-30])).life=100;
                (m.createMatter(MatterFire,[2+i*0.4, 2.5+i*0.1],[0,-30])).life=100;
            }
        },500))
        this.skillModule.addSkill(new MagicSkill("FIRETORNADO",function(m){
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
                    e.other.body.setVel([(x-e.other.body.pos[0])*1,1]);
                    // e.other.physics.setForce([(x-e.other.body.pos[0])*2,0.5]);
                    return !(e.other instanceof Actor)
                }
            }
            TIME.addSchedule(0,3,0,function(){
                for(let i=fires.length-1; i>=0; i--)fires[i].body.vel[0]+=(x-fires[i].body.midX);
                x+=speed*dir;
                speed+=0.2;

                SCREEN.renderer.camera.vibrate(10);
            },()=>{return m.getState()==0})
            TIME.addSchedule(3.5,3.5,0,function(){
                for(let i=fires.length-1; i>=0; i--)fires[i].setState(0);
                SCREEN.renderer.camera.vibrate(100);
            },()=>{return m.getState()==0});
            m.addEventListener("remove",()=>{
                for(let i=fires.length-1; i>=0; i--)fires[i].setState(0);
            })
        },1000))

        this.animation=new UnitAnimation(IMAGES.monster_wyvern,80,80,[4, 1],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.animation.fps=16;
        this.body.overlap=true;
        this.physics.inv_mass=0.001;
        this.physics.setGravity([0,0],true)
        this.lifeModule.ondamage=function(d, dt){
            return dt!=TYPE.damageFire;
        }
    }
    update(){
        super.update();
        this.animation.update();
        if(this.phase==1 && this.lifeModule.life<this.lifeModule.MAX_LIFE*1.1){ //PHASE 2
            this.phase=2;
            this.skillModule.addSkill(new MagicSkill("breath",function(m){
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
                        if(e.other.lifeModule)e.other.lifeModule.giveDamage(4444,TYPE.damageFire);
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
            },1400))
        }
    }
    draw(r){r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]})}   
}








class MonsterDragon extends Monster{
    animation;
    phase=1;
    constructor(pos){
        super(pos,[400,400],1000,new GameUnitMoveModule(1,3), new GameUnitLifeModule(10000000,100,5), new GameUnitSkillModule(0));
        
        this.skillModule.addSkill(new MagicSkill("THUNDER",(m)=>{
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
        },1000))

        this.skillModule.addSkill(new MagicSkill("VIM",(m)=>{
            if(!m.canTarget())return;
            let x=m.body.midX;
            let y=m.body.midY;
            let tb=m.target.body;
            let speed=25;
            let dir = m.body.getUnitVector(m.target.body.midPos)
            let vel=[dir[0]*speed, dir[1]*speed];
            let elecs=[];
            for(let i=0; i<100; i++){
                let color=`rgba(255,255,${(230-i*3>0 ? 230-i*3 : 0)},0.4)`
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
        },900))

        this.animation=new UnitAnimation(IMAGES.monster_golden_dragon,80,80,[4, 1],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.animation.fps=16;
        this.body.overlap=true;
        this.physics.inv_mass=0.001;
        this.physics.setGravity([0,0],true)
        this.ai_move_cycle=0.5;
        this.lifeModule.ondamage=function(d, dt){
            return dt!=TYPE.damageElectricity;
        }
    }
    update(){
        super.update();
        this.animation.update();
        if(this.phase==1 && this.lifeModule.life<this.lifeModule.MAX_LIFE*0.5){ //PHASE 2
            this.phase=2;
            this.skillModule.addSkill(new MagicSkill("BLUE",(m)=>{
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
            },1400))
        }
    }
    draw(r){r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]})}   
}









class MonsterEye extends Monster{
    slaveList=[];
    constructor(pos){
        super(pos,[160,160],1000,new GameUnitMoveModule(0,3,4), new GameUnitLifeModule(1000000,100,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("jump",function(m){m.body.addVel([m.front(5),10])},500))
        this.skillModule.addSkill(new MagicSkill("dash",function(m){
            if(!m.canTarget())return;
            let b=m.body, tb=m.target.body;
            let vx = tb.midX-b.midX;
            let vy = tb.midY-b.midY;
            let power = 30/Math.sqrt(vx**2+vy**2);
            b.setVel([vx*power, vy*power+1]);
        },1300))
        this.physics.inv_mass=0.0001;
        let slaveSize=45;
        for(let i=0; i<10; i++)for(let j=0; j<10; j++){
            let block = WORLD.add(new Block([this.body.pos[0]+i,this.body.pos[1]+j],[slaveSize,slaveSize],`rgba(0,0,0,0.7)`))
            this.slaveList.push(block);
            block.lifeModule.defense=1000000;
            block.physics.enableEnvironment=false;
            block.physics.inv_mass=1;
            block.physics.setCOF(0);
            block.eventManager.oncollision=function(e){
                if(this.canAttack(e.other))e.other.lifeModule.giveDamage(500);
                return true;
            }.bind(this)
        }
        this.addEventListener("remove",function(){
            let midX=this.body.midX;
            let midY=this.body.midY;
            for(let slave of this.slaveList){
                slave.physics.setCOR(0.8)
                slave.body.addVel([(midX-slave.body.midX),(midY-slave.body.midY)])
            } 
            TIME.addSchedule(2,2,undefined,function(){
                for(let slave of this.slaveList){
                    //slave.eventManager.oncollision=function(e){return false}
                    slave.setState(0)
                }
            }.bind(this))
            return true;
        })
    }
    update(){
        super.update();
        let midX=this.body.midX;
        let midY=this.body.midY;
        for(let slave of this.slaveList){
            slave.body.addVel([(midX-slave.body.midX)*0.01,(midY-slave.body.midY)*0.01])
        } 
    }
    draw(r){r.fillRect("maroon", this.body)}
}