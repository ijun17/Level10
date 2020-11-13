class Player extends Entity{
    lv=1;
    hp=20;
    mp=40;
    skill=new Array();
    
    isRight=true;

    constructor(x,y){
        super(x,y,`resource/player_right.png`);
    }


    collisionHandler(type, entity){
        if(type=="entity"){
            console.log("Player : entity collision");
            super.vx=0;
            super.vy=0;
        }
        
    }
}