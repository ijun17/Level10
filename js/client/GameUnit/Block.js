class Block extends GameUnit{
    color;
    lifeModule;
    constructor(pos, size, color="black"){
        super(new UnitBody(pos, size));
        this.physics=new UnitPhysics();
        this.physics.inv_mass=10/(size[0]*size[1]+1);
        this.physics.setCOF(0.5);
        this.physics.setCOR(0);
        

        this.lifeModule=new GameUnitLifeModule(size[0]*size[1],100,10);
        this.lifeModule.ondie=()=>{this.setState(0);}

        this.color=color;
        this.addEventListener("collision",function(e){
            const collAxis = e.collisionNormal[0]==0?1:0;
            const deltaVel = e.other.body.vel[collAxis] - this.body.vel[collAxis];
            // if (e.collisionNormal[collAxis] * deltaVel > 0) return;
            if(Math.abs(deltaVel)>30 && e.other.lifeModule){
                e.other.lifeModule.giveDamage(deltaVel*deltaVel);
            }
        })
    }
    update(){
        this.lifeModule.update();
        this.lifeModule.life--;
    }
    draw(r){
        r.fillRect(this.color,this.body);
    }

}