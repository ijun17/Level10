class TextPanel extends Entity{
    colors=[]; //text color / colors[0] is back ground color
    px=[]; //text size , px[0] is newLine size
    texts=[] //[type, text] type0=\n
    tx;//text x
    ty;//text y
    textBaseline = "top";
    textAlign="left";

    constructor(x,y,w,h,chanel=Game.TEXT_CHANNEL){
        super(x,y,chanel);
        this.w=w;
        this.h=h;
        this.tx=0;
        this.ty=0;
        this.colors[0]=null;
        this.px[0]=0;
    }
    update(){
        this.draw();
    }
    draw(){
        if(this.colors[0]!=null){
            ctx.fillStyle=this.colors[0];
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
        let lineY=this.ty+this.y;
        let lineX=this.x+this.tx;
        let textType;
        ctx.textBaseline = this.textBaseline;
        ctx.textAlign = this.textAlign;
        for(let i=0, l=this.texts.length; i<l; i++){
            textType=this.texts[i][0];
            if(textType==0){
                lineY+=this.px[0]*this.texts[i][1];
            }else {
                ctx.fillStyle=this.colors[textType];
                ctx.font = "bold " + this.px[textType] + "px Arial";
                ctx.fillText(this.texts[i][1],lineX,lineY);
                lineY+=this.px[textType]+this.px[0];
            }
        }
    }
}