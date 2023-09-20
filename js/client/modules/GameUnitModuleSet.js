class GameUnitMoveModule {
    moveType = 0; //0:run  1:fly
    canMove=true;
    moveSpeed = 0;
    moveDirection = [true, true]; //이동 방향 - 오른쪽, 위쪽이면 true 반대 false
    moveFlag=[false, false]; //이동중인지
    canJump = true; //점프할 수 있는지
    doJump =false; //점프를 했는지
    jumpSpeed = 0; 
    footDirection = [0, -1]; //중력방향
    constructor(moveType,moveSpeed=4,jumpSpeed=0) {
        this.moveType=moveType;
        this.moveSpeed=moveSpeed;
        this.jumpSpeed=jumpSpeed;
    }
    update(unit){
        if(!this.canMove)return;
        if(this.moveType===0)this.moveRun(unit.body);
        else this.moveFly(unit.body);
        this.calculateFootDirection(unit.physics.gravity);
    }
    moveRun(body){
        if(this.footDirection[0]===0)this.moveX(body); 
        else this.moveY(body);
        if(this.doJump)this.jump(body);
    }
    moveFly(body){
        this.moveX(body);
        this.moveY(body);}
    moveX(body){
        if(this.moveFlag[0]){
            if(this.moveDirection[0]&&body.vel[0]<this.moveSpeed)body.addVel([1,0])
            else if(!this.moveDirection[0]&&body.vel[0]>-this.moveSpeed)body.addVel([-1,0])
        }
    }
    moveY(body){
        if(this.moveFlag[1]){
            if(this.moveDirection[1]&&body.vel[1]<this.moveSpeed)body.addVel([0,1])
            else if(!this.moveDirection[1]&&body.vel[1]>-this.moveSpeed)body.addVel([0,-1])
        }
    }
    jump(body){
        if (this.canMove&&this.canJump) {
            this.canJump = false;
            this.doJump = false;
            body.addVel(calvec(this.footDirection,'*',-this.jumpSpeed))
        }
    }
    readyJump(collisionNormal){
        if(collisionNormal[0]==this.footDirection[0]&&collisionNormal[1]==this.footDirection[1])this.canJump=true;
    }
    calculateFootDirection(gravity){
        if(gravity[1]!==0)this.footDirection=[0,Math.sign(gravity[1])]
        else if(gravity[0]!==0)this.footDirection=[Math.sign(gravity[0]),0]
        //else this.footDirection=[0,-1]
    }

    keyDownHandler(moveKey){//0:right   1:left   2:up   3:down
        switch(moveKey){
            case 0: this.moveDirection[0]=true;this.moveFlag[0]=true;if(this.footDirection[0]===-1&&this.canJump)this.doJump=true;break;//right
            case 1: this.moveDirection[0]=false;this.moveFlag[0]=true;if(this.footDirection[0]===1&&this.canJump)this.doJump=true;break;//left
            case 2: this.moveDirection[1]=true;this.moveFlag[1]=true;if(this.footDirection[1]===-1&&this.canJump)this.doJump=true; break;//up
            case 3: this.moveDirection[1]=false;this.moveFlag[1]=true;if(this.footDirection[1]===1&&this.canJump)this.doJump=true; break;//down
        }
    }
    keyUpHandler(moveKey){
        switch(moveKey){
            case 0: if(this.moveDirection[0]===true)this.moveFlag[0]=false; break;
            case 1: if(this.moveDirection[0]===false)this.moveFlag[0]=false; break;
            case 2: if(this.moveDirection[1]===true)this.moveFlag[1]=false; break;
            case 3: if(this.moveDirection[1]===false)this.moveFlag[1]=false; break;
        }
    }
}

class GameUnitSkillModule{
    skillList=[];
    coolTime=[];
    mp=0;
    MAX_MP=0;
    mpRecovery=0;
    constructor(MAX_MP,mpRecovery=0){
        this.MAX_MP=MAX_MP;
        this.mp=MAX_MP;
        this.mpRecovery=mpRecovery;
    }
    update(){
        if(this.mp<this.MAX_MP)this.mp+=this.mpRecovery;
        for(let i=this.coolTime.length-1; i>=0; i--)this.coolTime[i]--;
    }
    addSkill(skill){
        this.skillList.push(skill);
        this.coolTime.push(0);
    }
    castSkill(caster, skillNum){
        if(this.canCast(skillNum)){
            this.mp-=this.skillList[skillNum].getRequiredMP();
            this.coolTime[skillNum]=this.skillList[skillNum].getCoolTime();
            this.skillList[skillNum].cast(caster);
            return true;
        }
        return false;
    }
    canCast(skillNum){
        return skillNum<this.skillList.length&&this.coolTime[skillNum]<1&&this.mp>=this.skillList[skillNum].getRequiredMP();
    }
    getSkillCount(){return this.skillList.length;}
}

class GameUnitLifeModule{
    MAX_LIFE;
    life;
    defense=50;
    damageDelay=1;
    damageDelayTick;
    totalDamage=0;
    constructor(life,defense=1,damageDelay=0){
        this.life=life;
        this.MAX_LIFE=life;
        this.defense=defense;
        this.damageDelay=damageDelay;
        this.damageDelayTick=damageDelay;
    }
    update(){
        if(this.damageDelayTick>0)this.damageDelayTick--;
        else if(this.totalDamage>this.defense){
            this.ontotaldamage(this.totalDamage);
            this.life-=this.totalDamage;
            this.totalDamage=0;
            this.damageDelayTick=this.damageDelay;
            if(this.life<=0){
                this.life=0;
                this.ondie();
            }
        }
    }
    giveDamage(damage,damageType=0){
        if(damage>this.defense&&this.damageDelayTick==0&&this.ondamage(damage,damageType)){
            this.totalDamage+=Math.floor(damage);
            return true;
        }
        else return false;
    }
    addLife(life){this.life+=life;}
    setLife(life){this.life=life;}
    ondie(){}
    ondamage(damage,damageType){return true;}
    ontotaldamage(){}
}

class GameUnitStatusEffectModule{
    statusEffectList=[0,0];
    constructor(){}
    
    set(unit, type, time, power=1){
        if(this.statusEffectList[type]>0 || !this.oneffect(type,power))return;
        this.statusEffectList[type]=power;
        let effectF=()=>{};
        let endF=()=>{};
        switch(type){
        case TYPE.iceEffect : 
            effectF=()=>{
                SCREEN.renderer.fillRect("rgba(92,150,212,0.5)",unit.body);
                unit.moveModule.canMove=false;
            }
            endF=()=>{unit.moveModule.canMove=true;};
        break;
        }
        TIME.addSchedule(0,time,undefined,effectF,()=>{return unit.getState()==0});
        TIME.addTimer(time+0.01,()=>{
            endF();
            this.statusEffectList[type]=0;
        },()=>{return unit.getState()==0});
    }
    oneffect(){return true}
}
