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
        if(unit==this.target || unit instanceof Block)return true;
        else if(this.target==null)this.searchTarget()
        return false;
    }
    attack(unit){
        unit.lifeModule.giveDamage(this.power*(1-Math.random()*0.1));
        if(this.animation)this.attackTick = this.animation.fps*this.animation.MAX_X[1];
        let knockback=(unit.body.midX > this.body.midX?1:-1)*((this.power+1000)>>9)+this.body.vel[0];
        if(Math.abs(unit.body.vel[0] < Math.abs(knockback)))
            unit.physics.addForce([(unit instanceof Actor?-unit.body.vel[0]:0)+knockback,0.2]);
    }
    canTarget(){return (this.target!=null&&this.target.canDraw&&this.target.lifeModule.life>0)}
    searchTarget(){
        let layer=WORLD.layer[PHYSICS_LAYER].gameUnitList;
        for(let i=layer.length-1; i>=0; i--){
            if(layer[i] instanceof Player){
                this.target=layer[i];
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
        let vector_length = Math.sqrt(matter_vx**2+matter_vy**2);
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
        if(Math.random()<0.1)this.moveModule.moveDirection[0]=!this.moveModule.moveDirection[0];
        
        if(this.moveModule.moveType==0)this.moveModule.keyDownHandler(2);
        else{
            this.moveModule.keyDownHandler(this.getTargetDirY()==1 ? 2 : 3);
            if(Math.random()<0.1)this.moveModule.moveDirection[1]=!this.moveModule.moveDirection[1]
        }
    }
    skillAI(){
        for(let i=0; i<this.skillModule.getSkillCount(); i++){
            if(this.skillModule.castSkill(this,i))break;
        }
    }
    renderStatusBar(pos){
        const perX=SCREEN.perX.bind(SCREEN);
        const perY=SCREEN.perY.bind(SCREEN);
        const sbx=pos[0];
        const sby=pos[1];
        this.statusBarInfo={
            draw:true,
            pos:[sbx,sby],
            backgroundBody: {pos:[sbx,sby], size:[perX(40),perX(7.5)]},
            strokeHPBody: {pos:[sbx+perX(1),sby+perX(1)],size:[perX(38), perX(3)]},
            playerNameBody: {pos:[sbx+perX(1),sby+perX(6.5)],size:[0,0]},
            playerNameFont: "bold " + perX(1.8) + "px Arial",
            hpTextFont: perX(1.4) + "px Arial",
            fillHPTextBody: {pos:[sbx+perX(1.5),sby+perX(3)],size:[0,0]}
        };
        TIME.addSchedule(0,undefined,undefined,function(){this.drawStatusBar(SCREEN.renderer)}.bind(this))
    }
    drawStatusBar(r) {
        const perX=SCREEN.perX.bind(SCREEN);
        const perY=SCREEN.perY.bind(SCREEN);
        const SBI=this.statusBarInfo;
        const DRAW_OPTION = {cameraOn:false};

        let fillHPBody = {pos:SBI.strokeHPBody.pos, size:[perX(38) * (this.lifeModule.life / this.lifeModule.MAX_LIFE), perX(3)]}

        r.fillRect("rgba(0,0,0,0.2)",SBI.backgroundBody,DRAW_OPTION);
        r.strokeRect("white",SBI.strokeHPBody,DRAW_OPTION);
        r.fillRect("DarkSlateBlue",fillHPBody,DRAW_OPTION);
        r.ctx.textBaseline = "top";
        r.ctx.textAlign = "left";
        r.ctx.font = SBI.playerNameFont;
        r.ctx.fillStyle = "white";
        r.fillText("Boss", SBI.playerNameBody,DRAW_OPTION);
        r.ctx.font = SBI.hpTextFont;
        r.fillText(this.lifeModule.life, SBI.fillHPTextBody,DRAW_OPTION);
    }
}

class MonsterMushroom extends Monster{
    animation
    constructor(pos){
        super(pos,[180,180],500,new GameUnitMoveModule(0,3,3), new GameUnitLifeModule(100000,100,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("jump",function(m){m.body.addVel([m.front(5),7])},500))

        this.animation=new UnitAnimation(IMAGES.monster_mushroom,60,60,[3, 3],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.animation.fps=16;
        this.body.overlap=true;
        this.physics.inv_mass=0.5;

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
        super(pos,[120,200],1000,new GameUnitMoveModule(0,8,4), new GameUnitLifeModule(200000,100,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("jump",function(m){m.body.addVel([m.front(5),7])},500))

        this.animation=new UnitAnimation(IMAGES.monster_monkey,120,200,[3, 3],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.animation.fps=16;
        this.body.overlap=true;
        this.physics.inv_mass=0.5;

    }
    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]})}   
}

class MonsterFly extends Monster{
    animation;
    slaveList=[];
    constructor(pos,isMaster=true){
        super(pos,[30,30],300,new GameUnitMoveModule(1,10), new GameUnitLifeModule(100000,100,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("jump",function(m){
            m.moveModule.moveSpeed=30;
            m.canInteract=false;
            TIME.addSchedule(0.5,0.5,0,function(){
                m.moveModule.moveSpeed=10;
                m.canInteract=true;
            },function(){return m.getState()==0;})
        },300))
        this.body.overlap=true;
        this.physics.inv_mass=0.5;
        this.ai_move_cycle=0.05;
        this.animation=new UnitAnimation(IMAGES.monster_hellfly,30,30,[1, 1],function(){return (this.attackTick>0?1:0)}.bind(this));
        if(isMaster){
            for(let i=0; i<20; i++){
                let m=WORLD.add(new MonsterFly(pos,false));
                TIME.addSchedule(1,1,0,function(){m.activateAI()});
                this.slaveList.push(m);
            }
        }
        this.addEventListener("remove",()=>{for(let m of this.slaveList)m.setState(0)})
    }
    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]})} 
}

