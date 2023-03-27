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
    constructor(moveType) {
        this.moveType=moveType;
    }
    update(unit){
        if(!this.canMove)return;
        if(this.moveType===0){
            this.moveRun(unit.body);
            if(this.doJump)this.jump(unit.body);

        }else this.moveFly(unit.body);
        this.calculateFootDirection(unit.physics.gravity);
    }
    moveRun(body){if(this.footDirection[0]===0)this.moveX(body); else this.moveY(body);}
    moveFly(body){this.moveX(body);this.moveY(body);}
    moveX(body){
        if(this.moveFlag[0])
        if(this.moveDirection[0]&&body.vel[0]<this.moveSpeed)body.addVel([1,0])
        else if(!this.moveDirection[0]&&body.vel[0]>-this.moveSpeed)body.addVel([-1,0])
    }
    moveY(body){
        if(this.moveFlag[1])
        if(this.moveDirection[1]&&body.vel[1]<this.moveSpeed)body.addVel([0,1])
        else if(!this.moveDirection[1]&&body.vel[1]>-this.moveSpeed)body.addVel([0,-1])
    }
    jump(body){
        if (this.canMove&&this.canJump) {
            this.doJump = false;
            this.canJump = false;
            body.addVel(calvec(this.footDirection,'*',-this.jumpSpeed))
        }
    }
    readyJump(collisionNormal){
        if(collisionNormal[0]==this.footDirection[0]&&collisionNormal[1]==this.footDirection[1])this.canJump=true;
    }
    calculateFootDirection(gravity){
        if(gravity[1]!==0)this.footDirection=[0,Math.sign(gravity[1])]
        else if(gravity[0]!==0)this.footDirection=[Math.sign(gravity[0]),0]
        else this.footDirection=[0,-1]
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
            case 0: case 1: this.moveFlag[0]=false; break;
            case 2: case 3: this.moveFlag[1]=false; break;
        }
    }
}

class GameUnitSkillModule{
    skillList=[];
    coolTime=[];
    mp=0;
    MAX_MP=0;
    mpRecovery=0;
    constructor(MAX_MP){
        this.MAX_MP=MAX_MP;
        this.mp=MAX_MP;
    }
    update(){
        this.mp+=this.mpRecovery;
        for(let i=this.coolTime.length-1; i>=0; i--)this.coolTime[i]--;
    }
    addSkill(skill){
        this.skillList.push(skill);
        this.coolTime.push(0);
    }
    castSkill(caster, skillNum){
        if(this.skillList[skillNum]&&this.coolTime[skillNum]<1&&this.mp>this.skillList[skillNum].getRequiredMP()){
            this.mp-=this.skillList[skillNum].getRequiredMP();
            this.coolTime[skillNum]=this.skillList[skillNum].getCoolTime();
            this.skillList[skillNum].cast(caster);
        }
    }
}

class GameUnitStatusEffectModule{

    constructor(){

    }
    update(){

    }
}

class GameUnitLifeModule{
    life;
    defense;
    damageText;
    damageDelay=1;
    constructor(life,defense=1,damageText=false){
        this.life=life;
        this.defense=defense;
    }
    giveDamage(damage){
        damage=Math.floor(damage)
        if(damage>this.defense){
            this.life-=damage;
            if(this.damageText)this.createDamageText();
        }
        if(damage<=0)this.unitDieHandler;
    }
    createDamageText(){}
    unitDieHandler(){}
}