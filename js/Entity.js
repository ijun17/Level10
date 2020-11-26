//var canvas = document.getElementById("myCanvas");
//var ctx = canvas.getContext("2d");

let entitys = new Array();
let time=0;
let p;

class Entity{
    x;y;w=0;h=0;vx=0;vy=0;ga=0.1;friction=0.9; //phisics;
    life=1;
    
    overlap=true; //겹칠 수 있는가
    canRemoved=true; //삭제될 수 있는가
    visibility=true; //보일 수 있는가
    canMove=true; //움직일 수 있는가
    canAct=true; //행동을 할 수 있는가

    img = new Image; //엔티티의 이미지

    action=new Array(); //한 틱마다 행위들 [시작시간, 종료시간-1, 코드]

    constructor(x,y){
        this.x=x;
        this.y=y;
        entitys.push(this);
    }

    update(){
        if(this.visibility)this.draw();
        this.act();
        if(this.canMove)this.move();
        if(this.canRemoved && this.life<1)this.removeEntity();
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y);
    }

    addAction(start, end, code){
        var i;
        for(i=0; i<this.action.length; i++){
            if(this.action[i][1]>=end+time)break;
        }
        this.action.splice(i,0,[start+time, end+time, code]);
    }

    act(){
        let removed=0;
        for(var a of this.action){
            if(a[1]<time){
               removed++;
            }else if(a[0]<=time){
                new (a[2])();
            }
        }
        this.action.splice(0,removed);
    }

    move(){
        if(this.y>canvas.height+100)this.life=0;
        var collisionType;
        for(var e of entitys){//entity collision event
            if(e!=this&&this.x+this.vx<e.x+e.w&&this.x+this.vx+this.w>e.x&&this.y-this.vy<e.y+e.h&&this.y-this.vy+this.h>e.y){
                if(entitys.indexOf(this)==-1)return; //엔티티 리스트에서 삭제시 연산 종료

                if(this.x+this.w<=e.x){ //left collision
                    collisionType='L';
                }else if(this.x>=e.x+e.w){ //right collision
                    collisionType='R';
                }else if(this.y+this.h<=e.y){ //down collision
                    collisionType='D';
                }else if(this.y>=e.y+e.h){ //up collision
                    collisionType='U';
                }
                this.collisionHandler(e,collisionType,true);
                e.collisionHandler(this,collisionType,false);
                if(!(this.overlap&&e.overlap)){
                    if(collisionType=='L'){ //left collision
                        this.vx=0;
                        this.x=e.x-this.w;
                    }else if(collisionType=='R'){ //right collision
                        this.vx=0;
                        this.x=e.x+e.w;
                    }else if(collisionType=='D'){ //down collision
                        this.vy=0;
                        this.y=e.y-this.h;
                    }else if(collisionType=='U'){ //up collision
                        this.vy=0;
                        this.y=e.y+e.h;
                    }
                }
            }
        }
        this.x+=this.vx;
        this.y-=this.vy;
        if(collisionType=='D'){
            if(Math.abs(this.vx)>1.8&&time%10==0)this.vx*=this.friction;
            if(Math.abs(this.vx)<=1.8)this.vx=0;
        }
        this.vy-=this.ga;
    }

    setVectorX(vx){
        this.vx=vx;
    }
    setVectorY(vy){
        this.vy=vy;
    }
    giveForce(ax,ay){
        this.vx+=ax;
        this.vy+=ay;
    }
    removeEntity(){
        if(this.canRemoved){
            var ei = entitys.indexOf(this);
            if(ei>=0)entitys.splice(ei, 1);
            this.removeHandler();
        }
    }
    setGravity(ga){
        this.ga=ga;
    }
    setLife(life){
        this.life=life;
    }

    //event handler
    collisionHandler(e,collisionType, isActor){}
    removeHandler(){}

}