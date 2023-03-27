class Matter extends GameUnit{
    power=0;
    constructor(pos,size,vel,power){
        super(new UnitBody(pos, size));
        this.body.setVel(vel);
        this.body.overlap=true;

        this.physics=new UnitPhysics();
        
        this.power=power;
    }
}