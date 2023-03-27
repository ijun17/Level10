class Actor extends GameUnit{
    moveModule;
    lifeModule;
    animation;
    skillList;
    constructor(pos,size,moveMode,moveSpeed,jumpSpeed,life,defense){//move={moveMode, moveSpeed, jumpSpeed}, life={life,defense}
        super(new UnitBody(pos,size));
        this.physics=new UnitPhysics();
        this.moveModule=new GameUnitMoveModule(moveMode); //walk mode
        this.addEventListener("collision", function(e){this.moveModule.readyJump(e.collisionNormal)})
        this.moveModule.moveSpeed=moveSpeed;
        this.moveModule.jumpSpeed=jumpSpeed;

        this.lifeModule=new GameUnitLifeModule(life,defense);
        this.lifeModule.unitDieHandler=function(){this.state=0;}.bind(this);
    }
    update(){
        this.moveModule.update(this);
        this.animation.update();
    }
    onkeydown(keyCode, moveKey, skillKey){
        switch(keyCode){
            case moveKey[0]:this.moveModule.keyDownHandler(0);break;
            case moveKey[1]:this.moveModule.keyDownHandler(1);break;
            case moveKey[2]:this.moveModule.keyDownHandler(2);break;
            case moveKey[3]:this.moveModule.keyDownHandler(3);break;
        }
    }
    onkeyup(keyCode, moveKey){
        switch(keyCode){
            case moveKey[0]:this.moveModule.keyUpHandler(0);break;
            case moveKey[1]:this.moveModule.keyUpHandler(1);break;
            case moveKey[2]:this.moveModule.keyUpHandler(2);break;
            case moveKey[3]:this.moveModule.keyUpHandler(3);break;
        }
    }
}