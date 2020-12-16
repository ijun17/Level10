let Magic = {
    //qwer
    skillNum:[5,7,4,6],
    coolTime:[0,0,0,0],
    
    //magic = [name, magic,coolTime,level]
    basicMagic:[["null", function(){}, 0],
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
    },50],

    ["ice",function(p){
        let ice;
        let temp=-1;
        if(p.isRight)temp=1;
        ice=new Matter(2,p.x+50*temp, p.y+20, 10*temp, 0.5);
    },200],

    ["wall",function(p){
        let wall;
        let temp=-1;
        if(p.isRight)temp=1;
        wall=new Block(p.x+50*temp, p.y-40, 20, 100);
        wall.life=4000;
    },200],

    ["dash", function(p){
        if(p.isRight)p.vx=20;
        else p.vx=-20;
        p.vy=0;
    },100],

    ["teleport",function(p){
        let temp=-1;
        if(p.isRight)temp=1;
        p.x+=300*temp;
    },200],

    ["chidori",function(p){
        p.addAction(1,200,function(){
            let temp=-1;
            if(p.isRight)temp=1;
            new Matter(1,p.x+40*temp, p.y+20, 0, 0);});
    },1000],

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
    },2000],

    ["meteor",function(p){
        let temp=-1;
        if(p.isRight)temp=1;
        for(let i=0; i<4; i++){
            for(let j=0; j<4; j++){
                let fire = new Matter(0,p.x+i*41, p.y-400+j*41, 10*temp, -10);
                fire.life=10;
            }
        }
    },1000],

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
    },2000],
    
    ["one-gi-ok",function(p){
        let temp=-1;
        if(p.isRight)temp=1;
        for(let i=0; i<4; i++){
            let energy = new Matter(5, p.x,p.y-250, 3*temp, -3);
            energy.life=20;
        }
    },2000],
    
    ["sniper", function(p){
        let arrow;
        let temp=-1;
        if(p.isRight)temp=1;
        arrow=new Matter(4,p.x+50*temp, p.y+20, 20*temp, 0.5);
        arrow.life=10;
    },2000],
    ["barricade",function(p){
        let b;
        let temp=-1;
        if(p.isRight)temp=1;
        b=new Block(p.x+p.w/2 + 50*temp-25, p.y-200, 50, 200);
        b.life=10000;
        b.mass=30;
    },1000]],
    //end basicMasic

    doSkill:function(p,num){
        if(Magic.coolTime[num]<Game.time){
            Magic.magicEffect(p);
            let magicNum=Magic.skillNum[num];
            new (Magic.basicMagic[magicNum][1])(p);
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
    convertMagictoJS: function (magicCode) {
        let magicFactor = 0;
        let JSCode = "";
        let codeToJs = function () {

        }

    }

}