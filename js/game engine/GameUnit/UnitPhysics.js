class UnitPhysics {
    force=[0,0];
    gravity=[0,0];
    fixedForce=false;
    fixedGravity=false;

    inv_mass=1;//질량분의1
    FRICTION_COEF=0.1; //마찰 계수 / 0~1이며 0이면 마찰력 없음 COF
    DRAG_COEF=1; //항력 계수 / 0~1이며 0이면 저항력 없음 COD
    RESTITUTION_COEF=0; //반발 계수 / 0~1이며 0이면 완전 비탄성 충돌,1이면 완전 탄성 충돌 COR

    constructor(){}

    updateAcc(){
        let acc=[this.force[0]*this.inv_mass+this.gravity[0], this.force[1]*this.inv_mass+this.gravity[1]];
        this.setForce([0,0]);
        this.setGravity([0,0]);
        return acc;
    }

    addForce(df){if(this.fixedForce)return;calvec(this.force, '+=', df)}
    setForce(force){if(this.fixedForce)return;calvec(this.force, '=', force)}
    setGravity(ga){if(this.fixedGravity)return;calvec(this.gravity,'=',ga)}

    setCOF(COF){this.FRICTION_COEF=COF;}
    setCOD(COD){this.DRAG_COEF=COD;}
    setCOR(COR){this.RESTITUTION_COEF=COR;}

    /**
     * 상대의 속도와 동화되는 힘을 적용하는 함수
     * @param {[Number,Number]} rel_vel relative velocity
     * @param {Number} COR coefficient of resistance
     */
    applyCollision(other, rel_vel, collisionNormal){
        let imperse=this.getImperse(other, rel_vel, collisionNormal);
        if(imperse===null)return;
        this.addForce(imperse);
        other.addForce(calvec(imperse,'*',[-1,-1]))
        let friction=this.getFriction(other, rel_vel, collisionNormal);
        //console.log(friction)
        this.applyResistance(friction, 1);
        other.applyResistance(friction, -1);
    }
    getImperse(other, rel_vel, collisionNormal){
        if(this.inv_mass===0&&other.inv_mass===0)return null;
        let velAlongNormal=collisionNormal[0]*rel_vel[0]+collisionNormal[1]*rel_vel[1];
        if(velAlongNormal>0)return null;//collsion normal =/= vector direction
        const MASS_RATIO=this.inv_mass+other.inv_mass;
        const COR=1+Math.max(this.RESTITUTION_COEF,other.RESTITUTION_COEF)//(this.RESTITUTION_COEF<other.RESTITUTION_COEF ? this.RESTITUTION_COEF : other.RESTITUTION_COEF);
        const COLLISION_COEF=COR/MASS_RATIO;
        return calvec(collisionNormal,'*',velAlongNormal*COLLISION_COEF);
    }
    getFriction(other, rel_vel, collisionNormal){
        const FRICTION_COEF=Math.max(this.FRICTION_COEF,other.FRICTION_COEF)//(this.FRICTION_COEF<other.FRICTION_COEF?this.FRICTION_COEF:other.FRICTION_COEF);
        const FRICTION_VEL=(collisionNormal[0]===0 ? [rel_vel[0]*FRICTION_COEF,0] : [0,rel_vel[1]*FRICTION_COEF])
        return FRICTION_VEL;
    }
    getMassRatio(other){
        if(this.inv_mass===0&&other.inv_mass===0)return -1;
        return (this.inv_mass/(this.inv_mass+other.inv_mass));
    }
    applyDrag(rel_vel, density){
        this.applyResistance(rel_vel, density*this.DRAG_COEF);
    }

    applyResistance(rel_vel, RESISTANCE_COEF){
        this.addForce([rel_vel[0]*RESISTANCE_COEF, rel_vel[1]*RESISTANCE_COEF]);
    }
    
}