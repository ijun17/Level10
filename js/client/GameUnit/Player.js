class Player extends Actor{
    animation
    constructor(pos, level=1){
        super(pos, [30,60], 1, 4, 5, 10000*level, 100);

        this.body.overlap=true;

        this.animation = new UnitAnimation(IMAGES.player,30,60,[1,1],function(){
            if(this.moveModule.moveFlag[0])return 1;
            else return 0;
        }.bind(this));
    }
    draw(r){
        r.drawAnimation(this.animation,this.body,{reverseX:!this.moveModule.moveDirection[0]});
    }
    update(){
        super.update();
    }
}