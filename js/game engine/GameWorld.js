/*
class GameWorld
    class GameWorldLayer
    class WorldEnvironment
*/


class GameWorld{
    layer=[];
    environment;
    physics;
    constructor(layerCount=1){
        this.environment=new GameWorldEnvironment();
        this.physics=new GameWorldPhysics();
        for(let i=0; i<layerCount; i++)this.layer[i]=new GameWorldLayer();
    }
    reset(){for(let i=0, l=this.layer.length; i<l; i++)this.layer[i].reset();this.environment.reset();}
    update(){for(let i=0, l=this.layer.length; i<l; i++)this.layer[i].update(this.physics, this.environment);}
    add(unit){this.layer[unit.getLayer()].add(unit);return unit;}
    getLayer(i){return this.layer[i]}
}

class GameWorldLayer{
    gameUnitList=[];
    enableEnvironment=true;
    enableInteraction=true;
    enableClick=false;
    limitPosFlag=false;
    startLimitPos=[0,0];
    endLimitPos=[0,0];
    constructor(){}
    update(physics, environment){
        const renderer = Game.screen.renderer;
        const gameUnitList=this.gameUnitList;//important
        //1.interaction
        if(this.enableInteraction)this.interact(physics);
        //2. move and draw and die
        let unit;
        for(let i=gameUnitList.length-1; i>=0;i--){
            unit=gameUnitList[i];
            if (!this.garbageCollect(unit, i)) {
                if(this.limitPosFlag)unit.body.limitPos(this.startLimitPos, this.endLimitPos);
                if(unit.canDraw)unit.draw(renderer);
                unit.update();
                unit.updateBody();
                
                if(this.enableEnvironment)environment.applyEnvironment(unit)
            }
        }
    }
    interact(physics){
        const gameUnitList=this.gameUnitList;//important
        let unit1,unit2;
        for(let i=gameUnitList.length-1; i>0;i--){
            unit1=gameUnitList[i];
            if(unit1.canInteract && unit1.getState()!==0){
                for(let j=i-1; j>=0; j--){
                    unit2=gameUnitList[j];
                    if(unit2.canInteract && unit2.getState()!==0){
                        physics.checkCollision(unit1,unit2);
                    }
                }
            }
        }
    }
    garbageCollect(e, i){
        if (e.getState()===0&&e.eventManager.onremove({do:true})) {
            this.gameUnitList.splice(i, 1);
            return true;
        }
        return false;
    }
    add(e){this.gameUnitList[this.gameUnitList.length]=e;}
    reset(){this.gameUnitList=[];this.LimitPosFlag=false;}
    setLimitPos(startPos, endPos){
        this.limitPosFlag=true;
        this.startLimitPos=startPos;
        this.endLimitPos=endPos;
    }
}


class GameWorldEnvironment{
    gravity=[] //중력
    drag=[] //유체 저항력
    constructor(){}
    reset(){this.gravity=[];this.drag=[];}
    addGravity(pos,size,acc){
        this.gravity[this.gravity.length]={pos:pos, size:size, acc:acc}
        //pos,size: 중력을 끼칠 범위 / acc: 중력가속도
    }
    addDrag(pos,size,vel,density){
        this.drag[this.drag.length]={pos:pos, size:size, vel:vel, density:density}
        //pos,size: 유체 저항을 끼칠 범위 / vel: 유체의 속도 / density: 유체의 밀도
    }
    applyEnvironment(unit){
        if(unit.physics&&unit.physics.enableEnvironment){
            this.applyGravity(unit.body, unit.physics)
            this.applyDrag(unit.body, unit.physics)
        }
    }
    applyGravity(body, physics) {
        for (let i = this.gravity.length - 1; i >= 0; i--) {
            if (this.isCollision(this.gravity[i],body)) {
                physics.setGravity(this.gravity[i].acc)
                return;
            }
        }
    }
    applyDrag(body, physics) {
        for (let i = this.drag.length - 1; i >= 0; i--) {
            if (this.isCollision(this.drag[i],body)) {
                physics.applyDrag(body.getRelativeVel(this.drag[i]), this.drag[i].density)
                return;
            }
        }
    }
    isCollision(body1, body2){
        const distance=[body2.pos[0]-body1.pos[0], body2.pos[1]-body1.pos[1]]
        if(distance[0]+body2.size[0]<=0||distance[0]-body1.size[0]>=0)return false;
        if(distance[1]+body2.size[1]<=0||distance[1]-body1.size[1]>=0)return false;
        return true;
    }
}


