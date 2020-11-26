class Button extends Entity{
    code;
    constructor(x,y,w,h,img,code){  
        super(x,y);
        this.w=w;
        this.h=h;
        this.img.src="resource/button/"+img;
        this.code=code;

        this.canRemoved=false;
        this.ga=0;
        this.canAct=false;
    }

    collisionHandler(e){
        if(e.w==0&&e.h==0){
            new (this.code)();
        }
    }
}