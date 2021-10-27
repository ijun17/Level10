/*몬스터
플레이어를 공격하는 엔티티

{name:"", 
draw:{},
status:{},
skillList:[],
attack:{}
}

몬스터 스킬

몬스터 공격

몬스터 상태-이동, 공격(충돌)

*/
//const MONSTER_SKILL={""};
const MONSTERS = [{
    name: "뾰족버섯",
    image: { name: "crazymushroom",w: 60, h: 60, frame: 8, MAX_X: [3, 3] },
    setup: function(e){ 
        e.w=120; e.h=120; e.life=100000; e.power=500; e.speed=3;e.jumpSpeed=3; e.inv_mass=0.2;
        e.animation=new Animation(ImageManager.crazymushroom,60,60,[3, 3],function(){return (e.attackTick>0?1:0)});e.animation.fps=16;
    },
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI();return 48;},
        function(e){e.vx+=(e.isRight ? 5 : -5);e.vy+=7;e.canJump=false;return 503;}
    ]
},
{
    name: "혹한의군주 미눅",
    image: { name: "crazymonkey", w: 120, h: 200, frame: 8, MAX_X: [1, 1] },
    setup: function(e){ 
        e.w=120;e.h=200;e.life=200000;e.power=1000;e.speed=8;e.jumpSpeed=4;e.inv_mass=0.1;
        e.animation=new Animation(ImageManager.crazymonkey,120,200,[1, 1],function(){return (e.attackTick>0?1:0)});e.animation.fps=8;
    },
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI();return 50;},
        function(e){if(e.canTarget())e.createMatterToTarget(TYPE.ice,e.getTargetDir()*2,0,20);return 200;}
    ]
},
{
    name: "지옥파리",
    image: {name:"hellfly",w:30,h:30,frame:8,MAX_X:[1,1]},
    setup: function(e){
        e.w=30;e.h=30;e.life=50000;e.power=100;e.ga=-0.03;e.speed=10;e.inv_mass=1;e.isFlying=true;
        e.animation=new Animation(ImageManager.hellfly,30,30,[1, 1],function(){return (e.attackTick>0?1:0)});e.animation.fps=8;
    },
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI();return 4;},
        function(e){e.addAction(1,1,function(){e.speed=30;e.power=1000;});e.addAction(100,100,function(){e.speed=10;e.power=500;}); return 700;}
    ]
},
{
    name: "심연의흑염룡",
    image: {name:"wyvern",w:80,h:80,frame:16,MAX_X:[4,1]},
    setup: function(e){
        e.w=300;e.h=300;e.life=5000000;e.power=1000;e.speed=4;e.inv_mass=0.1;e.isFlying=true;
        e.animation=new Animation(ImageManager.wyvern,80,80,[4, 1],function(){return (e.attackTick>0?1:0)});e.animation.fps=16;
    },
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI();return 50;},
        function(e){if(!e.canTarget())return 70;let m=e.createMatterToTarget(TYPE.fire,e.getTargetDir()*1.3,0,10);m.power=2000;m.w=60;m.h=60;m.inv_mass=1;return 111;},
        function(e){
            for(let i=0; i<10; i++){
                (e.createMatter(TYPE.fire,(e.isRight?1:-1)*(2+i*0.4),-2-i*0.1,0,-30)).life=10;
                (e.createMatter(TYPE.fire,(e.isRight?1:-1)*(2+i*0.4),-1.5-i*0.1,0,-30)).life=10;
                (e.createMatter(TYPE.fire,(e.isRight?1:-1)*(2+i*0.4),-2.5-i*0.1,0,-30)).life=10;
            }
            return 500;}
    ]
},
{
    name: "마법골렘",
    image: {name:"golem",w:128,h:128,frame:32,MAX_X:[4,2]},
    setup: function(e){
        e.w=200;e.h=200;e.life=5000000;e.power=4000;e.speed=1;e.jumpSpeed=2;e.inv_mass=0.01;e.ga=-1;e.canFallDie=false;e.overlap=false;
        e.animation=new Animation(ImageManager.golem,128,128,[4, 2],function(){return (e.attackTick>0?1:0)});e.animation.fps=32;
    },
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI();return 50;},
        function(e){
            if(!e.canTarget())return 100;
            e.x = e.target.getX()-e.w/2;e.y=e.target.y-700;e.vx = 0;e.vy = -5;
            let effect = new Particle(TYPE.magicEffect, e.x-e.w, e.y-e.h);effect.w=e.h*3;effect.h=e.h*3;
            let temp=e.power;e.power=9999;e.addAction(40,40,function(){e.power=temp});
            return 501;},
        function(e){
            e.addAction(50,50,function(){e.vx=e.getTargetDir()*30;})
            let effect = new Particle(TYPE.magicEffect, e.x-e.w, e.y-e.h);effect.w=e.h*3;effect.h=e.h*3;
            let noMatter = new Entity(effect.x,effect.y,Game.PHYSICS_CHANNEL);
            noMatter.w=effect.w;noMatter.h=effect.h;
            noMatter.collisionHandler=function(v){if(v instanceof Matter)v.throw();return false;}
            return 888;
        }
    ]
},
{
    name: "골드드래곤",
    image: {name:"golddragon",w:80,h:80,frame:16,MAX_X:[4,1]},
    setup: function(e){
        e.w=300;e.h=300;e.life=10000000;e.power=2000;e.speed=5;e.inv_mass=0.1;e.isFlying=true;e.brightness=6;
        e.animation=new Animation(ImageManager.golden_dragon,80,80,[4, 1],function(){return (e.attackTick>0?1:0)});e.animation.fps=16;
    },
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI();return 50;},
        function(e){if(!e.canTarget())return 70;let m=e.createMatterToTarget(TYPE.wind,e.getTargetDir()*1.5,0,30);m.power=500;m.life=100;m.vx*=0.5;m.vy*=0.5;return 500;},
        function(e){
            if(!e.canTarget())return 70;
            let block=new Block(e.target.x-50+(e.target.w>>1),-3000,100,300,"rgba(255, 229, 0,0.5)");
            block.collisionHandler=function(en){if(en===e)return false;if(en instanceof Matter)en.life=0;en.giveDamage(3000);return true;}
            block.brightness=5;
            block.vy=-20;block.ga=-1;
            return 1000;
        },
        function(e){
            for(let i=0; i<10; i++){
                for(let j=0; j<20; j++){
                    let block=new Block(e.x+j*10,e.y+i*10,50,50,"rgba(255, 229, 0,0.5)");
                    block.giveForce=function(){};
                    block.giveDamage=function(){};
                    block.collisionHandler=function(en){if(en===e)return false;en.giveDamage(1000);return true;}
                    block.brightness=1;
                    block.canRemoved=false;
                    block.addAction(1000,1000,function(){block.throw();});
                }
            }
            return 3000;}
    ]
},
{
    name:"warrior",
    setup:function(e){
        e.w=60;e.h=90;e.life=1000000;e.power=4000;e.speed=5;e.jumpSpeed=5;e.inv_mass=1;e.isFlying=true;e.brightness=6;
        e.animation=new Animation(ImageManager.warrior,40,60,[1,3,3],function(){
            if(e.attackTick>0)return 2;
            else return (e.isMovingX?1:0);
        });
        e.animation.fps=16;
    },
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI(4);return 20;},
        function(e){//플레이어에게 돌진 
            if(e.canTarget()){
                let effect = new Particle(TYPE.magicEffect, e.x-e.w, e.y-e.h);effect.w=e.h*3;effect.h=effect.w;
                e.addAction(1,50,function(){effect.x--;effect.h--;effect.w+=2;effect.h+=2;})
                e.canMove=false;
                e.addAction(50,50,function(){e.canMove=true;e.vx=e.target.getX()-e.getX();e.vy=e.getY()-e.target.getY();})
                
            }
            return 500;
        }
    ]
}
];

