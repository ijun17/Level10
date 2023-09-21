class Actor extends GameUnit{
    moveModule;
    lifeModule;
    skillModule;
    statusEffectModule;
    damageTextColor="orange";
    damageVibrate=0;

    constructor(pos,size,moveModule,lifeModule,skillModule){//move={moveMode, moveSpeed, jumpSpeed}, life={life,defense}
        super(new UnitBody(pos,size));
        this.physics=new UnitPhysics();
        if(moveModule instanceof GameUnitMoveModule){
            this.moveModule=moveModule;
            this.addEventListener("collision", function(e){this.moveModule.readyJump(e.collisionNormal)})
        }else console.error("is not GameUnitMoveModule");

        if(lifeModule instanceof GameUnitLifeModule){
            this.lifeModule=lifeModule;
            this.lifeModule.ondie=function(){this.state=0;}.bind(this);
            this.lifeModule.ontotaldamage=function(totalDamage){
                this.createDamageText(totalDamage,this.damageTextColor);
                SCREEN.renderer.camera.vibrate(this.damageVibrate);
            }.bind(this)
        }else console.error("is not GameUnitLifeModule");

        if(skillModule instanceof GameUnitSkillModule)this.skillModule=skillModule;
        else console.error("is not GameUnitSkillModule");

        this.statusEffectModule=new GameUnitStatusEffectModule();
    }
    update(){
        this.moveModule.update(this);
        this.lifeModule.update();
        this.skillModule.update();
    }
    // getNameTag=function(){return `HP:${this.lifeModule.life}`}
    // draw(r){
    //     r.ctx.textBaseline = "middle";
    //     r.ctx.textAlign = "center";
    //     r.ctx.font = "bold 15px Arial";
    //     r.ctx.fillStyle = "black";
    //     r.fillText(this.getNameTag(), this.body)
    // }
    onkeydown(keyCode, moveKey, skillKey){
        switch(keyCode){
            case moveKey[0]:this.moveModule.keyDownHandler(0);break;
            case moveKey[1]:this.moveModule.keyDownHandler(1);break;
            case moveKey[2]:this.moveModule.keyDownHandler(2);break;
            case moveKey[3]:this.moveModule.keyDownHandler(3);break;
            case skillKey[0]:this.skillModule.castSkill(this,0);break;
            case skillKey[1]:this.skillModule.castSkill(this,1);break;
            case skillKey[2]:this.skillModule.castSkill(this,2);break;
            case skillKey[3]:this.skillModule.castSkill(this,3);break;
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
    getNameTag(){return `HP:${this.lifeModule.life}`}
    createDamageText(damage, color){
        let text=new TextUnit([this.body.midX, this.body.pos[1]+this.body.size[1]-50], damage,40,color,"black",40)
        text.body.setVel([0,1]);
        WORLD.add(text);
    }
}