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
    }

    update() {
        if (this.visibility) this.draw();
        if (this.canAct) this.act();
        if (this.canInteraction) this.interaction();
        if(this.canMove)this.move();
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y);
    }

    addAction(start, end, code) {
        let i,j;
        for (i = 0, j=this.action.length; i < j; i++) {
            if (this.action[i][1] >= end + Game.time) break;
        }
        this.action.splice(i, 0, [start + Game.time, end + Game.time, code]);
    }

    act() {
        let i;
        for(i=this.action.length-1; i>=0; i--){
            if (this.action[i][1] < Game.time) break;
            else if (this.action[i][0] <= Game.time) new (this.action[i][2])();  
        }
        this.action.splice(0, i+1);
    }

    interaction() {
        let maxV=80;
        if(this.vx>maxV)this.vx=maxV;
        else if(this.vx<-maxV)this.vx=-maxV;
        if(this.vy>maxV)this.vy=maxV;
        else if(this.vy<-maxV)this.vy=-maxV;

        if (this.y > canvas.height + 500) this.life = 0;
        if (this.life < 1) return;
        let collisionType = null;

        for (var e of Game.channel[this.channelLevel]) {//entity collision event
            if (e != this && this.x + this.vx < e.x + e.w && this.x + this.vx + this.w > e.x && this.y - this.vy < e.y + e.h && this.y - this.vy + this.h > e.y) {
                if (!(this.overlap && e.overlap)&&this.canMove) {
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
                if (!(this.overlap && e.overlap)&&this.canMove) {
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
            if (collisionType == 'D') {
                if (this.vx > 0) this.vx -= this.friction;
                else this.vx += this.friction;
                if (Math.abs(this.vx) < 2) this.vx = 0;
            }
            
            
        }
    }

    move(){
        this.x += this.vx;
        this.y -= this.vy;
        this.vy += this.ga;
    }

    giveForce(ax, ay) {
        this.vx += ax;
        this.vy += ay;
    }

    damage(d){
        this.life-=d;
    }

    //event handler
    collisionHandler(e, collisionType, isActor) { }
    removeHandler() { }

}