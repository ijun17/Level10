class Block extends GameUnit{
    color;
    lifeModule;
    constructor(pos, size, color="black"){
        super(new UnitBody(pos, size));
        this.physics=new UnitPhysics();
        this.physics.inv_mass=100/(size[0]*size[1]+1);
        this.physics.setCOF(1);
        

        this.lifeModule=new GameUnitLifeModule(size[0]*size[1]*10,100,10);
        this.lifeModule.ondie=function(){this.setState(0);}.bind(this);

        this.color=color;
        
    }
    update(){
        this.lifeModule.update();
    }
    draw(r){
        r.fillRect(this.color,this.body);
    }

}