class Monster extends Actor {
    typenum;
    target=null;
    targets=[];
    attackEffect=function(){};
    attackFilter=function(){}
    attackTick=0; //몬스터가 공격하는 자세

    power=100;
    damageTick=0;

    constructor(typenum, x, y, ai=true, channelLevel = Game.PHYSICS_CHANNEL) {
        super(x, y, channelLevel);
        let type=MONSTERS[typenum];
        this.typenum=typenum;
        this.name=type.name;
        this.overlap=true;
        this.ga=-0.2;
        this.COR=0;
        type.setup(this);
        this.attackEffect=type.attackEffect;
        this.attackFilter=function(e){return (e==this.target || e instanceof Block)}
        //skill
        for(let i=1; i<type.skillList.length; i++){
            this.skillList[i-1]=[i,type.skillList[i],0,0];
            this.coolTime[i-1]=0;
        }
        //AI
        if(ai){
            this.searchTarget();
            for(let i=type.skillList.length-1; i>=0;i--){
                this.addSkill(200,type.skillList[i]);
            }
        }
        //
        this.totalDamageHandler=function(){
            if(this.damageTick>0){
                this.damageTick--;
                return false;
            }else if(this.totalDamage > 0){
                this.damageTick=5;
                Camera.vibrate((this.totalDamage<10000 ? this.totalDamage*0.001 : 10)+5);
                return true;
            }
        }
    }

