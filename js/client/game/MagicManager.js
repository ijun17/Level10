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
        if(localStorage.CUSTOM_MAGIC2 == null)MagicManager.createEmptyCustomMagic();
        else MagicManager.primitiveCustomMagic=JSON.parse(localStorage.CUSTOM_MAGIC2);
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
    isBasicMagic:function(index){
        return index<MagicManager.primitiveBasicMagic.length;
    },
    createEmptyCustomMagic:function(){
        let emptyMagics=[];
        for(let i=0; i<10; i++)emptyMagics.push({name:"Empty Magic "+(i+1), code:"", level:i});
        MagicManager.primitiveCustomMagic=emptyMagics;
        MagicManager.saveMagic();
    },
    createMagicSkill: function (primitiveMagic) {
        const name=primitiveMagic.name;
        const prim_code=primitiveMagic.code;
        const level=primitiveMagic.level;

        let errorMessageList=[];
        function addErrorMessage(error){errorMessageList.push(error);}
        
        let keywordList=["player","if","for","while","switch","else","front","create","setTrigger","giveForce","giveLife","invisible","move","addSchedule","getX","getY","getVX","getVY","FIRE","ELECTRICITY","ICE","ARROW","ENERGY","WIND","BLOCK","TRIGGER"];
        let testFunctionList=["giveForce","giveLife","invisible", "create","move","addSchedule","setTrigger"];
        let prohibitedWord=["new","function","return","let","var", "addMagicCost", "setPlayer"]
        let prim_testCode,prim_jsCode;
        //주석제거
        prim_jsCode=prim_code.replace(new RegExp("//.*\n*","g"),"");
        prim_jsCode=prim_jsCode.replace(new RegExp("/\\*(.*\n)*.*\\*/"),"");
        //변수 생성
        prim_jsCode.replace(/@([A-Za-z_](\w|_)*)/g, (a,b)=>{if(keywordList.indexOf(b)==-1)keywordList.push(b);})
        //키워드 탐색
        prim_jsCode.replace(/([A-Za-z_](\w|_)*)/g, (a,b)=>{if(keywordList.indexOf(b)==-1)addErrorMessage("'"+b+"' is undefined")})
        //금지 단어 탐색
        prim_jsCode.replace(/\.|\[|\]/g, function(a){addErrorMessage("'"+a+"' is prohibited")});
        prim_jsCode.replace(/([A-Za-z_](\w|_)*)/g, (a)=>{if(prohibitedWord.indexOf(a)>=0)addErrorMessage("'"+a+"' is prohibited")})
        //기호 치환(@->let $->function)
        prim_jsCode=prim_jsCode.replace(/@/g, "let ");
        prim_jsCode=prim_jsCode.replace(/\#/g, "function()");
        //testcode 치환
        prim_testCode=prim_jsCode.replace(/([A-Za-z_](\w|_)*)/g, (a)=>{if(testFunctionList.indexOf(a)>=0)return "test_"+a;else return a;})

        let jsCode=prim_jsCode;
        let testCode=prim_testCode
        let magic;
        let magicInfo;
        try {
            magic = eval("(function(player){"+MAGIC_DATA.unit_magic+jsCode+"})");
            let testMagic=eval("(function(player){"+MAGIC_DATA.unit_magic+MAGIC_DATA.test_unit_magic+testCode+";return magicCost})");
            magicInfo=testMagic(new Player([0,0],1));
            if(isNaN(magicInfo.mp)||isNaN(magicInfo.cooltime))addErrorMessage("error : MP or Cooltime is not Number")
        }catch(e){
            addErrorMessage(e.message);
        }
        let magicSkill;
        if(errorMessageList.length>0){
            magic=()=>{}
            magicInfo={cooltime:0, mp:0};
            console.log(errorMessageList)
        }
        magicSkill=new MagicSkill(name,magic,magicInfo.cooltime,magicInfo.mp,level,false);
        magicSkill.setErrorMessageList(errorMessageList);
        magicSkill.setPrimitiveCode(prim_code)
        return magicSkill;
    }
}


