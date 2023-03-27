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
        this.limitVel(100);
        this.addPos(this.vel);
        this.addVel(acc);
    }
    
    addPos(dp){if(this.fixedPos)return;this.pos[0]+=dp[0];this.pos[1]+=dp[1]}
    addVel(dv){if(this.fixedPos||this.fixedVel)return;this.vel[0]+=dv[0];this.vel[1]+=dv[1]}
    setPos(pos){if(this.fixedPos)return;calvec(this.pos,'=',pos)}
    setVel(vel){if(this.fixedPos||this.fixedVel)return;calvec(this.vel,'=',vel)}
    setSize(size){calvec(this.size,'=',size);}
    getRelativePos(other){return [other.pos[0]-this.pos[0], other.pos[1]-this.pos[1]]}
    getRelativeVel(other){return [other.vel[0]-this.vel[0], other.vel[1]-this.vel[1]]}
    
    limitVel(lim){
        if(this.vel[0]>lim)this.vel[0]=lim;
        else if(this.vel[0]<-lim)this.vel[0]=-lim;
        if(this.vel[1]>lim)this.vel[1]=lim;
        else if(this.vel[1]<-lim)this.vel[1]=-lim;
    }
    

    checkCollision(unit1, unit2){
        const other=unit2.body;
        if(!this.canCollision||!other.canCollision)return;
        if (this.isCollision(other)) {
            let collInfo = this.getCollsionInfo(other);
            let do1 = unit1.eventManager.oncollision({do:true,other:unit2,collisionNormal:collInfo.normal});
            let do2 = unit2.eventManager.oncollision({do:true,other:unit1,collisionNormal:calvec(collInfo.normal,'*',[-1,-1])});
            if(!(this.overlap&&other.overlap) && do1 && do2){
                unit1.physics.applyCollision(unit2.physics, this.getRelativeVel(other), collInfo.normal)
                this.fixCollisionPos(unit1, unit2, collInfo.normal,collInfo.depth)
                
            }
            return;
        }
    }

    fixCollisionPos(unit1, unit2, normal, depth){
        const other=unit2.body;
        let coll_axis=(normal[0]==0 ? 1 : 0);
        let collisionSpeed1=Math.abs(this.vel[coll_axis]);
        let collisionSpeed2=Math.abs(other.vel[coll_axis]);
        let fixPosRatio;
        if(false&&this.vel[coll_axis]!==other.vel[coll_axis]){
            fixPosRatio = collisionSpeed1/(collisionSpeed1+collisionSpeed2);
        }else{
            fixPosRatio = unit1.physics.getMassRatio(unit2.physics);
            if(fixPosRatio<0)return;
        }
        // this.pos[0]-=normal[0]*fixPosRatio*depth;
        // this.pos[1]-=normal[1]*fixPosRatio*depth;
        // other.pos[0]+=normal[0]*(1-fixPosRatio)*depth;
        // other.pos[1]+=normal[1]*(1-fixPosRatio)*depth;

        this.addPos(calvec(normal,'*',-fixPosRatio*depth))
        other.addPos(calvec(normal,'*',(1-fixPosRatio)*depth))
    }
    
    isCollision(other){
        const distance=this.getRelativePos(other);
        if(distance[0]+other.size[0]<0||distance[0]-this.size[0]>0)return false;
        if(distance[1]+other.size[1]<0||distance[1]-this.size[1]>0)return false;
        return true;
    }

    getCollsionInfo(other){
        const distance=this.getRelativePos(other);
        const depths=[Math.abs(distance[0]-this.size[0]),
                    Math.abs(distance[0]+other.size[0]),
                    Math.abs(distance[1]-this.size[1]),
                    Math.abs(distance[1]+other.size[1])];
        let minIndex=depths[0]>depths[1] ? 1 : 0;
        if(depths[minIndex]>depths[2])minIndex=2;
        if(depths[minIndex]>depths[3])minIndex=3;
        let normal;
        switch(minIndex){
            case 0: normal=[1,0];break; //RIGHT
            case 1: normal=[-1,0];break; //LEFT
            case 2: normal=[0,1];break; //TOP
            case 3: normal=[0,-1];break; //BOTTOM
        }
        return {depth:depths[minIndex], normal:normal};
    }
}