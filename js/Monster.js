class Monster extends Entity{
    static dir="resource/monster/";
    static types=[{name:"crazymushroom",w:30,h:30,life:300,damage:100},{name:"crazyclam",w:100,h:100,life:1000,damage:500}];

    type;
    target;

    constructor(typenum,x,y){
        super(x,y);
        this.type=Monster.types[typenum];
        this.w=this.type.w;
        this.h=this.type.h;
        this.life=this.type.life;
        this.img.src = Monster.dir+this.type.name+".png";
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y);
        ctx.font="20px";
        ctx.strokeText("hp: "+this.life,this.x,this.y-20);
    }

    // collisionHandler(e, a){
    //     if(a&&e instanceof Player){
    //         e.life-=this.type.damage;
    //     }
    // }
}