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
        //scroll.style.overflow="scroll";
        return scroll;
    },
    createButtonSelector(){
        return {ele:null};
    },
    createMagicButton(i, buttonSelector, onclick=function(){}){
        const UI=SCREEN.ui;
        let magicBtn = document.createElement("div");
        magicBtn.className = "magicButton " + (i < MagicManager.primitiveBasicMagic.length ? "basicMagic" : "customMagic");
        UI.setElementSize(magicBtn, [SCREEN.perX(20), SCREEN.perX(3)]);
        magicBtn.innerText = MagicManager.magicList[i].name;
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
    createSelectMagicComponent(pos, skillNum, name="", onclick=function(){}){
        const UI=SCREEN.ui;
        const perX=SCREEN.perX.bind(SCREEN);
        const perY=SCREEN.perY.bind(SCREEN);
        const COMPONENT_WIDTH=perX(30);
        const COMPONENT_HEIGHT=perX(37);
        let component = SCREEN.ui.add("div", pos, [COMPONENT_WIDTH, COMPONENT_HEIGHT], "selectMagicComponent");
        component.innerText=name;
        for(let i=0; i<4; i++){
            let selectMagicBtn=document.createElement("button");
            const MAGIC=MagicManager.magicList[skillNum[i]];
            selectMagicBtn.className="selectMagicButton";
            UI.setElementSize(selectMagicBtn, [COMPONENT_WIDTH-perX(2),perX(7)])
            selectMagicBtn.innerText=`${MAGIC.name}\n\nMP: ${MAGIC.requiredMP} / cooltime: ${MAGIC.cooltime}`;
            let index=i;
            selectMagicBtn.onclick=function(){onclick(selectMagicBtn,index,skillNum)};
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
    }
}