let Game = {
    //ENGINE
    channel : [[], [], [], []], //phisics, particle, button
    PHYSICS_CHANNEL : 0,
    PARTICLE_CHANNEL : 1,
    TEXT_CHANNEL : 3,
    BUTTON_CHANNEL : 2,
    time : 0,
    p:null,
    interval:null,
    dt:10,
    
    //CLIENT
    //keyboardOn:false,
    developerMode:false,

    //ENGINE FUNCTION
    resetGame:function() {
        Game.channel = [[], [], [], []];
        Game.time = 0;
        Game.keyboardOn=false;
        Level.stageLevel = -1;
        Level.stageMonsterCount = -1;
        Camera.cameraOn = false;
        Camera.extension=canvas.width/(Screen.isMobile ? 1200 : 1400);
        Input.resetKeyInput();
        Screen.bgColor="#b2c3c8";
        //{어두운 배경: #2B2B2B, 붉은빛하늘: #A89A9A,맑은하늘:rgb(121, 155, 206), 녹색하늘색:#94a9ad}

        if(this.developerMode)Component.developerTool()
    },
    startGame:function() {

        Input.startInput();
        Level.loadLevel();
        Magic.loadMagic();
        Screen.mainScreen();

        this.interval=setInterval(Game.updateWorld, 10);
    },
    updateWorld:function() {
        ctx.fillStyle=Screen.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 4; i++) {
            //for (let j = 0, c = Game.channel[i],length=Game.channel[i].length; j <length; j++) { c[j].update(); }
            for (let j = Game.channel[i].length-1, c = Game.channel[i]; j >=0; j--) { c[j].update(); }
            Game.removeEntity(i);
        }
        Game.time++;
    },
    renderWorld:function(){
        ctx.fillStyle=Screen.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 4; i++) {
            for (let j = Game.channel[i].length - 1, c = Game.channel[i]; j >= 0; j--) { c[j].draw(); }
        }
    },
    removeEntity:function(channelLevel) {
        for (let e of Game.channel[channelLevel]) {
            if (e.life < 1 && e.canRemoved) {
                e.removeHandler();
                let ei = Game.channel[channelLevel].indexOf(e);
                if (ei >= 0) Game.channel[channelLevel].splice(ei, 1);
            }
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