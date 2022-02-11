

const MAGIC_DATA={
    BASIC_MASIC:[
    ["파이어볼",`//전방에 파이어볼을 발사
@e=create(FIRE,front(10),1);
giveLife(e,10);
move(e,front(30), 0);`,1],

    ["벽", `//길쭉한 블럭을 생성
@block = create(BLOCK,0,0,30,100);
move(block,0,100);`,1],

    ["대쉬",`//플레이어가 빠른 속도로 앞으로 이동
giveForce(player,front(20),0);`,1],

    ["힐",`//플레이어 hp를 2000회복
giveLife(player,2000);`,1],
    
    ["얼음비", `//많은 얼음을 소환
for(@i=0;i<10;i++){
    @ice = create(ICE, 0,-20)
    move(ice, front(i*40+100),300+i*40)
    giveLife(ice,100);
}`,2],

    ["얼음지뢰",`//얼음 지뢰 생성
@e = create(ICE,0,0);
giveLife(e,1000);
invisible(e,1000);
@e2 = create(ICE,0,0);
move(e2,front(31), 0);
giveLife(e2,1000);
invisible(e2,1000);`,2],

    ["텔레포트",`//텔레포트
move(player, front(400), 0);`,2],

    ["파이어토네이도",`//불꽃 토네이도 생성
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
});`,3],

    ["투명",`//플레이어의 투명화
invisible(player,300);`,3],

    ["활공",`//플레이어 아래에 바람 생성
@wind=create(WIND,0,40);
giveLife(wind,200);
move(wind,front(-100),-20);
giveForce(wind,0,-35);`,3],

    ["기관총",`//화살 발사
@count=0;
addAction(player,1,500,#{
    if((count++)%10==0){
        @a = create(ARROW, front(30), 1, 30,10)
        giveLife(a, 10)
    }
})`, 4],

    ["전격실드", `//전기 실드를 생성
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
}`,4],

    ["끌어당기기",`//닿은 물체를 끌어 당김
@t = create(TRIGGER,front(10),0,20,100);
giveLife(t,100);
setTrigger(t,#{
    giveForce($, front(-10), 4);
});`,4],

    ["번개",`//번개는 전기들이 서로 일정 수 부딪히면 생성된다.
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
})`,5],

    ["폭발 비",`//불끼리 부딪히면 폭발한다.
@count=0;
addAction(player, 1,10,#{
    @fire= create(FIRE, 0,-20)
    move(fire, front(count*70+150),300)
    giveLife(fire,50);
    @fire2= create(FIRE, 0,-20)
    move(fire2, front(count*70+150),400)
    giveLife(fire2,50);
    count++;
})`,5],

    ["연막",`//수증기는 불과 얼음이 부딪히면 생성된다.
@i=0;
addAction(player, 1, 10, #{
    move(create(FIRE,front(10),1),front(100*i), 0);
    move(create(ICE,front(10),1),front(100*i), 0);
    move(create(FIRE,front(10),1),front(100*i), 100);
    move(create(ICE,front(10),1),front(100*i), 100);
    ++i;
})`,5],

    ["파이어토네이도V",`//불꽃 토네이도 생성
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
});`,10],

    ["유도미사일",`//유도미사일
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
})`,10],

["유도얼음",`//유도얼음
@t=create(TRIGGER, front(50),0,30,200)
setTrigger(t,#{
    @target=$
    @e=create(ICE, 0,0)
    giveLife(e,4000)
    addAction(e, 0,2000, #{giveForce(e,-getVX(e)+(getX(target)-getX(e)),-getVY(e)+(getY(target)-getY(e)))})
})`,10]
],

//
unit_magic:`
let vvobject={};
const vvmagic={
    FIRE:TYPE.fire, ELECTRICITY:TYPE.electricity,ICE:TYPE.ice,ARROW:TYPE.arrow,ENERGY:TYPE.energy,WIND:TYPE.wind,BLOCK:6,TRIGGER:7,
    create:function(typenum=this.BLOCK,vx=0,vy=0,w=30,h=30){
        let e;
        let p=player;
        if(typenum<=this.WIND)e=new Matter(typenum,0,0,vx,vy);
        else if(typenum===this.BLOCK)e=new Block(0,0,w,h);
        else if(typenum===this.TRIGGER)e=new Trigger(0,0,w,h,100,function(e){});
        e.vx=vx;e.vy=vy;e.x=p.getX()+this.front(e.w/2+p.w/2)-e.w/2;e.y=p.getY()-e.h/2;
        return e;
    },
    setTrigger:function(t,f){if(t instanceof Trigger)t.code=f;},
    giveForce:function(e,ax,ay){e.vx+=ax;e.vy+=ay;},
    giveLife:function(e,d){e.life+=d;},
    invisible:function(e,time){e.canDraw=false;e.addAction(time,time,function(){e.canDraw=true;});},
    move:function(e,vx,vy){if(e instanceof Actor&&e!==player)return;e.x+=vx;e.y-=vy;},
    addAction:function(e,startTime,endTime,f){e.addAction(startTime,endTime,f);},
    getX:function(e){return e.getX()-player.getX();},
    getY:function(e){return player.getY()-e.getY();},
    getVX:function(e){return e.vx;},
    getVY:function(e){return e.vy;},
    front:function(d=1){return (player.isRight ? d : -d);}
}
`,
//
test_unit_magic:`
let magicFactor = [100,100]; //[cooltime, magic point]
function getEnergy(e){
    let test = new Entity(0,10000);
    e.limitVector(80);
    test.life=0;
    e.oncollision({other:test,vector:[Math.sign(e.vx),Math.sign(e.vy)]});
    return Math.abs(test.life);
}
function addMF(mf) {magicFactor[0] = Math.floor(Math.sqrt(magicFactor[0]**2 + mf[0]**2));magicFactor[1] += Math.floor(Math.abs(mf[1]));}
const vvtest={
    test_create:function(typenum=vvmagic.BLOCK,vx=0,vy=0,w=30,h=30){
        let e=vvmagic.create(typenum,vx,(vy==0?1:vy),w,h);
        addMF([50,getEnergy(e)*(w*h)/900+e.getVectorLength()]);return e;
    },
    test_setTrigger:function(t,f){vvmagic.setTrigger(t,f);addMF([100,t.w*t.h+getEnergy(t)+1]);},
    test_giveForce:function(e,ax,ay){let oldE = getEnergy(e);vvmagic.giveForce(e,ax,ay);let newE=getEnergy(e);addMF([0, newE-oldE]);},
    test_giveLife:function(e,d){addMF([0,d]);vvmagic.giveLife(e,d);},
    test_invisible:function(e,time){addMF([time*2,(e instanceof Player?(time**2)/100:time)]);},
    test_move:function(e,vx,vy){addMF([0,(vx+vy)/10]);},
    test_addAction:function(e,startTime,endTime,f){
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
}
`,
prohibitedWord:["new","function","let","var", "addMF", "setPlayer"],
prohibitedSymbol:[],
predefinedKeyword:["player","if","for","while","switch","else"],
vvmagics:["front","create","setTrigger","giveForce","giveLife","invisible","move","addAction","getX","getY","getVX","getVY",
    "FIRE","ELECTRICITY","ICE","ARROW","ENERGY","WIND","BLOCK","TRIGGER"],
vvtests:["giveForce","giveLife","invisible", "create","move","addAction","setTrigger"],
symbol:{"@":"let ","#":"function(parameter)","$":"parameter"}
}


