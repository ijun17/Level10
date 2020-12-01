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
        this.canMove=false;
        this.collisionLevel=-2;
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y);
        new (this.drawCode)();
    }

    collisionHandler(e){
        if(e.w==0&&e.h==0){
            new (this.code)();
        }
    }
}