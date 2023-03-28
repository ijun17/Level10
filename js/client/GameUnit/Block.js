class Block extends GameUnit{
    color;
    lifeModule;
    constructor(pos, size, color="black"){
        super(new UnitBody(pos, size));
        this.physics=new UnitPhysics();
        this.physics.inv_mass=900/(size[0]*size[1]);

        this.lifeModule=new GameUnitLifeModule(size[0]*size[1],100);
        this.lifeModule.unitDieHandler=function(){this.state=0;}.bind(this);

        this.color=color;
    }
    draw(r){
        r.strokeRect(this.color,this.body);
    }
}