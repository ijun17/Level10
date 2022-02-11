class Entity {
    channelLevel;
    x = 0; y = 0; w = 0; h = 0; 
    brightness=0;
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

    //event
    event={
        collision:[],
        remove:[],
        trigger:[]
    }

    //다른 엔티티와 겹쳐질 수 있는가, if one overlap true and other overlap false, they overlap false;
    canInteract = true;
    canDraw=true;
    canMove=true;
    
    constructor(x, y, channelLevel=0) {
        this.x = x;
        this.y = y;
        this.channelLevel = channelLevel;
        World.add(this);
    }
    update() {
        if (this.canDraw) this.draw(EntityRenderer);
        if(this.canMove)this.move();
    }
    draw(renderer) {}
    addAction(start, end, code) {Time.addSchedule(start, end, code)}

    move(){
        this.limitVector(80);
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
    getVectorLength(){return Math.sqrt(this.vx*this.vx+this.vy*this.vy);}
    limitVector(maxV){
        if(Math.abs(this.vx)>maxV)this.vx=Math.sign(this.vx)*maxV;
        if(Math.abs(this.vy)>maxV)this.vy=Math.sign(this.vy)*maxV;
    }
    getX(){return this.x+(this.w>>1)}
    getY(){return this.y+(this.h>>1)}
    midX(){return this.x+(this.w>>1)}
    midY(){return this.y+(this.h>>1)}

    //event handler
    addEventListener(type,code,id=0){if(this.event[type]===undefined)console.error(`${type} event not exist`);this.event[type].push(code.bind(this));}
    ontrigger(event){return this.eventHandler(this.event.trigger, event)}
    oncollision(event){return this.eventHandler(this.event.collision, event)}//event={vector, other}
    onremove(event){return this.eventHandler(this.event.remove, event)}
    eventHandler(handler, event) {
        event.do=true;
        for(let i=handler.length-1; i>=0; i--)if(handler[i](event)===false)event.do=false;
        return event.do;
    }
}