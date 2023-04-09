class MapBlock extends GameUnit{
    color;
    constructor(pos, size, color="black"){
        super(new UnitBody(pos, size));
        this.physics=new UnitPhysics();
        
        this.body.fixedPos=true;
        this.body.fixedVel=true;
        this.physics.fixedForce=true;
        this.physics.fixedGravity=true;
        this.physics.inv_mass=0;

        this.color=color;

        this.body.limitPos=function(){}
    }
    draw(r){
        r.fillRect(this.color,this.body);
    }
}