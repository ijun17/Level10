//keyboard mouse

let Input = {
    keyDowns:[],
    keyUps:[],
    KEY_MOVE:[[37,38,39,40],[65,87,68,83]], //left up right down / a w d s
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
    addMoveKey:function(player, keyset){ // 땅에서 걷는 엔티티를 조종할때
        const a=keyset[0],b=keyset[1],c=keyset[2];
        this.keyDowns.push(function(e){
            switch(e.keyCode){
                case a:player.isMoving = true;player.isRight = false;break;//left
                case b:player.jump();break;//up
                case c:player.isMoving = true;player.isRight = true;break;//right
            }
        })
        this.keyUps.push(function(e){
            switch(e.keyCode){
                case a: case c:player.isMoving = false;break;
            }
        })
    },
    addFlyKey:function(player, keyset){//하늘을 나는 엔티티를 조종할때
        const a=keyset[0],b=keyset[1],c=keyset[2],d=keyset[3];
        this.keyDowns.push(function(e){
            switch(e.keyCode){
                case a:player.isMoving = true;player.isRight = false;break;//left
                case b:player.isFlying = true;player.isUp=true;break;//up
                case c:player.isMoving = true;player.isRight = true;break;//right
                case d:player.isFlying = true;player.isUp=false;break;
            }
        })
        this.keyUps.push(function(e){
            switch(e.keyCode){
                case a: case c:player.isMoving = false;break;
                case b: case d:player.isFlying = false;break;
            }
        })
    },
    addSkillKey:function(player,keyset){
        const a=keyset[0],b=keyset[1],c=keyset[2],d=keyset[3];
        this.keyDowns.push(function(e){
            switch(e.keyCode){
                case a:player.castSkill(0);break; //q
                case b:player.castSkill(1);break; //w
                case c:player.castSkill(2);break; //e
                case d:player.castSkill(3);break; //r
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
        canvas.addEventListener("touchstart", this.touchStartHandler, {passive: true}); //
        canvas.addEventListener("touchmove", this.touchMoveHandler, {passive: true}); //캔버스로 해야 더 빠름
        canvas.addEventListener("touchend", this.touchEndHandler, false);
        canvas.removeEventListener("mousedown", this.clickDownHandler, false);
    },
    click:function(x, y) {
        let c = Game.channel[Game.BUTTON_CHANNEL].entitys;
        for (let i = c.length - 1; i >= 0; i--) {
            if (c[i].x < x && x < c[i].x + c[i].w && c[i].y < y && y < c[i].y + c[i].h) {
                c[i].collisionHandler({x,y},'c');
                break;
            }
        }
    },
    clickDownHandler:function(e) {
        e.preventDefault();
        Input.click(e.offsetX, e.offsetY);
    },
    touchStartHandler:function(e) {
        //e.preventDefault();
        for(let i=0, max=e.touches.length; i<max; i++){
            Input.click(e.touches[i].clientX, e.touches[i].clientY);
        }
    },
    touchMoveHandler:function(e) {
        //if (e.cancelable) e.preventDefault();
        for(let i=0, max=e.touches.length; i<max; i++){
            Input.click(e.touches[i].clientX, e.touches[i].clientY);
        }
    },
    touchEndHandler:function(e) {
        //e.preventDefault();
        if(e.touches.length==0){
            Input.keyUpHandler({keyCode:37});
            Input.keyUpHandler({keyCode:65});
        }
    }
}