class Monster extends Entity{
    static dir="resource/monster/";
    static types=[{name:"crazymushroom",w:30,h:30,life:5000,damage:10},{name:"crazyclam",w:100,h:100,life:10000,damage:10}];

    type;
    target;
    canJump=true;
    //speed=50;

    constructor(typenum,x,y){
        super(x,y);
        this.type=Monster.types[typenum];
        this.w=this.type.w;
        this.h=this.type.h;
        this.life=this.type.life;
        this.img.src = Monster.dir+this.type.name+".png";
        this.target=p;
        var temp = this;

        this.addAction(100-time%10,100-time%10,function(){temp.AI();});
        //this.AI();
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y);
        ctx.font="20px";
        ctx.strokeText("hp: "+this.life,this.x,this.y-20);
    }

    collisionHandler(e,ct,isActor){
        if(isActor&&this.y+this.h<=e.y)this.canJump=true;
        //공격
        if(!(e instanceof Monster)&&e.canMove&&time%10==0){
            e.life-=this.type.damage;
            if(!(e instanceof Block)){
                e.vx=this.type.damage/10*(this.vx);
                e.vy=1;
            }
            
        }
    }

    AI(){
        var tx = this.target.x;
        var ty = this.target.y;
        if(this.x<tx)this.vx = 2;
        else this.vx = -2;
        if(this.canJump){
            this.canJump=false;
            this.vy=1;
        }
        var temp = this;
        this.addAction(50,50,function(){temp.AI();});
    }
}