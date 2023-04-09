class GameUnit{
    state;
    worldLayer=0;
    canInteract=true;
    canDraw=true;
    body;
    physics;
    eventManager;
    constructor(body){
        this.state=1; //GameUnit 활성화
        if(body instanceof UnitBody)this.body=body;
        else console.error("not UnitBody");
        this.eventManager=new UnitEventManager();
    }
    updateBody(){this.body.update((this.physics ? this.physics.updateAcc() : [0,0]));}
    update(){}
    interact(other){if(this.physics&&other.physics)this.body.checkCollision(this,other);}
    draw(r){};
    addEventListener(eventName,code){this.eventManager.addEventListener(eventName, code.bind(this));}

    getState(){return this.state;}
    setState(num){this.state=num;}
    setLayer(num){this.worldLayer=num;return this;}
    getLayer(){return this.worldLayer}
}