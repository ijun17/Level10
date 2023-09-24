Game.setScene("gameStage",function(level){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");

    let player=WORLD.add(new Player([300,340]));
    player.renderStatusBar([perX(10),perY(100)-perX(10)])
    player.addEventListener("remove", ()=>{
        let stageClearText=SCREEN.ui.add("div",[0,0],[SCREEN.perX(100),SCREEN.perY(100)],"playerDieText");
        stageClearText.innerText="YOU DIE";
        TIME.addSchedule(2,2,undefined,()=>{Game.changeScene("select")});
    })
    SCREEN.renderer.camera.addTarget(player.body);
    
    ReusedModule.userInputKeySet(player)
    if(localStorage.getItem("mobile")==='1')ReusedModule.createMobileButton(player);
    Level.makeStage(level,player)
})