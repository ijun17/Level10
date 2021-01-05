class Text extends Entity{
    text;
    size;
    strokeColor;
    fillColor;
    constructor(x,y,text,size,fillColor=null,strokeColor=null,life=100){
        super(x,y,Game.TEXT_CHANNEL);
        this.text=text;
        this.size=size;
        this.strokeColor=strokeColor;
        this.fillColor=fillColor;
        this.life=life;
        this.canInteraction=false;
        this.ga=0;
    }
    draw(){
        ctx.font = "bold " + this.size + "px Arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        if(this.strokeColor!=null){
            ctx.strokeStyle = this.strokeColor;
            ctx.strokeText(this.text, Camera.getX(this.x), Camera.getY(this.y));
        }
        if(this.fillColor!=null){
            ctx.fillStyle = this.fillColor;
            ctx.fillText(this.text, Camera.getX(this.x), Camera.getY(this.y));
        }
        this.life--;
    }
}