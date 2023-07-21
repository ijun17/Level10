const ReusedModule={
    createbackButton(scene){
        let backBtn=SCREEN.ui.add("button", [0,SCREEN.perY(100)-SCREEN.perX(6)], [SCREEN.perX(6),SCREEN.perX(6)],"backButton");
        backBtn.innerText="<";
        backBtn.onclick=()=>{Game.changeScene(scene)}
        return 0;
    },
    createGameMap(w,h){
        const WALL_SIZE=300;
        WORLD.add(new MapBlock([-WALL_SIZE,-WALL_SIZE],[w+WALL_SIZE*2,WALL_SIZE],"#303030"))
        WORLD.add(new MapBlock([-WALL_SIZE,h],[w+WALL_SIZE*2,WALL_SIZE],"#303030"))
        WORLD.add(new MapBlock([-WALL_SIZE,-WALL_SIZE],[WALL_SIZE,h+WALL_SIZE*2],"#303030"))
        WORLD.add(new MapBlock([w,-WALL_SIZE],[WALL_SIZE,h+WALL_SIZE*2],"#303030"))
        WORLD.layer[PHYSICS_LAYER].setLimitPos([0,0], [w,h]);
    },
    createScroll(pos,size){
        let scroll = ui.add("div",pos,size,"scroll");
        return scroll;
    },
    createButtonSelector(){
        return {ele:null};
    },
    createMagicButton(i, buttonSelector, onclick=function(){}){
        const UI=SCREEN.ui;
        const perX=SCREEN.perX.bind(SCREEN);
        const perY=SCREEN.perY.bind(SCREEN);
        let magicBtn = UI.create("button",[0,0],[perX(20), perX(3)],"magicButton " + (MagicManager.isBasicMagic(i) ? "basicMagic" : "customMagic"));
        magicBtn.innerText = MagicManager.magicList[i].name;
        magicBtn.style.position="static"
        magicBtn.dataset.magicNum=i;
        magicBtn.onclick = function () {
            onclick(i);
            if (buttonSelector.ele != null) buttonSelector.ele.classList.remove("selectedMagic");
            buttonSelector.ele = magicBtn;
            magicBtn.classList.add("selectedMagic");
        };
        return magicBtn;
    },
    createMagicButtonList(pos, size, buttonSelector, onclick=function(){}) {
        const UI=SCREEN.ui;
        let scroll = UI.add("button", pos, size, "scroll");
        for (let i = 0; i < MagicManager.magicList.length; i++) {
            if(MagicManager.magicList[i].requiredLevel>Level.playerLevel)continue;
            scroll.append(ReusedModule.createMagicButton(i,buttonSelector, onclick));
        }
        return scroll;
    },
    createSelectMagicComponent(pos, skillNum, name, buttonSelector){
        const UI=SCREEN.ui;
        const perX=SCREEN.perX.bind(SCREEN);
        const perY=SCREEN.perY.bind(SCREEN);
        const COMPONENT_WIDTH=perX(28);
        const COMPONENT_HEIGHT=perX(35);
        let component = SCREEN.ui.add("div", pos, [COMPONENT_WIDTH, COMPONENT_HEIGHT], "selectMagicComponent");
        component.innerText=name;
        const KEY_SET=['Q','W','E','R'];
        for(let i=0; i<4; i++){
            let selectMagicBtn=document.createElement("button");
            const MAGIC=MagicManager.magicList[skillNum[i]];
            selectMagicBtn.className="selectMagicButton";
            UI.setElementSize(selectMagicBtn, [COMPONENT_WIDTH-perX(2),perX(7)])
            selectMagicBtn.innerText=`(${KEY_SET[i]}) ${MAGIC.name}\nMP: ${MAGIC.requiredMP} / cooltime: ${MAGIC.cooltime}`;
            selectMagicBtn.onclick=()=>{
                if(buttonSelector.ele===null)return;
                let magicNum=Number(buttonSelector.ele.dataset.magicNum);
                const MAGIC=MagicManager.magicList[magicNum];
                skillNum[i]=magicNum;
                selectMagicBtn.innerText=`(${KEY_SET[i]}) ${MAGIC.name}\nMP: ${MAGIC.requiredMP} / cooltime: ${MAGIC.cooltime}`;
                MagicManager.saveSkillNum();
            }
            component.append(selectMagicBtn);
        }
        
    },
    createParticleSpray:function(type,pos,range,particleSize,particleVy,delaySec){
        TIME.addSchedule(0,undefined,delaySec,function(){
            let randomX = Math.random()*range;
            let particle=WORLD.add(new Particle([randomX+pos[0],pos[1]],[particleSize,particleSize],type))
            particle.life=400;
            particle.body.addVel([0,-particleVy])
        })
    },

    createMobileButton:function(player,size){
        //move button
        const UI=SCREEN.ui;
        const perX=SCREEN.perX.bind(SCREEN);
        const perY=SCREEN.perY.bind(SCREEN);
        const BTN_W=perX(10);
        const BTN_SIZE=[BTN_W,BTN_W];
        const MOVE_RUN=(player.moveModule.moveType===0)
        const MOVE_BUTTON_TEXT=(MOVE_RUN?['<','^','>']:['<','v','>','^']);
        const MOVE_BUTTON_POS=(MOVE_RUN?[[perX(1),perX(1)],[perX(2)+BTN_W,perX(1)],[perX(3)+BTN_W*2,perX(1)]]: [[perX(1),perX(1)],[perX(2)+BTN_W,perX(1)],[perX(3)+BTN_W*2,perX(1)],[perX(2)+BTN_W,perX(2)+BTN_W]])
        const MOVE_HANDLER_CODE=(MOVE_RUN?[1,2,0]:[1,3,0,2]);
        for(let i=0; i<MOVE_BUTTON_TEXT.length; i++){
            let btn = WORLD.add(new Button(MOVE_BUTTON_POS[i],BTN_SIZE,"white",MOVE_BUTTON_TEXT[i]))
            btn.ontouchstart=()=>{player.moveModule.keyDownHandler(MOVE_HANDLER_CODE[i]);}
            btn.ontouchmove=()=>{player.moveModule.keyDownHandler(MOVE_HANDLER_CODE[i])}
            btn.ontouchend=()=>{player.moveModule.keyUpHandler(MOVE_HANDLER_CODE[i])}
        }
        
        const SKILL_BUTTON_TEXT=['Q','W','E','R'];
        const SKILL_BUTTON_POS=[[perX(96)-BTN_W*4,perX(1)],[perX(97)-BTN_W*3,perX(1)],[perX(98)-BTN_W*2,perX(1)],[perX(99)-BTN_W,perX(1)]]
        for(let i=0; i<4; i++){
            let btn = WORLD.add(new Button(SKILL_BUTTON_POS[i],BTN_SIZE,"white",SKILL_BUTTON_TEXT[i]))
            btn.ontouchstart=()=>{player.skillModule.castSkill(player, i);}
        }
    },

    createMobileButton2:function(player,size){
        //move button
        const UI=SCREEN.ui;
        const perX=SCREEN.perX.bind(SCREEN);
        const perY=SCREEN.perY.bind(SCREEN);
        const BTN_W=perX(10);
        const BTN_SIZE=[BTN_W,BTN_W];
        const MOVE_RUN=(player.moveModule.moveType===0)
        const MOVE_BUTTON_TEXT=(MOVE_RUN?['<','^','>']:['<','v','>','^']);
        const MOVE_BUTTON_POS=(MOVE_RUN?[[perX(1),perX(1)],[perX(2)+BTN_W,perX(1)],[perX(3)+BTN_W*2,perX(1)]]: [[perX(1),perX(1)],[perX(2)+BTN_W,perX(1)],[perX(3)+BTN_W*2,perX(1)],[perX(2)+BTN_W,perX(2)+BTN_W]])
        const MOVE_HANDLER_CODE=(MOVE_RUN?[1,2,0]:[1,3,0,2]);
        for(let i=0; i<MOVE_BUTTON_TEXT.length; i++){
            let btn = UI.add("button",MOVE_BUTTON_POS[i],BTN_SIZE,"mobileMoveButton");
            btn.innerText=MOVE_BUTTON_TEXT[i];
            btn.addEventListener("touchstart", ()=>{player.moveModule.keyDownHandler(MOVE_HANDLER_CODE[i]);console.log(MOVE_BUTTON_TEXT[i])}, {passive:true});
            btn.addEventListener("touchend", ()=>{player.moveModule.keyUpHandler(MOVE_HANDLER_CODE[i])}, {passive:true});
        }
        
        const SKILL_BUTTON_TEXT=['Q','W','E','R'];
        const SKILL_BUTTON_POS=[[perX(96)-BTN_W*4,perX(1)],[perX(97)-BTN_W*3,perX(1)],[perX(98)-BTN_W*2,perX(1)],[perX(99)-BTN_W,perX(1)]]
        for(let i=0; i<4; i++){
            let btn = UI.add("button",SKILL_BUTTON_POS[i],BTN_SIZE,"mobileSkillButton");
            btn.innerText=SKILL_BUTTON_TEXT[i];
            //btn.onclick=()=>{ player.skillModule.castSkill(player, i);}
            btn.addEventListener("touchstart", ()=>{ player.skillModule.castSkill(player, i);console.log(SKILL_BUTTON_TEXT[i])}, {passive:true});
        }
        
    }
}