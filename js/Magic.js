let Magic = {
    magicPoint:0,
    //qwer
    skillNum:[1,2,3,4],
    coolTime:[0,0,0,0],
    basicMagicCount:1,
    customMagicCount:0,
    customMagic:[],
    //magicFrame=[magic name, magic code, needed Level] : basicMagic, customMagic
    //magicList = [name, magic function, coolTime, needed MagicPoint, needed Level] : magicList
    magicList:[["magicEffect",function(p){
        let magicEffect = new Particle(5, p.x+p.w/2-p.h/2, p.y);
        magicEffect.w=p.h;
        magicEffect.h=p.h;
    },0,0,0]],
    basicMagic:[
    ["fire ball",`
    createMatter(0,front()*10,0);
    `,1],

    ["wall", `
    createBlock(20,60,"black");
    `,1],

    ["dash",`
    giveForce(player,front()*20,0);
    `,2],

    ["teleport",`
    move(player,front()*300,0);
    `,2],

    ["fire tornado",`
    @x=getX(player)+front()*200;
    for(@i=0;i<12;i++){
        @fire = createMatter(0,0,0);
        move(fire,front()*(200-13*i-15), i*35);
        setGravity(fire,500,0);
        damage(fire,-100)
        time(fire,1,500,#{
            giveForce(fire,(x-getX(fire))/(11+i)*10,-getVY(fire));
        });
    }
    `,3],

    ["meteor",`
    for(@i=0;i<4;i++){
        for(@j=0;j<4;j++){
            @fire=createMatter(0,front()*10,-10);
            move(fire, front()*i*40,200-j*40);
        }
    }
    `,3],

    ["sniper",`
    createMatter(4,front()*40,0);
    `,4],

    ["one-gi-oc",`
    for(@i=0;i<4;i++){
        @e=createMatter(5,front()*3,-3);
        move(e,0,300);
    }
    `,4],
    ["chi-do-ri",`
    time(player,1,501,#{
        @e=createMatter(1,0,0);
        move(e,front()*20,0)
    });
    `,5],
    ["sword",`
        @e=createMatter(6,front()*20,0)
        damage(e,-2);
    `,5]],
    //end basicMasic

    doSkill:function(p,num){
        if(Magic.coolTime[num]<Game.time){
            Magic.magicList[0][1](p);
            let magicNum=Magic.skillNum[num];
            (Magic.magicList[magicNum][1])(p);
            Magic.coolTime[num]=Magic.magicList[magicNum][2]+Game.time;
        }
    },
    clearCoolTime:function(){
        this.coolTime=[0,0,0,0];
    },
    saveMagic:function(){
        localStorage.CUSTOM_MAGIC=JSON.stringify(Magic.customMagic);
    },
    loadMagic:function(){
        //load basic magic
        Magic.basicMagicCount=Magic.basicMagic.length;
        for(let i=0,j=Magic.basicMagicCount; i<j; i++){
            Magic.magicList.push(Magic.convertMagictoJS(Magic.basicMagic[i][0],Magic.basicMagic[i][1]));
            Magic.magicList[i][4]=Magic.basicMagic[i][2]; //제한 레벨을 지정
            //console.log(Magic.basicMagic[i]);
        }
        //load custom magic
        if(localStorage.CUSTOM_MAGIC!=null)Magic.customMagic=JSON.parse(localStorage.CUSTOM_MAGIC);
        Magic.customMagicCount=Magic.customMagic.length;
        for(let i=0,j=Magic.customMagicCount; i<j; i++){
            Magic.magicList.push(Magic.convertMagictoJS(Magic.customMagic[i][0],Magic.customMagic[i][1]));
        }
    },
    addEmptyMagic:function(){
        Magic.customMagicCount++;
        Magic.customMagic.push(["none", ""]);
        Magic.magicList.push(["none", function(){},0,0]);
    },
    isCompile:false,
    magicFactor:[0,0], //temp
    convertMagictoJS: function (name, magicCode) {
        Magic.isCompile=true;
        Magic.magicFactor = [0,0]; //[cooltime, power]
        let jsCode="";
        let testCode="";
        let temp =""; //문자열이 일시적으로 담기는곳
        function isEnglish(c){return (64<c&&c<91)||(96<c&&c<123);}
        function addMF(mf){if(Magic.isCompile){if(Magic.magicFactor[0]<Math.abs(mf[0]))Magic.magicFactor[0]=Math.abs(mf[0]);Magic.magicFactor[1]+=Math.abs(mf[1]);}}
        //
        function giveForce(e,ax,ay){e.vx+=ax;e.vy+=ay;addMF([0, (ax*ax+ay*ay)]);}
        function damage(e,d){e.life-=d;addMF([0,d/10]);}
        function invisible(e,time){e.visibility=false;e.addAction(time,time,function(){e.visibility=true;});addMF([time*2,100]);}
        function freeze(e,time){e.canMove=false;e.addAction(time,time,function(){e.visibility=true;});addMF([time*2,100]);}
        function setGravity(e,time,ga){let temp=e.ga;e.ga=ga;e.addAction(time,time,function(){e.ga=temp;});addMF([time*2,Math.abs(ga*100)]);}
        function setLocation(e,x,y){e.x=x-e.w/2;e.y=y-e.h/2;addMF([200,20]);}
        function move(e,vx,vy){e.x+=vx;e.y-=vy;addMF([200,vx+vy]);}
        function time(e,startTime,endTime,f){addMF([(endTime-startTime)*2,0]);e.addAction(startTime,endTime,f);}
        //
        function getX(e){return e.x+e.w/2;}
        function getY(e){return e.y+e.h/2;}
        function getVX(e){return e.vx;}
        function getVY(e){return e.vy;}
        function front(){return (Game.p.isRight ? 1 : -1);}
        //
        function createBlock(w,h,color){let b=new Block(Game.p.x+15+front()*(w/2+25)-w/2,Game.p.y,w,h,color);addMF([0,w*h/10]);return b;}
        function createMatter(type,vx,vy){
            addMF([50,(vx*vx+vy*vy)+100]);
            let m=new Matter(type,0,0,vx,vy);
            m.x=getX(Game.p)+front()*(m.w/2+15)-m.w/2;
            m.y=getY(Game.p)-m.h/2;
            return m;
        }
        //
        let prohibitedWord=["new","function"];
        let prohibitedSymbol=["[",".","$"];
        let keyword={};
        let symbol={"@":"let ","#":"function()"};
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

                if(magicCode[i] in symbol)jsCode+=symbol[magicCode[i]];
                else jsCode+=magicCode[i];
                temp="";
            }
        }
        if(temp!="")jsCode+=temp;
        console.log("js code: ",jsCode);
        let magic=function(){};
        try {
            magic = eval("(function(player){"+jsCode+"})");
            let temp = Game.p;
            Game.p = new Player(0,10000);
            Game.p.dieCode=function(){};
            magic(Game.p);
            Game.p=temp;
        }catch(e){
            console.log("err: syntex");
            return null;
        }
        console.log(Magic.magicFactor);
        this.isCompile=false
        return [name,magic, Magic.magicFactor[0],Magic.magicFactor[1],1];
    }
}