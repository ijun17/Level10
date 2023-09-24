class MagicSkill{
    name="";
    requiredMP=0;
    requiredLevel;
    cooltime=0;
    isBasic;
    error;
    errorMessageList=[];
    code;
    primitiveCode="";
    constructor(name="", code=function(){}, cooltime=0, requiredMP=0, requiredLevel=0, isBasic=true){
        this.name=name;
        this.code=code;
        this.requiredMP=requiredMP;
        this.cooltime=cooltime;
        this.requiredLevel=requiredLevel;
        this.isBasic=isBasic
    }
    cast(caster){
        this.code(caster);
        SCREEN.renderer.camera.vibrate(5);
    }
    getName(){return this.name}
    getRequiredMP(){return this.requiredMP}
    getCoolTime(){return this.cooltime}
    getRequiredLevel(){return this.requiredLevel}
    getPrimitiveCode(){return this.primitiveCode;}
    setErrorMessageList(e){this.errorMessageList=e;}
    setName(name){this.name=name}
    setRequiredLevel(level){this.requiredLevel=level}
    setPrimitiveCode(pCode){
        this.primitiveCode=pCode;
        
        let errorMessageList=[];
        function addErrorMessage(error){errorMessageList.push(error);}
        
        let keywordList=["player","if","for","while","switch","else","front","create","setTrigger","giveForce","giveLife","invisible","move","addSchedule","getX","getY","getVX","getVY","FIRE","ELECTRICITY","ICE","ARROW","ENERGY","WIND","BLOCK","TRIGGER"];
        let testFunctionList=["giveForce","giveLife","invisible", "create","move","addSchedule","setTrigger"];
        let prohibitedWord=["new","function","return","let","var", "addMagicCost", "setPlayer"]

        let jsCode=pCode;
        //주석제거
        jsCode=jsCode.replace(new RegExp("//.*\n*","g"),"");
        jsCode=jsCode.replace(new RegExp("/\\*(.*\n)*.*\\*/"),"");
        //변수 생성
        jsCode.replace(/@([A-Za-z_](\w|_)*)/g, (a,b)=>{if(keywordList.indexOf(b)==-1)keywordList.push(b);})
        //키워드 탐색
        jsCode.replace(/([A-Za-z_](\w|_)*)/g, (a,b)=>{if(keywordList.indexOf(b)==-1)addErrorMessage("'"+b+"' is undefined")})
        //금지 단어 탐색
        jsCode.replace(/\.|\[|\]/g, function(a){addErrorMessage("'"+a+"' is prohibited")});
        jsCode.replace(/([A-Za-z_](\w|_)*)/g, (a)=>{if(prohibitedWord.indexOf(a)>=0)addErrorMessage("'"+a+"' is prohibited")})
        //기호 치환(@->let $->function)
        jsCode=jsCode.replace(/@/g, "let ");
        jsCode=jsCode.replace(/\#/g, "function()");
        //testcode 치환
        let test_jsCode=jsCode.replace(/([A-Za-z_](\w|_)*)/g, (a)=>{if(testFunctionList.indexOf(a)>=0)return "test_"+a;else return a;})
        let magic;
        let magicInfo;
        try {
            magic = eval("(function(player){"+MAGIC_DATA.unit_magic+jsCode+"})");
            let testMagic=eval("(function(player){"+MAGIC_DATA.unit_magic+MAGIC_DATA.test_unit_magic+test_jsCode+";return magicCost})");
            magicInfo=testMagic(new Player([0,0],1));
            if(isNaN(magicInfo.mp)||isNaN(magicInfo.cooltime))addErrorMessage("error : MP or Cooltime is not Number")
        }catch(e){
            addErrorMessage(e.message);
        }
        this.setErrorMessageList(errorMessageList);
        if(errorMessageList.length>0){
            this.code=()=>{}
            this.requiredMP=0;
            this.cooltime=0;
            console.log(this.getName(),errorMessageList)
        }else{
            this.code=magic
            this.requiredMP=magicInfo.mp
            this.cooltime=magicInfo.cooltime
        }
        return this
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
    BLOCK=6

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
const front=function(d=1){return (player.moveModule.moveDirection[0] ? d : -d);};
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
};`,
    prohibitedWord:["new","function","let","var", "addMagicCost", "setPlayer"],
    prohibitedSymbol:[],
    predefinedKeyword:["player","if","for","while","switch","else"],
    vvmagics:["front","create","setTrigger","giveForce","giveLife","invisible","move","addSchedule","getX","getY","getVX","getVY",
        "FIRE","ELECTRICITY","ICE","ARROW","ENERGY","WIND","BLOCK","TRIGGER"],
    vvtests:["giveForce","giveLife","invisible", "create","move","addSchedule","setTrigger"],
    symbol:{"@":"let ","#":"function(parameter)","$":"parameter"},}