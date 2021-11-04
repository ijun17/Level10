/*
재사용 component
*/

let Component={
    backButton:function(code){
        let backButton = new Button(0, 0, Screen.perX(6), Screen.perX(6));
        backButton.canAct=true;
        backButton.code = function(){code()}
        backButton.drawOption(null, null, "<", Screen.perX(6), "black","white");
        return backButton;
    },
    
    screenName:function(name,color="rgba(255,255,255,0.5)"){ //화면 우측 상단 흰 투명 텍스트
        let screenNameText = new Text(Screen.perX(99),Screen.perX(1), name, Screen.perX(3),color,null,-1,null);
        screenNameText.textBaseline = "top";
        screenNameText.textAlign="right";
        return screenNameText;
    },
    buttonStack:function(perX,perY,count,hasScroll,createCode){
        let maxBtnWidth=0;
        let maxBtnHeight=0;
        
        let stackHead = new Button(Screen.perX(perX), Screen.perX(perY-9), 0, Screen.perX(10));
        stackHead.stack_id=Game.channel[Game.BUTTON_CHANNEL].entitys.length;
        stackHead.stack_list=[stackHead];
        stackHead.stack_interface_list=[];
        let btns=stackHead.stack_list;
        stackHead.moveComponent=function(x,y){
            for(let i=0,l=this.stack_list.length;i<l;i++){btns[i].x+=x;btns[i].y+=y;}
            for(let i=0,l=this.stack_interface_list.length;i<l;i++){stackHead.stack_interface_list[i].x+=x;}
        }
        stackHead.addStack=function(btn){
            let last=this.stack_list[this.stack_list.length-1];
            btn.x=last.x;btn.y=last.y+last.h+Screen.perY(3);
            btn.ga = 0.1;btn.vy = 10;btn.canMove = true;btn.canInteract = true;
            btn.stack_id=this.stack_id;
            btn.collisionHandler=function(e,ct){if(ct==='c')this.code(e,ct);else return (e.stack_id===this.stack_id)}
            this.stack_list.push(btn);
        }
        stackHead.collisionHandler=function(e,ct){if(ct==='c')this.code(e,ct);else return (e.stack_id===this.stack_id)}
        stackHead.canAct=true;
        stackHead.canInteract = true;
        for(let i=0;i<count;i++){
            let btn=createCode(i);
            if(btn===null)continue;
            stackHead.addStack(btn);
            if(btn.w>maxBtnWidth)maxBtnWidth=btn.w;
            if(btn.h>maxBtnHeight)maxBtnHeight=btn.h;
        }
        //스택헤드 위치 크기 조정
        stackHead.w=maxBtnWidth;stackHead.y=Screen.perX(1+perY)-maxBtnHeight;stackHead.h=maxBtnHeight;
        if(hasScroll){
            let background=new Button(Screen.perX(perX-1), 0, maxBtnWidth+Screen.perX(2), 0);
            background.draw = function () { ctx.fillStyle = "rgba(0,0,0,0.2)";ctx.fillRect(this.x, 0, this.w, canvas.height);}
            const MOVE_DISTANCE=Screen.perY(20);
            let upButton = new Button(stackHead.w+stackHead.x+Screen.perX(1), 0, Screen.perX(4), Screen.perX(4));
            upButton.drawOption("rgba(0,0,0,0.5)", null, "▲", Screen.perX(3), "white");
            upButton.code = function () {if(btns[0].y+btns[0].h<0) stackHead.moveComponent(0,MOVE_DISTANCE); };
            let downButton = new Button(stackHead.w+stackHead.x+Screen.perX(1), canvas.height - Screen.perX(4), Screen.perX(4), Screen.perX(4));
            downButton.drawOption("rgba(0,0,0,0.5)", null, "▼", Screen.perX(3), "white");
            downButton.code =function(){if(btns[btns.length-1].y+btns[btns.length-1].h > canvas.height) stackHead.moveComponent(0,-MOVE_DISTANCE);};
            stackHead.stack_interface_list.push(background);
            stackHead.stack_interface_list.push(upButton);
            stackHead.stack_interface_list.push(downButton);
        }
        return stackHead;
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
        let components=[];
        const ID=Game.channel[Game.BUTTON_CHANNEL].entitys.length;
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
            keyBtn.temp[0]=Component.magicButton(Screen.perX(perX+9), Screen.perX(perY) + Screen.perX(9*i+1), skillNum[i]);
            components.push(temp);components.push(keyBtn);components.push(keyBtn.temp[0]);
        }
        let nameText = new Text(Screen.perX(perX),Screen.perX(perY-3), name, Screen.perX(2),"rgba(255,255,255,0.7)",null,-1,null);
        nameText.textBaseline = "top";
        nameText.textAlign="left";
        let keyButtonComponent= new Button(Screen.perX(perX-0.5), Screen.perX(perY-0.5), Screen.perX(26), Screen.perX(36))
        keyButtonComponent.drawOption("rgba(0,0,0,0.2)");
        components.push(nameText);components.push(keyButtonComponent);
        keyButtonComponent.interface_list=components;
        keyButtonComponent.canAct=true;
        let list=keyButtonComponent.interface_list
        for(let i=0; i<list.length; i++){
            list[i].component_id=ID;
            list[i].collisionHandler=function(e,ct){if(ct==='c')this.code(e,ct);else return (e.component_id===this.component_id)}
        }
        keyButtonComponent.moveComponent=function(x,y){for(let i=0,l=this.interface_list.length;i<l;i++){this.interface_list[i].x+=x;this.interface_list[i].y+=y;}}
        return keyButtonComponent;
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
    bossMonsterStatusView:function(bossMonster,perX,perY,name="Boss",textColor="white"){
        const viewTextSize=Screen.perX(1.8);
        const MAX_HP=bossMonster.life;
        let view=new Button(Screen.perX(perX),Screen.perX(perY),Screen.perX(40),Screen.perX(6.5),Game.TEXT_CHANNEL)
        view.draw=function(){
            ctx.fillStyle="rgba(0,0,0,0.1)";
            ctx.fillRect(this.x,this.y, this.w, this.h);
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillStyle=textColor;
            ctx.font = "bold "+viewTextSize+"px Arial";
            ctx.fillText(name, this.x+Screen.perX(0.5),this.y+Screen.perX(0.5));
            ctx.strokeStyle=textColor;
            ctx.strokeRect(this.x+Screen.perX(0.5),this.y+Screen.perX(3),this.w-Screen.perX(1),Screen.perX(3));
            ctx.fillStyle="DarkSlateBlue";
            let bossMonsterLife=bossMonster.life>0?bossMonster.life:0;
            ctx.fillRect(this.x+Screen.perX(0.5),this.y+Screen.perX(3),(this.w-Screen.perX(1))*(bossMonsterLife/MAX_HP),Screen.perX(3));
            ctx.fillStyle="white";
            ctx.fillText(bossMonsterLife,this.x+Screen.perX(1),this.y+Screen.perX(3.7));
        }
        return view;
    },
    mobileButton: function (player, mobileButtonSize = 70) {
        //move button
        let leftButton = new Button(5, canvas.height - mobileButtonSize - 5, mobileButtonSize, mobileButtonSize);
        leftButton.code = function () { player.isMovingX = true; player.isRight = false; };
        leftButton.drawOption("rgba(61, 61, 61,0.5)", "black", "<", mobileButtonSize, "black");
        leftButton.collisionHandler=function(e,ct){if (ct==="t"||ct==="c") this.code(e,ct);return true;}
        let rightButton = new Button(15 + mobileButtonSize * 2, canvas.height - mobileButtonSize - 5, mobileButtonSize, mobileButtonSize);
        rightButton.code = function () { player.isMovingX = true; player.isRight = true; };
        rightButton.drawOption("rgba(61, 61, 61,0.5)", "black", ">", mobileButtonSize, "black");
        rightButton.collisionHandler=function(e,ct){if (ct==="t"||ct==="c") this.code(e,ct);return true;}
        if(player.isFlying){
            let upButton = new Button(10 + mobileButtonSize, canvas.height - mobileButtonSize*2 - 10, mobileButtonSize, mobileButtonSize);
            upButton.code = function () { player.isMovingY = true; player.isUp = true; };
            upButton.drawOption("rgba(61, 61, 61,0.5)", "black", "^", mobileButtonSize, "black");
            upButton.collisionHandler=function(e,ct){if (ct==="t"||ct==="c") this.code(e,ct);return true;}
            let downButton = new Button(10 + mobileButtonSize, canvas.height - mobileButtonSize - 5, mobileButtonSize, mobileButtonSize);
            downButton.code = function () { player.isMovingY = true; player.isUp = false; };
            downButton.drawOption("rgba(61, 61, 61,0.5)", "black", "v", mobileButtonSize, "black");
            downButton.collisionHandler=function(e,ct){if (ct==="t"||ct==="c") this.code(e,ct);return true;}
        }else{
            let upButton = new Button(10 + mobileButtonSize, canvas.height - mobileButtonSize - 5, mobileButtonSize, mobileButtonSize);
            upButton.code = function () { player.jump() };
            upButton.drawOption("rgba(61, 61, 61,0.5)", "black", "^", mobileButtonSize, "black");
            upButton.collisionHandler=function(e,ct){if (ct==="t"||ct==="c") this.code(e,ct);return true;}
        }
        //skill button
        const keys = ["Q", "W", "E", "R"];
        const font1="bold " + (Math.floor(mobileButtonSize*0.7)) + "px Arial";
        const font2="bold " + (Math.floor(mobileButtonSize*0.19)) + "px Arial";
        for (let i = 0; i < player.skillList.length; i++) {
            let keyButton = new Button(canvas.width +(i-4) * (mobileButtonSize + 5), canvas.height - mobileButtonSize -5, mobileButtonSize, mobileButtonSize);
            keyButton.code = function () { player.castSkill(i); };
            keyButton.draw = function () {
                ctx.fillStyle = (player.coolTime[i] < Game.time ? "rgb(121, 140, 205)" : "rgba(61, 61, 61,0.5)");//"rgba(61, 61, 61,0.5)";
                ctx.fillRect(keyButton.x, keyButton.y, keyButton.w, keyButton.h);
                ctx.strokeStyle = "black";
                ctx.strokeRect(keyButton.x, keyButton.y, keyButton.w, keyButton.h);
                ctx.fillStyle = "black";
                ctx.font = font1;
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(keys[i], keyButton.x + mobileButtonSize*0.5, keyButton.y + mobileButtonSize*0.6);
                ctx.fillStyle = "white";
                ctx.font = font2;
                ctx.fillText(player.skillList[i][0], keyButton.x + mobileButtonSize*0.5, keyButton.y + mobileButtonSize*0.2);
            }
        }
    },
    worldWall:function(mapSizeW,mapSizeH,wallSize){
        let top=new Block(0,-wallSize-mapSizeH,mapSizeW,wallSize,"wall");//top
        let left=new Block(-wallSize, -wallSize-mapSizeH, wallSize, mapSizeH+wallSize*2,"wall"); //left
        let right=new Block(mapSizeW, -wallSize-mapSizeH, wallSize, mapSizeH+wallSize*2,"wall");//right
        top.setMapBlock(TYPE.wall)
        left.setMapBlock(TYPE.wall)
        right.setMapBlock(TYPE.wall)
        top.canInteract=false;
        left.canInteract=false;
        right.canInteract=false;
        new Block(-wallSize,0,mapSizeW+wallSize*2,wallSize).setMapBlock(TYPE.grass);

        const deadzoneSize=100000000
        new Block(-deadzoneSize, -deadzoneSize-mapSizeH,deadzoneSize,deadzoneSize*2).setMapBlock()
        new Block(mapSizeW,  -deadzoneSize-mapSizeH, deadzoneSize, deadzoneSize*2).setMapBlock()
        new Block(-deadzoneSize,-mapSizeH-deadzoneSize,deadzoneSize*2+mapSizeW,deadzoneSize).setMapBlock()
        
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
            tempctx.arc(Camera.getX(e.getX()), Camera.getY(e.getY()), Camera.getS(r), 0, Math.PI * 2, true);
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
    },
    chain:function(list,chainDistance, power1,power2){
        let chain = new Entity(0,0,Game.PHYSICS_CHANNEL);
        chain.canInteract=false;
        chain.chainList=list;
        for(let i=0,l=list.length; i<l; i++){
            list[i].chainType=33;
            list[i].collisionHandler=function(e){if(e.chainType===this.chainType)return false; return true;}
        }
        chain.chainDistance=chainDistance;
        chain.chainTension=power1;
        chain.addChain=function(e){this.chainList[this.chainList.length]=e}
        chain.update=function(){
            //장력 적용
            let a,b,c,vx,vy,temp;
            for(let i=0,l=this.chainList.length-1;i<l;i++){
                a=this.chainList[i];
                b=this.chainList[i+1];
                let distance=Math.sqrt((a.x-b.x)**2)+((a.y-b.y)**2)-this.chainDistance;
                temp=(1-this.chainDistance/(Math.sqrt((a.x-b.x)**2)+((a.y-b.y)**2)+100))*0.5;
                vx=(b.x-a.x)*temp;
                vy=(a.y-b.y)*temp;
                vx=vx*Math.abs(vx)*0.5*0.1;
                vy=vy*Math.abs(vy)*0.5*0.1;
                a.vx*=0.995;a.vy*=0.995;b.vx*=0.995;b.vy*=0.995
                a.giveForce(vx,vy);
                b.giveForce(-vx,-vy);
            }

            // for(let i,l=this.chainList.length-2;i<l;i++){
            //     a=this.chainList[i];
            //     b=this.chainList[i+1];
            //     c=this.chainList[i+2];
            //     temp=Math.sqrt((4*chainDistance**2)/((a.x-c.x)**2+(a.y-c.y)**2)-1)*0.5*power2;
            //     vx=(c.y-a.y)*temp;
            //     vy=(c.x-a.x)*temp;
            //     a.giveForce(vx,vy);
            //     b.giveForce(-vx,-vy);
            //     c.giveForce(vx,vy);
            // }
        }
        return chain;
    }
}