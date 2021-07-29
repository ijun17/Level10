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
    setStatus: function(e){ e.w=60; e.h=60; e.life=20000; e.power=200; e.speed=3; e.inv_mass=1;},
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI(1);return 50;},
        function(e){e.vx+=(e.isRight ? 5 : -5);e.vy+=7;return 503;}
    ]
},
{
    name: "혹한의군주 미눅",
    image: { name: "crazymonkey", w: 120, h: 200, frame: 8, MAX_X: [1, 1] },
    setStatus: function(e){ e.w=120;e.h=200;e.life=100000;e.power=1000;e.speed=5;e.inv_mass=0.2},
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI(10);return 50;},
        function(e){if(e.canTarget())e.createMatterToTarget(2,e.getTargetDir()*2,0,10);return 200;}
    ]
},
{
    name: "지옥파리",
    image: {name:"hellfly",w:30,h:30,frame:8,MAX_X:[1,1]},
    setStatus: function(e){e.w=30;e.h=30;e.life=20000;e.power=500;e.speed=5;e.inv_mass=2;e.ga=0;},
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI2(5);return 50;}
    ]
},
{
    name: "마법골렘",
    image: {name:"golem",w:128,h:128,frame:32,MAX_X:[4,2]},
    setStatus: function(e){e.w=200;e.h=200;e.life=10000000;e.power=4000;e.speed=3;e.inv_mass=0.01;e.ga=-1;e.canFallDie=false;},
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI();return 50;},
        function(e){
            if(!e.canTarget())return 100;
            e.x = e.target.x+e.target.w/2-e.w/2;e.y=e.target.y-700;e.vx = 0;e.vy = -5;
            let effect = new Particle(5, e.x+e.w-e.h, e.y);effect.w=e.h*2;effect.h=e.h*2;
            let temp=e.power;e.power=9999;e.addAction(40,40,function(){e.power=temp});
            return 501;},
        function(e){e.vx=e.getTargetDir()*30;return 600;}
    ]
},
{
    name: "심연의흑염룡",
    image: {name:"wyvern",w:80,h:80,frame:16,MAX_X:[4,1]},
    setStatus: function(e){e.w=300;e.h=300;e.life=10000000;e.power=4000;e.speed=5;e.inv_mass=0.1;e.ga=0;},
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI2(4);return 50;},
        function(e){if(!e.canTarget())return 70;let m=e.createMatterToTarget(0,e.getTargetDir()*1.3,0,10);m.power=2000;m.w=60;m.h=60;m.inv_mass=1;return 111;},
        function(e){
            for(let i=0; i<10; i++){
                (e.createMatter(0,(e.isRight?1:-1)*(2+i*0.4),-2-i*0.5,0,-30)).life=10;
                (e.createMatter(0,(e.isRight?1:-1)*(2+i*0.4),-1.5-i*0.5,0,-30)).life=10;
            }
            return 500;}
    ]
},
{
    name: "지옥불군주 미누크",
    image: { name: "crazymonkey2", w: 120, h: 200, frame: 8, MAX_X: [1, 1] },
    setStatus: function(e){ e.w=120;e.h=200;e.life=1000000;e.power=2000;e.speed=6;e.inv_mass=0.1},
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI(10);return 50;},
        function(e){if(e.canTarget())e.createMatterToTarget(2,e.getTargetDir()*2,0,10);return 200;}
    ]
}
];

class Monster extends Entity {
    typenum;
    animation;
    name;
    target=null;
    targets=[];
    attackEffect=function(){};
    attackFilter=function(){}
    attackTick=0; //몬스터가 공격하는 자세

    power=100;
    speed=1;
    
    coolTime=[0,0,0,0];

    totalDamage=0;
    canJump = true;
    isRight=false;
    isMoving=false;
    isFlying=false;
    

    mp=0;//쓰지는 않으나 플레이어와 연동을 위해 만듬

    constructor(typenum, x, y, ai=true, channelLevel = Game.PHYSICS_CHANNEL) {
        super(x, y, channelLevel);
        let type=MONSTERS[typenum];
        this.typenum=typenum;
        this.name=type.name;
        type.setStatus(this);
        this.attackEffect=type.attackEffect;
        this.attackFilter=function(e){return (e==this.target || e instanceof Block)}
        //AI
        if(ai){
            this.target = Game.p;
            for(let i=type.skillList.length-1; i>=0;i--){
                this.addSkill(200,type.skillList[i]);
            }
        }
        //image
        let temp = this;
        this.animation=new Animation("resource/monster/" + type.image.name + ".png",type.image.w,type.image.h,type.image.MAX_X,function(){
            if(temp.attackTick>0){
                temp.attackTick--;
                return 1;
            }
            else return 0;
        });
        this.animation.fps=type.image.frame;
    }

