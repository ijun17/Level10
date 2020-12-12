class Matter extends Entity {
    static types =
        [{ name: "fire", num:0, damage: 300 },
        { name: "lightning", num:1, damage: 100 },
        { name: "ice", num:2, damage: 50 },
        { name: "explosion", num:3, damage: 200 },
        { name: "arrow", num:4, damage: 10 },
        { name: "energy", num:5, damage: 1000}];
    //effect- -1:none 0:fire 1:Electric shock 2:freezing 3:invisioble
    static dir = "resource/effect/";

    type;

    constructor(typenum, x, y, vx = 0, vy = 0,channelLevel=Game.PHYSICS_CHANNEL) {
        super(x, y,channelLevel);
        this.type = {name:Matter.types[typenum].name, num:Matter.types[typenum].num, damage:Matter.types[typenum].damage,};
        this.vx = vx;
        this.vy = vy;
        this.w = 30;
        this.h = 30;
        this.ga = -0.02;
        this.img.src = Matter.dir + this.type.name + ".png";
        let matter = this;
        this.addAction(1, 10000, function () { if (Game.time % 10 == 0) { new Particle(2, matter.x, matter.y); new Particle(0, matter.x, matter.y); } });
    }


    draw() {
        var r = Math.atan2(this.vx, this.vy);
        ctx.save();
        ctx.translate(Camera.getX(this.x + this.w/2), Camera.getY(this.y + this.h/2));
        ctx.rotate(r);
        ctx.drawImage(this.img, -this.w/2, -this.h/2, this.w, this.h);
        ctx.restore();
    }

    damage(d, textColor=null){
        this.life--;
    }

    collisionHandler(e) {
        this.damage();
        e.damage(this.type.damage,"orange");//e.life -= this.type.damage;
        if (!(e instanceof Block)) {
            e.vx += this.vx;
            e.vy += this.vy+1;
        }

        switch(this.type.num){
            case 1://lightning
                e.vx=0;
                e.vy=0;
                break;
            case 2://ice
                e.addAction(1, 100, function () { e.vx = 0; e.vy = 0; ctx.fillStyle = "rgba(167, 220, 244, 0.5)"; ctx.fillRect(Camera.getX(e.x), Camera.getY(e.y), e.w, e.h); });
                break;
            case 4://arrow
                var damage = Math.floor(Math.abs(this.vx * this.vx * this.vx + this.vy * this.vy * this.vy))+1;
                e.damage(damage, "orange");
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
            default:
                break;

        }
    }
}