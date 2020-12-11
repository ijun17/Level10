class Magic{
    //qwer
    static skillNum=[5,7,4,6];
    static coolTime=[0,0,0,0];
    
    //magic = [magic,coolTime]
    static basicMagic=[["null", function(){}, 0],
    ["bullet", function(){
        let bullet;
        let temp=-1;
        if(Game.p.isRight)temp=1;
        for(let i=0; i<3; i++){

            bullet = new Block(Game.p.x+30*temp, Game.p.y+i*14, 10,10);
            bullet.vx=30*temp;
            bullet.life=50;
            bullet.mass=10;
        }
    },50],

    ["ice",function(){
        let ice;
        let temp=-1;
        if(Game.p.isRight)temp=1;
        ice=new Matter(2,Game.p.x+50*temp, Game.p.y+20, 10*temp, 0.5);
    },200],

    ["wall",function(){
        let wall;
        let temp=-1;
        if(Game.p.isRight)temp=1;
        wall=new Block(Game.p.x+50*temp, Game.p.y-40, 20, 100);
        wall.life=4000;
    },200],

    ["teleport",function(){
        let temp=-1;
        if(Game.p.isRight)temp=1;
        Game.p.x+=300*temp;
    },200],

    ["chidori",function(){
        Game.p.addAction(1,200,function(){
            let temp=-1;
            if(Game.p.isRight)temp=1;
            new Matter(1,Game.p.x+40*temp, Game.p.y+20, 0, 0);});
    },1000],

    ["firetornado",function(){
        let temp=-1;
        if(Game.p.isRight)temp=1;
        for(let i=0; i<12; i++){
            let x=Game.p.x+200*temp;
            let y=Game.p.y+29-i*35;
            let fire = new Matter(0, x-13*i+10,y,0,0 );
            fire.addAction(1,500,function(){
                fire.vx+=(x-fire.x)/(1.1+i/10);
                fire.vy=0;
                fire.life=100;
            });
            fire.addAction(1001,1001,function(){fire.life=0;});
        }
    },2000],

    ["meteor",function(){
        let temp=-1;
        if(Game.p.isRight)temp=1;
        for(let i=0; i<4; i++){
            for(let j=0; j<4; j++){
                let fire = new Matter(0, Game.p.x+i*41, Game.p.y-400+j*41, 10*temp, -10);
                fire.life=10;
            }
        }
    },1000],

    ["icetornado",function(){
        let temp=-1;
        if(Game.p.isRight)temp=1;
        for(let i=0; i<12; i++){
            let x=Game.p.x+200*temp;
            let y=Game.p.y+29-i*40;
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
    
    ["energy-lay",function(){
        let temp=-1;
        if(Game.p.isRight)temp=1;
        for(let i=0; i<2; i++){
            for(let j=0; j<2; j++){
                let energy = new Matter(5, Game.p.x, Game.p.y-400, 10*temp, -10);
                energy.life=20;
            }
        }
    },2000],
    
    ["sniper", function(){
        let arrow;
        let temp=-1;
        if(Game.p.isRight)temp=1;
        arrow=new Matter(4,Game.p.x+50*temp, Game.p.y+20, 20*temp, 0.5);
        arrow.life=10;
    },2000]];
    //end basicMasic

    static doSkill(num){
        if(Magic.coolTime[num]<Game.time){
            let magicNum=Magic.skillNum[num];
            new (Magic.basicMagic[magicNum][1]);
            Magic.coolTime[num]=Magic.basicMagic[magicNum][2]+Game.time;
        }
    }

    static clearCoolTime(){
        this.coolTime=[0,0,0,0];
    }
}