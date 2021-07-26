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
    keyboardOn:false,
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
        Screen.bgColor="#b2c3c8";
        //{어두운 배경: #2B2B2B, 붉은빛하늘: #A89A9A,맑은하늘:rgb(121, 155, 206), 녹색하늘색:#94a9ad}
    },
    startGame:function() {
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);
        canvas.addEventListener("mousedown", this.clickDownHandler, false);
        
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
    },
    //CLIENT FUNCITON
    click:function(x, y) {
        let c = Game.channel[Game.BUTTON_CHANNEL];
        for (let i = c.length - 1; i >= 0; i--) {
            if (c[i].x < x && x < c[i].x + c[i].w && c[i].y < y && y < c[i].y + c[i].h) {
                c[i].collisionHandler(null, "down");
                break;
            }
        }
    },
    keyDownHandler:function(e) {
        if(Game.keyboardOn)
        switch (e.keyCode) {
            case 39:Game.p.moveFlag = true;Game.p.isRight = true;break;//right
            case 37:Game.p.moveFlag = true;Game.p.isRight = false;break;//left
            case 38:Game.p.jump();break;//up
            case 32:Game.p.jump();break;//space
            case 81:Game.p.castMagic(0);break; //q
            case 87:Game.p.castMagic(1);break; //w
            case 69:Game.p.castMagic(2);break; //e
            case 82:Game.p.castMagic(3);break; //r
        }
    },
    keyUpHandler:function(e) {
        switch(e.keyCode){
            case 39:Game.p.moveFlag = false;break;
            case 37:Game.p.moveFlag = false;break;
        }
    },
    clickDownHandler:function(e) {
        e.preventDefault();
        Game.click(e.layerX, e.layerY);
    },
    touchStartHandler:function(e) {
        //e.preventDefault();
        let touch= new Button(e.touches[0].clientX, e.touches[0].clientY, 0,0,Game.PARTICLE_CHANNEL);
        touch.canRemoved=true;
        touch.drawCode = function(){ctx.strokeRect(touch.x-5,touch.y-5, 10, 10);touch.life--;}
        touch.life=10;
        for(let i=0, max=e.touches.length; i<max; i++){
            Game.click(e.touches[i].clientX, e.touches[i].clientY);
        }
    },
    touchMoveHandler:function(e) {
        //e.preventDefault();
        for(let i=0, max=e.touches.length; i<max; i++){
            Game.click(e.touches[i].clientX, e.touches[i].clientY);
        }
    },
    touchEndHandler:function(e) {
        //e.preventDefault();
        if(e.touches.length==0){
            if(Multi.gameOn)Multi.keyUpHandler({keyCode:39});
            else Game.p.moveFlag = false;
        }
    },
    convertMultiMode:function(a) {
        if(a){
            document.removeEventListener("keydown", this.keyDownHandler, false);
            document.removeEventListener("keyup", this.keyUpHandler, false);
            document.addEventListener("keydown", Multi.keyDownHandler, false);
            document.addEventListener("keyup", Multi.keyUpHandler, false);
        }else{
            document.addEventListener("keydown", this.keyDownHandler, false);
            document.addEventListener("keyup", this.keyUpHandler, false);
            document.removeEventListener("keydown", Multi.keyDownHandler, false);
            document.removeEventListener("keyup", Multi.keyUpHandler, false);
        }
    },
    convertMobileMode:function(a) {
        if (a) {
            document.addEventListener("touchstart", this.touchStartHandler, false);
            canvas.addEventListener("touchmove", this.touchMoveHandler, false); //캔버스로 해야 더 빠름
            document.addEventListener("touchend", this.touchEndHandler, false);
            canvas.removeEventListener("mousedown", this.clickDownHandler, false);
            Screen.isMobile = true;
        } else {
            canvas.removeEventListener("touchstart", this.touchStartHandler, false);
            canvas.removeEventListener("touchmove", this.touchMoveHandler,false);
            canvas.removeEventListener("touchend", this.touchEndHandler, false);
            canvas.addEventListener("mousedown", this.clickDownHandler, false);
            Screen.isMobile = false;
        }
    }
}

Game.startGame();