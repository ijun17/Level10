const monsterTypes=[{ name: "crazymushroom", w: 30, h: 30, life: 10000, damage: 200, speed: 3 },
    { name: "crazymonkey", w: 120, h: 200, life: 50000, damage: 500, speed: 4 },
    { name: "hellfly", w: 30, h: 30, life: 20000, damage: 200, speed: 5 },
    { name: "madfish", w: 200, h: 100, life: 2000000, damage: 2000, speed: 1 }];

class Monster extends Entity {
    type;
    animation;
    target;

    totalDamage=0;
    canJump = true;
    isRight=true;
    attackTick=0; //Animation에서 얼마나 공격 이미지를 유지 하는가
    //moveFlag=false;

    constructor(typenum, x, y, channelLevel = Game.PHYSICS_CHANNEL) {
        super(x, y, channelLevel);
        this.type = monsterTypes[typenum];
        this.w = this.type.w;
        this.h = this.type.h;
        this.life = this.type.life;
        this.target = Game.p;

        let temp = this;
        this.animation=new Animation("resource/monster/" + temp.type.name + ".png",this.w,this.h,function(){
            if(temp.attackTick>0){
                temp.attackTick--;
                return 1;
            }
            else return 0;
        })

        
        switch (this.type.name) {
            case "crazymushroom":
                this.addAction(100, 100, function () { temp.AI(); });
                this.addAction(100, 100, function () { temp.skill3(); });
                break;
            case "crazymonkey":
                this.addAction(100, 100, function () { temp.AI(); });
                this.addAction(100, 100, function () { temp.skill(500); });
                this.addAction(999, 999, function () { temp.skill2(); });
                break;
            case "hellfly":
                this.ga = 0;
                this.addAction(100, 100, function () { temp.AI2(); });
                break;
            case "madfish":
                this.ga = 0;
                this.canMove = false;
                this.w=600;
                this.h=300;
                this.addAction(300, 300, function () { temp.skill6(300); });
                this.addAction(150, 150, function () { temp.skill4(50); });
                break;
            default:
                break;
        }
    }

    draw() {
        this.animation.draw(Camera.getX(this.x), Camera.getY(this.y), Camera.getS(this.w), Camera.getS(this.h),this.isRight);
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "black"
        ctx.fillText("hp: " + (Math.floor(this.life)), Camera.getX(this.x), Camera.getY(this.y - 20));
        if (this.totalDamage > 0) {
            new Text(this.x + this.w / 2, this.y - 50,this.totalDamage,30,"orange","black",40);
            this.life-=this.totalDamage;
            this.totalDamage=0;
        }
    }

    collisionHandler(e,ct) {
        if (ct=='D') this.canJump = true;
        //공격
        if(!(e instanceof Monster))e.damage(this.type.damage);
        if (e == this.target) {
            this.attackTick=10;
            if (e.x + e.w / 2 > this.x + this.w / 2) e.giveForce(Math.sqrt(this.type.damage)/3,2);
            else e.giveForce(-(Math.sqrt(this.type.damage))/3,2);
        }
    }

    removeHandler() {
        Level.stageMonsterCount--;
        if (Level.stageMonsterCount == 0) Level.clearLevel();
    }

    damage(d, textColor = null) {
        d=Math.floor(d);
        this.totalDamage += d;
    }

    AI(time = 50) {
        var tx = this.target.x;
        var ty = this.target.y;
        if (this.x < tx) {
            this.isRight=true;
            this.vx = this.type.speed;
        }else {
            this.isRight=false;
            this.vx = -this.type.speed;
        }
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
        if (this.x < tx) this.vx = this.type.speed;
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
        var ice;
        var temp = -1;
        if (this.x + this.w / 2 < this.target.x + this.target.w / 2) temp = 1;
        ice = new Matter(2, monster.x + monster.w / 2 + (monster.w + 80) / 2 * temp, monster.y + monster.h / 2, 0, 0);
        ice.vx = (this.target.x - ice.x) / speed;
        ice.vy = -(this.target.y - ice.y) / speed;

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
        var ice;
        var temp = -1;
        if (this.x + this.w / 2 < this.target.x + this.target.w / 2) temp = 1;
        ice = new Matter(5, monster.x + monster.w / 2 + (monster.w + 150) / 2 * temp, monster.y , 0, 0);
        ice.vx = (this.target.x - ice.x) / speed;
        ice.vy = -(this.target.y - ice.y) / speed;
        ice.life = 1;
        //new Matter(5, monster.x + monster.w / 2 + (monster.w + 200) / 2 * temp, monster.y/ 2, 0,0);

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
        var temp = -1;
        if (this.x + this.w / 2 < this.target.x + this.target.w / 2) temp = 1;
        for (let i = 0; i < 15; i++) {
            ice = new Matter(2, monster.x + monster.w / 2 + temp * 400 - 15 + temp * i * 120, -100 - i * 70, 0, -20);
            ice.w = 60;
            ice.h = 60;
            ice.type.damage=2000;
        }
        this.addAction(time, time, function () { monster.skill6(time, speed); });
    }
}