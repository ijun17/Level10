class Text extends Entity{
    text;
    font;
    strokeColor;
    fillColor;
    camera;
    textBaseline="middle";
    textAlign="center";
    constructor(x,y,text="",size="1",fillColor=null,strokeColor=null,life=100,camera=true){
        super(x,y,World.TEXT_CHANNEL);
        this.text=text;
        this.font="bold " + size + "px Arial";
        this.strokeColor=strokeColor;
        this.fillColor=fillColor;
        this.life=life;
        this.camera=camera;
        this.canInteract=false;
        this.ga=0;
        this.canRemoved=false;
    }
    update(){
        super.update();
        if(this.life>0)this.life--;
        else if(this.life==0) this.canRemoved=true;
    }
    draw(r){
        r.ctx.textBaseline = this.textBaseline;
        r.ctx.textAlign = this.textAlign;
        r.ctx.font = this.font;
        const textX=(this.camera ? EntityRenderer.Camera.getX(this.x) : this.x);
        const textY=(this.camera ? EntityRenderer.Camera.getY(this.y) : this.y);
        if (this.strokeColor != null) {
            r.ctx.strokeStyle = this.strokeColor;
            r.ctx.strokeText(this.text, textX, textY);
        }
        if (this.fillColor != null) {
            r.ctx.fillStyle = this.fillColor;
            r.ctx.fillText(this.text, textX, textY);
        }
    }
}