const MAGIC_DATA={
    unit_magic:`
const FIRE=0,
    ELECTRICITY=1,
    ICE=2,
    ARROW=3,
    ENERGY=4,
    WIND=5,
    BLOCK=6,
    TRIGGER=7

const create=function(typenum=BLOCK,vx=0,vy=0,w=30,h=30){
    let e;
    let p=player;
    switch(typenum){
        case BLOCK : e=new Block([0,0],[w,h]); break;
        case FIRE : e=new MatterFire([0,0],[vx,vy]); break;
        case ICE : e=new MatterIce([0,0],[vx,vy]); break;
        case ELECTRICITY : e=new MatterElectricity([0,0],[vx,vy]); break;
        case ARROW : e=new MatterArrow([0,0],[vx,vy]); break;
        case ENERGY : e=new MatterEnergy([0,0],[vx,vy]); break;
        case WIND : e=new MatterWind([0,0],[vx,vy]); break;
        default : e=new Block([0,0],[w,h]); break;
    }
    WORLD.add(e);
    e.body.setPos([p.body.midX+front(e.body.size[0]*0.5+p.body.size[0]*0.5)-e.body.size[0]*0.5, p.body.midY-e.body.size[1]*0.5]);
    return e;
}
const setTrigger=function(t,f){}
const giveForce=function(e,ax,ay){e.body.addVel([ax,ay])}
const giveLife=function(e,d){e.lifeModule.addLife(d)}
const invisible=function(e,time){e.canDraw=false;TIME.addTimer(time,function(){e.canDraw=true;});}
const move=function(e,vx,vy){if(e instanceof Actor&&e!==player)return;e.body.addPos([vx,vy])}
const addSchedule=function(startSec,endSec,intervalSec,f){TIME.addSchedule(startSec,endSec,intervalSec,f,function(){return player.getState()==0});}
const getX=function(e){return e.body.midX-player.body.midX;}
const getY=function(e){return e.body.midY-player.body.midY;}
const getVX=function(e){return e.body.vel[0];}
const getVY=function(e){return e.body.vel[1];}
const front=function(d=1){return (player.moveModule.moveDirection[0] ? d : -d);}
`,
    //
    test_unit_magic:`
let magicCost = {cooltime: 50, mp: 50}; //[cooltime, magic point]
function getEnergy(e){
    let testUnit = new Block([0,0],[0,0]);
    testUnit.lifeModule.life=0;
    e.eventManager.oncollision({ do: true, other: testUnit, collisionNormal: [1,0] });
    return Math.abs(testUnit.lifeModule.life);
}
function addMagicCost(cooltime,mp) {
    magicCost.cooltime = Math.floor(Math.sqrt(Math.sqrt(magicCost.cooltime**4 + cooltime**4)));
    magicCost.mp += Math.floor(Math.abs(mp));
}
        
const test_create=function(typenum=BLOCK,vx=0,vy=0,w=30,h=30){
    let e=create(typenum,vx,(vy==0?1:vy),w,h);
    addMagicCost(50,getEnergy(e)*(w*h)/900+e.body.speed);return e;
}
const test_setTrigger=function(t,f){setTrigger(t,f);addMagicCost(100,t.w*t.h+getEnergy(t)+1);}
//const test_giveForce=function(e,ax,ay){let oldE = getEnergy(e);giveForce(e,ax,ay);let newE=getEnergy(e);addMagicCost(0, newE-oldE);}
const test_giveForce=function(e,ax,ay){
    ax=ax>100 ? 100 : ax;
    ay=ay>100 ? 100 : ay;
    giveForce(e,ax,ay);
    addMagicCost(0, Math.sqrt(ax**2+ay**2)/200);
}
const test_giveLife=function(e,d){addMagicCost(0,d);giveLife(e,d);}
const test_invisible=function(e,time){addMagicCost(time*200,time*200);}
const test_move=function(e,vx,vy){addMagicCost(0,(vx+vy)/10);}
const test_addSchedule=function(startSec,endSec,intervalSec,f){
    if(intervalSec<0.01)intervalSec=0.01;
    let excuteCount=(endSec-startSec)/intervalSec;
    if(excuteCount>100){
        let oldM0 = magicCost.cooltime;
        let oldM1 = magicCost.mp;
        for(let i=0,j=Math.floor(excuteCount/10);i<j;i++)f();
        let newM0 = magicCost.cooltime;
        let newM1 = magicCost.mp;
        addMagicCost(Math.sqrt((newM0**2-oldM0**2)*10), (newM1-oldM1)*10);
    }else{
        for(let i=0,j=excuteCount;i<j;i++)f();
    }
    addMagicCost(endSec*200,excuteCount);
}
`,
    prohibitedWord:["new","function","let","var", "addMagicCost", "setPlayer"],
    prohibitedSymbol:[],
    predefinedKeyword:["player","if","for","while","switch","else"],
    vvmagics:["front","create","setTrigger","giveForce","giveLife","invisible","move","addSchedule","getX","getY","getVX","getVY",
        "FIRE","ELECTRICITY","ICE","ARROW","ENERGY","WIND","BLOCK","TRIGGER"],
    vvtests:["giveForce","giveLife","invisible", "create","move","addSchedule","setTrigger"],
    symbol:{"@":"let ","#":"function(parameter)","$":"parameter"},
//
    BASIC_MASIC:[
    {name:"파이어볼",code:`//전방에 파이어볼을 발사
@e1=create(FIRE,front(20),2);
giveLife(e1,10);
move(e1,front(30), 0);`,level:0},

    {name:"벽", code:`//길쭉한 블럭을 생성
@block = create(BLOCK,0,0,60,200);
move(block,0,100);`,level:0},

    {name:"대쉬",code:`//플레이어가 빠른 속도로 앞으로 이동
giveForce(player,front(30),1);`,level:0},

    {name:"힐",code:`//플레이어 hp를 2000회복
giveLife(player,2000);`,level:0},
    
    {name:"얼음비", code:`//많은 얼음을 소환
for(@i=0;i<10;i++){
    @ice = create(ICE, 0,-20)
    move(ice, front(i*40+100),300+i*40)
    giveLife(ice,100);
}`,level:1},

    {name:"텔레포트",code:`//텔레포트
move(player, front(600), 0);`,level:1},

    {name:"파이어토네이도",code:`//불꽃 토네이도 생성
@x=getX(player)+front(200);
@plusX=front(10);
addSchedule(0,70/100,1/100,#{x+=plusX;});
for(@i=0; i<12; i++){
    @fire = create(FIRE,0,0);
    move(fire,front(200-13*i-15), i*35);
    giveLife(fire,500)
    addSchedule(0,70/100,1/100,#{
        giveForce(fire,(x-getX(fire))/(11+i)*10,-getVY(fire));
    });
    addSchedule(71/100,71/100,1/100,#{
        giveForce(fire,-getVX(fire)+plusX*20,-10);
    })
}`,level:2},

    {name:"투명",code:`//플레이어의 투명화
invisible(player,3);`,level:2},

    {name:"활공",code:`//플레이어 아래에 바람 생성
@wind=create(WIND,0,40);
giveLife(wind,200);
move(wind,front(-100),-20);
giveForce(wind,0,-35);`,level:2},

    {name:"기관총",code:`//화살 발사
addSchedule(0,5,1/20,#{
    for(@i=0; i<2; i++){
        @a = create(ARROW, front(60), 3)
        move(a,front(20),i*35)
    }
})`, level:3},

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
}`,level:3},

    {name:"번개",code:`//번개는 전기들이 서로 일정 수 부딪히면 생성된다. 
for(@i=0; i<200; i++){
    @e=create(ELECTRICITY, 0,0);
    move(e, front(300),0);
}`,level:4},

    {name:"폭발 비",code:`//불끼리 부딪히면 폭발한다.
for(@i=0; i<10; i++){
    for(@j=0; j<3; j++){
        @fire=create(FIRE,0,-20);
        @x=front(i*70+150);
        @y=200+i*50+j*100;
        move(fire,x,y);
        giveLife(fire,30);
    }
}`,level:4},

    {name:"연막",code:`//수증기는 불과 얼음이 부딪히면 생성된다.
for(@i=0; i<10; i++){
    move(create(FIRE,front(10),1),front(100*i), 0);
    move(create(ICE,front(10),1),front(100*i), 0);
    move(create(FIRE,front(10),1),front(100*i), 100);
    move(create(ICE,front(10),1),front(100*i), 100);
}`,level:4},

    {name:"파이어토네이도V",code:`//불꽃 토네이도 생성
@x=getX(player)+front(200);
@plusX=front(10);
addSchedule(0,70/100,1/100,#{x+=plusX;});
for(@i=0; i<12; i++){
    @fire = create(FIRE,0,0);
    move(fire,front(200-13*i-15), i*35);
    giveLife(fire,500)
    addSchedule(0,70/100,1/100,#{
        giveForce(fire,(x-getX(fire))/(11+i)*10,-getVY(fire));
    });
    addSchedule(71/100,71/100,1/100,#{
        giveForce(fire,-getVX(fire)+plusX*20,-10);
    })
}`,level:10},

    {name:"유도미사일",code:`//유도미사일
// @t=create(TRIGGER, front(50),0,30,200)
// setTrigger(t,#{
//     @target=$
//     @e=create(ENERGY, 0,0)
//     giveLife(e,4000)
//     move(e, front(200),0);
//     addSchedule(e, 0,2000, #{giveForce(e,-getVX(e)+(getX(target)-getX(e)),-getVY(e)+(getY(target)-getY(e)))})
//     for(@i=0;i<30;i++){
//         move(create(ENERGY, 0,0), front(200), 0);
//     }
// })`,level:10},

{name:"유도얼음",code:`//유도얼음
// @t=create(TRIGGER, front(50),0,30,200)
// setTrigger(t,#{
//     @target=$
//     @e=create(ICE, 0,0)
//     giveLife(e,4000)
//     addSchedule(e, 0,2000, #{giveForce(e,-getVX(e)+(getX(target)-getX(e)),-getVY(e)+(getY(target)-getY(e)))})
// })`,level:10}
]

//
}