class Button extends Entity {
    code = function () { };
    temp = new Array();

    boxFill=null;
    boxLine=null;
    text=null;
    font="";
    px="";
    textFill=null;
    textLine=null;
    textX=0;
    textY=0;


    constructor(x, y, w, h, channelLevel=Game.BUTTON_CHANNEL) {
        super(x, y, channelLevel);
        this.w = w;
        this.h = h;
        this.ga = 0;
        this.overlap=false;
        this.canAct = false;
        this.canInteract=false;
        this.canMove=false;
        this.canRemoved=false;
    }

    draw() {
        if (this.boxFill != null) {
            ctx.fillStyle = this.boxFill;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
        if (this.boxLine != null) {
            ctx.strokeStyle = this.boxLine;
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
        if (this.text != null) {
            ctx.font = "bold " + this.px + "px Arial";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            if (this.textFill != null) {
                ctx.fillStyle = this.textFill;
                ctx.fillText(this.text, this.x + this.textX, this.y + this.textY);
            }
            if (this.textLine != null) {
                ctx.strokeStyle = this.textLine;
                ctx.strokeText(this.text, this.x + this.textX, this.y + this.textY);
            }
        }
    }

    drawOption(boxFill = null, boxLine = null, text = null, px = 10, textFill = null, textLine = null) {
        this.textX=this.w >> 1; this.textY=(this.h >> 1) + this.h / 20;
        this.boxFill=boxFill;
        this.boxLine=boxLine;
        this.text=text;
        this.px=px;
        this.textFill=textFill;
        this.textLine=textLine;
    }

    collisionHandler(e,ct) {
        if (ct=="c") this.code(e,ct);//c=click
    }
}