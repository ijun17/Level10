let Magic = {
    skillNum:[0,1,2,3],//qwer
    basicMagicCount:0,
    customMagicCount:0,
    customMagic:[],
    magicEffectSound : new Audio(),
    //magicFrame=[magic name, magic code, needed Level] : basicMagic, customMagic
    //magicList = [name, magic function, coolTime, needed MagicPoint, needed Level] : magicList
    magicList:[],
    basicMagic:[
    ["fire ball",`//전방에 파이어볼을 발사
@e=create(FIRE,front()*10,1);
giveLife(e,10);
move(e,front()*30, 0);
    `,1],

    ["wall", `//길쭉한 블럭을 생성
@block = create(BLOCK,0,0,30,100);
move(block,0,100);
    `,1],

    ["dash",`//플레이어가 빠른 속도로 앞으로 이동
giveForce(player,front()*20,0);
    `,1],

    ["heal",`//플레이어 hp를 2000회복
giveLife(player,2000);
    `,1],

    ["invisible",`//플레이어의 투명화
invisible(player,300);    
    `,2],

    ["teleport",`//텔레포트
move(player, front()*300, 0);
    `,2],

    ["fire tornado",`//불꽃 토네이도 생성
@x=getX(player)+front()*200;
@i=0;
addAction(player, 1,12,#(){
    @fire = create(FIRE,0,0);
    move(fire,front()*(200-13*i-15), i*35);
    //setGravity(fire,500,0);
    giveLife(fire,500)
    addAction(fire,1,500,#(){
        giveForce(fire,(x-getX(fire))/(11+i)*10,-getVY(fire));
    });
    i++;
});
    `,3],
    ["sword energy",`//검기 발사
@e=create(SWORD,front()*20,0);
giveLife(e,10);
    `,3],
    ["elec shield", `//전기 실드를 생성
@j=0;
addAction(player,1,5,#(){
@a=create(ELECTRICITY,0,0);
move(a,front()*(20-j*20),60);
giveLife(a,500);
@b=create(ELECTRICITY,0,0);
move(b,front()*(20),60-j*20);
giveLife(b,500);
@c=create(ELECTRICITY,0,0);
move(c,front()*(-80),60-j*20);
giveLife(c,500);
j++;
})
    `,4],
    ["끌어당기기",`//닿은 물체를 끌어 당김
@t = create(TRIGGER,front()*10,0,20,100);
giveLife(t,100);
setTrigger(t,#(e){
    giveForce(e, -front()*10, 4);
});
    `,5],
    ["얼음지뢰",`//얼음 지뢰 생성
    @e = create(ICE,0,0);
    giveLife(e,1000);
    invisible(e,1000);
    @e2 = create(ICE,0,0);
    move(e2,front()*31, 0);
    giveLife(e2,1000);
    invisible(e2,1000);
    `,5]],
    //end basicMasic

    doSkill: function (p, num) {
        let magicNum = Magic.skillNum[num];
        (Magic.magicList[magicNum][1])(p);
    },
    clearCoolTime:function(){
        this.coolTime=[0,0,0,0];
    },
    saveMagic:function(){
        localStorage.CUSTOM_MAGIC=JSON.stringify(Magic.customMagic);
    },
    saveSkillNum:function(){
        localStorage.skillNum=JSON.stringify(Magic.skillNum);
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
        if (localStorage.CUSTOM_MAGIC == null) {
            Magic.customMagicCount = 0;
            Magic.customMagic = [];
        } else {
            Magic.customMagic = JSON.parse(localStorage.CUSTOM_MAGIC);
            Magic.customMagicCount = Magic.customMagic.length;
            for (let i = 0, j = Magic.customMagicCount; i < j; i++) {
                let magic = Magic.convertMagictoJS(Magic.customMagic[i][0], Magic.customMagic[i][1]);
                if (magic == null) Magic.magicList.push([Magic.customMagic[i][0], function () { }, 100, 100, 1]);
                else Magic.magicList.push(magic);
            }
        }
        //selected skill num
        if(localStorage.skillNum!=null){
            this.skillNum = JSON.parse(localStorage.skillNum);
            for(let i=0; i<this.skillNum.length; i++){
                if(this.magicList[this.skillNum[i]]==null)this.skillNum[i]=-1;
            }
        } else {
            this.skillNum = [0,1,2,3];
        }
        this.saveSkillNum();
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
            e.collisionHandler(test);
            return Math.abs(test.life);
        }
        function addMF(mf) {
            magicFactor[0] = Math.floor(Math.sqrt(magicFactor[0]**2 + mf[0]**2));
            magicFactor[1] += Math.floor(Math.abs(mf[1]));
        }
        let player;
        function setPlayer(p){player=p;}
        function getPlayer(){return player;}
        //UNIT MAGIC FUNCTION
        const FIRE=0, ELECTRICITY=1,ICE=2,ARROW=3,ENERGY=4,SWORD=5,BLOCK=6,TRIGGER=7;
        function create(typenum,vx,vy,w,h){
            let e;
            let p=getPlayer();
            if(typenum<=SWORD)e=new Matter(typenum,0,0,vx,vy);
            else if(typenum==BLOCK)e=new Block(0,0,w,h);
            else if(typenum==TRIGGER)e=new Trigger(0,0,w,h,100,function(e){});
            e.vx=vx;e.vy=vy;e.x=p.getX()+front()*(e.w/2+p.w/2)-e.w/2;e.y=p.getY()-e.h/2;
            return e;
        }
        function setTrigger(t,f){if(t instanceof Trigger)t.code=f;}
        function giveForce(e,ax,ay){e.vx+=ax;e.vy+=ay;}
        function giveLife(e,d){e.life+=d;}
        function invisible(e,time){e.canDraw=false;e.addAction(time,time,function(){e.canDraw=true;});}
        function move(e,vx,vy){if(e instanceof Monster)return;e.x+=vx;e.y-=vy;}
        function addAction(e,startTime,endTime,f){e.addAction(startTime,endTime,f);}
        function getX(e){return e.getX()-getPlayer().getX();}
        function getY(e){return getPlayer().getY()-e.getY();}
        function getVX(e){return e.vx;}
        function getVY(e){return e.vy;}
        function front(){return (getPlayer().isRight ? 1 : -1);}
        //TEST FUNCTION
        function test_giveForce(e,ax,ay){let oldE = getEnergy(e);giveForce(e,ax,ay);let newE=getEnergy(e);addMF([0, newE-oldE]);}
        function test_giveLife(e,d){addMF([0,d]);giveLife(e,d);}
        function test_invisible(e,time){addMF([time*2,(e instanceof Player?(time**2)/100:time)]);}
        function test_move(e,vx,vy){addMF([0,(vx+vy)**2/1000]);}
        function test_addAction(e,startTime,endTime,f){
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
        function test_create(typenum,vx,vy,w,h){let e=create(typenum,vx,vy,w,h);addMF([50,getEnergy(e)]);return e;}
        function test_setTrigger(t,f){setTrigger(t,f);addMF([100,t.w*t.h+getEnergy(t)+1]);}  
        //prohibited keyword
        let prohibitedWord=["new","function","let","var"];
        let prohibitedSymbol=["[",".","$"];
        //test
        let testKeyword=["giveForce","giveLife","invisible", "create","move","addAction","setTrigger"];
        //convert symbol to word
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
                if(magicCode[i] in symbol){
                    testCode+=symbol[magicCode[i]];
                    jsCode+=symbol[magicCode[i]];
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
        //console.log("js code: ",testCode);
        //console.log("js code: ",jsCode);
        let magic=function(){};
        try {
            //clearInterval(systemclock);
            magic = eval("(function(player){setPlayer(player);"+jsCode+"})");
            let testMagic=eval("(function(player){setPlayer(player);"+testCode+"})");
            let temp = Game.p;
            Game.p = new Player(0,10000);
            Game.p.dieCode=function(){};
            testMagic(Game.p);
            Game.p=temp;
        }catch(e){
            printError("Fail: "+name," : syntex error")
            return null;
        }
        return [name,magic, magicFactor[0],magicFactor[1],1];
    }
}