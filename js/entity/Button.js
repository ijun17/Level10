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

    draw() {
        let x=Math.floor(this.x);let y=Math.floor(this.y);
        if (this.boxFill !== null) {
            ctx.fillStyle = this.boxFill;
            ctx.fillRect(x, y, this.w, this.h);
        }
        if (this.boxLine !== null) {
            ctx.strokeStyle = this.boxLine;
            ctx.strokeRect(x, y, this.w, this.h);
        }
        if (this.text !== null) {
            ctx.font = `bold ${this.px}px Arial`;//"bold " + this.px + "px Arial";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            if (this.textFill !== null) {
                ctx.fillStyle = this.textFill;
                ctx.fillText(this.text, x + this.textX, y + this.textY);
            }
            if (this.textLine !== null) {
                ctx.strokeStyle = this.textLine;
                ctx.strokeText(this.text, x + this.textX, y + this.textY);
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

    collisionHandler(e,ct) {
        if (ct==="c") this.code(e,ct);//c=click
        return true;
    }

    setStatic(){this.COR=0; this.inv_mass=0; this.ga=0; this.canMove=false;this.canInteract=true;}
}