Game.setScene("main",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    let startBtn = ui.add("button", [perX(38), perY(50)-perX(4)], [perX(24),perX(8)],"startButton");
    startBtn.innerText="START";
    let accY=-1;
    let velY=6;
    let zoom=1;
    startBtn.onclick=()=>{
        startBtn.style.display="none"
        SCREEN.renderer.camera.vibrate(30)
        const size = 2
        const speed=0.5
        for(let i=0; i<24*size; i++){
            for(let j=0; j<8*size; j++){
                let p = WORLD.add(new Particle([perX(38)+perX(i/size), perY(50)-perX(4)+perX(j/size)],[15,15],TYPE.firefly))
                p.body.setVel([p.body.vel[0]*speed, p.body.vel[1]*speed])
            }   
        }
        TIME.addSchedule(1,1,undefined,()=>{Game.changeScene("select");})
        // TIME.addSchedule(0,1,0.01,()=>{
        //     SCREEN.renderer.camera.zoom=zoom
        //     zoom+=0.002;
        // })
        // TIME.addSchedule(0,1,0.01,()=>SCREEN.renderer.camera.move([0,velY+(accY-=0.3)]))
    }
    WORLD.add(new TextUnit([perX(50),perY(8)],"LEVEL"+Level.playerLevel,perX(8),"#1b1b1b",null,10000));

    // WORLD.environment.addGravity([-1000,-1000], [3000,3000], [0,-0.05]);

    SCREEN.renderer.bgColor="#111"
    ReusedModule.fireflyWeather(50)
    // WORLD.environment.addDrag([-20000,-20000], [40000,40000], [0,0],0.001);
    // ReusedModule.snowWeather()
    const WALL_COLOR = "#222"
    WORLD.add(new MapBlock([perX(5),perY(8)],[perX(15),perY(30)],WALL_COLOR));
    WORLD.add(new MapBlock([perX(27),perY(-20)],[perX(15),perY(50)],WALL_COLOR));
    WORLD.add(new MapBlock([perX(58),perY(-20)],[perX(15),perY(50)],WALL_COLOR));
    WORLD.add(new MapBlock([perX(80),perY(8)],[perX(15),perY(30)],WALL_COLOR));
    WORLD.add(new MapBlock([perX(8),perY(-300)],[perX(84),perY(320)],WALL_COLOR));
    for(let i=0; i<20; i++){
        WORLD.add(new MapBlock([perX(7),perY(-i*20)],[perX(2),perY(15)],WALL_COLOR));
        WORLD.add(new MapBlock([perX(91),perY(-i*20)],[perX(2),perY(15)],WALL_COLOR));
    }
})