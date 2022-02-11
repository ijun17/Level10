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


    constructor(x, y, w, h, channelLevel=World.BUTTON_CHANNEL) {
        super(x, y, channelLevel);
        this.w = w;
        this.h = h;
        this.ga = 0;
        this.inv_mass=0;
        this.COR=1;
        this.overlap=false;
        this.canAct = false;
        this.canInteract=false;
        this.canMove=false;
        this.canRemoved=false;
    }

    draw(r) {
        let x=Math.floor(this.x), y=Math.floor(this.y);
        if (this.boxFill !== null) {
            r.ctx.fillStyle = this.boxFill;
            r.ctx.fillRect(x, y, this.w, this.h);
        }
        if (this.boxLine !== null) {
            r.ctx.strokeStyle = this.boxLine;
            r.ctx.strokeRect(x, y, this.w, this.h);
        }
        if (this.text !== null) {
            r.ctx.font = `bold ${this.px}px Arial`;//"bold " + this.px + "px Arial";
            r.ctx.textBaseline = "middle";
            r.ctx.textAlign = "center";
            if (this.textFill !== null) {
                r.ctx.fillStyle = this.textFill;
                r.ctx.fillText(this.text, x + this.textX, y + this.textY);
            }
            if (this.textLine !== null) {
                r.ctx.strokeStyle = this.textLine;
                r.ctx.strokeText(this.text, x + this.textX, y + this.textY);
            }
        }
    }

    drawOption(boxFill = null, boxLine = null, text = null, px = 10, textFill = null, textLine = null) {
        this.textX=Math.floor(this.w >> 1); this.textY=Math.floor((this.h >> 1) + (this.h >>4));
        this.boxFill=boxFill;
        this.boxLine=boxLine;
        this.text=text;
        this.px=px;
        this.textFill=textFill;
        this.textLine=textLine;
    }

    setStatic(){this.COR=0; this.inv_mass=0; this.ga=0; this.canMove=false;this.canInteract=true;}
}