    update() {
        if (this.canDraw) this.draw();
        if (this.canAct) this.act();
        if (this.canInteract) this.interact();
        if(this.canMove){
            this.move();
            if (this.isMoving) {
                if (this.isRight && this.vx <= this.speed) this.vx++;
                else if (!this.isRight && this.vx >= -this.speed) this.vx--;
            }
        }
        if (this.totalDamage > 0) {
            let damageText = new Text(this.x + this.w / 2, this.y - 50,Math.floor(this.totalDamage),30,"orange","black",40);
            damageText.vy=1;
            this.life-=Math.floor(this.totalDamage);
            this.totalDamage=0;
        }
    }

    draw() {
        this.animation.draw(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h),this.isRight);
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "bold 15px Arial";
        ctx.fillStyle = "black"
        Camera.fillText("hp:"+(Math.floor(this.life)), this.x+this.w/2, this.y - 20);
        
    }

    collisionHandler(e,ct) {
        if (ct=='D') this.canJump = true;
        //공격
        if(this.attackFilter(e)){
            if(this.target==null)this.target=e;
            e.giveDamage((1 - Math.random()*2)*this.power/10+this.power);
            this.attackTick = this.animation.fps*this.animation.MAX_X[1];
            if (e.x + e.w / 2 > this.x + this.w / 2) {
                e.giveForce((e instanceof Player?-e.vx:0)+Math.sqrt(this.power)/5/e.inv_mass,0.3);
            } else {
                e.giveForce((e instanceof Player?-e.vx:0)-Math.sqrt(this.power)/5/e.inv_mass,0.3);
            }
        }
        // if(e instanceof Matter){
        //     e.giveForce((e.x + e.w / 2 > this.x + this.w / 2?1:-1)*Math.sqrt(this.power)/5/e.inv_mass,0.3);
        // }
    }

    removeHandler() {
        Level.stageMonsterCount--;
        if (Level.stageMonsterCount == 0) Level.clearLevel();
        for(let i=this.w/10; i>=0; i--){
            for(let j=this.h/10; j>=0; j--){
                let e = new Particle(1, this.x + i * 10, this.y + j * 10);
                e.ga = 0;
                e.vx *= 2;
                e.vy *= 2;
            }
        }
        Camera.vibrate(50);
    }

    giveDamage(d) {
        if(this.defense<d){
            this.totalDamage += d;
            Camera.vibrate((d<8000 ? d/400 : 20)+1);
        }
    }
    castSkill(num){
        //num 0:q 1:w 2:e 3:r
        if(MONSTERS[this.typenum].skillList.length>num&&this.coolTime[num]<Game.time){
            this.coolTime[num]=MONSTERS[this.typenum].skillList[num](this)+Game.time;
        }
    }

    addSkill(time,f){ 
        let temp=this;
        this.addAction(time,time,function(){temp.addSkill(f(temp),f)});
    }
    //편의기능
    canTarget(){return (this.target!=null&&this.target.canDraw&&this.target.life>0)}
    searchTarget(){
        let c=Game.channel[Game.PHYSICS_CHANNEL]
        let targetPriority=3; //타겟 우선순위
        for(let i=c.length-1; i>=0; i--){
            if(c[i] instanceof Player){
                this.target=c[i];targetPriority=0;break;
            }
        }
    }
    getTargetDir(){
        if(this.canTarget())return (this.x+this.w/2 < this.target.x+this.target.w/2 ? 1 : -1);
        else return (Math.random()-0.5>0 ? 1 : -1);
        
    }
    front(n=1){return (this.isRight?n:-n)}
    createMatterToTarget(type,xDir,yDir,power){
        let matter_x = this.x+this.w/2+(this.w/2+15)*xDir-15;
        let matter_y = this.y+this.h/2+(this.h/2+15)*yDir-15;
        let matter_vx = (this.target.x-matter_x);
        let matter_vy = -(this.target.y-matter_y);
        let vector_length = Math.sqrt(matter_vx**2+matter_vy**2);
        return  new Matter(type, matter_x, matter_y, matter_vx*power/vector_length, matter_vy*power/vector_length+1);
    }
    createMatter(type,xDir,yDir,vx,vy){
        let matter_x = this.x+this.w/2+(this.w/2+15)*xDir-15;
        let matter_y = this.y+this.h/2+(this.h/2+15)*yDir-15;
        return  new Matter(type, matter_x, matter_y,vx,vy);
    }
    //MONSTER MOVING
    jump(){
        if (this.canJump) {
            this.canJump = false;
            this.vy = this.speed - 0.5;
        }
    }
    AI(noise = 0) { //걸어 댕기는 놈
        this.isRight=(this.getTargetDir()>0);
        if(Math.abs(this.vx)<this.speed)this.vx += (this.speed+(1 - Math.random()*2)*noise)*(this.isRight ? 1 : -1);
        this.jump();
    }
    AI2(noise = 0) {// 날아 댕기는 놈
        this.isRight=(this.getTargetDir()>0);
        this.vx=this.speed*(this.isRight ? 1 : -1);
        this.vy=this.speed*(this.y<this.target.y ? -1 : 1);
        this.giveForce((1 - Math.random()*2)*noise, (1 - Math.random()*2)*noise);
    }
}