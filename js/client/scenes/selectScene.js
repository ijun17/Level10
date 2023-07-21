Game.setScene("select",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("main");

    let levelBtn;
    for(let i=1; i<=Level.playerLevel; i++){
        levelBtn=ui.add("button", [perX(42),perY(100)-perX(i*4+1)], [perX(16), perX(4)], "levelButton");
        levelBtn.innerText="LEVEL"+i;
        levelBtn.style.backgroundColor="rgba("+(255-(i+1)*25)+","+(255-(i+1)*25)+","+(255-(i+1)*20)+",0.5)";
        let level=i;
        levelBtn.onclick=()=>{Game.changeScene("gameStage",level);};
    }

    //SELECT MAGIC BUTTON
    let manageMagicSceneBtn = ui.add("button",[perX(83),perY(100)-perX(5)], [perX(16),perX(4)],"selectMagicSceneButton");
    manageMagicSceneBtn.innerText="My Magic";
    manageMagicSceneBtn.onclick=()=>{Game.changeScene("manageMagic")};
    //TEST BUTTON
    let textSceneBtn = ui.add("button",[perX(83),perY(100)-perX(10)], [perX(16),perX(4)],"selectMagicSceneButton");
    textSceneBtn.innerText="TEST";
    textSceneBtn.onclick=()=>{Game.changeScene("test")};
    //HELP BUTTON
    let helpSceneBtn = ui.add("button",[perX(1),perX(1)], [perX(4),perX(4)],"helpSceneButton");
    helpSceneBtn.innerText="?";
    helpSceneBtn.onclick=()=>{Game.changeScene("help")};
    
    //let pvpBtn = ui.add("button",[SCREEN.perX(83),SCREEN.perX(11)], [SCREEN.perX(16),SCREEN.perX(4)],"pvpButton");
    //pvpBtn.innerText="PVP";

})