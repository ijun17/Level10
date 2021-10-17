/*
재사용 component
*/

let Component={
    backButton:function(code){
        let backButton = new Button(0, 0, Screen.perX(6), Screen.perX(6));
        backButton.code = code;
        backButton.drawOption(null, null, "<", Screen.perX(6), "black","white");
        return backButton;
    },
    
    screenName:function(name,color="rgba(255,255,255,0.5)"){ //화면 우측 상단 흰 투명 텍스트
        let screenNameText = new Text(Screen.perX(99),Screen.perX(1), name, Screen.perX(3),color,null,-1,null);
        screenNameText.textBaseline = "top";
        screenNameText.textAlign="right";
        return screenNameText;
    },
    listScroll:function(perX,perSize,listStart, listEnd){
        //MAGIC LIST SCROLL
        let scroll = new Button(Screen.perX(perX-1), -Screen.perX(8), Screen.perX(perSize+2), Screen.perX(9));
        scroll.setStatic();
        scroll.draw = function () {
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(scroll.x, 0, scroll.w, canvas.height);
        }
        function move(d){
            for(let i=listStart;i<=listEnd;i++){
                if(Game.channel[Game.BUTTON_CHANNEL].get(i).temp[1]==null)Game.channel[Game.BUTTON_CHANNEL].get(i).y+=d;
            }
        }
        const MOVE_DISTANCE=Screen.perY(20);
        let upButton = new Button(Screen.perX(perX+perSize+1),0,Screen.perX(4),Screen.perX(4));
        upButton.drawOption("rgba(0,0,0,0.5)",null,"▲", Screen.perX(3),"white");
        upButton.code=function(){if(Game.channel[Game.BUTTON_CHANNEL].get(listEnd).y<-Screen.perX(8))move(MOVE_DISTANCE);};
        let downButton = new Button(Screen.perX(perX+perSize+1),canvas.height-Screen.perX(4),Screen.perX(4),Screen.perX(4));
        downButton.drawOption("rgba(0,0,0,0.5)",null,"▼", Screen.perX(3),"white");
        downButton.code=function(){if(Screen.perX(3)*(listEnd-listStart)+Screen.perX(8)+Game.channel[Game.BUTTON_CHANNEL].get(listEnd).y>canvas.height)move(-MOVE_DISTANCE);};
    },
    magicButton:function(x,y,magicListIndex,selector=null,extraCode=function(){}){
        let magicBtn = new Button(x,y,Screen.perX(16),Screen.perX(3));
        const color = (magicListIndex<Magic.basicMagic.length ? `rgba(119, 138, 202,0.8)` : `rgba(65, 105, 225,0.8)`); //119, 138, 202
        magicBtn.drawOption(color, "black", Magic.magicList[magicListIndex][0], Screen.perX(2), "black");
        magicBtn.code = function () {
            (Magic.magicList[magicListIndex][1]) (Game.p);
            if(selector!=null)selector.selectedBtn=this;
            extraCode(magicBtn);
        }
        magicBtn.temp[0] = magicListIndex;
        magicBtn.ga = 0.1;
        magicBtn.vy = 10;
        magicBtn.canMove = true;
        magicBtn.canInteract = true;
        return magicBtn;
    },
    buttonSelector:function(extraCode=function(){}){
        let selector = new Entity(0,0,Game.BUTTON_CHANNEL);
        selector.selectedBtn=null;
        selector.update=function(){
            if (this.selectedBtn != null) {
                //선택된 마법의 색을 어둡게
                ctx.fillStyle = "rgba(0,0,0,0.5)";
                ctx.fillRect(this.selectedBtn.x, this.selectedBtn.y, this.selectedBtn.w, this.selectedBtn.h);
                extraCode();
            }
        }
        return selector;
    },
    keyButton:function(perX,perY,keys,skillNum,selector,name=""){
        for (let i = 0; i < 4; i++) {
            if(skillNum[i]>=Magic.magicList.length)skillNum[i]=i;
            let temp = new Button(Screen.perX(perX+8), Screen.perX(perY-4+9*i), Screen.perX(16), Screen.perX(4));
            temp.setStatic();
            let keyBtn = new Button(Screen.perX(perX), Screen.perX(perY+9*i), Screen.perX(8), Screen.perX(8))
            keyBtn.code = function () {
                let selectMagic=selector.selectedBtn;
                if(selectMagic != null){
                    
                    skillNum[i]=selectMagic.temp[0];
                    const boxFill=(selectMagic.temp[0]<Magic.basicMagic.length ? `rgba(119, 138, 202,0.8)` : `rgba(65, 105, 225,0.8)`);
                    keyBtn.temp[0].drawOption(boxFill, "black", Magic.magicList[skillNum[i]][0], Screen.perX(2), "black");
                    keyBtn.temp[0].code=function(){(Magic.magicList[skillNum[i]][1])(Game.p)};
                    keyBtn.temp[0].y+=Screen.perX(1);
                    Magic.saveSkillNum();
                }
            };
            keyBtn.drawOption("rgb(60, 60, 60)", "black", keys[i],Screen.perX(7), "black");
            keyBtn.temp[0]=Component.magicButton(Screen.perX(perX+9), Screen.perX(perY) + Screen.perX(9*i+1), skillNum[i])
        }
        let nameText = new Text(Screen.perX(perX),Screen.perX(perY-3), name, Screen.perX(2),"rgba(255,255,255,0.5)",null,-1,null);
        nameText.textBaseline = "top";
        nameText.textAlign="left";
        new Entity(0,0,Game.BUTTON_CHANNEL).update=function(){
            ctx.fillStyle = "rgba(0,0,0,0.1)";
            ctx.fillRect(Screen.perX(perX-0.5), Screen.perX(perY-0.5), Screen.perX(26), Screen.perX(36));
        }
    },
    playerStatusView:function(player,perX,perY,playerName="Player",textColor="white"){
        const viewTextSize=Screen.perX(1.8);
        const viewTextSize2=Screen.perX(1.4);
        const MAX_HP=player.life;
        const MAX_MP=player.mp;
        const printSkillInfo=function(){
            for(let i = player.skillList.length-1; i >=0 ; i--){
                let coolT = player.coolTime[i] - Game.time;
                let skill = player.skillList[i];
                ctx.fillText(skill[0] + "(" + skill[3] + "): " + (coolT > 0 ? (coolT * 0.01).toFixed(2) : "ready"),Screen.perX(perX+19),Screen.perX(perY)+Screen.perX(2) * i);
            }
        }
        let view = new Button(Screen.perX(perX),Screen.perX(perY),Screen.perX(45),Screen.perX(8),Game.TEXT_CHANNEL);
        view.draw=function(){
            ctx.fillStyle="rgba(0,0,0,0.1)";
            ctx.fillRect(this.x-Screen.perX(0.5),this.y-Screen.perX(0.5), Screen.perX(42), Screen.perX(8))
            ctx.strokeStyle=textColor;
            ctx.strokeRect(this.x,this.y+Screen.perX(2.5),Screen.perX(18),Screen.perX(2));
            ctx.strokeRect(this.x,this.y+Screen.perX(5),Screen.perX(18),Screen.perX(2));
            let playerLife=player.life>0?player.life:0;
            ctx.fillStyle="brown";
            ctx.fillRect(this.x,this.y+Screen.perX(2.5),Screen.perX(18)*(playerLife/MAX_HP),Screen.perX(2));
            ctx.fillStyle="royalblue";
            ctx.fillRect(this.x,this.y+Screen.perX(5),Screen.perX(18)*(player.mp/MAX_MP),Screen.perX(2));
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillStyle=textColor;
            ctx.font = "bold "+viewTextSize+"px Arial";
            ctx.fillText(playerName, this.x,this.y);
            ctx.font = viewTextSize2+"px Arial";
            ctx.fillText(playerLife, this.x+Screen.perX(0.5),this.y+Screen.perX(3));
            ctx.fillText(player.mp, this.x+Screen.perX(0.5),this.y+Screen.perX(5.5));
            printSkillInfo();
        }
        return view;
    },
    mobileButton: function (player, mobileButtonSize = 70) {
        let leftButton = new Button(5, canvas.height - mobileButtonSize - 5, mobileButtonSize, mobileButtonSize);
        leftButton.code = function () { player.isMoving = true; player.isRight = false; };
        leftButton.drawOption("rgba(61, 61, 61,0.5)", "black", "<", 80, "black");
        let upButton = new Button(10 + mobileButtonSize, canvas.height - mobileButtonSize - 5, mobileButtonSize, mobileButtonSize);
        upButton.code = function () { player.jump() };
        upButton.drawOption("rgba(61, 61, 61,0.5)", "black", "^", 80, "black");
        let rightButton = new Button(15 + mobileButtonSize * 2, canvas.height - mobileButtonSize - 5, mobileButtonSize, mobileButtonSize);
        rightButton.code = function () { player.isMoving = true; player.isRight = true; };
        rightButton.drawOption("rgba(61, 61, 61,0.5)", "black", ">", 80, "black");
        let keys = ["Q", "W", "E", "R"];
        for (let i = 0; i < 4; i++) {
            let keyButton = new Button(canvas.width - (5 * 4 + mobileButtonSize * 4) + i * (mobileButtonSize + 5), canvas.height - mobileButtonSize - 5, mobileButtonSize, mobileButtonSize);
            keyButton.code = function () { player.castSkill(i); };
            keyButton.draw = function () {
                ctx.fillStyle = (player.coolTime[i] < Game.time ? "rgb(121, 140, 205)" : "rgba(61, 61, 61,0.5)");//"rgba(61, 61, 61,0.5)";
                ctx.fillRect(keyButton.x, keyButton.y, keyButton.w, keyButton.h);
                ctx.strokeStyle = "black";
                ctx.strokeRect(keyButton.x, keyButton.y, keyButton.w, keyButton.h);
                ctx.fillStyle = "black";
                ctx.font = "bold " + (mobileButtonSize - 20) + "px Arial";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(keys[i], keyButton.x + 35, keyButton.y + 43);
                ctx.fillStyle = "white";
                ctx.font = "bold 15px Arial";
                ctx.fillText(player.skillList[i][0], keyButton.x + 35, keyButton.y + 11);
            }
        }
    },
    serverConnectionChecker:function(x,y){
        Multi.connectOn();
        let checker = new Button(x,y,Screen.perX(8),Screen.perX(2.5));
        checker.drawOption(null,"brown","offline", Screen.perX(2),"brown",null);
        checker.act=function(){
            //check server
            if(Game.time%20==0){
                if(Multi.serverOn){checker.drawOption(null,"green","online", Screen.perX(2),"green",null);
                }else{checker.drawOption(null,"brown","offline", Screen.perX(2),"brown",null);}
            }
        }
        return checker;
    },
    worldWall:function(mapSizeW,mapSizeH,wallSize){
        new MapBlock(0,-wallSize-mapSizeH,mapSizeW,wallSize,"wall");//top
        new MapBlock(-wallSize, -wallSize-mapSizeH, wallSize, mapSizeH+wallSize*2,"wall"); //left
        new MapBlock(mapSizeW, -wallSize-mapSizeH, wallSize, mapSizeH+wallSize*2,"wall");//right
        new MapBlock(-wallSize,0,mapSizeW+wallSize*2,wallSize,"grass");

        const deadzoneSize=100000000
        new MapBlock(-deadzoneSize, -deadzoneSize-mapSizeH,deadzoneSize,deadzoneSize*2,"deadzone")//.collisionHandler=function(e){if(e instanceof Player)e.life=0;}
        new MapBlock(mapSizeW,  -deadzoneSize-mapSizeH, deadzoneSize, deadzoneSize*2,"deadzone")//.collisionHandler=function(e){if(e instanceof Player)e.life=0;}
        new MapBlock(-deadzoneSize,-mapSizeH-deadzoneSize,deadzoneSize*2+mapSizeW,deadzoneSize,"deadzone")//.collisionHandler=function(e){if(e instanceof Player)e.life=0;}
        
    },
    particleSpray:function(type,xy,rangeW,rangeH,particleSize,particleVy,delay){
        let spray = new Entity(0,0,Game.BUTTON_CHENNEL);
        spray.canMove=false;
        spray.canCollision=false;
        spray.canRemoved=false;
        let count=0;
        spray.update=function(){
            if(++count==delay){
                let randomX = (Math.random()-0.5)*rangeW;
                let particle=new Particle(type,randomX+xy.x,xy.y+rangeH);
                particle.w=particleSize;
                particle.h=particleSize;
                particle.life=400;
                particle.vy-=particleVy;
                count=0;
            }
        };
    },
    developerTool:function(){
        const perSize=Screen.perX(4);
        const perX=Screen.perX(50)-perSize*1.5;
        const perY=Screen.perY(100)-perSize-Screen.perX(1);
        speed=[0,10,100];
        for(let i=0; i<speed.length; i++){
            let speedBtn=new Button(perX+i*perSize, perY, perSize, perSize);
            speedBtn.drawOption("rgba(125,125,125,0.5)","black",speed[i],Screen.perX(2),"black");
            speedBtn.code=function(){Game.setGameSpeed(speed[i])}
            speedBtn.canCollision=false;
        }
    },

    shader: function (background="rgb(1,1,7)", globalAlpha=0.8) {
        function getBrightness(e){
            if(e.brightness==undefined)return 0;
            else return e.brightness;
        }
        function fillLight(e,r){
            tempctx.beginPath();
            tempctx.arc(Camera.getX(e.getX()), Camera.getY(e.getY()), r, 0, Math.PI * 2, true);
            tempctx.fill();
            tempctx.closePath();
        }
        let sm = new Entity(0,0,Game.PARTICLE_CHANNEL);
        sm.update = function () {
            tempctx.clearRect(0, 0, tempcanvas.width, tempcanvas.height);
            tempctx.fillStyle="#FAFFAF";//자연광  rgb(250, 255, 175)
            tempctx.globalCompositeOperation = "source-over";
            let entitys = Game.channel[Game.PHYSICS_CHANNEL].entitys;
            let e;
            let brightness;
            let sumBrightness=0;
            for (let i = entitys.length - 1; i > -1; i--) {
                e = entitys[i];
                brightness=getBrightness(e);
                if(brightness>0){
                    sumBrightness+=brightness;
                    tempctx.globalAlpha = 0.1;
                    fillLight(e,200*brightness);
                    tempctx.globalAlpha = 0.2;
                    fillLight(e,60*brightness);
                    tempctx.globalAlpha = 0.3;
                    fillLight(e,20*brightness);
                }
            }
            tempctx.globalCompositeOperation = "xor";
            if(sumBrightness<1){
                tempctx.globalAlpha = globalAlpha;
            }else{
                tempctx.globalAlpha = globalAlpha-0.1;
            }
            tempctx.fillStyle=background;
            tempctx.fillRect(0,0,tempcanvas.width, tempcanvas.height);
            ctx.drawImage(tempcanvas,0,0);
        }
        return sm;
    }
}