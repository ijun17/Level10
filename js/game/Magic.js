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
//전방에 파이어볼을 발사
@e=createMatter(FIRE,front()*10,1);
giveLife(e,10);
move(e,front()*30, 0);
    `,1],

    ["wall", `
//길쭉한 블럭을 생성
@block = createBlock(30,100,"black");
move(block,0,100);
    `,1],

    ["dash",`
//플레이어가 빠른 속도로 앞으로 이동
giveForce(player,front()*20,0);
    `,1],

    ["heal",`
//플레이어 hp를 2000회복
giveLife(player,2000);
    `,1],

    ["invisible",`
//플레이어의 투명화
invisible(player,300);    
    `,2],

    ["teleport",`
//텔레포트
move(player, front()*300, 0);
    `,2],

    ["fire tornado",`
//불꽃 토네이도 생성
@x=getX(player)+front()*200;
@i=0;
time(player, 1,12,#(){
    @fire = createMatter(FIRE,0,0);
    move(fire,front()*(200-13*i-15), i*35);
    //setGravity(fire,500,0);
    giveLife(fire,500)
    time(fire,1,500,#(){
        giveForce(fire,(x-getX(fire))/(11+i)*10,-getVY(fire));
    });
    i++;
});
    `,3],
    ["sword energy",`
//검기 발사
@e=createMatter(SWORD,front()*20,0);
giveLife(e,10);
    `,3],
    ["zero gravity", `
//플레이어를 무중력 상태로 만듦
setGravity(player,200,0);
    `,4],
    ["Knockback",`
//넉백
@e = createTrigger(20,100,100,#(e){
    giveForce(e, front()*20, 0);
})
giveForce(e,front()*20,0);
    `,5],
    ["detection",`
