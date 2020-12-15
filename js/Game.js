let Game = {
    channel : [[], [], [], []], //phisics, particle, button
    time : 0,
    p:null,
    isManager:false,

    PHYSICS_CHANNEL : 1,
    PARTICLE_CHANNEL : 0,
    TEXT_CHANNEL : 2,
    BUTTON_CHANNEL : 3,


    resetGame:function() {
        Game.channel = [[], [], [], []];
        Game.time = 0;
        Magic.clearCoolTime();
        Level.stageLevel = -1;
        Level.stageMonsterCount = -1;
        Camera.cameraOn = false;
        if(canvas.width==1200)Camera.extension=1;
        else Camera.extension=0.7;
        Screen.bgColor="rgb(121, 155, 206)";
    },

    startGame:function() {
        //canvas.addEventListener('browserFullScreen', function () { startFs(canvas); });
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        canvas.addEventListener("mousedown", clickDownHandler, false);
        canvas.addEventListener("mouseup", clickUpHandler, false);
        //{어두운 배경: #2B2B2B, 붉은빛하늘: #A89A9A, 붉은빛밤하늘: #3F3939, 보라빛밤하늘: #3C3647, 겨울아침:rgb(179, 211, 244)}

        Level.loadLevel();
        Screen.mainScreen();
        Game.p = new Player(100, -1000);
        Game.p.ga = 0;
    },
    updateWorld:function() {
        if (Game.p != null && Game.p.moveFlag) {
            Game.p.go();
        }
        ctx.fillStyle=Screen.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 4; i++) {
            for (let j = Game.channel[i].length - 1, c = Game.channel[i]; j >= 0; j--) { c[j].update(); }
            Game.removeEntity(i);
        }
        Game.time++;

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

    click:function(x, y) {
        let c = Game.channel[Game.BUTTON_CHANNEL];
        for (let i = c.length - 1; i >= 0; i--) {
            if (c[i].x < x && x < c[i].x + c[i].w && c[i].y < y && y < c[i].y + c[i].h) {
                c[i].collisionHandler(null, "down");
                break;
            }
        }
    },

    convertMobileMode:function(a) {
        if (a) {
            document.addEventListener("touchstart", touchStartHandler, false);
            canvas.addEventListener("touchmove", touchMoveHandler, false); //캔버스로 해야 더 빠름
            document.addEventListener("touchend", touchEndHandler, false);
            canvas.removeEventListener("mousedown", clickDownHandler, false);
            canvas.removeEventListener("mouseup", clickUpHandler, false);
            document.removeEventListener("keydown", keyDownHandler, false);
            document.removeEventListener("keyup", keyUpHandler, false);
            Screen.isMobile = true;
        } else {
            canvas.removeEventListener("touchstart", touchStartHandler, false);
            canvas.removeEventListener("touchmove", touchMoveHandler,false);
            canvas.removeEventListener("touchend", touchEndHandler, false);
            canvas.addEventListener("mousedown", clickDownHandler, false);
            canvas.addEventListener("mouseup", clickUpHandler, false);
            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);
            Screen.isMobile = false;
        }
    }
}


function keyDownHandler(e) {
    switch (e.keyCode) {
        case 39:
            Game.p.moveFlag = true;
            Game.p.isRight = true;
            break;
        case 37:
            Game.p.moveFlag = true;
            Game.p.isRight = false;
            break;
        case 38:
            Game.p.jump();
            break;
        case 81: //q
            Magic.doSkill(Game.p,0);
            break;
        case 87: //w
            Magic.doSkill(Game.p,1);
            break;
        case 69: //e
            Magic.doSkill(Game.p,2);
            break;
        case 82: //r
            Magic.doSkill(Game.p,3);
            break;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        Game.p.moveFlag = false;
        //p.setVectorX(0);
    }
    else if (e.keyCode == 37) {
        Game.p.moveFlag = false;
        //p.setVectorX(0);
    }
}

function clickDownHandler(e) {
    e.preventDefault();
    Game.click(e.layerX, e.layerY);
}

function clickUpHandler(e) {
    e.preventDefault();
    Game.p.moveFlag = false;
}

function touchStartHandler(e) {
    let touch= new Button(e.touches[0].clientX, e.touches[0].clientY, 0,0,Game.PARTICLE_CHANNEL);
    touch.drawCode = function(){
        ctx.strokeRect(touch.x-5,touch.y-5, 10, 10);
        touch.life--;
    }
    touch.life=10;
    
    //e.preventDefault();
    for(let i=0, max=e.touches.length; i<max; i++){
        Game.click(e.touches[i].clientX, e.touches[i].clientY);
    }
}

function touchMoveHandler(e) {
    e.preventDefault();
    for(let i=0, max=e.touches.length; i<max; i++){
        Game.click(e.touches[i].clientX, e.touches[i].clientY);
    }
}


function touchEndHandler(e) {
    //e.preventDefault();
    if(e.touches.length==0)Game.p.moveFlag = false;
    
}

Game.startGame();
setInterval(Game.updateWorld, 10);