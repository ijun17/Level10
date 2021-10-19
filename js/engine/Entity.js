class Entity {
    channelLevel;

    x = 0; y = 0; w = 0; h = 0; 
    vx = 0; 
    vy = 0; 
    ga = -0.2; //gravity acceleration

    defense=10;
    
    inv_mass=1;
    COR=0;//coefficient of restitution
    life = 1;
    friction=0.4;
    SFV=1; //static friction velocity
    action=[];

    action = new Array(); //한 틱마다 행위들 [시작시간, 종료시간-1, 코드]

    overlap = false; //다른 엔티티와 겹쳐질 수 있는가, if one overlap true and other overlap false, they overlap false;
    canInteract = true;
    canDraw=true;
    canMove=true;
    canAct=true;
    canRemoved = true; 
    canFallDie=true;
    constructor(x, y, channelLevel=0) {
        this.x = x;
        this.y = y;
        this.channelLevel = channelLevel;
        Game.channel[channelLevel].push(this);
    }
    update() {
        if (this.canDraw) this.draw();
        if(this.canMove)this.move();
        if (this.canAct) this.act();
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

    move(){
        if(Math.abs(this.vx)>80)this.vx=Math.sign(this.vx)*80;
        if(Math.abs(this.vy)>80)this.vy=Math.sign(this.vy)*80;
        this.x += this.vx;
        this.y -= this.vy;
        this.vy += this.ga;
    }
    giveForce(ax, ay) {
        this.vx += ax*this.inv_mass;
        this.vy += ay*this.inv_mass;

    }
    giveDamage(d){
        if(d>this.defense){
            this.life-=Math.floor(d);
            return true;
        }
        return false;
    }
    setStatic(){this.COR=0; this.inv_mass=0; this.ga=0; this.canMove=false;this.canInteract=true;}
    enlarge(per){this.w*=per; this.h*=per;}
    throw(){this.y=10000;this.life=0;this.canRemoved=true;this.update=function(){};}
    getVectorLength(){
        return Math.sqrt(this.vx*this.vx+this.vy*this.vy);
    }
    getX(){return this.x+(this.w>>1)}
    getY(){return this.y+(this.h>>1)}
    //event handler
    collisionHandler(e, collisionType, isActor) { return true;}
    removeHandler() { return true}
}