//var canvas = document.getElementById("myCanvas");
//var ctx = canvas.getContext("2d");

let entitys = new Array();
let time=0;
let p;

class Entity{
    x;y;w=0;h=0;vx=0;vy=0;ga=0.1;friction=1.01; //phisics;
    life=1;
    
    overlap=true; //겹칠 수 있는가
    canRemoved=true; //삭제될 수 있는가

    canMove=true; //움직일 수 있는가
    canAct=true; //행동을 할 수 있는가
    visibility=true; //보일 수 있는가

    img = new Image; //엔티티의 이미지
    action=new Array();//행위들 [시작시간, 종료시간-1, 코드]

    constructor(x,y){
        this.x=x;
        this.y=y;
        entitys.push(this);
    }

    update(){
        if(this.canRemoved && this.life<1){
            this.removeEntity();
            return;
        }
        if(this.visibility)this.draw();
        this.act();
        if(this.canMove)this.move();
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y);
    }

    act(){
        let removed=0;
        for(let i=0; i<this.action.length;i++){
            if(this.action[i][1]<time){
               removed++;
            }else if(this.action[i][0]<=time){
                //eval(this.action[i][2]);
                new this.action[i][2]();
            }
        }
        this.action.splice(0,removed);
    }

    addAction(start, end, code){
        let i;
        for(i=0; i<this.action.length; i++){
            if(this.action[2]>=end+time)break;
        }
        this.action.splice(i,0,[start+time, end+time, code]);
    }

    move(){
        var isDownCollision=false;
        if(this.vx>20)this.vx=20;
        if(this.vy>20)this.vy=20;
        for(var e of entitys){//entity collision event
            if(e!=this&&this.x+this.vx<e.x+e.w&&this.x+this.vx+this.w>e.x&&this.y-this.vy<e.y+e.h&&this.y-this.vy+this.h>e.y){
                if(entitys.indexOf(this)==-1)return; //엔티티 리스트에서 삭제시 연산 종료
                this.collisionHandler(e);
                if(!this.overlap||!e.overlap){
                    if(this.x+this.w<=e.x){ //left collision
                        this.vx=0;
                        this.x=e.x-this.w;
                    }else if(this.x>=e.x+e.w){ //right collision
                        this.vx=0;
                        this.x=e.x+e.w;
                    }else if(this.y+this.h<=e.y){ //down collision
                        this.vy=0;
                        this.y=e.y-this.h;
                        isDownCollision=true;
                    }else if(this.y>=e.y+e.h){ //up collision
                        this.vy=0;
                        this.y=e.y+e.h;
                    }
                }
            }
        }
        this.x+=this.vx;
        this.y-=this.vy;
        if(isDownCollision){
            if(Math.abs(this.vx)>1)this.vx/=this.friction;
            else this.vx=0;
        }
        
        this.vy-=this.ga//*Math.sqrt(this.w*this.h)/20;
    }

    setVectorX(vx){
        this.vx=vx;
    }
    setVectorY(vy){
        this.vy=vy;
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
    collisionHandler(e){} //isActor가 true면 주체라는 뜻
    removeHandler(){};

}