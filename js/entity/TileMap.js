//this class under test

class TileMap extends Entity{
    tiles; //block set in 2D array, oneblock is 30x30
    tileType=[];
    tileDraw=[
        function(x,y,s){this.mapctx.fillStyle="black"; this.mapctx.fillRect(x,y,s,s)}.bind(this)
    ]; 
    TILE_SIZE=30
    INV_TILE_SIZE=0.0333;
    renderedMap;
    mapctx;

    xLength;
    yLength;

    constructor(x,y,xLength=12,yLength=1,tiles=["000000000000"]){
        super(x,y,Game.PHYSICS_CHANNEL);
        this.w=0;
        this.h=0;
        this.xLength=xLength;
        this.yLength=yLength;
        this.canMove=false;
        this.tiles=tiles;
        this.renderedMap=document.createElement('canvas');
        this.mapctx=this.renderedMap.getContext('2d')
        this.renderedMap.width=this.TILE_SIZE*xLength;
        this.renderedMap.height=this.TILE_SIZE*yLength;
        this.renderMap();
    }

    update(){
        this.draw();
    }

    collisionHandler(e){
        let tiles=this.getTilesInRange(e.x,e.x+e.w,e.y,e.y+e.h);
        for(let xi=tiles[0]; xi<=tiles[1]; xi++){
            for(let yi=tiles[2]; yi<=tiles[3]; yi++){

            }
        }
        //collision
        return false;
    }

    draw(){
        Camera.drawImage(this.renderedMap,0,0,this.renderedMap.width,this.renderedMap.height);
    }

    renderMap(){
        for(let i=0; i<this.yLength; i++){
            for(let j=0; j<this.xLength; j++){
                this.tileDraw[Number(this.tiles[i][j])](j*this.TILE_SIZE, i*this.TILE_SIZE, this.TILE_SIZE);
            }
        }
    }

    getTilesInRange(sx,ex,sy,ey){
        let sxi=Math.floor((sx-this.x)*this.inv_tileSize);
        let exi=Math.ceil((ex-this.x)*this.inv_tileSize);
        let syi=Math.floor((sy-this.y)*this.inv_tileSize);
        let eyi=Math.ceil((ey-this.y)*this.inv_tileSize);
        return [sxi<0?0:sxi,exi>=this.xLength?this.xLength-1:exi,syi<0?0:syi,eyi>=this.yLength?this.yLength-1:eyi];
    }
}