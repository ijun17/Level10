//var canvas = document.getElementById("myCanvas");
//var ctx = canvas.getContext("2d");

let entitys = new Array();

class Entity{
    x;
    y;
    w=0;
    h=0;
    vx=0;
    vy=0;
    ga=0.1; //default 0.1
    img = new Image;

    constructor(x,y,src){
        this.x=x;
        this.y=y;
        this.img.src = src;
        entitys.push(this);
    }
    
    draw(){
        ctx.drawImage(this.img, this.x, this.y);
        this.do();
        this.move();
    }

    move(){

        if(this.vx>20)this.vx=20;
        if(this.vy>20)this.vy=20;

        var newx = this.x+this.vx;
        var newy = this.y-this.vy;
        //entity충돌
        for(var e of entitys){
            if(e!=this
                &&this.x+this.vx<e.x+e.w
                &&this.x+this.vx+this.w>e.x
                &&this.y-this.vy<e.y+e.h
                &&this.y-this.vy+this.h>e.y){
                this.collisionHandler("entity", e);
            }
        }
        //캔버스 끝 충돌
        if(this.x+this.vx > canvas.width-this.w){ //오른쪽충돌
            this.vx=0;
            this.x=canvas.width-this.w;
            this.collisionHandler("rightwall");
        }else if(this.x+this.vx < 0){ //왼쪽충돌
            this.vx=0;
            this.x=0;
            this.collisionHandler("leftwall");
        }else{
            this.x+=this.vx;
        }
        if(this.y-this.vy > canvas.height-this.h){ //아래충돌
            this.vy=0;
            this.y=canvas.height-this.h;
            this.collisionHandler("downwall");
        }else if(this.y-this.vy < 0){ //위충돌
            this.vy=0;
            this.y=0;
            this.collisionHandler("upwall");
        }else{
            this.y-=this.vy;
        }
        //중력가속도
        if(this.y<canvas.height-this.h)this.vy-=this.ga;
    }

    do(){}

    setVectorX(vx){
        this.vx=vx;
    }
    setVectorY(vy){
        this.vy=vy;
    }
    removeEntity(){
        let thisIndex = entitys.indexOf(this);
        entitys.splice(thisIndex, thisIndex);
    }
    setGravity(ga){
        this.ga=ga;
    }
    setImage(src){
        this.img.src=src;
    }

    collisionHandler(type, entity){}

}