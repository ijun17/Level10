class Monster extends Actor{
    target=null;
    power=0;
    attackTick=0;
    
    constructor(pos,size,power=0,moveModule,lifeModule,skillModule){
        super(pos,size,moveModule,lifeModule,skillModule);
        this.power=power;
        this.addEventListener("collision", function(e){
            this.moveModule.readyJump(e.collisionNormal);
            if(this.canAttack(e.other))this.attack(e.other);
        })

        this.lifeModule.ontotaldamage=function(totalDamage){
            this.createDamageText(totalDamage,"orange")
            SCREEN.renderer.camera.vibrate(10);
        }.bind(this)
    }
    update(){
        super.update();
        if(this.attackTick>0)this.attackTick--;
    }
    canAttack(unit){
        if(unit==this.target || unit instanceof Block)return true;
        else this.searchTarget()
        return false;
    }
    attack(unit){
        unit.lifeModule.giveDamage(this.power*(1-Math.random()*0.1));
        this.attackTick = this.animation.fps*this.animation.MAX_X[1];
        const knockback=(unit.body.midX > this.body.midX?1:-1)*((this.power+1000)>>9)+this.body.vel[0];
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
    createMatterToTarget(MatterClass,xDir,yDir,power){
        let matter_x = this.body.midX+((this.body.size[0]>>1)+15)*xDir-15;
        let matter_y = this.body.midY+((this.body.size[1]>>1)+15)*yDir-15;
        let matter_vx = this.target.x-matter_x;
        let matter_vy = this.target.y-matter_y;
        let vector_length = Math.sqrt(matter_vx**2+matter_vy**2);
        return  WORLD.add(new MatterClass([matter_x, matter_y], [matter_vx*power/vector_length, matter_vy*power/vector_length+1]));
    }
    createMatter(MatterClass,xDir,yDir,vx,vy){
        let matter_x = this.body.midX+((this.body.size[0]>>1)+15)*xDir-15;
        let matter_y = this.body.midY+((this.body.size[1]>>1)+15)*yDir-15;
        return  WORLD.add(new MatterClass([matter_x, matter_y],[vx,vy]));
    }
    AI() {
        this.moveModule.keyDownHandler(this.getTargetDirX()==1 ? 0 : 1);
        if(Math.random()<0.1)this.moveModule.moveDirection[0]=!this.moveModule.moveDirection[0];
        
        if(this.moveModule.moveType==0)this.moveModule.keyDownHandler(2);
        else{
            this.moveModule.keyDownHandler(this.getTargetDirY()==1 ? 2 : 3);
            if(Math.random()<0.1)this.moveModule.moveDirection[1]=!this.moveModule.moveDirection[1]
        }
    }
}

class MonsterMushroom extends Monster{
    animation
    constructor(pos){
        super(pos,[180,180],500,new GameUnitMoveModule(0,3,3), new GameUnitLifeModule(100000,100,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("jump",function(m){m.body.addVel([m.front(5),7])},500))
        TIME.addSchedule(0,undefined,0.5,this.AI.bind(this),function(){return this.getState()==0}.bind(this))
        TIME.addSchedule(0,undefined,5.1,function(){this.skillModule.castSkill(this,0)}.bind(this),function(){return this.getState()==0}.bind(this))

        this.animation=new UnitAnimation(IMAGES.monster_mushroom,60,60,[3, 3],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.animation.fps=16;

        this.physics.inv_mass=0.2;

    }
    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body)}   
}

class MonsterMonkey extends Monster{
    animation
    constructor(pos){
        super(pos,[120,200],1000,new GameUnitMoveModule(0,8,4), new GameUnitLifeModule(200000,100,5), new GameUnitSkillModule(0));
        this.skillModule.addSkill(new MagicSkill("jump",function(m){m.body.addVel([m.front(5),7])},500))
        TIME.addSchedule(0,undefined,0.5,this.AI.bind(this),function(){return this.getState()==0}.bind(this))
        TIME.addSchedule(0,undefined,5.1,function(){this.skillModule.castSkill(this,0)}.bind(this),function(){return this.getState()==0}.bind(this))

        this.animation=new UnitAnimation(IMAGES.monster_monkey,120,200,[3, 3],function(){return (this.attackTick>0?1:0)}.bind(this));
        this.animation.fps=16;

        this.physics.inv_mass=0.2;

    }
    update(){
        super.update();
        this.animation.update();
    }
    draw(r){r.drawAnimation(this.animation,this.body)}   
}