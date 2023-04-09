class Player extends Actor{
    animation
    constructor(pos, level=1){
        super(pos, [30,60], new GameUnitMoveModule(0,4,5), new GameUnitLifeModule(10000*level,100,20), new GameUnitSkillModule(level*10000));
        this.body.overlap=true;

        for(let i=0; i<4;i++)this.skillModule.addSkill(MagicManager.magicList[MagicManager.skillNum[i]])
        
        this.lifeModule.ontotaldamage=function(totalDamage){
            this.createDamageText(totalDamage,"red")
            SCREEN.renderer.camera.vibrate(30);
        }.bind(this)

        this.animation = new UnitAnimation(IMAGES.player,30,60,[1,1],function(){
            if(this.moveModule.moveFlag[0])return 1;
            else return 0;
        }.bind(this));
    }
    draw(r){
        super.draw(r);
        r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]});
    }
    update(){
        super.update();
        this.animation.update();
    }
}