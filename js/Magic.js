let Magic = {
    //qwer
    skillNum:[1,2,3,4],
    coolTime:[0,0,0,0],
    basicMagicCount:13,
    customMagicCount:0,
    customMagic:[],
    //magic = [name, magic,coolTime,level]
    basicMagic:[["null", function(){}, 0,0],
    ["bullet", function(p){
        let bullet;
        let temp=-1;
        if(p.isRight)temp=1;
        for(let i=0; i<3; i++){

            bullet = new Block(p.x+30*temp, p.y+i*14, 10,10);
            bullet.vx=30*temp;
            bullet.life=50;
            bullet.mass=10;
        }
    },50,1],

    ["ice",function(p){
        let ice;
        let temp=-1;
        if(p.isRight)temp=1;
        ice=new Matter(2,p.x+50*temp, p.y+20, 10*temp, 0.5);
    },200,1],

    ["dash", function(p){
        if(p.isRight)p.vx=20;
        else p.vx=-20;
        p.vy=0;
    },100,1],

    ["wall",function(p){
        let wall;
        let temp=-1;
        if(p.isRight)temp=1;
        wall=new Block(p.x+50*temp, p.y-40, 20, 100);
        wall.life=4000;
    },200,1],

    ["teleport",function(p){
        let temp=-1;
        if(p.isRight)temp=1;
        p.x+=300*temp;
    },200,1],

    ["chidori",function(p){
        p.addAction(1,200,function(){
            let temp=-1;
            if(p.isRight)temp=1;
            new Matter(1,p.x+40*temp, p.y+20, 0, 0);});
    },1000,2],

    ["meteor",function(p){
        let temp=-1;
        if(p.isRight)temp=1;
        for(let i=0; i<4; i++){
            for(let j=0; j<4; j++){
                let fire = new Matter(0,p.x+i*41, p.y-400+j*41, 10*temp, -10);
                fire.life=10;
            }
        }
    },1000,2],

    ["barricade",function(p){
        let b;
        let temp=-1;
        if(p.isRight)temp=1;
        b=new Block(p.x+p.w/2 + 50*temp-25, p.y-200, 50, 200);
        b.life=10000;
        b.mass=30;
    },1000,4],

    ["firetornado",function(p){
        let temp=-1;
        if(p.isRight)temp=1;
        for(let i=0; i<12; i++){
            let x=p.x+200*temp;
            let y=p.y+29-i*35;
            let fire = new Matter(0, x-13*i+10,y,0,0 );
            fire.addAction(1,500,function(){
                fire.vx+=(x-fire.x)/(1.1+i/10);
                fire.vy=0;
                fire.life=100;
            });
            fire.addAction(1001,1001,function(){fire.life=0;});
        }
    },2000,3],

    ["icetornado",function(p){
        let temp=-1;
        if(p.isRight)temp=1;
        for(let i=0; i<12; i++){
            let x=p.x+200*temp;
            let y=p.y+29-i*40;
            let fire = new Matter(2, x-13*i+10,y,0,0 );
            //fire.w=38;
            //fire.h=38;
            fire.addAction(1,500,function(){
                fire.vx+=(x-fire.x)/(1.1+i/10);
                fire.vy=0;
                fire.life=100;
            });
            fire.addAction(501,501,function(){fire.life=1;});
        }
    },2000,3],
    
    ["one-gi-ok",function(p){
        let temp=-1;
        if(p.isRight)temp=1;
        for(let i=0; i<4; i++){
            let energy = new Matter(5, p.x,p.y-250, 3*temp, -3);
            energy.life=20;
        }
    },2000,4],
    
    ["sniper", function(p){
        let arrow;
        let temp=-1;
        if(p.isRight)temp=1;
        arrow=new Matter(4,p.x+50*temp, p.y+20, 20*temp, 0.5);
        arrow.life=10;
    },2000,4]],
    //end basicMasic

    doSkill:function(p,num){
        if(Magic.coolTime[num]<Game.time){
            Magic.magicEffect(p);
            let magicNum=Magic.skillNum[num];
            (Magic.basicMagic[magicNum][1])(p);
            Magic.coolTime[num]=Magic.basicMagic[magicNum][2]+Game.time;
        }
    },
    clearCoolTime:function(){
        this.coolTime=[0,0,0,0];
    },

    magicEffect:function(e){
        let magicEffect = new Particle(5, e.x+e.w/2-e.h/2, e.y);
        magicEffect.w=e.h;
        magicEffect.h=e.h;
    },
    saveMagic:function(){
        localStorage.CUSTOM_MAGIC=JSON.stringify(Magic.customMagic);
    },
    loadMagic:function(){
        Magic.basicMagicCount=Magic.basicMagic.length;
        if(localStorage.CUSTOM_MAGIC!=null)Magic.customMagic=JSON.parse(localStorage.CUSTOM_MAGIC);
        Magic.customMagicCount=Magic.customMagic.length;
        for(let i=0,j=Magic.customMagicCount; i<j; i++){
            Magic.basicMagic.push(Magic.convertMagictoJS(Magic.customMagic[i][0],Magic.customMagic[i][1]));
        }
    },
    addEmptyMagic:function(){
        Magic.customMagicCount++;
        Magic.customMagic.push(["none", ""]);
        Magic.basicMagic.push(["none", function(){},0,0]);
    },
    convertMagictoJS: function (name, magicCode) {
        let magicFactor = 0;
        let jsCode="";
        let temp =""; //문자열이 일시적으로 담기는곳
        function isEnglish(c){return (64<c&&c<91)||(96<c&&c<123);}
        let prohibitedWord=["Game", "Magic", "MapBlock", "Screen", "Level", "Button", "Camera","Entity", "Particle", "Player", "Monster","new","document","canvas","ctx"];
        let prohibitedSymbol=["$","@","~","#"];
        let keyword={"createBlock":"new Block", "createMatter":"new Matter"};
        for(let i=0, j=magicCode.length;i<j; i++){
            if(isEnglish(magicCode.charCodeAt(i)))temp+=magicCode[i];
            else{
                if(prohibitedWord.includes(temp)){
                    console.log("err: your code have prohibited word");
                    return null;
                }
                if(prohibitedSymbol.includes(magicCode[i])){
                    console.log("err: your code have @ or ~ or $");
                    return null;
                }
                if(temp in keyword)jsCode+=keyword[temp];
                else jsCode+=temp;
                jsCode+=magicCode[i];
                temp="";
            }
        }
        if(temp!="")jsCode+=temp;
        console.log("js code: ",jsCode);
        let magic=function(){};
        try {
            magic = eval("(function(player){"+jsCode+"})");
            let tester = new Player(0,10000);
            tester.dieCode=function(){};
            magic(tester);
        }catch(e){
            console.log("err: syntex");
            return null;
        }
        return [name,magic, 100,1];
    }
}