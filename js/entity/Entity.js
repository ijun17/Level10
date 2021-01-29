class Entity {
    channelLevel;

    x = 0; y = 0; w = 0; h = 0; vx = 0; vy = 0; 
    ga = -0.2; friction = 0.4; inv_mass=1;//phisics;
    life = 1;defense=100;
    
    canDraw = true; //보일 수 있는가
    canMove = true; //움직일 수 있는가
    canAct = true; //행동을 할 수 있는가
    canInteract = true;//다른 물체 상호작용할 수 있는지
    overlap = true;//다른 물체와 겹칠 수 있는지
    canCollision=true; //물리적 충돌을 하는지(flase여도 collisionHandler 작동)
    canRemoved = true; //삭제될 수 있는가
    canFallDie=true;//낙사하는지

    action = new Array(); //한 틱마다 행위들 [시작시간, 종료시간-1, 코드]
    
    constructor(x, y, channelLevel = 0) {
        this.x = x;
        this.y = y;
        this.channelLevel = channelLevel;
        Game.channel[channelLevel][Game.channel[channelLevel].length] = this;
    }
    update() {
        if (this.canDraw) this.draw();
        if (this.canAct) this.act();
        if (this.canInteract) this.interact();
        if(this.canMove)this.move();
    }
    draw() {
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
    interact() {
        let maxV=80;
        if(this.vx>maxV)this.vx=maxV;
        else if(this.vx<-maxV)this.vx=-maxV;
        if(this.vy>maxV)this.vy=maxV;
        else if(this.vy<-maxV)this.vy=-maxV;
        if (this.canFallDie&&this.y > 2000) this.life = 0;
        let downCollision=false;
        for(let i=Game.channel[this.channelLevel].length-1; i>=0; i--){ //check collision
            let e = Game.channel[this.channelLevel][i];
            if (e != this && this.x + this.vx < e.x + e.w&& this.x + this.vx + this.w > e.x && this.y - this.vy < e.y + e.h && this.y - this.vy + this.h > e.y) {
                let collisionType = null;
                if (!(this.overlap && e.overlap)) {
                    if (this.x + this.w <= e.x) { //right collision
                        collisionType = 'R';
                    } else if (this.x >= e.x + e.w) { //left collision
                        collisionType = 'L';
                    } else if (this.y + this.h <= e.y) { //down collision
                        collisionType = 'D';
                        downCollision=true;
                    } else if (this.y >= e.y + e.h) { //up collision
                        collisionType = 'U';
                    }
                }
                this.collisionHandler(e, collisionType, true);
                if (this.canCollision&&e.canCollision&&!(this.overlap && e.overlap)&&this.canMove) {
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
            if (downCollision) {
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
        if(this.canMove){
            this.vx += ax*this.inv_mass;
            this.vy += ay*this.inv_mass;
        }
    }
    giveDamage(d){
        if(this.defense<d){
            this.life-=Math.floor(d);
            return true;
        }
        return false;
    }
    enlarge(per){this.w*=per; this.h*=per;}
    getVectorLength(){
        return Math.sqrt(this.vx*this.vx+this.vy*this.vy);
    }
    //event handler
    collisionHandler(e, collisionType, isActor) { }
    removeHandler() { }
}