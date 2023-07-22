Game.setScene("test",function(){
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
    USER_INPUT.setParameter("player",player);
    USER_INPUT.setParameter("moveKey",[39,37,38,40]);
    if(localStorage.getItem("mobile")==='1')ReusedModule.createMobileButton(player);

    ReusedModule.createGameMap(2000,1000);
    WORLD.environment.addGravity([-20000,-20000], [40000,40000], [0,-0.2]);
    WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.02);

    //TIME.addSchedule(0,undefined,1,()=>{console.log(player.moveModule.footDirection)});
})