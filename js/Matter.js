let matterTypes=[{ name: "fire", num:0, damage: 300},
        { name: "lightning", num:1, damage: 500 },
        { name: "ice", num:2, damage: 50 },
        { name: "explosion", num:3, damage: 200 },
        { name: "arrow", num:4, damage: 10 },
        { name: "energy", num:5, damage: 400},
        { name: "sword", num:6, damage: 700}];

class Matter extends Entity {
    type;
    constructor(typenum, x, y, vx = 0, vy = 0,channelLevel=Game.PHYSICS_CHANNEL) {
        super(x, y,channelLevel);
        this.type = {name:matterTypes[typenum].name, num:matterTypes[typenum].num, damage:matterTypes[typenum].damage,};
        this.vx = vx;
        this.vy = vy;
        this.w = 30;
        this.h = 30;
        this.ga = -0.02;
        this.img.src = "resource/effect/" + this.type.name + ".png";
        let matter = this;
        if(typenum==0)this.addAction(1, 10000, function () { 
            if (Game.time % 10 == 0) { new Particle(2, matter.x, matter.y); new Particle(0, matter.x, matter.y); } });
        if(typenum==6){
            this.w*=Math.sqrt(this.vx*this.vx+ this.vy*this.vy)/5;
            this.h=this.w;
        }
    }


    draw() {
        var r = Math.atan2(this.vx, this.vy);
        ctx.save();
        ctx.translate(Camera.getX(this.x + this.w/2), Camera.getY(this.y + this.h/2));
        ctx.rotate(r);
        ctx.drawImage(this.img, Camera.getS(-this.w/2), Camera.getS(-this.h/2), Camera.getS(this.w), Camera.getS(this.h));
        ctx.restore();
    }

    damage(){
        this.life--;
    }

    collisionHandler(e) {
        this.life--;
        e.damage(this.type.damage*this.w/30);
        e.giveForce(this.vx,this.vy+1);

        switch(this.type.num){
            case 1://lightning
                e.vx=0;
                e.vy=0;
                break;
            case 2://ice
                var damage = Math.floor(Math.sqrt(this.vx * this.vx + this.vy * this.vy))+1;
                e.damage(damage);
                e.addAction(1, 100, function () { 
                e.vx = 0; e.vy = 0; ctx.fillStyle = "rgba(167, 220, 244, 0.5)"; 
                ctx.fillRect(Camera.getX(e.x), Camera.getY(e.y), Camera.getS(e.w), Camera.getS(e.h)); });
                break;
            case 4://arrow
                var damage = Math.floor(Math.abs(this.vx * this.vx * this.vx + this.vy * this.vy * this.vy))+1;
                e.damage(damage);
                break;
            case 5://energy
                if(e instanceof Matter&&e.type.num==5){
                    e.life=0;
                    e.x=-10000;
                    this.life++;
                    this.w+=e.w;
                    this.h+=e.h;
                    this.vx+=e.vx;
                    this.vy+=e.vy;
                    this.type.damage+=e.type.damage;
                }
                break;
            case 6:
                var damage = Math.sqrt(this.vx * this.vx + this.vy * this.vy)+1;
                e.damage(damage);
                break;
            default:
                break;

        }
    }
}