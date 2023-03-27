Game.setScene("main",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    let startBtn = ui.add("button", [perX(38), perY(50)-perX(4)], [perX(24),perX(8)],"startButton");
    startBtn.innerText="START";
    let accY=-0.1;
    let velY=3;
    startBtn.onclick=function(){
        startBtn.style.display="none"
        TIME.addSchedule(1,1,undefined,()=>{Game.changeScene("select");})
        TIME.addSchedule(0,1,0.01,()=>SCREEN.renderer.camera.move([0,velY+(accY-=0.3)]))
    }

    //let level10Text = ui.add("button",[perX(30),perY(0)],[perX(40),perY(20)],"level10Text");
    //level10Text.innerText="LEVEL10";
    WORLD.environment.addGravity([0,0], [1200,600], [0,-0.2]);

    WORLD.add(new MapBlock([perX(5),perY(8)],[perX(15),perY(30)],"#303030"));
    WORLD.add(new MapBlock([perX(27),perY(-20)],[perX(15),perY(50)],"#303030"));
    WORLD.add(new MapBlock([perX(58),perY(-20)],[perX(15),perY(50)],"#303030"));
    WORLD.add(new MapBlock([perX(80),perY(8)],[perX(15),perY(30)],"#303030"));
    WORLD.add(new MapBlock([perX(8),perY(-300)],[perX(84),perY(320)],"#303030"));
    for(let i=0; i<20; i++){
        WORLD.add(new MapBlock([perX(7),perY(-i*20)],[perX(2),perY(15)],"#303030"));
        WORLD.add(new MapBlock([perX(91),perY(-i*20)],[perX(2),perY(15)],"#303030"));
    }
})