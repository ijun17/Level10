class GameMap extends Entity{
    blocks; //block set in 2D array, oneblock is 30x30
    blockType=[];
    blockImage=[];


    constructor(){
        this.canMove=false;
    }


    collisionHandler(){
        //collision
        return false;
    }

    draw(){

    }

    getBlocksInRange(x,y,w,h){
        let bx,by,bw,bh;
        return [bx,by,bw,bh];
    }
}