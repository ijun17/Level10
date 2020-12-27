class Animation {
    image=new Image();
    imageW;
    imageH;
    condition=function(){};
    constructor(src,w,h,cdt){
        this.image.src=src;
        this.imageW=w;
        this.imageH=h;
        this.condition=cdt;
    }
    draw(x,y,w,h){
        ctx.drawImage(this.image, this.condition()*this.imageW, 0, this.imageW,this.imageH,x,y,w,h);
    }
}