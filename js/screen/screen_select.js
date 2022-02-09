Screen.addScreen("select",function() {
    const space=Screen.perX(1);

    Component.particleSpray(3,{x:Screen.perX(50),y:0}, Screen.perX(120),0, 20, 2, 10);
    //BACK
    Component.backButton(function () { Screen.setScreen("main"); });
    //HELP BUTTON
    let helpButton = new Button(space, canvas.height-space-Screen.perX(3), Screen.perX(3), Screen.perX(3));
    helpButton.code = function () { Screen.setScreen("help") };
    helpButton.drawOption(null, "white", "?", Screen.perX(3),"white");
    //SELECT MAGIC BUTTON
    let selectMagicButton = new Button(canvas.width - Screen.perX(16)-space, space, Screen.perX(16), Screen.perX(4));
    selectMagicButton.code = function () { Screen.setScreen("selectMagic") };
    selectMagicButton.drawOption(null, "black", "select magic", Screen.perX(2.5), "black");//"rgb(119, 138, 202)"
    //MAKE MAGIC BUTTON
    let makeMagicButton = new Button(canvas.width - Screen.perX(16)-space, 2*space+Screen.perX(4), Screen.perX(16), Screen.perX(4));
    makeMagicButton.code = function () { Screen.setScreen("makeMagic") };
    makeMagicButton.drawOption(null, "black", "create magic", Screen.perX(2.5), "black");//"rgb(65, 105, 225)"
    //PVP
    let multiplayButton =new Button(canvas.width - Screen.perX(16)-space, 3*space+Screen.perX(8),Screen.perX(16), Screen.perX(4));
    multiplayButton.code = function () { Screen.setScreen("pvp", [0,0]) };
    multiplayButton.drawOption(null, "purple", "PVP", Screen.perX(2.5), "purple");//"rgb(65, 105, 225)"
    //Level Btn
    Component.buttonStack(42, 0, Level.playerLevel,false,function(i){
        let levelButton = new Button(0,0,Screen.perX(16), Screen.perX(4));
        levelButton.code = function () { Screen.setScreen("game", i+1)};
        levelButton.drawOption("rgba("+(255-(i+1)*25)+","+(255-(i+1)*25)+","+(255-(i+1)*20)+",0.5)", "black", `LEVEL${i+1}`, Screen.perX(3), "black");
        return levelButton;
    })
})