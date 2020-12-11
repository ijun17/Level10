class Monster extends Entity {
    static dir = "resource/monster/";
    static types = [{ name: "crazymushroom", w: 30, h: 30, life: 10000, damage: 20, speed: 3 },
    { name: "crazyclam", w: 100, h: 100, life: 10000, damage: 10, speed: 2 },
    { name: "오세안", w: 142, h: 297, life: 20000, damage: 40, speed: 2 },
    { name: "crazymonkey", w: 125, h: 200, life: 50000, damage: 60, speed: 4 },
    { name: "hellfly", w:30, h:30, life:15000,damage:150, speed:5},
    { name: "strongsword", w:100, h:100,life:10000,damage:5000,speed:0},
    { name: "madfish", w:600, h:300, life:1000000, damage:2000,speed:1}];
    

    type;
    target;
    canJump = true;

    constructor(typenum, x, y) {
        super(x, y);
        this.type = Monster.types[typenum];
        this.w = this.type.w;
        this.h = this.type.h;
        this.life = this.type.life;
        this.img.src = Monster.dir + this.type.name + ".png";
        this.target = Game.p;
        var temp = this;
        switch(typenum){
            case 0:
                this.addAction(100, 100, function () { temp.AI(); });
                this.addAction(100, 100, function () { temp.skill3(); });
                break;
            case 2:
                this.addAction(100, 100, function () { temp.AI(); });
                this.addAction(100, 100, function () { temp.skill(500); });
                this.addAction(999, 999, function () { temp.skill2(); });
                break;
            case 3:
                this.addAction(100, 100, function () { temp.AI(); });
                this.addAction(100, 100, function () { temp.skill(500); });
                this.addAction(999, 999, function () { temp.skill2(); });
                break;
            case 4:
                this.ga=0;
                this.addAction(100, 100, function () { temp.AI2(); });
                break;
            case 5:
                //this.addAction(100, 100, function () { temp.skill(500, 10); });
                break;
            case 6:
                this.ga=0;
                this.canMove=false;
                this.addAction(300, 300, function () { temp.skill6(300); });
                this.addAction(150, 150, function () { temp.skill4(50); });
                break;
            default:
                break;
        }
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.w,this.h);
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "black"
        ctx.fillText("hp: " + (Math.floor(this.life)), this.x, this.y - 20);
    }

    collisionHandler(e) {
        if (this.y + this.h <= e.y) this.canJump = true;
        //공격
        if (!(e instanceof Monster || e instanceof MapBlock)) {
            e.damage(this.type.damage, "red");
            if (e==this.target) {
                if (e.x + e.w / 2 > this.x + this.w / 2) e.vx = Math.sqrt(this.type.damage) / 2;
                else e.vx = -(Math.sqrt(this.type.damage)) / 2;
                e.vy = 2;
            }
            if(e instanceof Block)e.life -= this.type.damage*10;

            if (this.type.name == "crazymonkey") {
                this.img.src = Monster.dir + this.type.name + "_attack.png";
                let m = this;
                this.addAction(10, 10, function () { m.img.src = Monster.dir + m.type.name + ".png"; });
            }
        }
    }

    removeHandler() {
        Level.stageMonsterCount--;
        if (Level.stageMonsterCount == 0) Level.clearLevel();
    }

    AI(time=50) {
        var tx = this.target.x;
        var ty = this.target.y;
        if (this.x < tx) this.vx = this.type.speed;
        else this.vx = -this.type.speed;
        if (this.canJump) {
            this.canJump = false;
            this.vy = this.type.speed - 0.5;
        }
        var temp = this;
        this.addAction(time, time, function () { temp.AI(time); });
    }

    AI2(time=10, randomNum=10){
        var tx = this.target.x;
        var ty = this.target.y;
        if (this.x < tx) this.vx = this.type.speed;
        else this.vx = -this.type.speed;
        if (this.y < ty) this.vy = -this.type.speed;
        else this.vy = +this.type.speed;

        this.vx+=(1-Math.random()*2)*randomNum;
        this.vy+=(1-Math.random()*2)*randomNum;

        var temp = this;
        this.addAction(time, time, function () { temp.AI2(time, randomNum); });
    }

    skill(time=1000,speed=6) {
        this.x = this.target.x + this.target.w / 2 - this.w / 2;
        this.y = 0;
        this.vx = 0;
        this.vy = -speed;
        var temp = this;
        this.addAction(time, time, function () { temp.skill(time,speed); });
    }

    skill2(time=200, speed=30) {
        var monster = this;
        var ice;
        var temp = -1;
        if (this.x + this.w / 2 < this.target.x + this.target.w / 2) temp = 1;
        ice = new Matter(2, monster.x + monster.w / 2 + (monster.w + 80) / 2 * temp, monster.y + monster.h / 2, 0, 0);
        ice.vx = (this.target.x - ice.x) / speed;
        ice.vy = -(this.target.y - ice.y) / speed;

        this.addAction(time, time, function () { monster.skill2(time,speed); });
    }

    skill3(time=100, duration=50) {
        var monster = this;
        this.addAction(1, 1, function () { monster.visibility = false; });
        this.addAction(duration, duration, function () { monster.visibility = true; });
        this.addAction(time, time, function () { monster.skill3(); });

    }

    skill4(time=50, speed=30) {
        var monster = this;
        var ice;
        var temp = -1;
        if (this.x + this.w / 2 < this.target.x + this.target.w / 2) temp = 1;
        ice = new Matter(5, monster.x + monster.w / 2 + (monster.w + 100) / 2 * temp, monster.y/ 2, 0,0);
        ice.vx = (this.target.x - ice.x)/speed;
        ice.vy = -(this.target.y - ice.y)/speed;
        //ice.life=10;
        //new Matter(5, monster.x + monster.w / 2 + (monster.w + 100) / 2 * temp, monster.y/ 2, 0,0);

        this.addAction(time, time, function () { monster.skill4(time,speed); });
    }

    skill5(time=200, speed=10) {
        var monster = this;
        var ice;
        ice = new Matter(2, this.target.x, -200, 0,-speed);
        ice.w=100;
        ice.h=100;
        ice.life=3;
        this.addAction(time, time, function () { monster.skill5(time,speed); });
    }
    skill6(time=200, speed=10) {
        var monster = this;
        let ice;
        var temp = -1;
        if (this.x + this.w / 2 < this.target.x + this.target.w / 2) temp = 1;
        for(let i=0;i<15; i++){
            ice = new Matter(2,monster.x + monster.w/2 + temp*400 -15 +temp*i*70,-100-i*70,0,-20);
            ice.w=60;
            ice.h=60;
        }
        this.addAction(time, time, function () { monster.skill6(time,speed); });
    }
}