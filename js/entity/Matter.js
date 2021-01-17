const matterTypes=[{ type:function(){return {name: "fire", num:0, damage: 500}} },
        { type:function(){return {name: "lightning", num:1, damage: 500}} },
        { type:function(){return {name: "ice", num:2, damage: 50}} },
        { type:function(){return {name: "explosion", num:3, damage: 20}} },
        { type:function(){return {name: "arrow", num:4, damage: 10}} },
        { type:function(){return {name: "energy", num:5, damage: 1000}} },
        { type:function(){return {name: "sword", num:6, damage: 700}} }];

class Matter extends Entity {
    img = new Image; //엔티티의 이미지
    type;
    sound = new Audio();
    constructor(typenum, x, y, vx = 0, vy = 0,channelLevel=Game.PHYSICS_CHANNEL) {
        super(x, y,channelLevel);
        this.type = matterTypes[typenum].type();
        this.vx = vx;
        this.vy = vy;
        this.w = 30;
        this.h = 30;
        this.ga = -0.02;
        this.img.src = "resource/matter/" + this.type.name + ".png";
        let matter = this;

        this.sound.src="resource/sound/explosion.mp3";
        this.sound.volume=0.1;

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
        if(!e.canCollision)return;
        this.life--;
        e.damage(this.type.damage);
        e.giveForce(this.vx,this.vy+1);

        //effect
        
        switch(this.type.num){
            // case 0:
            //     //let size=30;
            //     let explosion = new Button(this.x,this.y,this.w,this.h,Game.PARTICLE_CHANNEL);
            //     let temp=Game.time;
            //     explosion.animation=new Animation("resource/particle/explosion.png",40,40,function(){
            //         return Math.floor(((Game.time-temp)%60)/10);
            //     })
            //     explosion.canRemoved=true;
            //     explosion.life=60;
            //     explosion.drawCode=function(){explosion.life--;explosion.animation.draw(Camera.getX(explosion.x), Camera.getY(explosion.y), Camera.getS(explosion.w), Camera.getS(explosion.h))}
            //     break;
            case 1://lightning
                e.vx=0;
                e.vy=0;
                break;
            case 2://ice
                var damage = Math.floor(this.getVectorLength())+1;
                e.damage(damage);
                e.addAction(1, 100, function () { 
                    e.vx = 0; e.vy = 0; 
                    ctx.fillStyle = "rgba(92, 150, 212,0.5)";
                    ctx.fillRect(Camera.getX(e.x), Camera.getY(e.y), Camera.getS(e.w), Camera.getS(e.h)); 
                    
                });
                break;
            case 3:
                e.damage(this.w);
                break;
            case 4://arrow
                var damage = Math.floor(Math.abs(this.vx * this.vx* this.vx) + Math.abs(this.vy * this.vy* this.vy))+1;
                e.damage(damage);
                break;
            case 5://energy
                if(e instanceof Matter&&e.type.num==5){
                    e.x=-10000;
                    this.life+=e.life+1;
                    e.life=0;
                    this.w+=e.w;
                    this.h+=e.h;
                    this.giveForce(e.vx, e.vy);
                    this.type.damage+=e.type.damage;
                }
                break;
            case 6:
                var damage = this.getVectorLength()*this.w;
                e.damage(damage);
                break;
            default:
                break;

        }
    }
}