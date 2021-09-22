class EntityManager{
    entitys;
    entityInteraction=true;
    MAX_V=80;
    LIMIT_Y=2000;
    constructor(ei=true){
        this.entitys=[];
        this.entityInteraction=ei;
    }
    push(e){this.entitys[this.entitys.length]=e;if(!(e instanceof Entity))console.log("non entity pushed")}
    get(i){return this.entitys[i];}
    clear(){this.entitys=[];}
    length(){return this.entitys.length;}

    update(){
        let entitys=this.entitys;//important
        //1.interlaction
        if(this.entityInteraction)this.interact();
        //2. move and draw and die
        let entity;
        for(let i=entitys.length-1; i>=0;i--){
            entity=entitys[i];
            if (entity.canRemoved && (entity.life < 1 || (entity.y>this.LIMIT_Y&&entity.canFallDie)) && entity.removeHandler()) {
                entitys.splice(i, 1);
            }else {
                const maxV = 80;
                if(Math.abs(entity.vx)>maxV)entity.vx=Math.sign(entity.vx)*maxV;
                if(Math.abs(entity.vy)>maxV)entity.vy=Math.sign(entity.vy)*maxV;
                entity.update();
            }
        }
    }

    interact(){
        for(let i=this.entitys.length-1; i>0;i--){
            let e=this.entitys[i];

            if(e.canInteract){
                for (let j = i - 1; j >= 0; j--) {
                    let e2 = this.entitys[j];
                    if (e2.canInteract && this.isCollision(e, e2)) {
                        this.collision(e, e2);
                    }
                }
            }
        }
    }

    isCollision(a,b){
        if(a.x>=b.x+b.w||a.x+a.w<=b.x)return false;
        if(a.y>=b.y+b.h||a.y+a.h<=b.y)return false;
        return true;
    }
    collision(entity1,entity2){
        let a=(entity1.inv_mass>entity2.inv_mass?entity1:entity2); //light
        let b=(entity1.inv_mass<=entity2.inv_mass?entity1:entity2); //heavy

        let normalAndOverlap = this.getCollisionNormal(a,b);
        let normal=normalAndOverlap[0];
        let overlap=normalAndOverlap[1];

        let collisionHandling = a.collisionHandler(b, normal[0]+normal[1]*2);
        if(!(b.collisionHandler(a,-normal[0]-normal[1]*2)&&collisionHandling))return; //prevent defalult
        if(a.overlap&&b.overlap)return; //ignore phsics collision
        if(a.inv_mass===0 && b.inv_mass===0){
            //special collision 
            let changeE=a;
            let fixedE=b;
            if(normal[0]==0){
                if(a.vy==0&&b.vy==0)return;
                if(Math.abs(a.vy)<Math.abs(b.vy)){changeE=b;fixedE=a;normal=[-normal[0], -normal[1]]}
                changeE.y=(normal[1]>0?fixedE.y+fixedE.h : fixedE.y-changeE.h);
                changeE.vy=0;
            }else{
                if(a.vx==0&&b.vx==0)return;
                if(Math.abs(a.vx)<Math.abs(b.vx)){changeE=b;fixedE=a;normal=[-normal[0], -normal[1]]}
                changeE.x=(normal[1]>0?fixedE.x+fixedE.w : fixedE.x-changeE.w);
                changeE.vx=0;
            }
            return;
        }else{
            //coordinate fix
            let milyunam=[0,0];
            let temp=b.inv_mass/(a.inv_mass+b.inv_mass);
            milyunam=[1-temp,temp];
            a.x-=milyunam[0]*overlap*normal[0];
            b.x+=milyunam[1]*overlap*normal[0];
            a.y+=milyunam[0]*overlap*normal[1];
            b.y-=milyunam[1]*overlap*normal[1];

            //friction
            if(normal[0]==0){
                if (Math.abs(a.vx) < a.SFV) a.vx = 0;
                else a.vx += a.vx > 0 ? -a.friction : a.friction;
                if (Math.abs(b.vx) < b.SFV) b.vx = 0;
                else b.vx += b.vx > 0 ? -b.friction : b.friction;
            }

            //action and reaction
            let velAlongNormal=(b.vx-a.vx)*normal[0] + (b.vy-a.vy)*normal[1];
            if(velAlongNormal>0){return;}//collsion normal =/= vector direction
            let e=(a.COR<b.COR ? a.COR : b.COR);
            let j = -(1+e)*velAlongNormal/(a.inv_mass+b.inv_mass);
            let imperse = [j*normal[0], j*normal[1]];
            a.giveForce(-imperse[0], -imperse[1]);
            b.giveForce(imperse[0], imperse[1]);
        }
    }
    getCollisionNormal(a, b){
        let normal=[0,0];
        let overlaps=[Math.abs(a.x+a.w-(b.x)),Math.abs(a.x-(b.x+b.w)),Math.abs(a.y-(b.y+b.h)),Math.abs(a.y+a.h-b.y)]; //[right, left, top, bottom]

        let min_i=0;
        min_i= overlaps[min_i]<overlaps[1] ? min_i : 1;
        min_i= overlaps[min_i]<overlaps[2] ? min_i : 2;
        min_i= overlaps[min_i]<overlaps[3] ? min_i : 3;
        switch(min_i){
            case 0:
                normal=[1,0];//right
                break;
            case 1:
                normal=[-1,0];//left
                break;
            case 2:
                normal=[0,1];//top
                break;
            case 3:
                normal=[0,-1];//bottom
                break;
        }
        return [normal, overlaps[min_i]];
    }
}