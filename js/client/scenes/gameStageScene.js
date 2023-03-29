Game.setScene("gameStage",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");
    ReusedModule.createGameMap(2000,1000);
    
    USER_INPUT.setParameter("moveKey",[39,37,38,40]);
    WORLD.environment.addGravity([0,0], [2000,1000], [0,-0.2]);
    for(let i=0; i<20; i++)for(let j=0; j<20; j++){
        let r=Math.random();
        let color;
        if(r<0.3)color="rgba(0,0,200,0.5)";
        else if(r<0.6)color="rgba(0,50,200,0.5)";
        else color="rgba(50,0,200,0.5)";
        let block=new Block([400+i*40,0+j*40],[40,40],color)
        WORLD.add(block)
        block.physics.setCOR(0);
        //block.physics.setCOF(0.1)
        //block.physics.inv_mass=1;
    }

    // let b=new Block([400,340],[30,30],"black");
    // WORLD.add(b);
    // //b.physics.setCOR(1);
    // WORLD.add(new Block([400,340],[30,30],"red"))
    //b.body.addVel([10,0]);
    
    let player=new Player([300,340],1);
    WORLD.add(player);
    SCREEN.renderer.camera.addTarget(player.body);
    USER_INPUT.setParameter("player",player);
    //TIME.addSchedule(0,10000,1,function(){console.log(player.body.pos, player.body.vel)})
    //player.physics.inv_mass=0;
})