class Button extends Entity{
    code=function(){};
    drawCode=function(){};

    constructor(x,y,w,h,img,code){  
        super(x,y);
        this.w=w;
        this.h=h;
        if(img!=null)this.img.src="resource/button/"+img;
        this.code=code;

        this.canRemoved=false;
        this.canAct=false;
        this.ga=0;
        //this.canMove=false;
        this.collisionLevel=-8;
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y);
        new (this.drawCode)();
    }

    collisionHandler(e){
        if(e.w==0&&e.h==0){
            new (this.code)();
        }else if(e.collisionLevel==-8){//button끼리는 충돌
            if(this.x+this.w<=e.x){ //left collision
                this.vx=0;
                this.x=e.x-this.w;
            }else if(this.x>=e.x+e.w){ //right collision
                this.vx=0;
                this.x=e.x+e.w;
            }else if(this.y+this.h<=e.y){ //down collision
                this.vy=0;
                this.y=e.y-this.h;
            }else if(this.y>=e.y+e.h){ //up collision
                this.vy=0;
                this.y=e.y+e.h;
            }
        }
    }
}