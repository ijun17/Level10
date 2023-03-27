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
        for(let i=0; i<layerCount; i++)this.layer[i]=new WorldLayer();
    }
    reset(){for(let i=0, l=this.layer.length; i<l; i++)this.layer[i].reset();this.environment.reset();}
    update(){for(let i=0, l=this.layer.length; i<l; i++)this.layer[i].update(this.environment);}
    add(unit){this.layer[unit.getLayer()].add(unit);}
}

class WorldLayer{
    gameUnitList=[];
    enableEnvironment=true;
    enableInteraction=true;
    enableClick=false;
    MAX_V=80;
    constructor(){}
    update(environment){
        let renderer = Game.screen.renderer;
        let gameUnitList=this.gameUnitList;//important
        //1.interlaction
        if(this.enableInteraction)this.interact();
        //2. move and draw and die
        let unit;
        for(let i=gameUnitList.length-1; i>=0;i--){
            unit=gameUnitList[i];
            if (!this.garbageCollect(unit, i)) {
                //unit.limitVector(this.MAX_V);
                
                unit.draw(renderer);
                unit.update();
                unit.updateBody();
                if(this.enableEnvironment)environment.applyEnvironment(unit)
            }
        }
    }
    interact(){
        let gameUnitList=this.gameUnitList;//important
        let unit1;
        for(let i=gameUnitList.length-1; i>0;i--){
            unit1=gameUnitList[i];
            if(unit1.canInteract)for(let j=i-1; j>=0; j--)unit1.interact(gameUnitList[j]);
        }
    }
    garbageCollect(e, i){
        if (e.state===0) {
            this.gameUnitList.splice(i, 1);
            return true;
        }
        return false;
    }
    add(e){this.gameUnitList[this.gameUnitList.length]=e;}
    reset(){this.gameUnitList=[];}
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
    addDrag(pos,size,vel,dragPower){
        this.drag[this.drag.length]={pos:pos, size:size, vel:vel, density:density}
        //pos,size: 유체 저항을 끼칠 범위 / vel: 유체의 속도 / density: 유체의 밀도
    }
    applyEnvironment(unit){
        this.applyGravity(unit)
        this.applyDrag(unit)
    }
    applyGravity(unit){
        if(unit.physics){
            for(let i=this.gravity.length-1; i>=0; i--){
                if(unit.body.isCollision(this.gravity[i])){
                    unit.physics.setGravity(this.gravity[i].acc)
                    return;
                }
            }
        }
    }
    applyDrag(unit){
        if(unit.physics){
            for(let i=this.drag.length-1; i>=0; i--){
                if(unit.body.isCollision(this.drag[i])){
                    unit.physics.applyWorldDrag(unit.body.getRelativeVel(this.drag[i]), this.drag[i].density)
                    return;
                }
            }
        }
    }
}


//test class 
class GameWorldPhysics{
    constructor(){}
    checkCollision(unit1, unit2){
        //if(!unit1.canInteract||!unit2.canInteract)return;
        const body1=unit1.body;
        const body2=unit2.body;
        const physics1=unit1.physics;
        const physics2=unit2.physics;
        if(!body1.canCollision||!body2.canCollision)return;
        if (this.isCollision(body1,body2)) {
            let collInfo = this.getCollsionInfo(body1,body2);
            let do1 = unit1.eventManager.oncollision({do:true,other:unit2,collisionNormal:collInfo.normal});
            let do2 = unit2.eventManager.oncollision({do:true,other:unit1,collisionNormal:calvec(collInfo.normal,'*',[-1,-1])});
            if(physics1&&physics2 && !(body1.overlap&&body2.overlap) && do1 && do2){
                //unit1.physics.applyCollision(unit2.physics, this.getRelativeVel(body1,body2), collInfo.normal)
                //let fixPosRatio = unit1.physics.getMassRatio(unit2.physics);
                //body1.addPos(calvec(collInfo.normal,'*',-fixPosRatio[0]*collInfo.depth))
                //body2.addPos(calvec(collInfo.normal,'*',fixPosRatio[1]*collInfo.depth))
                this.fixCollisionPos();
                this.fixCollisionVel();
            }
            return;
        }
    }
    applyCollision(physics1, physics2, rel_vel, collisionNormal){
        let imperse=physics1.getImperse(physics2, rel_vel, collisionNormal);
        if(imperse===null)return;
        physics1.addForce(imperse);
        physics2.addForce(calvec(imperse,'*',[-1,-1]))
        let friction=physics1.getFriction(physics2, rel_vel, collisionNormal);
        //console.log(friction)
        physics1.applyResistance(friction, 1);
        physics2.applyResistance(friction, -1);
    }
    isCollision(body1, body2){
        const distance=this.getRelativePos(body1,body2);
        if(distance[0]+body2.size[0]<0||distance[0]-body1.size[0]>0)return false;
        if(distance[1]+body2.size[1]<0||distance[1]-body1.size[1]>0)return false;
        return true;
    }
    fixCollisionPos(body1, body2, ){

    }
    fixCollisionVel(body1, body2, ){

    }
    getRelativePos(body1, body2){return [body2.pos[0]-body1.pos[0], body2.pos[1]-body1.pos[1]]}
    getRelativeVel(body1, body2){return [body2.vel[0]-body1.vel[0], body2.vel[1]-body1.vel[1]]}
    getCollsionInfo(body1, body2){
        const distance=this.getRelativePos(body1,body2);
        const depths=[Math.abs(distance[0]-body1.size[0]),
                    Math.abs(distance[0]+body2.size[0]),
                    Math.abs(distance[1]-body1.size[1]),
                    Math.abs(distance[1]+body2.size[1])];
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
