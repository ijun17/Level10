const MagicManager={
    skillNum:[0,1,2,3],
    pvp_skillNum:[[0,1,2,3],[0,1,2,3]],
    magicList:[],//magicList = [name, magic function, coolTime, needed MagicPoint, needed Level]
    primitiveCustomMagic:[],//[name,code]
    primitiveBasicMagic:[],
    saveMagic:function(){
        localStorage.CUSTOM_MAGIC2=JSON.stringify(MagicManager.primitiveCustomMagic);
    },
    saveSkillNum:function(){
        localStorage.skillNum=JSON.stringify(MagicManager.skillNum);
        localStorage.pvp_skillNum=JSON.stringify(MagicManager.pvp_skillNum);
    },
    loadMagic:function(){
        //load basic magic
        MagicManager.primitiveBasicMagic=MAGIC_DATA.BASIC_MASIC;
        for(let i=0,j=MagicManager.primitiveBasicMagic.length; i<j; i++){
            MagicManager.magicList.push(MagicManager.createMagicSkill(MagicManager.primitiveBasicMagic[i])); 
        }
        //load custom magic
        MagicManager.primitiveCustomMagic = (localStorage.CUSTOM_MAGIC2 == null ? [] : JSON.parse(localStorage.CUSTOM_MAGIC2));
        for (let i = 0, j = MagicManager.primitiveCustomMagic.length; i < j; i++) {
            MagicManager.magicList.push(MagicManager.createMagicSkill(MagicManager.primitiveCustomMagic[i]));
        }
        //selected skill num
        MagicManager.skillNum = localStorage.skillNum!=null ? JSON.parse(localStorage.skillNum) : [0,1,2,3];
        for(let i=0; i<MagicManager.skillNum.length; i++)if(MagicManager.magicList[MagicManager.skillNum[i]]==null)this.skillNum[i]=0;

        //selected pvp skill num
        MagicManager.pvp_skillNum = localStorage.pvp_skillNum!=null ? JSON.parse(localStorage.pvp_skillNum) : [[0,1,2,3],[0,1,2,3]];
        for(let i=0; i<MagicManager.skillNum.length; i++){
            if(MagicManager.magicList[MagicManager.pvp_skillNum[0][i]]==null)MagicManager.pvp_skillNum[0][i]=i;
            if(MagicManager.magicList[MagicManager.pvp_skillNum[1][i]]==null)MagicManager.pvp_skillNum[1][i]=i;
        }
        MagicManager.saveSkillNum();
    },
    addPrimitiveMagic:function(name="", code="", level=0){
        Magic.primitiveCustomMagic.push({name:name, code:code, level:level});
        Magic.magicList.push(new MagicSkill());
    },
    createMagicSkill: function (primitiveMagic) {
        const name=primitiveMagic.name;
        const prim_code=primitiveMagic.code;
        const level=primitiveMagic.level;

        let isSuccess=true;
        let resultText="";
        function stopProcess(result){
            isSuccess=false;
            resultText=result;
            console.log(resultText)
        }
        
        let variableList=["player","if","for","while","switch","else","front","create","setTrigger","giveForce","giveLife","invisible","move","addAction","getX","getY","getVX","getVY","FIRE","ELECTRICITY","ICE","ARROW","ENERGY","WIND","BLOCK","TRIGGER"];
        let testFunctionList=["giveForce","giveLife","invisible", "create","move","addAction","setTrigger"];
        let prohibitedWord=["new","function","let","var", "addMagicCost", "setPlayer"]
        let prim_testCode,prim_jsCode;
        //주석제거
        prim_jsCode=prim_code.replace(new RegExp("//.*\n","g"),"");
        prim_jsCode=prim_jsCode.replace(new RegExp("/\\*(.*\n)*.*\\*/"),"");
        //변수 생성
        prim_jsCode.replace(/@([A-Za-z_](\w|_)*)/g, function(a,b){if(variableList.indexOf(b)==-1)variableList.push(b);else stopProcess("'"+b+"' is already created")})
        if(!isSuccess)return new MagicSkill();
        //미생성 변수 탐색
        prim_jsCode.replace(/([A-Za-z_](\w|_)*)/g, function(a,b){if(variableList.indexOf(b)==-1)stopProcess("'"+b+"' is not created")})
        if(!isSuccess)return new MagicSkill();
        //금지 단어 탐색
        prim_jsCode.replace(/\.|\[|\]/g, function(a){stopProcess("'"+a+"' is prohibited")});
        prim_jsCode.replace(/([A-Za-z_](\w|_)*)/g, function(a){if(prohibitedWord.indexOf(a)>=0)stopProcess("'"+a+"' is prohibited")})
        if(!isSuccess)return new MagicSkill();
        //기호 치환(@->let $->function)
        prim_jsCode=prim_jsCode.replace(/@/g, "let ");
        prim_jsCode=prim_jsCode.replace(/\$/g, "function ");
        //testcode 치환
        prim_testCode=prim_jsCode.replace(/([A-Za-z_](\w|_)*)/g, function(a){if(testFunctionList.indexOf(a)>=0)return "test_"+a;else return a;})

        let jsCode=prim_jsCode;
        let testCode=prim_testCode
        let magic=function(){};
        let magicCost;
        return new MagicSkill(name,function(){},0,0,0);
        try {
            magic = eval("(function(player){"+MAGIC_DATA.unit_magic+jsCode+"})");
            let testMagic=eval("(function(player){"+MAGIC_DATA.unit_magic+MAGIC_DATA.test_unit_magic+testCode+"return magicCost})");
            magicInfo=testMagic(new Player(0,10000));
        }catch(e){
            console.error(e+"\n\n"+testCode);
            //console.log(testCode);
            return new MagicSkill(name,function(){},0,0,0);
        }
        //printResult(true, "cooltime: "+(magicInfo[0]/100)+"sec\nMP: "+magicInfo[1],true)
        return new MagicSkill(name,magic, magicCost.coolTime,magicCost.mp,level);
    }
}


