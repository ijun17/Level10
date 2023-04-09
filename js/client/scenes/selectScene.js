Game.setScene("select",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("main");

    let levelBtn;
    for(let i=1; i<=Level.playerLevel; i++){
        levelBtn=ui.add("button", [perX(42),perY(100)-perX(i*4)], [perX(16), perX(4)], "levelButton");
        levelBtn.innerText="LEVEL"+i;
        levelBtn.style.backgroundColor="rgba("+(255-(i+1)*25)+","+(255-(i+1)*25)+","+(255-(i+1)*20)+",0.5)";
        let level=i;
        levelBtn.onclick=()=>{Game.changeScene("gameStage",level);};
    }

    //SELECT MAGIC BUTTON
    let selectMagicBtn = ui.add("button",[perX(83),perY(100)-perX(5)], [perX(16),perX(4)],"selectMagicSceneButton");
    selectMagicBtn.innerText="Select Magic";
    selectMagicBtn.onclick=()=>{Game.changeScene("selectMagic")};
    //MAKE MAGIC BUTTON
    let makeMagicBtn = ui.add("button",[perX(83),perY(100)-perX(10)], [perX(16),perX(4)],"selectMagicSceneButton");
    makeMagicBtn.innerText="Create Magic";
    makeMagicBtn.onclick=()=>{Game.changeScene("createMagic")};
    //MAKE MAGIC BUTTON
    //let pvpBtn = ui.add("button",[SCREEN.perX(83),SCREEN.perX(11)], [SCREEN.perX(16),SCREEN.perX(4)],"pvpButton");
    //pvpBtn.innerText="PVP";

})