let Magic = {
    skillNum:[0,1,2,3],
    pvp_skillnum:[[0,1,2,3],[0,1,2,3]],
    magicList:[],//magicList = [name, magic function, coolTime, needed MagicPoint, needed Level]
    customMagic:[],//[name,code]
    basicMagic:[],
    saveMagic:function(){
        localStorage.CUSTOM_MAGIC=JSON.stringify(Magic.customMagic);
    },
    saveSkillNum:function(){
        localStorage.skillNum=JSON.stringify(Magic.skillNum);
        localStorage.pvp_skillNum=JSON.stringify(Magic.pvp_skillNum);
    },
    loadMagic:function(){
        //load basic magic
        Magic.basicMagic=MAGIC_DATA.BASIC_MASIC;
        for(let i=0,j=Magic.basicMagic.length; i<j; i++){
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
            Magic.customMagic = [["my magic", ""]];
        }else{
            Magic.customMagic = JSON.parse(localStorage.CUSTOM_MAGIC);
        }
        for (let i = 0, j = Magic.customMagic.length; i < j; i++) {
            let magic = Magic.convertMagictoJS(Magic.customMagic[i][0], Magic.customMagic[i][1]);
            if (magic == null) Magic.magicList.push([Magic.customMagic[i][0], function () { }, 100, 100, 1]);
            else Magic.magicList.push(magic);
        }
        //selected skill num
        if(localStorage.skillNum!=null){
            this.skillNum = JSON.parse(localStorage.skillNum);
            for(let i=0; i<this.skillNum.length; i++){
                if(this.magicList[this.skillNum[i]]==null)this.skillNum[i]=i;
            }
        } else {
            this.skillNum = [0,1,2,3];
        }
        //selected pvp skill num
        if(localStorage.pvp_skillNum!=null){
            this.pvp_skillNum = JSON.parse(localStorage.pvp_skillNum);
            for(let i=0; i<this.skillNum.length; i++){
                if(this.magicList[this.pvp_skillNum[0][i]]==null)this.pvp_skillNum[0][i]=i;
                if(this.magicList[this.pvp_skillNum[1][i]]==null)this.pvp_skillNum[1][i]=i;
            }
        } else {
            this.pvp_skillNum = [[0,1,2,3],[0,1,2,3]];
        }
        this.saveSkillNum();
    },
    addEmptyMagic:function(){
        Magic.customMagic.push(["none", ""]);
        Magic.magicList.push(["none", function(){},0,0]);
    },
    convertMagictoJS: function (name, magicCode) {
        //사용자가 @를 통해 생성한 객체
        let userdefinedKeyword=[]
        let isUserdefined=false;

        //convert magic code to js code
        let linenum=1;
        function isEnglish(c){return (64<c&&c<91)||(96<c&&c<123);}
        function printResult(isSuccess,text){
            const successInfo=document.querySelector(".successInfo");
            const magicInfo = document.querySelector(".magicInfo");
            if(isSuccess){
                successInfo.innerText ="SUCCESS: "+name+"를 생성했습니다.";
                successInfo.style.color = "yellow";
                magicInfo.innerText = text;
            }else{
                successInfo.innerText = "Fail: "+name+"를 생성하지 못했습니다.";
                successInfo.style.color = "red";
                magicInfo.innerText = text//+"\n line "+linenum;

            }
        }
        //주석제거
        magicCode=magicCode.replace(new RegExp("//.*\n","gm"),"");
        magicCode=magicCode.replace(new RegExp("/\\*(.*\n)*.*\\*/"),"");

        let jsCode="",testCode="",temp ="";
        magicCode+="\n"; //마지막에 temp가 더해지지 않을 수 있어서
        for(let i=0, j=magicCode.length;i<j; i++){
            if(isEnglish(magicCode.charCodeAt(i)))temp+=magicCode[i];
            else{
                //prohibit
                if(MAGIC_DATA.prohibitedWord.includes(temp) || MAGIC_DATA.prohibitedSymbol.includes(magicCode[i])){
                    printResult(false, "원인: 금지어를 포함했습니다.\n"+JSON.stringify(MAGIC_DATA.prohibitedWord)+"\n"+JSON.stringify(MAGIC_DATA.prohibitedSymbol));
                    return null;
                }
                //단어 검사
                if(temp.length>0){
                    if(MAGIC_DATA.predefinedKeyword.includes(temp)){
                        testCode +=temp;
                        jsCode+=temp;
                        if(isUserdefined){
                            printResult(false, "원인: 예약어 "+JSON.stringify(MAGIC_DATA.predefinedKeyword)+"를 변수로 선언했습니다.");
                            return null;
                        }
                    }else if(isUserdefined){
                        userdefinedKeyword.push(temp);
                        testCode+=temp;
                        jsCode+=temp;
                        isUserdefined=false;
                    }else{
                        if(userdefinedKeyword.includes(temp)){
                            testCode +=temp;
                            jsCode+=temp;
                        }else if(MAGIC_DATA.vvmagics.includes(temp)){
                            MAGIC_DATA.vvtests.includes(temp) ? testCode += "vvtest.test_" + temp : testCode += "vvmagic." + temp;//테스트해야할 메소드면 test를 더함
                            jsCode+="vvmagic."+temp;
                        }else{
                            printResult(false, "원인: 변수 "+temp+"가 선언되지 않았습니다.");
                            return null;
                        }
                    }  
                }
                temp=""; //검사하고 비움
                //심볼 검사
                if(magicCode[i] in MAGIC_DATA.symbol){
                    testCode+=MAGIC_DATA.symbol[magicCode[i]];
                    jsCode+=MAGIC_DATA.symbol[magicCode[i]];
                    if(magicCode[i]=="@")isUserdefined=true;
                }else{
                    testCode+=magicCode[i];
                    jsCode+=magicCode[i];
                }
                //if(magicCode[i]=="\r\n\t"||magicCode[i]=="\n"||magicCode[i]=="\r\t")++linenum;
                if(magicCode[i]=="\n")++linenum;
            }
        }
        let magic=function(){};
        let magicFactor;
        try {
            magic = eval("(function(player){"+MAGIC_DATA.unit_magic+jsCode+"})");
            let testMagic=eval("(function(player){"+MAGIC_DATA.unit_magic+MAGIC_DATA.test_unit_magic+testCode+"return magicFactor})");
            magicFactor=testMagic(new Player(0,10000));
        }catch(e){
            linenum="";
            printResult(false,e);
            console.error(e);
            console.log(testCode);
            return null;
        }
        printResult(true, "cooltime: "+(magicFactor[0]/100)+"sec\nMP: "+magicFactor[1],true)
        return [name,magic, magicFactor[0],magicFactor[1],1];
    }
}