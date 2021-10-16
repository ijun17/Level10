let Game = {
    //ENGINE
    channel : [], //phisics, particle, button
    PHYSICS_CHANNEL : 0,
    PARTICLE_CHANNEL : 1,
    TEXT_CHANNEL : 3,
    BUTTON_CHANNEL : 2,
    time : 0,
    p:null,
    interval:null,
    dt:10,
    developerMode:false,

    //ENGINE FUNCTION
    resetGame:function() {
        Game.channel[0].clear();
        Game.channel[1].clear();
        Game.channel[2].clear();
        Game.channel[3].clear();
        Game.time = 0;
        Camera.cameraOn = false;
        Camera.extension=canvas.width/1600;
        Input.resetKeyInput();
        Screen.bgColor="#b2c3c8";
        //{어두운 배경: #2B2B2B, 붉은빛하늘: #A89A9A,맑은하늘:rgb(121, 155, 206), 녹색하늘색:#94a9ad, 겨울하늘:#b2c3c8}

        if(this.developerMode)Component.developerTool()
    },
    startGame:function() {
        this.channel=[new EntityManager(true), new EntityManager(false), new EntityManager(true), new EntityManager(false)];

        Input.startInput();
        Level.loadLevel();
        Magic.loadMagic();
        Screen.mainScreen();

        this.interval=setInterval(Game.updateWorld, 10);
    },
    updateWorld:function() {
        ctx.fillStyle=Screen.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        Game.channel[0].update();
        Game.channel[1].update();
        Game.channel[2].update();
        Game.channel[3].update();
        Game.time++;
    },
    renderWorld:function(){
        ctx.fillStyle=Screen.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 4; i++) {
            for (let j = Game.channel[i].length - 1, c = Game.channel[i]; j >= 0; j--) { c[j].draw(); }
        }
    },
    setGameSpeed(speed=100){ //num 0~120%
        const MAX_SPEED=120;
        clearInterval(Game.interval);
        if(speed<=0){
            this.dt=0;
            return;
        }
        if(speed>MAX_SPEED)speed=MAX_SPEED;
        this.dt=Math.floor(1000/speed)
        this.interval=setInterval(Game.updateWorld, Game.dt);
        console.log("dt="+Game.dt);
    },
    develope:function(){this.developerMode=true;Component.developerTool()}
}

Game.startGame();