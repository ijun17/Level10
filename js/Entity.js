//let entitys = new Array();

class Entity {
    channelLevel;

    x = 0; y = 0; w = 0; h = 0; vx = 0; vy = 0; ga = -0.15; friction = 0.4; //phisics;
    life = 1;

    overlap = true;
    canRemoved = true; //삭제될 수 있는가
    visibility = true; //보일 수 있는가
    canMove = true; //움직일 수 있는가
    canAct = true; //행동을 할 수 있는가
    canInteraction = true;

    img = new Image; //엔티티의 이미지

    action = new Array(); //한 틱마다 행위들 [시작시간, 종료시간-1, 코드]

    constructor(x, y, channelLevel = 0) {
        this.x = x;
        this.y = y;
        this.channelLevel = channelLevel;
        Game.channel[channelLevel][Game.channel[channelLevel].length] = this;
        //Game.channel[channelLevel]=[this].concat(Game.channel[channelLevel]);
    }

    update() {
        if (this.visibility) this.draw();
        if (this.canAct) this.act();
        if (this.canInteraction) this.interaction();
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y);
    }

    addAction(start, end, code) {
        var i;
        for (i = 0; i < this.action.length; i++) {
            if (this.action[i][1] >= end + Game.time) break;
        }
        this.action.splice(i, 0, [start + Game.time, end + Game.time, code]);
    }

    act() {
        let removed = 0;
        for (var a of this.action) {
            if (a[1] < Game.time) {
                removed++;
            } else if (a[0] <= Game.time) {
                new (a[2])();
            }
        }
        this.action.splice(0, removed);
    }

    interaction() {
        if (this.y > canvas.height + 100) this.life = 0;
        if (this.life < 1) return;
        let collisionType = null;

        for (var e of Game.channel[this.channelLevel]) {//entity collision event
            if (e != this && this.x + this.vx < e.x + e.w && this.x + this.vx + this.w > e.x && this.y - this.vy < e.y + e.h && this.y - this.vy + this.h > e.y) {
                if (!(this.overlap && e.overlap)) {
                    if (this.x + this.w <= e.x) { //right collision
                        collisionType = 'R';
                    } else if (this.x >= e.x + e.w) { //left collision
                        collisionType = 'L';
                    } else if (this.y + this.h <= e.y) { //down collision
                        collisionType = 'D';
                    } else if (this.y >= e.y + e.h) { //up collision
                        collisionType = 'U';
                    }
                }
                this.collisionHandler(e, collisionType, true);
                if (!(this.overlap && e.overlap)) {
                    if (collisionType == 'R') { //right collision
                        this.vx = 0;
                        this.x = e.x - this.w;
                    } else if (collisionType == 'L') { //left collision
                        this.vx = 0;
                        this.x = e.x + e.w;
                    } else if (collisionType == 'D') { //down collision
                        this.vy = 0;
                        this.y = e.y - this.h;
                    } else if (collisionType == 'U') { //up collision
                        this.vy = 0;
                        this.y = e.y + e.h;
                    }
                }
            }
        }
        if (this.canMove) {
            this.x += this.vx;
            this.y -= this.vy;
            this.vy += this.ga;
            if (collisionType == 'D') {
                if (this.vx > 0) this.vx -= this.friction;
                else this.vx += this.friction;
                if (Math.abs(this.vx) < 2) this.vx = 0;
            }
        }
    }


    giveForce(ax, ay) {
        this.vx += ax;
        this.vy += ay;
    }

    damage(d, textColor=null){
        this.life-=d;
        if(textColor!=null){
            let textSize=50;
            let damageText = new Button(this.x+this.w/2, this.y-textSize, 0,0,Game.TEXT_CHANNEL);
            damageText.life=40;
            damageText.vy=1;
            damageText.canInteraction=false;
            //damageText.overlap=false;
            //damageText.drawOption(null, null, d, 30,"red");
            damageText.drawCode=function(){
                ctx.font = "bold 30px Arial";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillStyle = textColor;
                ctx.fillText(d, damageText.x, damageText.y);
                ctx.strokeStyle = "black";
                ctx.strokeText(d, damageText.x, damageText.y);
                damageText.life--;
            }
            
        }
    }

    //event handler
    collisionHandler(e, collisionType, isActor) { }
    removeHandler() { }

}