class Player extends Actor{
    animation;
    statusBarInfo;
    constructor(pos, level=Level.playerLevel){
        super(pos, [30,60], new GameUnitMoveModule(0,6,5), new GameUnitLifeModule(10000*(level+1),50,20), new GameUnitSkillModule((level+1)*20000,level));
        this.body.overlap=true;
        this.damageTextColor="red";
        this.damageVibrate=30;
        for(let magic of MagicManager.getSelectedMagic())this.skillModule.addSkill(magic)

        this.animation = new UnitAnimation(IMAGES.player,30,60,[1,1],function(){
            if(this.moveModule.moveFlag[0])return 1;
            else return 0;
        }.bind(this));
    }
    draw(r){
        super.draw(r);
        r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]});
        //if(this.statusBarInfo.draw)this.drawStatusBar(r);
    }
    update(){
        super.update();
        this.animation.update();
    }
    setObserver(){
        this.canInteract=false;
        this.physics.setGravity([0,0],true);
        this.moveModule.moveType=1;
    }
    renderStatusBar(pos){
        const perX=SCREEN.perX.bind(SCREEN);
        const perY=SCREEN.perY.bind(SCREEN);
        const sbx=pos[0];
        const sby=pos[1];
        this.statusBarInfo={
            draw:true,
            pos:[sbx,sby],
            backgroundBody: {pos:[sbx,sby], size:[perX(42),perX(9)]},
            strokeHPBody: {pos:[sbx+perX(1),sby+perX(3.5)],size:[perX(18), perX(2)]},
            strokeMPBody: {pos:[sbx+perX(1),sby+perX(1)],size:[perX(18), perX(2)]},
            playerNameBody: {pos:[sbx+perX(1),sby+perX(8)],size:[0,0]},
            playerNameFont: "bold " + perX(1.8) + "px Arial",
            hpTextFont: perX(1.4) + "px Arial",
            fillHPTextBody: {pos:[sbx+perX(1.5),sby+perX(5)],size:[0,0]},
            fillMPTextBody: {pos:[sbx+perX(1.5),sby+perX(2.5)],size:[0,0]},
            fillSkillTextBody: [
                {pos:[sbx+perX(20),sby+perX(8)],size:[0,0]},
                {pos:[sbx+perX(20),sby+perX(6)],size:[0,0]},
                {pos:[sbx+perX(20),sby+perX(4)],size:[0,0]},
                {pos:[sbx+perX(20),sby+perX(2)],size:[0,0]}
            ]
        };
        TIME.addSchedule(0,undefined,undefined,function(){this.drawStatusBar(SCREEN.renderer)}.bind(this))
    }
    drawStatusBar(r) {
        const perX=SCREEN.perX.bind(SCREEN);
        const perY=SCREEN.perY.bind(SCREEN);
        const SBI=this.statusBarInfo;
        const DRAW_OPTION = {cameraOn:false};

        let fillHPBody = {pos:SBI.strokeHPBody.pos, size:[perX(18) * (this.lifeModule.life / this.lifeModule.MAX_LIFE), perX(2)]}
        let fillMPBody = {pos:SBI.strokeMPBody.pos, size:[perX(18) * (this.skillModule.mp / this.skillModule.MAX_MP), perX(2)]}
        
        r.ctx.lineWidth = 2;
        r.fillRect("rgba(0,0,0,0.2)",SBI.backgroundBody,DRAW_OPTION);
        r.strokeRect("white",SBI.strokeHPBody,DRAW_OPTION);
        r.strokeRect("white",SBI.strokeMPBody,DRAW_OPTION);
        r.fillRect("brown",fillHPBody,DRAW_OPTION);
        r.fillRect("royalblue",fillMPBody,DRAW_OPTION);

        r.ctx.textBaseline = "top";
        r.ctx.textAlign = "left";
        r.ctx.font = SBI.playerNameFont;
        r.ctx.fillStyle = "white";
        r.fillText("Player", SBI.playerNameBody,DRAW_OPTION);

        r.ctx.font = SBI.hpTextFont;
        r.fillText(this.lifeModule.life, SBI.fillHPTextBody,DRAW_OPTION);
        r.fillText(this.skillModule.mp, SBI.fillMPTextBody,DRAW_OPTION);
        
        for(let i = this.skillModule.skillList.length-1; i >=0 ; i--){
            let coolTime = this.skillModule.coolTime[i];
            let skillName = this.skillModule.skillList[i].name;
            let skillMP = this.skillModule.skillList[i].requiredMP;
            r.fillText(`${skillName}(${skillMP}): ${coolTime > 0 ? (coolTime * 0.01).toFixed(2) : "ready"}`,SBI.fillSkillTextBody[i],DRAW_OPTION);
        }
    }
}