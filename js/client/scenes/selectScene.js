Game.setScene("select",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("main");

    let levelBtn;
    for(let i=0; i<=Level.playerLevel; i++){
        levelBtn=ui.add("button", [perX(42),perY(100)-perX(i*4+5)], [perX(16), perX(4)], "levelButton");
        levelBtn.innerText="LEVEL"+i;
        levelBtn.style.backgroundColor="rgba("+(255-i*25)+","+(255-i*25)+","+(255-i*20)+",0.2)";
        levelBtn.onclick=()=>{Game.changeScene("gameStage",i);};
    }

    //SELECT MAGIC BUTTON
    let manageMagicSceneBtn = ui.add("button",[perX(83),perY(100)-perX(5)], [perX(16),perX(4)],"selectMagicSceneButton");
    manageMagicSceneBtn.innerText="MY MAGIC";
    manageMagicSceneBtn.onclick=()=>{Game.changeScene("manageMagic")};
    //TEST BUTTON
    let monsterVSBtn = ui.add("button",[perX(83),perY(100)-perX(10)], [perX(16),perX(4)],"monsterVSSceneButton");
    monsterVSBtn.innerText="Monster VS";
    monsterVSBtn.onclick=()=>{Game.changeScene("monsterVS")};
    //PVP BUTTON
    let pvpBtn = ui.add("button",[perX(83),perY(100)-perX(15)], [perX(16),perX(4)],"pvpButton");
    pvpBtn.innerText="PVP 2.1";
    pvpBtn.onclick=()=>{Game.changeScene("pvp")};
    //HELP BUTTON
    let helpSceneBtn = ui.add("button",[perX(1),perX(1)], [perX(4),perX(4)],"helpSceneButton");
    helpSceneBtn.innerText="?";
    helpSceneBtn.onclick=()=>{Game.changeScene("help")};

})