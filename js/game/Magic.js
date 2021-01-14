let Magic = {
    magicPoint:0,
    //qwer
    skillNum:[1,2,3,4],
    coolTime:[0,0,0,0],
    basicMagicCount:1,
    customMagicCount:0,
    customMagic:[],
    magicEffectSound : new Audio(),
    //magicFrame=[magic name, magic code, needed Level] : basicMagic, customMagic
    //magicList = [name, magic function, coolTime, needed MagicPoint, needed Level] : magicList
    magicList:[["magic effect",function(p){
        let magicEffect = new Particle(5, p.x+p.w/2-p.h/2, p.y);
        magicEffect.w=p.h;
        magicEffect.h=p.h;
        //Magic.magicEffectSound.pause();
        Magic.magicEffectSound.currentTime=0;
        Magic.magicEffectSound.play();
    },0,0,0]],
    basicMagic:[
    ["fire ball",`
createMatter(0,front()*10,3/4);
    `,1],

    ["wall", `
@block = createBlock(40,100,"black");
move(block,0,100);
    `,1],

    ["dash",`
giveForce(player,front()*20,0);
    `,1],

    ["heal",`
damage(player,-1000);
    `,1],

    ["zero gravity",`
setGravity(player,200,0);    
    
    `,2],

    ["meteor",`
for(@i=0;i<4;i++){
    for(@j=0;j<4;j++){
        @fire=createMatter(0,front()*10,-10);
        move(fire, front()*i*40,300-j*40);
        damage(fire,-10);
    }
}
    `,2],
    ["fire tornado",`
@x=getX(player)+front()*200;
for(@i=0;i<12;i++){
    @fire = createMatter(0,0,0);
    move(fire,front()*(200-13*i-15), i*35);
    //setGravity(fire,500,0);
    damage(fire,-500)
    time(fire,1,500,#(){
        giveForce(fire,(x-getX(fire))/(11+i)*10,-getVY(fire));
    });
}
    `,3],


    ["reflection",`
@barrier = createTrigger(20,200,400,#(e){
    if(e!=player){
        giveForce(e, 0, 5);
    }
})
    `,3],

    ["one-gi-oc",`
for(@i=0;i<4;i++){
    @e=createMatter(5,front()*1,-1);
    move(e,-60,200);
    damage(e,-2);
}
    `,4],
    ["chi-do-ri",`
time(player,1,401,#(){
    @e=createMatter(1,0,0);
    move(e,front()*20,0)
});
    `,5],
    ["detection",`
@block=createBlock(10,10,"blue");
@dt=150;
damage(block,-dt+100);
setGravity(block,dt,0);
move(block,0,100);
giveForce(block,front()*20,0);
setCamera(block,getX(block),getY(block),10);
time(player,dt,dt,#(){setCamera(player,getX(player),getY(player),10);});
    `,5]],
    //end basicMasic

    doSkill:function(p,num){
        if(Magic.coolTime[num]<Game.time&&Magic.magicPoint-Magic.magicList[Magic.skillNum[num]][3]>0){
            Magic.magicList[0][1](p);
            let magicNum=Magic.skillNum[num];
            (Magic.magicList[magicNum][1])(p);
            Magic.coolTime[num]=Magic.magicList[magicNum][2]+Game.time;
            Magic.magicPoint-=Magic.magicList[magicNum][3];
        }
    },
    clearCoolTime:function(){
        this.coolTime=[0,0,0,0];
    },
    saveMagic:function(){
        localStorage.CUSTOM_MAGIC=JSON.stringify(Magic.customMagic);
    },
    loadMagic:function(){
        //sound
        Magic.magicEffectSound.src="resource/sound/magic effect2.mp3";
        Magic.magicEffectSound.volume=0.3;
        //load basic magic
        Magic.basicMagicCount=Magic.basicMagic.length;
        for(let i=0,j=Magic.basicMagicCount; i<j; i++){
            let magic = Magic.convertMagictoJS(Magic.basicMagic[i][0],Magic.basicMagic[i][1]);
            if(magic==null){
                Magic.magicList.push([Magic.basicMagic[i][0], function(){}, 100,100,Magic.basicMagic[i][2]]);
            }else{
                magic[4]=Magic.basicMagic[i][2];//제한 레벨을 지정
                Magic.magicList.push(magic); 
            }
            
        }
        //load custom magic
        if(localStorage.CUSTOM_MAGIC!=null)Magic.customMagic=JSON.parse(localStorage.CUSTOM_MAGIC);
        Magic.customMagicCount=Magic.customMagic.length;
        for(let i=0,j=Magic.customMagicCount; i<j; i++){
            let magic = Magic.convertMagictoJS(Magic.customMagic[i][0],Magic.customMagic[i][1]);
            if(magic==null){
                Magic.magicList.push([Magic.customMagic[i][0], function(){},100,100,1]);
            }else {
                Magic.magicList.push(magic);
            }
        }
    },
    addEmptyMagic:function(){
        Magic.customMagicCount++;
        Magic.customMagic.push(["none", ""]);
        Magic.magicList.push(["none", function(){},0,0]);
    },
    convertMagictoJS: function (name, magicCode) {
        let magicFactor = [100,100]; //[cooltime, magic point]
        let jsCode="";
        let testCode="";
        let temp =""; //문자열이 일시적으로 담기는곳
        //caculate magicFactor(cooltime, magic point)
        function getEnergy(e){ //엔티티가 가지고 있는 데미지를 반환
            let test = new Entity(0,10000,Game.PHYSICS_CHANNEL);
            test.life=0;
            e.collisionHandler(test,'D',true);
            return Math.abs(test.life);
        }
        function addMF(mf) {
            magicFactor[0] = Math.floor(Math.sqrt(magicFactor[0] * magicFactor[0] + mf[0] * mf[0]));
            magicFactor[1] += Math.floor(Math.abs(mf[1]));
        }
        //magic function
        function giveForce(e,ax,ay){e.vx+=ax;e.vy+=ay;}
        function damage(e,d){if(e.canCollision)e.life-=d;}
        function invisible(e,time){e.visibility=false;e.addAction(time,time,function(){e.visibility=true;});}
        function freeze(e,time){e.canMove=false;e.addAction(time,time,function(){e.visibility=true;});}
        function setGravity(e,time,ga){let temp=e.ga;e.ga=ga;e.addAction(time,time,function(){e.ga=temp;});}
        function move(e,vx,vy){if(e instanceof Monster)return;e.x+=vx;e.y-=vy;}
        function time(e,startTime,endTime,f){e.addAction(startTime,endTime,f);}
        function setCamera(target,x,y,delay){Camera.makeMovingCamera(target,x,-y,delay);}
        function getX(e){return e.x+e.w/2;}
        function getY(e){return -(e.y+e.h/2);}
        function getVX(e){return e.vx;}
        function getVY(e){return e.vy;}
        function front(){return (Game.p.isRight ? 1 : -1);}
        function createBlock(w,h,color="black"){let b=new Block(Game.p.x+15+front()*(w/2+25)-w/2,-getY(Game.p)-h/2,w,h,color);return b;}
        function createMatter(type,vx,vy){
            let m=new Matter(type,0,0,vx,vy);
            m.x=getX(Game.p)+front()*(m.w/2+15)-m.w/2;
            m.y=-getY(Game.p)-m.h/2;
            return m;
        }
        function createTrigger(w,h,time,f){
            let t=new Trigger(Game.p.x+15+front()*(w/2+25)-w/2,-getY(Game.p)-h/2,w,h,time,f);
            return t;
        }
        //test function
        function test_giveForce(e,ax,ay){let oldE = getEnergy(e);e.vx+=ax;e.vy+=ay;let newE=getEnergy(e);addMF([0, newE-oldE]);}
        function test_damage(e,d){addMF([0,d]);if(e.canCollision)e.life-=d;}
        function test_invisible(e,time){addMF([time*2,100]);e.visibility=false;e.addAction(time,time,function(){e.visibility=true;});}
        function test_freeze(e,time){addMF([time*2,100]);e.canMove=false;e.addAction(time,time,function(){e.visibility=true;});}
        function test_setGravity(e,time,ga){addMF([time*2,ga*100]);let temp=e.ga;e.ga=ga;e.addAction(time,time,function(){e.ga=temp;});}
        function test_move(e,vx,vy){addMF([0,(vx+vy)**2/1000]);e.x+=vx;e.y-=vy;}
        function test_camera(target,x,y,delay){addMF([500,1000]);Camera.makeMovingCamera(target,x,y,delay);}
        function test_time(e,startTime,endTime,f){addMF([(endTime-startTime)*2,100]);for(let i=0,j=(endTime-startTime)/10;i<j;i++)f();}
        function test_createBlock(w,h,color){
            addMF([0,(w*h/100)**2]);let b=new Block(Game.p.x+15+front()*(w/2+25)-w/2,getY(Game.p)+h/2,w,h,color);return b;}
        function test_createMatter(type,vx,vy){
            let m=new Matter(type,0,0,vx,vy);
            m.x=getX(Game.p)+front()*(m.w/2+15)-m.w/2;
            m.y=getY(Game.p)-m.h/2;
            addMF([50,getEnergy(m)]);
            return m;
        }
        function test_createTrigger(w,h,time,f){
            let t=new Trigger(Game.p.x+15+front()*(w/2+25)-w/2,Game.p.y,w,h,time,f);
            addMF([time*2,w*h*time/1000+(getEnergy(t)+1)]);
            let a = new Entity(0,0,Game.PHYSICS_CHANNEL);
            for(let i=0; i<100; i++)f(a);
            return t;
        }    
        
        //keyword
        let prohibitedWord=["new","function"];
        let prohibitedSymbol=["[",".","$"];
        let testKeyword=["giveForce","damage","invisible", "freeze", "setGravity","createTrigger","move","time","createBlock","createMatter"];
        let symbol={"@":"let ","#":"function"};
        //convert magic code to js code
        function isEnglish(c){return (64<c&&c<91)||(96<c&&c<123);}
        function printError(text1,text2){
            const successInfo=document.querySelector(".successInfo");
            const magicInfo = document.querySelector(".magicInfo");
            successInfo.innerText = text1;
            magicInfo.innerText = text2;
        }
        for(let i=0, j=magicCode.length;i<j; i++){
            if(isEnglish(magicCode.charCodeAt(i)))temp+=magicCode[i];
            else{
                if(prohibitedWord.includes(temp)){
                    printError("Fail: "+name, " : your code have prohibited keyword(new, function)\n'function' change to '#'");
                    return null;
                }
                if(prohibitedSymbol.includes(magicCode[i])){
                    printError("Fail: "+name, " : your code have prohibited symbol('[', '.', '$')");
                    return null;
                }
                if(testKeyword.includes(temp))testCode+="test_"+temp;
                else testCode+=temp;
                jsCode+=temp;

                if(magicCode[i] in symbol){
                    testCode+=symbol[magicCode[i]];
                    jsCode+=symbol[magicCode[i]];
                }else {
                    testCode+=magicCode[i];
                    jsCode+=magicCode[i];
                }
                temp="";
            }
        }
        if(temp!=""){
            testCode+=temp;
            jsCode+=temp;
        }
        //running test
        console.log("js code: ",testCode);
        let magic=function(){};
        try {
            magic = eval("(function(player){"+jsCode+"})");
            let testMagic=eval("(function(player){"+testCode+"})");
            let temp = Game.p;
            Game.p = new Player(0,10000);
            Game.p.dieCode=function(){};
            testMagic(Game.p);
            Game.p=temp;
        }catch(e){
            printError("Fail: "+name," : syntex error")
            return null;
        }
        console.log(magicFactor);
        return [name,magic, magicFactor[0],magicFactor[1],1];
    }
}