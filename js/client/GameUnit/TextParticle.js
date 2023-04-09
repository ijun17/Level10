class TextParticle extends GameUnit{
    text;
    font;
    strokeColor;
    fillColor;
    textBaseline="middle";
    textAlign="center";
    life;
    constructor(pos,text="",size="1",fillColor=null,strokeColor=null,life=100){
        super(new UnitBody(pos,[0,0]));
        this.setLayer(PARTICLE_LAYER)
        this.text=text;
        this.font="bold " + size + "px Arial";
        this.strokeColor=strokeColor;
        this.fillColor=fillColor;
        this.life=life;
        this.canInteract=false;
        this.canRemoved=false;
    }
    update(){
        if(this.life>0)this.life--;
        else if(this.life==0) this.setState(0);
    }
    draw(r){
        r.ctx.textBaseline = this.textBaseline;
        r.ctx.textAlign = this.textAlign;
        r.ctx.font = this.font;
        if (this.strokeColor != null) {
            r.ctx.strokeStyle = this.strokeColor;
            r.strokeText(this.text, this.body);
        }
        if (this.fillColor != null) {
            r.ctx.fillStyle = this.fillColor;
            r.fillText(this.text, this.body);
        }
    }
}