Game.setScene("gameStage",function(level){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");

    let player=WORLD.add(new Player([300,340]));
    player.renderStatusBar([perX(10),perY(100)-perX(10)])
    SCREEN.renderer.camera.addTarget(player.body);
    USER_INPUT.setParameter("player",player);
    USER_INPUT.setParameter("moveKey",[39,37,38,40]);

    Level.makeStage(level,player)
})