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
    draw(x,y,w,h,isNotInverse){
        if(isNotInverse)ctx.drawImage(this.image, 0, this.condition()*this.imageH, this.imageW,this.imageH,x,y,w,h);
        else {
            ctx.save();
            ctx.translate(x, y);
			ctx.scale(-1, 1);
            ctx.drawImage(this.image, 0,this.condition()*this.imageH,  this.imageW,this.imageH,-w,0,w,h);
            ctx.restore();
        }
    }
}