class Entity {
    channelLevel;
    x = 0; y = 0; w = 0; h = 0; 
    //move
    vx = 0; 
    vy = 0; 
    ga = -0.2; //gravity acceleration

    //damage
    defense=10;
    life = 1;
    canRemoved = true; 
    canFallDie=true;

    //interaction
    inv_mass=1;
    COR=0;//coefficient of restitution
    friction=0.4;
    SFV=1; //static friction velocit
    overlap = false; 

    action = []; //한 틱마다 행위들 [시작시간, 종료시간-1, 코드]
    event={
        collision:[],
        remove:[]
    }

    //다른 엔티티와 겹쳐질 수 있는가, if one overlap true and other overlap false, they overlap false;
    canInteract = true;
    canDraw=true;
    canMove=true;
    canAct=true;
    
    constructor(x, y, channelLevel=0) {
        this.x = x;
        this.y = y;
        this.channelLevel = channelLevel;
        World.add(this);
    }
    update() {
        if (this.canDraw) this.draw();
        if(this.canMove)this.move();
    }
    draw() {}
    addAction(start, end, code) {Time.addSchedule(start, end, code)}

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
        this.limitVector(80);
    }
    giveDamage(d){
        if(d>this.defense){
            this.life-=Math.floor(d);
            return true;
        }
        return false;
    }
    enlarge(per){this.w*=per; this.h*=per;}
    throw(){this.y=10000;this.life=0;this.canRemoved=true;this.update=function(){};}
    getVectorLength(){
        return Math.sqrt(this.vx*this.vx+this.vy*this.vy);
    }
    limitVector(maxV){
        if(Math.abs(this.vx)>maxV)this.vx=Math.sign(this.vx)*maxV;
        if(Math.abs(this.vy)>maxV)this.vy=Math.sign(this.vy)*maxV;
    }
    getX(){return this.x+(this.w>>1)}
    getY(){return this.y+(this.h>>1)}
    //event handler
    addEventListener(event,code,id=0){
        this.event[event].push([code,id]);
    }
    removeEventListener(event,id){
        let events=this.event[event]
        for(let i=this.event.collision.length-1; i>=0; i--){
            if(events[i][1]===id)events.splice(i, 1);
        }
    }
    collisionHandler(e, collisionType) {
        let doEvent=true;
        for(let i=this.event.collision.length-1; i>=0; i--){
            doEvent = this.event.collision[i][0](e,collisionType)&&doEvent;
        }
        return doEvent;
    }
    removeHandler() {
        let doEvent=true;
        for(let i=this.event.remove.length-1; i>=0; i--){
            doEvent = this.event.remove[i][0]()&&doEvent;
        }
        return doEvent;
    }
}