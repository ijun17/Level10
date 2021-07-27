/*
재사용 component
*/

let Component={
    backButton:function(code){
        let backButton = new Button(0, 0, Screen.perX(6), Screen.perX(6));
        backButton.code = code;
        backButton.drawOption(null, null, "<", Screen.perX(6), "black");
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
        scroll.draw = function () {
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(scroll.x, 0, scroll.w, canvas.height);
        }
        function move(d){
            for(let i=listStart;i<=listEnd;i++){
                if(Game.channel[Game.BUTTON_CHANNEL][i].temp[1]==null)Game.channel[Game.BUTTON_CHANNEL][i].y+=d;
            }
        }
        const MOVE_DISTANCE=Screen.perY(20);
        let upButton = new Button(Screen.perX(perX+perSize+1),0,Screen.perX(4),Screen.perX(4));
        upButton.drawOption("rgba(0,0,0,0.5)",null,"▲", Screen.perX(3),"white");
        upButton.code=function(){if(Game.channel[Game.BUTTON_CHANNEL][listEnd].y<-Screen.perX(8))move(MOVE_DISTANCE);};
        let downButton = new Button(Screen.perX(perX+perSize+1),canvas.height-Screen.perX(4),Screen.perX(4),Screen.perX(4));
        downButton.drawOption("rgba(0,0,0,0.5)",null,"▼", Screen.perX(3),"white");
        downButton.code=function(){if(Screen.perX(3)*(listEnd-listStart)+Screen.perX(8)+Game.channel[Game.BUTTON_CHANNEL][listEnd].y>canvas.height)move(-MOVE_DISTANCE);};
    },
    magicButton:function(x,y,magicListIndex,selector=null,extraCode=function(){}){
        let magicBtn = new Button(x,y,Screen.perX(16),Screen.perX(3));
        const color = (magicListIndex<Magic.basicMagicCount ? `rgba(119, 138, 202,0.8)` : `rgba(65, 105, 225,0.8)`); //119, 138, 202
        magicBtn.drawOption(color, "black", Magic.magicList[magicListIndex][0], Screen.perX(2), "black");
        magicBtn.code = function () {
            (Magic.magicList[magicListIndex][1]) (Game.p);
            if(selector!=null)selector.selectedBtn=this;
            extraCode(magicBtn);
        }
        magicBtn.temp[0] = magicListIndex;
        magicBtn.ga = 0.5;
        magicBtn.vy = 20;
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
            let temp = new Button(Screen.perX(perX+8), Screen.perX(perY-4+9*i), Screen.perX(16), Screen.perX(4));
            let keyBtn = new Button(Screen.perX(perX), Screen.perX(perY+9*i), Screen.perX(8), Screen.perX(8))
            keyBtn.code = function () {
                let selectMagic=selector.selectedBtn;
                if(selectMagic != null){
                    skillNum[i]=selectMagic.temp[0];
                    const boxFill=(selectMagic.temp[0]<Magic.basicMagicCount ? `rgba(119, 138, 202,0.8)` : `rgba(65, 105, 225,0.8)`);
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
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(Screen.perX(perX-0.5), Screen.perX(perY-0.5), Screen.perX(26), Screen.perX(36));
        }
    },
    playerStatusView:function(player,perX,perY,playerName="Level "+Level.playerLevel){
        const viewTextSize=Screen.perX(1.5);
        const viewTextSize2=Screen.perX(1.8);
        const MAX_HP = 10000*player.lv;
        const MAX_MP = 30000*player.lv;
        let view = new Button(Screen.perX(perX),Screen.perY(perY),Screen.perX(45),Screen.perX(8),Game.TEXT_CHANNEL);
        view.draw=function(){
            ctx.strokeStyle="black";
            ctx.strokeRect(this.x,this.y+Screen.perX(2.5),Screen.perX(18),Screen.perX(2));
            ctx.strokeRect(this.x,this.y+Screen.perX(5),Screen.perX(18),Screen.perX(2));
            ctx.fillStyle="brown";
            ctx.fillRect(this.x,this.y+Screen.perX(2.5),Screen.perX(18)*(player.life/MAX_HP),Screen.perX(2));
            ctx.fillStyle="royalblue";
            ctx.fillRect(this.x,this.y+Screen.perX(5),Screen.perX(18)*(player.mp/MAX_MP),Screen.perX(2));
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillStyle="black";
            ctx.font = "bold "+viewTextSize2+"px Arial";
            ctx.fillText(playerName, this.x,this.y);
            ctx.fillStyle="black";
            ctx.font = "bold "+viewTextSize+"px Arial";
            ctx.fillText(player.life, this.x+Screen.perX(0.5),this.y+Screen.perX(3));
            ctx.fillText(player.mp, this.x+Screen.perX(0.5),this.y+Screen.perX(5.5));
            for (let i = 0; i < 4; i++) {
                let coolT = player.coolTime[i] - Game.time;
                let magic = player.magicList[i];
                ctx.fillText(magic[0] + "(" + magic[3] + "): " + (coolT > 0 ? (coolT * 0.01).toFixed(2) : "ready"), this.x+Screen.perX(19), this.y + Screen.perX(2) * i);
            }
        }
        return view;
    },
    mobileButton: function (player, mobileButtonSize = 70) {
        let leftButton = new Button(5, canvas.height - mobileButtonSize - 5, mobileButtonSize, mobileButtonSize);
        leftButton.code = function () { player.moveFlag = true; player.isRight = false; };
        leftButton.drawOption("rgba(61, 61, 61,0.5)", "black", "<", 80, "black");
        let upButton = new Button(10 + mobileButtonSize, canvas.height - mobileButtonSize - 5, mobileButtonSize, mobileButtonSize);
        upButton.code = function () { player.jump() };
        upButton.drawOption("rgba(61, 61, 61,0.5)", "black", "^", 80, "black");
        let rightButton = new Button(15 + mobileButtonSize * 2, canvas.height - mobileButtonSize - 5, mobileButtonSize, mobileButtonSize);
        rightButton.code = function () { player.moveFlag = true; player.isRight = true; };
        rightButton.drawOption("rgba(61, 61, 61,0.5)", "black", ">", 80, "black");
        let keys = ["Q", "W", "E", "R"];
        for (let i = 0; i < 4; i++) {
            let keyButton = new Button(canvas.width - (5 * 4 + mobileButtonSize * 4) + i * (mobileButtonSize + 5), canvas.height - mobileButtonSize - 5, mobileButtonSize, mobileButtonSize);
            keyButton.code = function () { player.castMagic(i); };
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
                ctx.fillText(player.magicList[i][0], keyButton.x + 35, keyButton.y + 11);
            }
        }
    },
    serverConnectionChecker:function(x=Screen.perX(6),y=Screen.perX(1)){
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
        new MapBlock(-wallSize, -wallSize-mapSizeH, wallSize, mapSizeH*2,"wall"); //left
        new MapBlock(mapSizeW, -wallSize-mapSizeH, wallSize, mapSizeH*2,"wall");//right
        new MapBlock(-wallSize,0,mapSizeW+wallSize*2,wallSize*2,"grass");
    },
    particleSpray:function(type,xy,width,particleSize,particleVy,delay){
        let spray = new Entity(0,0,Game.BUTTON_CHENNEL);
        spray.canMove=false;
        spray.addAction(1,1000000,function(){
            if(Game.time%delay==0){
                let randomX = (Math.random()-0.5)*width;
                let particle=new Particle(type,randomX+xy.x,xy.y);
                particle.w=particleSize;
                particle.h=particleSize;
                particle.life=400;
                particle.vy-=particleVy;
            }
        });
    }
}