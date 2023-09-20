class UnitBody{
    pos=[0,0];
    vel=[0,0];
    size=[0,0];
    fixedPos=false;
    fixedVel=false;
    canCollision=true;
    isTrigger=false;
    overlap=false; // true끼리는 충돌이 발생하지않고(이벤트헨들러는 실행됨) 둘중하나라도 false면 충돌

    constructor(pos, size){
        this.setPos(pos);
        this.setSize(size);
    }
    update(acc){
        this.limitVec(acc,100);
        this.limitVec(this.vel,100);
        this.addPos(this.vel);
        this.addVel(acc);
    }
    
    addPos(dp){if(this.fixedPos)return;this.pos[0]+=dp[0];this.pos[1]+=dp[1]}
    addVel(dv){if(this.fixedPos||this.fixedVel)return;this.vel[0]+=dv[0];this.vel[1]+=dv[1]}
    setPos(pos){if(this.fixedPos)return;this.pos[0]=pos[0];this.pos[1]=pos[1]}
    setVel(vel){if(this.fixedPos||this.fixedVel)return;this.vel[0]=vel[0];this.vel[1]=vel[1]}
    setSize(size){this.size[0]=size[0];this.size[1]=size[1];}
    getRelativePos(other){return [other.pos[0]-this.pos[0], other.pos[1]-this.pos[1]]}
    getRelativeVel(other){return [other.vel[0]-this.vel[0], other.vel[1]-this.vel[1]]}
    get midX(){return this.pos[0]+(this.size[0]>>1)}
    get midY(){return this.pos[1]+(this.size[1]>>1)}
    get midPos(){return [this.midX, this.midY]}
    get speed(){return Math.sqrt(this.vel[0]*this.vel[0]+this.vel[1]*this.vel[1]);}
    limitVec(vec,lim) {
        if (vec[0] > lim) vec[0] = lim;
        else if (vec[0] < -lim) vec[0] = -lim;
        if (vec[1] > lim) vec[1] = lim;
        else if (vec[1] < -lim) vec[1] = -lim;
    }
    limitPos(startPos,endPos){
        if(this.pos[0]<startPos[0])this.pos[0]=startPos[0]
        else if(this.pos[0]+this.size[0]>endPos[0])this.pos[0]=endPos[0]-this.size[0];
        if(this.pos[1]<startPos[1])this.pos[1]=startPos[1]
        else if(this.pos[1]+this.size[1]>endPos[1])this.pos[1]=endPos[1]-this.size[1];
    }
    getUnitVector(target_pos){
        let uvx=target_pos[0]-this.midX
        let uvy=target_pos[1]-this.midY
        let length=Math.sqrt(uvx**2+uvy**2)
        return [uvx/length, uvy/length]
    }
}