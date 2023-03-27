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
    },
    createScroll(pos,size){
        let scroll = ui.add("div",pos,size,"scroll");
        //scroll.style.overflow="scroll";
        return scroll;
    },
    createMagicButtonList(pos, size, onclick=function(){}) {
        const UI=SCREEN.ui;
        let scroll = UI.add("button", pos, size, "scroll");
        for (let i = 0; i < MagicManager.magicList.length; i++) {
            let magicBtn = document.createElement("div")
            magicBtn.className = "magicButton";
            UI.setElementSize(magicBtn,[SCREEN.perX(20),SCREEN.perX(3)]);
            magicBtn.innerText=MagicManager.magicList[i].name;
            let index=i;
            magicBtn.onclick=function(){onclick(index);};
            scroll.append(magicBtn);
        }
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
            selectMagicBtn.className="selectMagicButton";
            UI.setElementSize(selectMagicBtn, [COMPONENT_WIDTH-perX(2),perX(7)])
            selectMagicBtn.innerText=MagicManager.magicList[skillNum[i]].name;
            let index=i;
            selectMagicBtn.onclick=function(){onclick(selectMagicBtn,index,skillNum)};
            component.append(selectMagicBtn);
            

        }
        
    }

    
}