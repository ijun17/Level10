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
    name: "미친버섯",
    image: { name: "crazymushroom",w: 60, h: 60, frame: 8, MAX_X: [3, 3] },
    setStatus: function(e){ e.w=60; e.h=60; e.life=10000; e.power=200; e.speed=3; e.inv_mass=1},
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI(2);return 50;}
    ]
},
{
    name: "심연의 망나니 Varrc-Minok",
    image: { name: "crazymonkey", w: 120, h: 200, frame: 8, MAX_X: [1, 1] },
    setStatus: function(e){ e.w=120;e.h=200;e.life=50000;e.power=500;e.speed=5;e.inv_mass=0.5},
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI(10);return 50;},
        function(e){e.createMatterToTarget(2,e.getTargetDir()*2,0,10);return 200;}
    ]
},
{
    name: "지옥파리",
    image: {name:"hellfly",w:30,h:30,frame:8,MAX_X:[1,1]},
    setStatus: function(e){e.w=30;e.h=30;e.life=20000;e.power=500;e.speed=5;e.inv_mass=2;e.ga=0;},
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI2(5);return 10;}
    ]
},
{
    name: "마법골렘",
    image: {name:"golem",w:128,h:128,frame:32,MAX_X:[4,1]},
    setStatus: function(e){e.w=200;e.h=200;e.life=10000000;e.power=4000;e.speed=3;e.inv_mass=0.01;e.ga=-1;},
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI();return 50;},
        function(e){e.x = e.target.x+e.target.w/2-e.w/2;e.y=e.target.y-600;e.vx = 0;e.vy = -10;return 500;}
    ]
},
{
    name: "심연의흑염룡",
    image: {name:"wyvern",w:80,h:80,frame:16,MAX_X:[4,1]},
    setStatus: function(e){e.w=300;e.h=300;e.life=10000000;e.power=4000;e.speed=3;e.inv_mass=0.1;e.ga=0;},
    attackEffect: function(e,v){},
    skillList: [
        function(e){e.AI2(4);return 50;},
        function(e){let m=e.createMatterToTarget(0,e.getTargetDir()*1.3,0,20);m.type.damage=2000;m.w=60;m.h=60;return 70;},
        function(e){e.x = e.target.x+e.target.w/2-e.w/2;e.y=e.target.y-600;e.vx = 0;e.vy = -10;return 500;}
    ]
}
];

class Monster extends Entity {
    animation;
    name;
    target;
    power;
    speed;
    attackEffect=function(){};

    //draw
    totalDamage=0;
    canJump = true;
    isRight=true;
    attackTick=0;

    constructor(type, x, y, channelLevel = Game.PHYSICS_CHANNEL) {
        super(x, y, channelLevel);
        this.name=type.name;
        type.setStatus(this);
        this.attackTick=type.attackEffect;
        this.target = Game.p;
        //skill set
        for(let i=type.skillList.length-1; i>=0;i--){
            this.addSkill(200,type.skillList[i]);
        }
        //image
        let temp = this;
        this.animation=new Animation("resource/monster/" + type.image.name + ".png",type.image.w,type.image.h,type.image.MAX_X,function(){
            if(temp.attackTick>0){
                temp.attackTick--;
                return 1;
            }
            else return 0;
        })
        this.animation.fps=type.image.frame;
    }

    draw() {
        this.animation.draw(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h),this.isRight);
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "black"
        ctx.fillText("hp: " + (Math.floor(this.life)), Camera.getX(this.x+this.w/2), Camera.getY(this.y - 20));
        if (this.totalDamage > 0) {
            new Text(this.x + this.w / 2, this.y - 50,this.totalDamage,30,"orange","black",40);
            this.life-=this.totalDamage;
            this.totalDamage=0;
        }
    }

    collisionHandler(e,ct) {
        if (ct=='D') this.canJump = true;
        //공격
        if(!(e instanceof Monster||e instanceof MapBlock)){
            e.damage((1 - Math.random()*2)*this.power/10+this.power);
            this.attackTick = 10;
            if (e.x + e.w / 2 > this.x + this.w / 2) {
                e.giveForce((e instanceof Player?-e.vx:0)+Math.sqrt(this.power) / 3,0.3);
            } else {
                e.giveForce((e instanceof Player?-e.vx:0)-Math.sqrt(this.power) / 3,0.3);
            }
        }
    }

    removeHandler() {
        Level.stageMonsterCount--;
        if (Level.stageMonsterCount == 0) Level.clearLevel();
    }

    damage(d) {
        d=Math.floor(d);
        this.totalDamage += d;
        Camera.vibrate(2);
    }

    addSkill(time,f){ 
        let temp=this;
        this.addAction(time,time,function(){let cooltime = f(temp);temp.addSkill(cooltime,f)});
    }
    getTargetDir(){return (this.x+this.w/2 < this.target.x+this.target.w/2 ? 1 : -1)}
    createMatterToTarget(type,xDir,yDir,power){
        let matter_x = this.x+this.w/2+(this.w/2+15)*xDir-15;
        let matter_y = this.y+this.h/2+(this.h/2+15)*yDir-15;
        let matter_vx = (this.target.x-matter_x);
        let matter_vy = -(this.target.y-matter_y);
        let vector_length = Math.sqrt(matter_vx**2+matter_vy**2);
        return  new Matter(type, matter_x, matter_y, matter_vx*power/vector_length, matter_vy*power/vector_length);
    }
    createMatter(type,xDir,yDir,vx,vy){
        let matter_x = this.x+this.w/2+(this.w/2+15)*xDir-15;
        let matter_y = this.y+this.h/2+(this.h/2+15)*yDir-15;
        return  new Matter(type, matter_x, matter_y,vx,vy);
    }

    AI(noise = 0) { //걸어 댕기는 놈
        this.isRight=(this.getTargetDir()>0);
        this.vx = this.speed*(this.isRight ? 1 : -1)+(1 - Math.random()*2)*noise;
        if (this.canJump) {
            this.canJump = false;
            this.vy = this.speed - 0.5;
        }
    }
    AI2(noise = 0) {// 날아 댕기는 놈
        this.isRight=(this.getTargetDir()>0);
        this.vx=this.speed*(this.isRight ? 1 : -1);
        this.vy=this.speed*(this.y<this.target.y ? -1 : 1);
        this.giveForce((1 - Math.random()*2)*noise, (1 - Math.random()*2)*noise);
    }
}