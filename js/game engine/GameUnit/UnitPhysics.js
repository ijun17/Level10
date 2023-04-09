class UnitPhysics {
    force=[0,0];
    gravity=[0,0];
    fixedForce=false;
    fixedGravity=false;

    inv_mass=1;//질량분의1
    FRICTION_COEF=0.1; //마찰 계수 / 0~1이며 0이면 마찰력 없음 COF
    DRAG_COEF=0.5; //항력 계수 / 0~1이며 0이면 저항력 없음 COD
    RESTITUTION_COEF=0; //반발 계수 / 0~1이며 0이면 완전 비탄성 충돌,1이면 완전 탄성 충돌 COR

    constructor(){}

    updateAcc(){
        let acc=[this.force[0]*this.inv_mass+this.gravity[0], this.force[1]*this.inv_mass+this.gravity[1]];
        this.setForce([0,0]);
        this.setGravity([0,0]);
        return acc;
    }

    addForce(force){if(this.fixedForce)return;this.force[0]+=force[0];this.force[1]+=force[1];}
    setForce(force){if(this.fixedForce)return;this.force[0]=force[0];this.force[1]=force[1];}
    setGravity(ga){if(this.fixedGravity)return;this.gravity[0]=ga[0];this.gravity[1]=ga[1]}

    setCOF(COF){this.FRICTION_COEF=COF;}
    setCOD(COD){this.DRAG_COEF=COD;}
    setCOR(COR){this.RESTITUTION_COEF=COR;}
    applyDrag(rel_vel, density){this.addForce([rel_vel[0]*density*this.DRAG_COEF, rel_vel[1]*density*this.DRAG_COEF]);}
}