class MonsterSlime extends Monster{
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

class MonsterGolem extends Monster{
    animation;
    antiMatterFlag=false;
    constructor(pos){
        super(pos,[200,200],4000,new GameUnitMoveModule(0,1,2), new GameUnitLifeModule(5000000,100,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("down",function(e){
            if(!e.canTarget())return;
            let b=e.body, tb=e.target.body;
            b.setPos([tb.midX-b.size[0]/2, tb.midY+700]);
            b.setVel([0,-10]);
            WORLD.add(new Particle([b.midX-100, b.midY-100], [300, 300], TYPE.magicEffect));
            e.power=9999;
            TIME.addSchedule(1,1,0,function(){e.power=4000});
        },501));
        this.skillModule.addSkill(new MagicSkill("front",function(e){
            if(!e.canTarget())return;
            let b=e.body, vel=e.getTargetDirX()*10;
            e.antiMatterFlag=true;
            TIME.addSchedule(0.5, 1, 0, function(){b.vel[0]+=vel;});
            TIME.addSchedule(1, 1, 0, function(){e.antiMatterFlag=false;});
            WORLD.add(new Particle([b.midX-100, b.midY-100], [300, 300], TYPE.magicEffect));
        },888));

        this.addEventListener("collision", function(e){if(this.antiMatterFlag && e.other instanceof Matter)e.other.setState(0);})

        this.animation=new UnitAnimation(IMAGES.monster_golem,128,128,[4, 2],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.animation.fps=32;
        this.body.overlap=false;
        this.physics.inv_mass=0.001;
        this.physics.setGravity([0,-0.5]);
        this.physics.fixedGravity=true;
    }

    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]})}   
}

class MonsterWyvern extends Monster{
    animation
    constructor(pos){
        super(pos,[300,300],1000,new GameUnitMoveModule(1,3), new GameUnitLifeModule(5000000,100,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("jump",function(m){
            if(!m.canTarget())return;
            let fire=m.createMatterToTarget(MatterFire,[1.2,0],10);
            fire.lifeModule.life=500;
            fire.physics.setGravity([0,-0.1],true);
            fire.physics.setCOD(0)
            fire.damage=1000;
            fire.body.setSize([60,60]);
            fire.addEventListener("collision", function(e){WORLD.add(new MatterFire(this.body.pos,[0,0]))});
        },111))
        this.skillModule.addSkill(new MagicSkill("jump",function(m){
            for(let i=0; i<10; i++){
                (m.createMatter(MatterFire,[2+i*0.4, 2+i*0.1],[0,-30])).life=100;
                (m.createMatter(MatterFire,[2+i*0.4, 1.5+i*0.1],[0,-30])).life=100;
                (m.createMatter(MatterFire,[2+i*0.4, 2.5+i*0.1],[0,-30])).life=100;
            }
        },500))
        this.skillModule.addSkill(new MagicSkill("firetornado",function(m){
            let fires=[];
            let x=m.body.midX+m.front(200);
            let dir=m.front(10);
            for(let i=0; i<200; i++){
                let color=`rgba(255,${(170-i>0 ? 170-i*2 : 0)},0,0.6)`
                let fire=WORLD.add(new Block(m.body.pos,[50,50],color));
                fire.lifeModule.life=100000;
                fire.id=128743612;
                fire.physics.setCOR(1);
                fire.physics.enableEnvironment=false;
                fires.push(fire);
                fire.eventManager.oncollision=(e)=>{
                    if(e.other==m)return false;
                    if(e.other.id==128743612)return true;
                    if(e.other.lifeModule)e.other.lifeModule.giveDamage(1000,TYPE.damageFire);
                    e.other.body.setVel([(x-e.other.body.pos[0])*1,0.5+e.other.body.vel[1]]);
                    if(e.other instanceof Matter)e.other.setState(0);
                    return true;
                }
            }
            TIME.addSchedule(0,3,0,function(){
                for(let i=fires.length-1; i>=0; i--)fires[i].body.vel[0]+=(x-fires[i].body.midX);
                x+=dir;
            })
            TIME.addSchedule(3.5,3.5,0,function(){for(let i=fires.length-1; i>=0; i--)fires[i].setState(0);});
        },1000))

        this.animation=new UnitAnimation(IMAGES.monster_wyvern,80,80,[4, 1],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.animation.fps=16;
        this.body.overlap=true;
        this.physics.inv_mass=0.1;

        this.lifeModule.ondamage=function(d, dt){
            return dt!=TYPE.damageFire;
        }
    }
    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]})}   
}

