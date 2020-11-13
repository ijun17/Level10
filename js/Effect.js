class Effect extends Entity{
    //type : lighting fire ice
    animationCount=0;
    constructor(x,y,type){
        super(x,y,"resource/"+type+".png");
    }
    collisionHandler(type, entity){
        if(type=="entity")console.log("아야");
        this.removeEntity();
    }

}