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
    WORLD.add(new TextUnit([perX(50),perY(8)],"LEVEL"+Level.playerLevel,80,"#1b1b1b",null,10000));

    WORLD.environment.addGravity([-1000,-1000], [3000,3000], [0,-0.01]);
    ReusedModule.snowWeather()

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