    update() {
        super.update();
        if(this.attackTick>0)this.attackTick--;
    }

    collisionHandler(e,ct=[0,0]) {
        super.collisionHandler(e,ct);
        //공격
        if(this.attackFilter(e)){
            if(this.target==null)this.target=e;
            e.giveDamage((1 - Math.random()*2)*this.power*0.1+this.power);
            this.attackTick = this.animation.fps*this.animation.MAX_X[1];
            if (e.getX() > this.getX()) {
                e.giveForce((e instanceof Actor?-e.vx:0)+((this.power+1000)>>9)+this.vx,0.2-e.ga);
            } else {
                e.giveForce((e instanceof Actor?-e.vx:0)-((this.power+1000)>>9)+this.vx,0.2-e.ga);
            }
        }
        return true;
    }

    removeHandler() {
        for(let i=this.w/10; i>=0; i--){
            for(let j=this.h/10; j>=0; j--){
                let e = new Particle(1, this.x + i * 10, this.y + j * 10);
                e.ga = 0;
                e.vx *= 2;
                e.vy *= 2;
            }
        }
        Camera.vibrate(50);
        return true;
    }

    castSkill(num){
        //num 0:q 1:w 2:e 3:r
        //Monstet skillList[0] is skill to Move
        if(this.skillList.length>num&&this.coolTime[num]<Game.time){
            this.coolTime[num]=this.skillList[num][1](this)+Game.time;
        }
    }

    addSkill(time,f){ 
        let temp=this;
        this.addAction(time,time,function(){temp.addSkill(f(temp),f)});
    }
    //편의기능
    canTarget(){return (this.target!=null&&this.target.canDraw&&this.target.life>0)}
    searchTarget(){
        let c=Game.channel[Game.PHYSICS_CHANNEL].entitys;
        let targetPriority=3; //타겟 우선순위
        for(let i=c.length-1; i>=0; i--){
            if(c[i] instanceof Player){
                this.target=c[i];targetPriority=0;break;
            }
        }
    }
    getTargetDir(){
        if(this.canTarget())return (this.getX() < this.target.getX() ? 1 : -1);
        else return (Math.random()>0.5 ? 1 : -1);
        
    }
    front(n=1){return (this.isRight?n:-n)}
    createMatterToTarget(type,xDir,yDir,power){
        let matter_x = this.getX()+((this.w>>1)+15)*xDir-15;
        let matter_y = this.getY()+((this.h>>1)+15)*yDir-15;
        let matter_vx = (this.target.x-matter_x);
        let matter_vy = -(this.target.y-matter_y);
        let vector_length = Math.sqrt(matter_vx**2+matter_vy**2);
        return  new Matter(type, matter_x, matter_y, matter_vx*power/vector_length, matter_vy*power/vector_length+1);
    }
    createMatter(type,xDir,yDir,vx,vy){
        let matter_x = this.getX()+((this.w>>1)+15)*xDir-15;
        let matter_y = this.getY()+((this.h>>1)+15)*yDir-15;
        return  new Matter(type, matter_x, matter_y,vx,vy);
    }
    AI() {
        this.isRight=(this.canTarget() ? (this.getX() < this.target.getX()) : (Math.random()>0.5))
        this.isRight=(Math.random()>0.1 ? this.isRight : !this.isRight)
        this.isMovingX=true;
        if(this.isFlying){
            this.isUp=(this.canTarget() ? (this.getY() > this.target.getY()) : (Math.random()>0.5));
            this.isUp=(Math.random()>0.1 ? this.isUp : !this.isUp)
            this.isMovingY=true;
        }else this.jump();
    }
}