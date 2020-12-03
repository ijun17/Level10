class Button extends Entity {
    code = function () { };
    drawCode = function () { };
    temp = new Array();
    isTextBtn = true;

    constructor(x, y, w, h) {
        super(x, y);
        this.w = w;
        this.h = h;

        this.canRemoved = false;
        this.canAct = false;
        this.ga = 0;
        //this.canMove=false;
        this.collisionLevel = -8;
    }

    draw() {
        if (this.isTextBtn) new (this.drawCode)();
        else ctx.drawImage(this.img, this.x, this.y);
    }

    drawOption(boxFill = null, boxLine = null, text = null, px = 10, textFill = null, textLine = null) {
        let thisBtn = this;
        let textW = this.w / 2;
        let textH = this.h / 2 + this.h / 20;
        this.drawCode = function () {
            if (boxFill != null) {
                ctx.fillStyle = boxFill;
                ctx.fillRect(thisBtn.x, thisBtn.y, thisBtn.w, thisBtn.h);
            }
            if (boxLine != null) {
                ctx.strokeStyle = boxLine;
                ctx.strokeRect(thisBtn.x, thisBtn.y, thisBtn.w, thisBtn.h);
            }
            if (text != null) {
                ctx.font = "bold " + px + "px Arial";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                if (textFill != null) {
                    ctx.fillStyle = textFill;
                    ctx.fillText(text, thisBtn.x + textW, thisBtn.y + textH);
                }
                if (textLine != null) {
                    ctx.strokeStyle = textLine;
                    ctx.strokeText(text, thisBtn.x + textW, thisBtn.y + textH);
                }
            }
        }
    }

    collisionHandler(e) {
        if (e.w == 0 && e.h == 0) {
            new (this.code)();
        }
        if (e instanceof Button) {//button끼리는 충돌
            if (this.x + this.w <= e.x) { //left collision
                this.vx = 0;
                this.x = e.x - this.w;
            } else if (this.x >= e.x + e.w) { //right collision
                this.vx = 0;
                this.x = e.x + e.w;
            } else if (this.y + this.h <= e.y) { //down collision
                this.vy = -this.ga;
                this.y = e.y - this.h - this.ga;
            } else if (this.y >= e.y + e.h) { //up collision
                this.vy = -this.ga;
                this.y = e.y + e.h - this.ga;
            }
        }
    }
}