//전방으로 카메라 발사
@block=createBlock(10,10,"blue");
@dt=150;
giveLife(block,dt-100);
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
        Magic.magicEffectSound.volume=0.1;
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
            magicFactor[0] = Math.floor(Math.sqrt(magicFactor[0]**2 + mf[0]**2));
            magicFactor[1] += Math.floor(Math.abs(mf[1]));
        }
        //UNIT MAGIC FUNCTION
        const FIRE=0;
        const ELECTRICITY=1;
        const ICE=2;
        const ARROW=3;
        const ENERGY=4;
        const SWORD=5;
        const BLOCK=6;
        const TRIGGER=7;
        function create(p,typenum,w,h,vx,vy){
            let e;
            if(typenum<=SWORD)e=new Matter(typenum,0,0,vx,vy);
            else if(typenum=BLOCK)e=new Block(0,0,w,h);
            else if(typenum=TRIGGER)e=new Trigger(0,0,w,h);
            e.vx=vx;e.vy=vy;
            e.x=p.x+p.w/2+front(p)*(e.w/2+p.w/2)-e.w/2;
            e.y=p.y+p.h/2-e.h/2;
            return e;
        }
        function setTrigger(e,f){if(e instanceof Trigger)e.code=f}
        function giveForce(e,ax,ay){e.vx+=ax;e.vy+=ay;}
        function giveLife(e,d){if(e.canCollision)e.life+=d;}
        function invisible(e,time){e.canDraw=false;e.addAction(time,time,function(){e.canDraw=true;});}
        function freeze(e,time){e.canMove=false;e.addAction(time,time,function(){e.canMove=true;});}
        function setGravity(e,time,ga){let temp=e.ga;e.ga=ga;e.addAction(time,time,function(){e.ga=temp;});}
        function move(e,vx,vy){if(e instanceof Monster)return;e.x+=vx;e.y-=vy;}
        function time(e,startTime,endTime,f){e.addAction(startTime,endTime,f);}
        function setCamera(p,target,x,y,delay=10){Camera.makeMovingCamera(target,x+p.x,p.y-y,delay);}
        function getX(p,e){return e.x+e.w/2-(p.x+p.w/2);}
        function getY(p,e){return p.y+p.h/2-(e.y+e.h/2);}
        function getVX(e){return e.vx;}
        function getVY(e){return e.vy;}
        function front(p){return (p.isRight ? 1 : -1);}
        function createBlock(p,w,h,color="black"){let b=new Block(p.x+p.w/2+front(p)*(w/2+p.w/2)-w/2,p.y+p.h/2-w/2,w,h,color);return b;}
        function createMatter(p,type,vx,vy){let m=new Matter(type,0,0,vx,vy);m.x=p.x+p.w/2+front(p)*(m.w/2+15)-m.w/2;m.y=(p.y+p.h/2)-m.h/2;return m;}
        function createTrigger(p,w,h,time,f){let t=new Trigger(p.x+p.w/2+front(p)*(w/2+25)-w/2,p.y+p.h/2-h/2,w,h,time,f);return t;}
        //TEST FUNCTION
        function test_giveForce(e,ax,ay){let oldE = getEnergy(e);giveForce(e,ax,ay);let newE=getEnergy(e);addMF([0, newE-oldE]);}
        function test_giveLife(e,d){addMF([0,d]);giveLife(e,d);}
        function test_invisible(e,time){addMF([time*2,(time**2)/100]);}
        function test_freeze(e,time){addMF([time*2,(time**2)/100]);}
        function test_setGravity(e,time,ga){addMF([time*2,time*10]);}
        function test_move(e,vx,vy){addMF([0,(vx+vy)**2/1000]);}
        function test_camera(target,x,y,delay){addMF([500,1000]);}
        function test_time(e,startTime,endTime,f){
            /*
            컴파일 시간의 99%가 test_time 함수 때문임
            따라서 진행시간에 따라 magicFactor 계산 방법을 분리
            기존 - [3315, 72496] [10611,176634]
            새로운 방법 - 기존 값에서 +-200
            기존의 결과와 매우 근접한 결과가 나온 동시에 컴파일시간을 매우 줄임
            단점-함수가 무시되는 시간대가 있으므로 사용자가 이 시간대를 악용해 magicfactor를 줄일 수 있음.
            */
            if(endTime-startTime>100){
                let oldM0 = magicFactor[0];
                let oldM1 = magicFactor[1];
                for(let i=0,j=(endTime-startTime)/10;i<j;i++)f();
                let newM0 = magicFactor[0];
                let newM1 = magicFactor[1];
                addMF([Math.sqrt((newM0**2-oldM0**2)*9), (newM1-oldM1)*9]);
            }else{
                for(let i=0,j=(endTime-startTime);i<j;i++)f();
            }
            addMF([endTime*2,(endTime-startTime)]);
        }
        function test_createBlock(p,w,h,color){addMF([0,(w*h/100)**2]);let b=createBlock(p,w,h,color);return b;}
        function test_createMatter(p,type,vx,vy){let m=createMatter(p,type,vx,vy);addMF([50,getEnergy(m)]);return m;}
        function test_createTrigger(p,w,h,time,f){let t=createTrigger(p,w,h,time,f);addMF([time*2,w*h*time/1000+(getEnergy(t)+1)]);return t;}    
        //prohibited keyword
        let prohibitedWord=["new","function","let","var"];
        let prohibitedSymbol=["[",".","$"];
        //test
        let testKeyword=["giveForce","giveLife","invisible", "freeze", "setGravity","createTrigger","move","time","createBlock","createMatter"];
        //convert symbol to word
        let symbol={"@":"let ","#":"function"};
        //매개변수로 x,y를 가지거나 player의 isRight에 접근하는 메소드 - 사용자는 절대 좌표를 알 수 없게함.
        let playerInsertionList=["getX","getY","front","setCamera","createMatter","createBlock","createTrigger"];
        let playerInsertion=false;
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
                //prohibit
                if(prohibitedWord.includes(temp)){
                    printError("Fail: "+name, " : your code have prohibited keyword(new, function, let, var)");
                    return null;
                }
                if(prohibitedSymbol.includes(magicCode[i])){
                    printError("Fail: "+name, " : your code have prohibited symbol('[', '.', '$')");
                    return null;
                }
                //convert code to test code
                if(testKeyword.includes(temp))testCode+="test_"+temp;
                else testCode+=temp;
                jsCode+=temp;
                if(playerInsertionList.includes(temp)){
                    playerInsertion=true;
                }
                if(magicCode[i] in symbol){
                    testCode+=symbol[magicCode[i]];
                    jsCode+=symbol[magicCode[i]];
                }else if(magicCode[i]=="("&&playerInsertion){
                    testCode+="(player,";
                    jsCode+="(player,";
                    playerInsertion=false;
                }else{
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
        console.log("js code: ",jsCode);
        let magic=function(){};
        try {
            //clearInterval(systemclock);
            magic = eval("(function(player){"+jsCode+"})");
            let testMagic=eval("(function(player){"+testCode+"})");
            let temp = Game.p;
            Game.p = new Player(0,10000);
            Game.p.dieCode=function(){};
            testMagic(Game.p);
            Game.p=temp;
            //systemclock = setInterval(Game.updateWorld, 10);
        }catch(e){
            printError("Fail: "+name," : syntex error")
            return null;
        }
        console.log(magicFactor);
        return [name,magic, magicFactor[0],magicFactor[1],1];
    }
}