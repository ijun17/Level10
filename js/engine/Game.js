let Game = {
    //ENGINE
    channel : [[], [], [], []], //phisics, particle, button
    PHYSICS_CHANNEL : 1,
    PARTICLE_CHANNEL : 0,
    TEXT_CHANNEL : 2,
    BUTTON_CHANNEL : 3,
    time : 0,
    p:null,
    p2:null,
    
    //CLIENT
    //keyboardOn:false,
    isManager:false,

    //ENGINE FUNCTION
    resetGame:function() {
        Game.channel = [[], [], [], []];
        Game.time = 0;
        Game.keyboardOn=false;
        Magic.clearCoolTime();
        Magic.magicPoint=0;
        Level.stageLevel = -1;
        Level.stageMonsterCount = -1;
        Camera.cameraOn = false;
        Camera.extension=canvas.width/(Screen.isMobile ? 1200 : 1400);
        Input.resetKeyInput();
        Screen.bgColor="#b2c3c8";
        //{어두운 배경: #2B2B2B, 붉은빛하늘: #A89A9A,맑은하늘:rgb(121, 155, 206), 녹색하늘색:#94a9ad}
    },
    startGame:function() {

        Input.startInput();
        Level.loadLevel();
        Magic.loadMagic();
        Screen.mainScreen();

        setInterval(Game.updateWorld, 10);
        //setInterval(Game.renderWorld, 30);
    },
    updateWorld:function() {
        ctx.fillStyle=Screen.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 4; i++) {
            for (let j = Game.channel[i].length - 1, c = Game.channel[i]; j >= 0; j--) { c[j].update(); }
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
    }
}

Game.startGame();