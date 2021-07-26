class EntityManager {
    interaction=true;
    entitys;
    constructor(){
        entitys=[];
    }

    clear(){entitys=[];}

    update(){
        if(this.interaction)this.interact();
    }

    interact(){
        for(let i=entitys.length-1; i>=0; i--){
            let e1=entitys[i];
            //최고속도 제한
            const maxV=80;
            if(e1.vx>maxV)e1.vx=maxV;
            else if(e1.vx<-maxV)e1.vx=-maxV;
            if(e1.vy>maxV)e1.vy=maxV;
            else if(e1.vy<-maxV)e1.vy=-maxV;
            if (e1.canFallDie&&e1.y > 2000) e1.life = 0;

            for(let j=i-1; j>=0; j--){
                let e2=entitys[j];
                let collisionType=this.AABB(e1,e2);
                if(this.AABB(e1,e2)>0){
                    e1.collisionHandler(e2, collisionType, true);
                    e2.collisionHandler(e1, 5-collisionType, true);
                    if (this.canCollision&&e.canCollision&&!(this.overlap && e.overlap)&&this.canMove) {
                        if (collisionType == 2) { //right collision
                            e1.vx = 0;
                            e1.x = e2.x - e1.w;
                        } else if (collisionType == 3) { //left collision
                            e1.vx = 0;
                            e1.x = e2.x + e2.w;
                        } else if (collisionType == 4) { //down collision
                            e1.vy = 0;
                            e1.y = e2.y - e1.h;
                            if (Math.abs(e1.vx) < 1) e1.vx = 0;
                            else e1.vx+= (e1.vx < 0 ? e1.friction : -e1.friction);
                        } else if (collisionType == 1) { //up collision
                            e1.vy = 0;
                            e1.y = e2.y + e2.h;
                            if (Math.abs(e2.vx) < 1) e2.vx = 0;
                            else e2.vx+= (e2.vx < 0 ? e2.friction : -e2.friction);
                        }
                    }
                }
            }
        }
    }

    AABB(e1,e2){
        //충돌체크
        if(e2.x+e2.vx < e1.x+e1.w&& e2.x+e2.vx+e2.w > e1.x && e2.y-e2.vy < e1.y+e1.h && e2.y-e2.vy+e2.h > e1.y){ 
            if (e1.y >= e2.y + e2.h) { //up collision
                return 1;
            } else if (e1.x + e1.w <= e2.x) { //right collision
                return 2;
            } else if (e1.x >= e2.x + e2.w) { //left collision
                return 3;
            }else if (e1.y + e1.h <= e2.y) { //down collision
                return 4;
            }else return 0;
        }
        return -1;
    }
}