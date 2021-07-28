//keyboard mouse

let Input = {
    keyDowns:[],
    keyUps:[],
    KEY_MOVE:[[37,38,39],[65,87,68]], //left up right / a w d
    KEY_SKILL:[[81,87,69,82],[96,97,98,99],[82,84,89,85]], //qwer / 0123 / rtyu 
    startInput:function(){
        keyDowns=new Array();
        keyUps=new Array();
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);
        canvas.addEventListener("mousedown", this.clickDownHandler, false);
        
    },
    resetKeyInput:function(){
        this.keyDowns=[];
        this.keyUps=[];
    },
    
    //key up down
    addMoveKey:function(player, keyset){
        const a=keyset[0],b=keyset[1],c=keyset[2];
        this.keyDowns.push(function(e){
            switch(e.keyCode){
                case a:player.moveFlag = true;player.isRight = false;break;//left
                case b:player.jump();break;//up
                case c:player.moveFlag = true;player.isRight = true;break;//right
            }
        })
        this.keyUps.push(function(e){
            switch(e.keyCode){
                case a:player.moveFlag = false;break;
                case c:player.moveFlag = false;break;
            }
        })
    },
    addSkillKey:function(player,keyset){
        const a=keyset[0],b=keyset[1],c=keyset[2],d=keyset[3];
        this.keyDowns.push(function(e){
            switch(e.keyCode){
                case a:player.castMagic(0);break; //q
                case b:player.castMagic(1);break; //w
                case c:player.castMagic(2);break; //e
                case d:player.castMagic(3);break; //r
            }
        })
    },
    keyDownHandler: function (e) {
        for (let i = Input.keyDowns.length - 1; i >= 0; i--) {
            Input.keyDowns[i](e);
        }
    },
    keyUpHandler: function (e) {
        for (let i = Input.keyUps.length - 1; i >= 0; i--) {
            Input.keyUps[i](e);
        }
    },
    //touch and mouse
    convertToMobileMode:function(a) {
        document.addEventListener("touchstart", this.touchStartHandler, false);
        canvas.addEventListener("touchmove", this.touchMoveHandler, false); //캔버스로 해야 더 빠름
        document.addEventListener("touchend", this.touchEndHandler, false);
        canvas.removeEventListener("mousedown", this.clickDownHandler, false);
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
    clickDownHandler:function(e) {
        e.preventDefault();
        Input.click(e.layerX, e.layerY);
    },
    touchStartHandler:function(e) {
        //e.preventDefault();
        let touch= new Button(e.touches[0].clientX, e.touches[0].clientY, 0,0,Game.PARTICLE_CHANNEL);
        touch.canRemoved=true;
        touch.drawCode = function(){ctx.strokeRect(touch.x-5,touch.y-5, 10, 10);touch.life--;}
        touch.life=10;
        for(let i=0, max=e.touches.length; i<max; i++){
            Input.click(e.touches[i].clientX, e.touches[i].clientY);
        }
    },
    touchMoveHandler:function(e) {
        //e.preventDefault();
        for(let i=0, max=e.touches.length; i<max; i++){
            Input.click(e.touches[i].clientX, e.touches[i].clientY);
        }
    },
    touchEndHandler:function(e) {
        //e.preventDefault();
        if(e.touches.length==0){
            if(Multi.gameOn)Multi.keyUpHandler({keyCode:39});
            else Game.p.moveFlag = false;
        }
    }
}