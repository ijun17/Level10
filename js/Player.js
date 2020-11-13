class Player extends Entity{
    lv=1;
    hp=20;
    mp=40;
    skill=new Array();

    isRight=true;

    constructor(x,y){
        super(x,y,`resource/player_right.png`);
        this.w=20;
        this.h=20;
    }



    collisionHandler(type, entity){
        if(type=="entity"){
            if(this.x+this.w<=entity.x){ //left collision
                this.vx=0;
                this.x=entity.x-this.w;
            }else if(this.x>=entity.x+entity.w){ //right collision
                this.vx=0;
                this.x=entity.x+entity.w;
            }else if(this.y+this.h<=entity.y){ //bottom collision
                this.vy=0;
                this.y=entity.y-this.h;
            }else if(this.y>=entity.y+entity.h){ //top collision
                this.vy=0;
                this.y=entity.y+entity.h;
            }
            
        }
        
    }
}