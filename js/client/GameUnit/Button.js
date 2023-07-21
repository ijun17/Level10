class Button extends GameUnit{
    image;
    color;
    text;
    textBody;
    constructor(pos, size, color, text){
        super(new UnitBody(pos, size));
        this.setLayer(BUTTON_LAYER);
        this.color=color;
        this.text=text;
        this.textBody={pos:[this.body.midX,this.body.midY-this.body.size[1]], size:this.body.size};
    }
    draw(r){
        r.strokeRect(this.color,this.body,{cameraOn:false});
        r.ctx.fillStyle="white";
        r.ctx.font = '48px arial';
        r.ctx.textBaseline = "middle";
        r.ctx.textAlign = "center";
        r.fillText(this.text,this.textBody,{cameraOn:false});
    }
    ontouchstart(){}
    ontouchmove(){}
    ontouchend(){}
    isTouched(touch){
        let b=this.body;
        let distX=touch.clientX - b.pos[0];
        let distY=SCREEN.perY(100)-touch.clientY - b.pos[1];
        return (0 < distX && distX < b.size[0] && 0 < distY && distY< b.size[1]);
    }
}