const MAGIC_DATA={
    BASIC_MASIC:[
    {name:"파이어볼",code:`//전방에 파이어볼을 발사
@e=create(FIRE,front(10),1);
giveLife(e,10);
move(e,front(30), 0);`,level:1},

    {name:"벽", code:`//길쭉한 블럭을 생성
@block = create(BLOCK,0,0,30,100);
move(block,0,100);`,level:1},

    {name:"대쉬",code:`//플레이어가 빠른 속도로 앞으로 이동
giveForce(player,front(20),0);`,level:1},

    {name:"힐",code:`//플레이어 hp를 2000회복
giveLife(player,2000);`,level:1},
    
    {name:"얼음비", code:`//많은 얼음을 소환
for(@i=0;i<10;i++){
    @ice = create(ICE, 0,-20)
    move(ice, front(i*40+100),300+i*40)
    giveLife(ice,100);
}`,level:2},

    {name:"얼음지뢰",code:`//얼음 지뢰 생성
@e = create(ICE,0,0);
giveLife(e,1000);
invisible(e,1000);
@e2 = create(ICE,0,0);
move(e2,front(31), 0);
giveLife(e2,1000);
invisible(e2,1000);`,level:2},

    {name:"텔레포트",code:`//텔레포트
move(player, front(400), 0);`,level:2},

    {name:"파이어토네이도",code:`//불꽃 토네이도 생성
@x=getX(player)+front(200);
@i=0;
addAction(player, 1,12,#{
    @fire = create(FIRE,0,0);
    move(fire,front(200-13*i-15), i*35);
    giveLife(fire,500)
    addAction(fire,1,200,#{
        giveForce(fire,(x-getX(fire))/(11+i)*10,-getVY(fire));
    });
    i++;
});`,level:3},

    {name:"투명",code:`//플레이어의 투명화
invisible(player,300);`,level:3},

    {name:"활공",code:`//플레이어 아래에 바람 생성
@wind=create(WIND,0,40);
giveLife(wind,200);
move(wind,front(-100),-20);
giveForce(wind,0,-35);`,level:3},

    {name:"기관총",code:`//화살 발사
@count=0;
addAction(player,1,500,#{
    if((count++)%10==0){
        @a = create(ARROW, front(30), 1, 30,10)
        giveLife(a, 10)
    }
})`, level:4},

    {name:"전격실드", code:`//전기 실드를 생성
for(@j=0;j<5;j++){
    @a=create(ELECTRICITY,0,0);
    move(a,front(20-j*20),60);
    giveLife(a,500);
    @b=create(ELECTRICITY,0,0);
    move(b,front(20),60-j*20);
    giveLife(b,500);
    @c=create(ELECTRICITY,0,0);
    move(c,front(-80),60-j*20);
    giveLife(c,500);
}`,level:4},

    {name:"끌어당기기",code:`//닿은 물체를 끌어 당김
@t = create(TRIGGER,front(10),0,20,100);
giveLife(t,100);
setTrigger(t,#{
    giveForce($, front(-10), 4);
});`,level:4},

    {name:"번개",code:`//번개는 전기들이 서로 일정 수 부딪히면 생성된다. 
addAction(player,1,20,#{
    @a=create(ELECTRICITY, 0,0);
    move(a, front(300),0);
    giveLife(a,400)
        
    @b=create(ELECTRICITY, 0,0);
    move(b, front(300),0);
    giveLife(b,400);
        
    @c=create(ELECTRICITY, 0,0);
    move(c, front(300),0);
    giveLife(c, 400)
        
    @d=create(ELECTRICITY, 0,0);
    move(d, front(300),0);
    giveLife(d,400)
        
    @e=create(ELECTRICITY, 0,0);
    move(e, front(300),0);
    giveLife(e,400)
})`,level:5},

    {name:"폭발 비",code:`//불끼리 부딪히면 폭발한다.
@count=0;
addAction(player, 1,10,#{
    @fire= create(FIRE, 0,-20)
    move(fire, front(count*70+150),300)
    giveLife(fire,50);
    @fire2= create(FIRE, 0,-20)
    move(fire2, front(count*70+150),400)
    giveLife(fire2,50);
    count++;
})`,level:5},

    {name:"연막",code:`//수증기는 불과 얼음이 부딪히면 생성된다.
@i=0;
addAction(player, 1, 10, #{
    move(create(FIRE,front(10),1),front(100*i), 0);
    move(create(ICE,front(10),1),front(100*i), 0);
    move(create(FIRE,front(10),1),front(100*i), 100);
    move(create(ICE,front(10),1),front(100*i), 100);
    ++i;
})`,level:5},

    {name:"파이어토네이도V",code:`//불꽃 토네이도 생성
@x=getX(player)+front(200);
@plusX=front(1);
@i=0;
addAction(player, 1,12,#{
    @fire = create(FIRE,0,0);
    move(fire,front(200-13*i-15), i*35);
    giveLife(fire,500)
    addAction(fire,1,70,#{
        giveForce(fire,(x-getX(fire))/(11+i)*10,-getVY(fire));
        x+=plusX;
    });
    addAction(fire,81,81,#{giveForce(fire,-getVX(fire)+plusX*20,-getVY(fire));})
    i++;
});`,level:10},

    {name:"유도미사일",code:`//유도미사일
@t=create(TRIGGER, front(50),0,30,200)
setTrigger(t,#{
    @target=$
    @e=create(ENERGY, 0,0)
    giveLife(e,4000)
    move(e, front(200),0);
    addAction(e, 0,2000, #{giveForce(e,-getVX(e)+(getX(target)-getX(e)),-getVY(e)+(getY(target)-getY(e)))})
    for(@i=0;i<30;i++){
        move(create(ENERGY, 0,0), front(200), 0);
    }
})`,level:10},

{name:"유도얼음",code:`//유도얼음
@t=create(TRIGGER, front(50),0,30,200)
setTrigger(t,#{
    @target=$
    @e=create(ICE, 0,0)
    giveLife(e,4000)
    addAction(e, 0,2000, #{giveForce(e,-getVX(e)+(getX(target)-getX(e)),-getVY(e)+(getY(target)-getY(e)))})
})`,level:10}
],

//
unit_magic:`
const FIRE=TYPE.fire
    ELECTRICITY=TYPE.electricity
    ICE=TYPE.ice
    ARROW=TYPE.arrow
    ENERGY=TYPE.energy
    WIND=TYPE.wind
    BLOCK=6
    TRIGGER=7
const create=function(typenum=this.BLOCK,vx=0,vy=0,w=30,h=30){
    let e;
    let p=player;
    if(typenum<=this.WIND)e=new Matter(typenum,0,0,vx,vy);
    else if(typenum===this.BLOCK)e=new Block(0,0,w,h);
    else if(typenum===this.TRIGGER)e=new Trigger(0,0,w,h,100,function(e){});
    e.vx=vx;e.vy=vy;e.x=p.midX+this.front(e.w/2+p.w/2)-e.w/2;e.y=p.midY-e.h/2;
    return e;
}
const setTrigger=function(t,f){if(t instanceof Trigger)t.code=f;},
const giveForce=function(e,ax,ay){e.vx+=ax;e.vy+=ay;},
const giveLife=function(e,d){e.life+=d;},
const invisible=function(e,time){e.canDraw=false;e.addAction(time,time,function(){e.canDraw=true;});},
const move=function(e,vx,vy){if(e instanceof Actor&&e!==player)return;e.x+=vx;e.y-=vy;},
const addAction=function(e,startTime,endTime,f){e.addAction(startTime,endTime,f);},
const getX=function(e){return e.midX-player.midX;},
const getY=function(e){return player.midY-e.midY;},
const getVX=function(e){return e.vx;},
const getVY=function(e){return e.vy;},
const front=function(d=1){return (player.isRight ? d : -d);}
`,
//
test_unit_magic:`
let magicCost = {cooltime: 100, mp: 100}; //[cooltime, magic point]
function getEnergy(e){
    let test = new Entity(0,10000);
    e.limitVector(80);
    test.life=0;
    e.oncollision({other:test,vector:[Math.sign(e.vx),Math.sign(e.vy)]});
    return Math.abs(test.life);
}
function addMagicCost(cooltime,mp) {
    magicCost.cooltime = Math.floor(Math.sqrt(magicCost.cooltime**2 + cooltime**2));
    magicCost.mp += Math.floor(Math.abs(mp));
}
    
const test_create=function(typenum=BLOCK,vx=0,vy=0,w=30,h=30){
    let e=create(typenum,vx,(vy==0?1:vy),w,h);
    addMagicCost(50,getEnergy(e)*(w*h)/900+e.getVectorLength());return e;
}
const test_setTrigger=function(t,f){setTrigger(t,f);addMagicCost(100,t.w*t.h+getEnergy(t)+1);}
const test_giveForce=function(e,ax,ay){let oldE = getEnergy(e);giveForce(e,ax,ay);let newE=getEnergy(e);addMagicCost(0, newE-oldE);}
const test_giveLife=function(e,d){addMagicCost(0,d);giveLife(e,d);}
const test_invisible=function(e,time){addMagicCost(time*2,(e instanceof Player?(time**2)/100:time));}
const test_move=function(e,vx,vy){addMagicCost(0,(vx+vy)/10);}
const test_addAction=function(e,startTime,endTime,f){
    if(endTime-startTime>100){
        let oldM0 = magicCost[0];
        let oldM1 = magicCost[1];
        for(let i=0,j=(endTime-startTime)/10;i<j;i++)f();
        let newM0 = magicCost[0];
        let newM1 = magicCost[1];
        addMagicCost(Math.sqrt((newM0**2-oldM0**2)*9), (newM1-oldM1)*9);
    }else{
        for(let i=0,j=(endTime-startTime);i<j;i++)f();
    }
    addMagicCost(endTime*2,(endTime-startTime));
}
`,
prohibitedWord:["new","function","let","var", "addMagicCost", "setPlayer"],
prohibitedSymbol:[],
predefinedKeyword:["player","if","for","while","switch","else"],
vvmagics:["front","create","setTrigger","giveForce","giveLife","invisible","move","addAction","getX","getY","getVX","getVY",
    "FIRE","ELECTRICITY","ICE","ARROW","ENERGY","WIND","BLOCK","TRIGGER"],
vvtests:["giveForce","giveLife","invisible", "create","move","addAction","setTrigger"],
symbol:{"@":"let ","#":"function(parameter)","$":"parameter"}
}