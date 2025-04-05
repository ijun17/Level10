const MagicManager={
    skillNum:[0,0,0,0],
    pvp_skillNum:[[0,0,0,0],[0,0,0,0]],
    magicList:[],//magicList = [name, magic function, coolTime, needed MagicPoint, needed Level]
    customMagic:[],//[name,code]
    CUSTOM_MAGIC_COUNT:10,
    saveMagic:function(){
        localStorage.CUSTOM_MAGIC2=JSON.stringify(MagicManager.customMagic);
    },
    setCustomMagic:function(num, name, code){
        MagicManager.customMagic[num]={name:name, code:code}
        MagicManager.saveMagic()
    },
    saveSkillNum:function(){
        localStorage.skillNum=JSON.stringify(MagicManager.skillNum);
        localStorage.pvp_skillNum=JSON.stringify(MagicManager.pvp_skillNum);
    },
    setSkillNum:function(index, num){
        MagicManager.skillNum[index]=num;
        MagicManager.saveSkillNum()
    },
    loadMagic:function(){
        //load custom magic
        const CUSTOM_MAGIC = localStorage.CUSTOM_MAGIC2
        if(CUSTOM_MAGIC == null)MagicManager.createEmptyCustomMagic();
        else MagicManager.customMagic=JSON.parse(CUSTOM_MAGIC);
        for (let i = 0; i < MagicManager.customMagic.length; i++) {
            let magicSkill = MagicManager.createMagicSkill(MagicManager.customMagic[i].name, MagicManager.customMagic[i].code)
            magicSkill.setRequiredLevel(i)
            MagicManager.magicList.push(magicSkill);
        }
        //load basic magic
        for(let i=0; i<BASIC_MAGIC.length; i++){
            let magicSkill = MagicManager.createMagicSkill(BASIC_MAGIC[i].name, BASIC_MAGIC[i].code)
            magicSkill.setRequiredLevel(BASIC_MAGIC[i].level)
            MagicManager.magicList.push(magicSkill); 
        }
        const L=MagicManager.customMagic.length;
        //selected skill num
        MagicManager.skillNum = localStorage.skillNum!=null ? JSON.parse(localStorage.skillNum) : [L,L+1,L+2,L+3];
        //selected pvp skill num
        MagicManager.pvp_skillNum = localStorage.pvp_skillNum!=null ? JSON.parse(localStorage.pvp_skillNum) : [[L,L+1,L+2,L+3],[L,L+1,L+2,L+3]];
        
        MagicManager.saveSkillNum();
    },
    isBasicMagic:function(index){
        return index>=MagicManager.customMagic.length;
    },
    createEmptyCustomMagic:function(){
        let emptyMagics=[];
        for(let i=0; i<MagicManager.CUSTOM_MAGIC_COUNT; i++)emptyMagics.push({name:`커스텀 마법[${i+1}]`, code:"//마법을 생성하세요"});
        MagicManager.customMagic=emptyMagics;
        MagicManager.saveMagic();
    },
    getSelectedMagic:function(){
        let magics=[];
        for(let i=0; i<MagicManager.skillNum.length; i++){
            magics.push(MagicManager.magicList[MagicManager.skillNum[i]])
        }
        return magics
    },
    getSelectedPrimitiveMagic:function(){
        let codes = []
        for(let i=0; i<MagicManager.skillNum.length; i++){
            codes.push(MagicManager.magicList[MagicManager.skillNum[i]].getPrimitiveCode())
        }
        return codes
    },
    createMagicSkill: function (name, code) {
        return new MagicSkill(name).setPrimitiveCode(code)
    },
    setMagicSkill:function(num, name, code){
        if(MagicManager.isBasicMagic(num))return
        MagicManager.magicList[num]=MagicManager.createMagicSkill(name, code)
        MagicManager.setCustomMagic(num, name, code)
        return MagicManager.magicList[num]
    }
}


const BASIC_MAGIC=[
    {name:"파이어볼",code:`//불 생성
@e1=create(FIRE,front(30),3);
giveLife(e1,10);
move(e1,front(30), 0);`,level:0},

    {name:"벽", code:`//블럭을 생성
@block = create(BLOCK,0,0,60,200);
move(block,0,100);`,level:0},

    {name:"대쉬",code:`//플레이어가 빠른 속도로 앞으로 이동
giveForce(player,front(30),1);`,level:0},

    {name:"힐",code:`//플레이어 hp를 10000회복
giveLife(player,10000);`,level:0},

    {name:"파이어볼2",code:`//불과 불이 부딪히면 폭발한다
for(@i=0; i<3; i++){
    for(@j=0; j<3; j++){
        @fire = create(FIRE,front(60),3)
        move(fire,front(31)*i,j*31)
    }
}`,level:1},

    {name:"텔레포트",code:`//텔레포트
move(player, front(600), 0);`,level:1},

    {name:"활공",code:`//바람 생성
@wind=create(WIND,0,40);
giveLife(wind,500);
move(wind,front(-100),-50);
giveForce(wind,0,-30);`,level:1},
    
    {name:"얼음비", code:`//얼음을 소환
for(@i=0;i<10;i++){
    for(@j=0;j<3;j++){
        @ice = create(ICE, 0,-40)
        move(ice, front(i*40+100 +j*15),300+i*40+j*40)
    }
}`,level:2},

    {name:"파이어토네이도",code:`//불꽃 토네이도 생성
@x=getX(player)+front(200);
@plusX=front(15);
addSchedule(0,25/100,1/100,#{x+=plusX;});
for(@i=0; i<13; i++){
    @fire = create(FIRE,0,0);
    move(fire,front(100-12*i-15), i*31);
    addSchedule(0,25/100,1/100,#{  giveForce(fire,(x-getX(fire))/(i+11)*10,-getVY(fire));  });
    addSchedule(26/100,26/100,1/100,#{  giveForce(fire,-getVX(fire)+plusX*3,-30);  })
}`,level:2},

    {name:"투명",code:`//플레이어의 투명화
invisible(player,3);`,level:2},

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

    {name:"번개",code:`//전기들이 일정 수 부딪히면 번개가 생성된다. 
for(@i=0; i<200; i++){
    @e=create(ELECTRICITY, 0,0);
    move(e, front(300),0);
}`,level:4},

    {name:"폭발 비",code:`//불끼리 부딪히면 폭발한다.
for(@i=0; i<10; i++){
    for(@j=0; j<3; j++){
        @fire=create(FIRE,0,-29);
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

{name:"샷건",code:`//
for(@i=0; i<10; i++){
    for(@j=0; j<10; j++){
        @bullet = create(BLOCK,0,0,4,4)
        move(bullet,front(10)*i,j*5)
        giveForce(bullet,front(100),j)
    }
}`,level:10},

    {name:"에너지파",code:`//
for(@i=0;i<100;i++){
    @e=create(ENERGY,0,0)
    move(e,front(100+i*10),50)
}`,level:10},

]