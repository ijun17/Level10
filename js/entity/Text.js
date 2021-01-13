class Text extends Entity{
    text;
    font;
    strokeColor;
    fillColor;
    camera;
    constructor(x,y,text,size,fillColor=null,strokeColor=null,life=100,camera=true){
        super(x,y,Game.TEXT_CHANNEL);
        this.text=text;
        this.font="bold " + size + "px Arial";
        this.strokeColor=strokeColor;
        this.fillColor=fillColor;
        this.life=life;
        this.camera=camera;
        this.canInteraction=false;
        this.ga=0;
    }
    draw(){
        ctx.font = this.font;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        let textX=this.x;
        let textY = this.y;
        if (this.camera) {
            textX = Camera.getX(textX);
            textY = Camera.getY(textY);
        }
        if (this.strokeColor != null) {
            ctx.strokeStyle = this.strokeColor;
            ctx.strokeText(this.text, textX, textY);
        }
        if (this.fillColor != null) {
            ctx.fillStyle = this.fillColor;
            ctx.fillText(this.text, textX, textY);
        }

        if(this.canRemoved)this.life--;
    }
}