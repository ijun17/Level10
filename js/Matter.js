class Matter extends Entity{
    static types = 
    [{name:"fire",effect:0,damage:100},
    {name:"lightning",effect:1,damage:100}, 
    {name:"ice",effect:2,damage:50}, 
    {name:"explosion",effect:-1,damage:200},
    {name:"arrow",effect:-1,damage:10}];
    //effect- -1:none 0:fire 1:Electric shock 2:freezing 3:invisioble
    static dir="resource/effect/";

    animationCount=0;
    type;

    constructor(typenum,x,y,vx=0,vy=0){
        super(x,y);
        this.type = Matter.types[typenum];
        this.vx=vx;
        this.vy=vy;
        this.w=20;
        this.h=20;
        this.ga=0.02;
        this.img.src = Matter.dir+this.type.name+".png";
    }
    

    draw(){
        var r = Math.atan2(this.vx, this.vy);
        ctx.save();
	    ctx.translate(this.x+10, this.y+10);
	    ctx.rotate(r);
        ctx.drawImage(this.img, -10, -10);
        ctx.restore();
    }

    collisionHandler(e){
        this.life--;
        if(!(e instanceof MapBlock)){
            e.life -= this.type.damage;
            
            console.log(this.type.damage);
            if(this.type.name=="arrow"){
                var damage = (this.vx*this.vx+this.vy*this.vy)*5;
                e.life -= damage;
                console.log(damage);
            }
            if(!(e instanceof Block)){
                e.vx+=this.vx/10;
                e.vy+=this.vy/10+1;
            }
            if(this.type.effect==0){
                e.addAction(1,100,function(){e.life--;});
            }else if(this.type.effect==1){

            }else if(this.type.effect==2){
                e.addAction(1,1,function(){e.canMove=false;});
                e.addAction(300,300,function(){e.canMove=true;});
            }else if(this.type.effect==3){
                //var ei=entitys.indexOf(e);
                e.addAction(1,1,function(){e.visibility=false;});
                e.addAction(300,300,function(){e.visibility=true;});
            }  
        }
    }
}