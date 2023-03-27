Game.setScene("gameStage",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");
    ReusedModule.createGameMap(2000,1000);
    let player=new Player([300,300],1);
    WORLD.add(player);
    SCREEN.renderer.camera.addTarget(player.body);
    USER_INPUT.setParameter("player",player);
    USER_INPUT.setParameter("moveKey",[39,37,38,40]);
    WORLD.environment.addGravity([0,0], [1200,600], [0,-0.2])

    for(let i=0; i<20; i++)for(let j=0; j<10; j++){
        let block=new Block([400+i*40,0+j*40],[40,40])
        WORLD.add(block)
        block.physics.setCOR(0);
    }
})