//test class 
class GameWorldPhysics{
    constructor(){}
    checkCollision(unit1, unit2){
        //if(!unit1.canInteract||!unit2.canInteract)return;
        const body1=unit1.body;
        const body2=unit2.body;
        const physics1 = unit1.physics;
        const physics2 = unit2.physics;
        if (!body1.canCollision || !body2.canCollision || !this.isCollision(body1, body2)) return;
        let collInfo = this.getCollsionInfo(body1, body2);
        const COLL_AXIS=collInfo.collAxis;
        const COLL_DIR=collInfo.dir;
        const COLL_DEPTH=collInfo.depth;
        let normal1=[0,0];normal1[COLL_AXIS]=COLL_DIR;
        let normal2=[0,0];normal2[COLL_AXIS]=-COLL_DIR;
        let do1 = unit1.eventManager.oncollision({ do: true, other: unit2, collisionNormal: normal1 });
        let do2 = unit2.eventManager.oncollision({ do: true, other: unit1, collisionNormal: normal2 });
        if (physics1 && physics2  && do1 && do2) {
            //EXEPTION HANDLING
            if (physics1.inv_mass === 0 && physics2.inv_mass === 0) return;
            const INV_SUM_INV_MASS = 1 / (physics1.inv_mass + physics2.inv_mass);
            //RESOLVE POSITION
            if(!(body1.overlap && body2.overlap)){
                const velDef = Math.abs(body2.vel[COLL_AXIS]-body1.vel[COLL_AXIS]);
                if(velDef==0){
                    let fixPosRatio = COLL_DIR*INV_SUM_INV_MASS*COLL_DEPTH;
                    body1.addPosAxis(COLL_AXIS,-fixPosRatio*physics1.inv_mass);
                    body2.addPosAxis(COLL_AXIS,fixPosRatio*physics2.inv_mass)
                }else{
                    let fixPosRatio = COLL_DIR*COLL_DEPTH/(Math.abs(body2.vel[COLL_AXIS])+Math.abs(body1.vel[COLL_AXIS]));
                    body1.addPosAxis(COLL_AXIS,-fixPosRatio*Math.abs(body1.vel[COLL_AXIS]));
                    body2.addPosAxis(COLL_AXIS,fixPosRatio*Math.abs(body2.vel[COLL_AXIS]))
                }
                
            }
            //RESOLVE VELOCITY
            let deltaVel=[body2.vel[0]-body1.vel[0], body2.vel[1]-body1.vel[1]];
            if (COLL_DIR * deltaVel[COLL_AXIS] > 0) return;
            deltaVel[COLL_AXIS]*=(1+Math.max(physics1.RESTITUTION_COEF, physics2.RESTITUTION_COEF))*INV_SUM_INV_MASS;//충격량
            // deltaVel[1-COLL_AXIS]*=Math.min(physics1.FRICTION_COEF,physics2.FRICTION_COEF)*INV_SUM_INV_MASS;//마찰력
            deltaVel[1-COLL_AXIS]*=Math.min(1,physics1.FRICTION_COEF * physics2.FRICTION_COEF * Math.abs(deltaVel[COLL_AXIS]));//마찰력
            
            physics1.addForce(deltaVel);
            deltaVel[0]=-deltaVel[0];deltaVel[1]=-deltaVel[1];
            physics2.addForce(deltaVel);
        }
        return;
    }
    isCollision(body1, body2){
        const distance=[body2.pos[0]-body1.pos[0], body2.pos[1]-body1.pos[1]];
        if(distance[0]+body2.size[0]<=0||distance[0]-body1.size[0]>=0)return false;
        if(distance[1]+body2.size[1]<=0||distance[1]-body1.size[1]>=0)return false;
        return true;
    }
    getCollsionInfo(body1, body2){
        const distance=[body2.pos[0]-body1.pos[0], body2.pos[1]-body1.pos[1]];
        const depths=[Math.abs(distance[0]-body1.size[0]),Math.abs(distance[0]+body2.size[0]),Math.abs(distance[1]-body1.size[1]),Math.abs(distance[1]+body2.size[1])];
        let minIndex=depths[0]>depths[1] ? 1 : 0;
        if(depths[minIndex]>depths[2])minIndex=2;
        if(depths[minIndex]>depths[3])minIndex=3;
        switch(minIndex){
            case 0: return {collAxis:0,dir:1,depth:depths[minIndex]} //RIGHT
            case 1: return {collAxis:0,dir:-1,depth:depths[minIndex]} //LEFT
            case 2: return {collAxis:1,dir:1,depth:depths[minIndex]} //TOP
            case 3: return {collAxis:1,dir:-1,depth:depths[minIndex]} //BOTTOM
        }
    }
}
