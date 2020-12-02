class Magic{
    //qwer
    static skillNum=[0,1,2,4];
    static coolTime=[0,0,0,0];
    
    //magic = [magic,coolTime]
    static basicMagic=[
    ["bullet", function(){
        let bullet;
        let temp=-1;
        if(p.isRight)temp=1;
        for(let i=0; i<3; i++){
            bullet = new Block(p.x+30*temp, p.y+i*14, 10,10);
            bullet.setVectorX(30*temp);
            bullet.life=50;
        }
        bullet.setMass(10);
    },50],

    ["ice",function(){
        let ice;
        let temp=-1;
        if(p.isRight)temp=1;
        ice=new Matter(2,p.x+50*temp, p.y, 10*temp, 0.5);
    },200],

    ["teleport",function(){
        let temp=-1;
        if(p.isRight)temp=1;
        p.x+=300*temp;
    },100],

    ["chidori",function(){
        p.addAction(1,200,function(){
            let temp=-1;
            if(p.isRight)temp=1;
            new Matter(1,p.x+40*temp, p.y+20, 0, 0);});
    },1000],

    ["firetornado",function(){
        let temp=-1;
        if(p.isRight)temp=1;
        for(let i=0; i<12; i++){
            let x=p.x+200*temp;
            let y=p.y+29-i*40;
            let fire = new Matter(0, x-13*i+10,y,0,0 );
            fire.addAction(1,1000,function(){
                fire.vx+=(x-fire.x)/(1.1+i/10);
                fire.vy=0;
                fire.life=1000;
            });
            fire.addAction(1001,1001,function(){fire.life=1;});
        }
    },2000],

    ["metheor",function(){
        let temp=-1;
        if(p.isRight)temp=1;
        for(let i=0; i<4; i++){
            for(let j=0; j<4; j++){
                let fire = new Matter(0, p.x+i*41, p.y-400+j*41, 10*temp, -10);
                fire.life=50;
            }
        }
    },1000]];
    //end basicMasic

    static doSkill(num){
        if(Magic.coolTime[num]<time){
            let magicNum=Magic.skillNum[num];
            new (Magic.basicMagic[magicNum][1]);
            Magic.coolTime[num]=Magic.basicMagic[magicNum][2]+time;
        }
    }

    static clearCoolTime(){
        this.coolTime=[0,0,0,0];
    }
}