class MonsterDragon extends Monster{
    animation;
    constructor(pos){
        super(pos,[300,300],1000,new GameUnitMoveModule(1,3), new GameUnitLifeModule(5000000,100,5), new GameUnitSkillModule(0));

        // this.skillModule.addSkill(new MagicSkill("aa",(m)=>{
        //     let pos=[[2,0],[-2,0],[0,2],[1.5,1.5],[-1.5,1.5]];
        //     let dir=[[1,0],[-1,0],[0,1],[0,-1]];
        //     let dist=50;
        //     for(let i=0;i<5; i++){
        //         let elec=WORLD.add(new MatterElectricity([m.body.midX, m.body.midY],[pos[i][0],pos[i][1]]));
        //         elec.body.addPos([pos[i][0]*dist,pos[i][1]*dist])
        //         elec.lifeModule.addLife(300);
        //         TIME.addSchedule(1,1,0,()=>{
        //             for(let i=0; i<4; i++)for(let j=1; j<10; j++){
        //                 let e=WORLD.add(new MatterElectricity(elec.body.pos,[0,0]));
        //                 e.body.addPos([dir[i][0]*j*20,dir[i][1]*j*20]);
        //                 e.lifeModule.addLife(300);
        //             }
        //         },()=>{return m.getState()==0})
        //     }
        // },500));

        // this.skillModule.addSkill(new MagicSkill("aa",(m)=>{
        //     let count=40
        //     let radian=Math.PI/(count*0.5);
        //     let dist=200;
        //     for(let i=0;i<count; i++){
        //         let x=Math.cos(radian*i);
        //         let y=Math.sin(radian*i);
        //         let elec=WORLD.add(new MatterElectricity([m.body.midX, m.body.midY],[x*2,y*2]));
        //         elec.body.addPos([x*dist,y*dist])
        //         elec.lifeModule.addLife(300);
        //         //elec.electricPoint=100000;
        //     }
        // },300));

        this.skillModule.addSkill(new MagicSkill("thunder",(m)=>{
            let dir=m.front()
            let x=m.body.midX+dir*300;
            let y=m.body.midY;
            for(let i=0; i<5; i++){
                let elec=WORLD.add(new MatterElectricity([x+dir*i*400,y],[0,0]));
                elec.lifeModule.addLife(1000);
                elec.electricPoint=100000;
                TIME.addSchedule(i*0.5+1,i*0.5+1,0,()=>{
                    let ltn=WORLD.add(new MatterElectricity(elec.body.pos,[0,0]));
                    ltn.damage=10000;
                },()=>{return m.getState(0)==0})
            }
        },1000))

        this.skillModule.addSkill(new MagicSkill("vim",(m)=>{
            if(!m.canTarget())return;
            let dir=m.front()
            let x=m.body.midX+dir*300;
            let y=m.body.midY;
            let tb=m.target.body;
            let speed=Math.sqrt((tb.midX-x)**2+(tb.midY-y)**2)/10;
            let vel=[(tb.midX-x)/speed, (tb.midY-y)/speed];
            let elecs=[];
            for(let i=0; i<100; i++){
                let color=`rgba(255,255,${(200-i*3>0 ? 200-i*3 : 0)},0.7)`
                let elec=WORLD.add(new Block([x+i,y+i],[50,50],color));
                elec.lifeModule.life=100000;
                elec.id=252362436;
                elec.physics.setCOR(1);
                elec.physics.setCOF(0);
                elec.physics.enableEnvironment=false;
                elecs.push(elec);
                elec.eventManager.oncollision=(e)=>{
                    if(e.other==m)return false;
                    if(e.other.id==252362436)return true;
                    if(e.other.lifeModule)e.other.lifeModule.giveDamage(1000,TYPE.damageElectricity);
                    if(e.other instanceof Matter){
                        if(e.other.damageType!==TYPE.damageElectricity)e.other.setState(0);
                        return false;
                    }
                    e.other.body.setVel([(x-e.other.body.pos[0]),(y-e.other.body.pos[1])]);
                    return true;
                }
            }
            TIME.addSchedule(0,2,0,function(){
                for(let i=elecs.length-1; i>=0; i--)elecs[i].body.addVel([x-elecs[i].body.midX, y-elecs[i].body.midY]);
                x+=vel[0];
                y+=vel[1];
            })
            TIME.addSchedule(2.1,2.1,0,function(){for(let i=elecs.length-1; i>=0; i--)elecs[i].setState(0);});
        },700))

        this.animation=new UnitAnimation(IMAGES.monster_golden_dragon,80,80,[4, 1],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.animation.fps=16;
        this.body.overlap=true;
        this.physics.inv_mass=0.1;

        this.lifeModule.ondamage=function(d, dt){
            return dt!=TYPE.damageElectricity;
        }
    }
    update(){
        super.update();
        this.animation.update();
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