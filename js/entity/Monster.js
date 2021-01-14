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
    name: "crazymushroom",
    draw: { imageW: 60, imageH: 60, frame: 8, animation_MAX_X: [3, 1] },
    status: { w: 60, h: 60, life: 10000, damage: 200, speed: 3, inv_mass:1 },
    skillList: [function(e){}],
    attack: {}
},
{
    name: "crazymonkey",
    draw: { imageW: 120, imageH: 200, frame: 8, animation_MAX_X: [1, 1] },
    status: { w: 120, h: 200, life: 50000, damage: 900, speed: 5, inv_mass:0.5 },
    skillList: [],
    attack: {}
},
{
    name: "hellfly",
    draw: {imageW:30,imageH:30,frame:8,animaion_MAX_X:[1,1]},
    status: {w: 30, h: 30, life: 20000, damage: 500, speed: 5, inv_mass:2},
    skillList: [],
    attack: {}
}
];



const monsterTypes=[{ name: "crazymushroom", w: 60, h: 60, life: 10000, damage: 200, speed: 3, inv_mass:1 },
    { name: "crazymonkey", w: 120, h: 200, life: 50000, damage: 900, speed: 5, inv_mass:0.5 },
    { name: "hellfly", w: 30, h: 30, life: 20000, damage: 500, speed: 5, inv_mass:2 },
    { name: "madfish", w: 200, h: 100, life: 2000000, damage: 2000, speed: 1, inv_mass:0.1 },
    { name: "golem", w: 128, h: 128, life: 10000000, damage: 4000, speed: 3, inv_mass:0.01 },
    { name: "wyvern", w: 80, h: 80, life: 10000000, damage: 4000, speed: 3, inv_mass:0.1 }];

class Monster extends Entity {
    type;
    animation;
    target;

    //draw
    totalDamage=0;
    canJump = true;
    isRight=true;
    attackTick=0;

    constructor(typenum, x, y, channelLevel = Game.PHYSICS_CHANNEL) {
        super(x, y, channelLevel);
        this.type = monsterTypes[typenum];
        this.w = this.type.w;
        this.h = this.type.h;
        this.life = this.type.life;
        this.inv_mass=this.type.inv_mass;
        this.target = Game.p;

        let temp = this;
        let animation_MAX_X;        
        switch (this.type.name) {
            case "crazymushroom":

                this.addAction(100, 100, function () { temp.AI(); });
                this.addAction(100, 100, function () { temp.skill3(); });
                animation_MAX_X=[3,1];
                break;
            case "crazymonkey":
                this.addAction(100, 100, function () { temp.AI(); });
                this.addAction(999, 999, function () { temp.skill2(); });
                animation_MAX_X=[1,1];
                break;
            case "hellfly":
                this.ga = 0;
                this.addAction(100, 100, function () { temp.AI2(); });
                animation_MAX_X=[1,1];
                break;
            case "madfish":
                this.ga = 0;
                this.canMove = false;
                this.w=600;
                this.h=300;
                this.addAction(300, 300, function () { temp.skill6(300); });
                this.addAction(150, 150, function () { temp.skill4(50); });
                animation_MAX_X=[1,1];
                break;
            case "golem":
                this.ga=-1;
                this.w=200;
                this.h=200;
                this.addAction(300,300, function(){temp.AI(50,4);})
                this.addAction(300, 300, function () { temp.skill(500); });
                animation_MAX_X=[4,1];
                break;
            case "wyvern":
                this.ga=0;
                this.w=300;
                this.h=300;
                this.addSkill(300,function(e){let m=temp.createMatterToTarget(0,e.getTargetDir()*1.3,0,20);m.type.damage=2000;m.w=60;m.h=60;return 111;});
                this.addSkill(300,function(e){e.vx=e.getTargetDir()*40;return 500;})
                this.addAction(300,300, function(){temp.AI2(50,4);})
                this.addAction(300, 300, function () { temp.skill(500); });
                animation_MAX_X=[4,4];
                break;
            default:
                break;
        }
        this.animation=new Animation("resource/monster/" + temp.type.name + ".png",monsterTypes[typenum].w,monsterTypes[typenum].h,animation_MAX_X,function(){
            if(temp.attackTick>0){
                temp.attackTick--;
                return 1;
            }
            else return 0;
        })
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
            e.damage(this.type.damage);
            this.attackTick=10;
            if (e.x + e.w / 2 > this.x + this.w / 2) e.giveForce(Math.sqrt(this.type.damage)/10,0.5);
            else e.giveForce(-(Math.sqrt(this.type.damage))/10,0.5);
        }
    }

    removeHandler() {
        Level.stageMonsterCount--;
        if (Level.stageMonsterCount == 0) Level.clearLevel();
    }

    damage(d) {
        d=Math.floor(d);
        this.totalDamage += d;
    }

    addSkill(time,f){ //f = f(e){}
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

    AI(time = 50, jumpSpeed) {
        this.vx = this.type.speed*this.getTargetDir();
        this.isRight=(this.getTargetDir()>0);
        if (this.canJump) {
            this.canJump = false;
            this.vy = this.type.speed - 0.5;
        }
        var temp = this;
        this.addAction(time, time, function () { temp.AI(time); });
    }

    AI2(time = 10, randomNum = 10) {
        var tx = this.target.x;
        var ty = this.target.y;
        this.isRight = (this.x < tx);
        if (this.isRight) this.vx = this.type.speed;
        else this.vx = -this.type.speed;
        if (this.y < ty) this.vy = -this.type.speed;
        else this.vy = +this.type.speed;

        this.vx += (1 - Math.random() * 2) * randomNum;
        this.vy += (1 - Math.random() * 2) * randomNum;

        var temp = this;
        this.addAction(time, time, function () { temp.AI2(time, randomNum); });
    }

    skill(time = 1000, speed = 10) {
        this.x = this.target.x + this.target.w / 2 - this.w / 2;
        this.y = this.target.y -600;
        this.vx = 0;
        this.vy = -speed;
        var temp = this;
        this.addAction(time, time, function () { temp.skill(time, speed); });
    }

    skill2(time = 200, speed = 30) {
        var monster = this;
        this.createMatterToTarget(2,this.getTargetDir()*2,0,10);
        this.addAction(time, time, function () { monster.skill2(time, speed); });
    }

    skill3(time = 100, duration = 50) {
        var monster = this;
        this.addAction(1, 1, function () { monster.visibility = false; });
        this.addAction(duration, duration, function () { monster.visibility = true; });
        this.addAction(time, time, function () { monster.skill3(); });

    }

    skill4(time = 50, speed = 30) {
        var monster = this;
        this.createMatterToTarget(5,this.getTargetDir()*1.3,1,30);
        this.addAction(time, time, function () { monster.skill4(time, speed); });
    }

    skill5(time = 200, speed = 10) {
        var monster = this;
        var ice;
        ice = new Matter(2, this.target.x, -200, 0, -speed);
        ice.w = 100;
        ice.h = 100;
        ice.life = 3;
        this.addAction(time, time, function () { monster.skill5(time, speed); });
    }
    skill6(time = 200, speed = 10) {
        var monster = this;
        let ice;
        let temp = this.getTargetDir();
        for (let i = 0; i < 15; i++) {
            ice = new Matter(2, monster.x + monster.w / 2 + temp * 400 - 15 + temp * i * 120, -100 - i * 70, 0, -20);
            ice.w = 60;
            ice.h = 60;
            ice.type.damage=2000;
        }
        this.addAction(time, time, function () { monster.skill6(time, speed); });
    }
}