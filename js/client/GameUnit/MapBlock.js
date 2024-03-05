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
        this.physics.setCOF(0.5)

        this.color=color;

        this.body.limitPos=function(){}
        // 맵 블럭에 낙사 데미지 넣으면 몬스터 끼리 싸울 때 즉사 할 수 있음
        // this.addEventListener("collision",function(e){
        //     const collAxis = e.collisionNormal[0]==0?1:0;
        //     const diffVel = Math.abs(e.other.body.vel[collAxis] - this.body.vel[collAxis]);
        //     if(diffVel>30 && e.other.lifeModule){
        //         e.other.lifeModule.giveDamage(diffVel*diffVel*2);
        //     }
        // })
    }
    draw(r){
        r.fillRect(this.color,this.body);
    }
}