let Camera={
    e:null, //Entity
    cameraOn:false,
    extension:1,
    getX:function(x){
        if(Camera.cameraOn)return ((x-Camera.e.x)*Camera.extension+Screen.perX(50));
        else return x;
    },
    getY:function(y){
        if(Camera.cameraOn)return ((y-Camera.e.y)*Camera.extension+Screen.perY(65));
        else return y;
    },
    getS:function(w){ //size
        if(Camera.cameraOn)return w*Camera.extension;
        else return w;
    },
    fillRect:function(x,y,w,h){
        if(this.cameraOn)ctx.fillRect(this.getX(x), this.getY(y), this.getS(w), this.getS(h));
        else ctx.fillRect(x,y,w,h);
    },
    strokeRect:function(x,y,w,h){
        if(this.cameraOn)ctx.strokeRect(this.getX(x), this.getY(y), this.getS(w), this.getS(h));
        else ctx.strokeRect(x,y,w,h);
    },
    fillText:function(text,x,y){
        if(this.cameraOn)ctx.fillText(text,this.getX(x), this.getY(y));
        else ctx.fillText(text,x,y);
    },
    strokeText:function(text,x,y){
        if(this.cameraOn)ctx.strokeText(text,this.getX(x), this.getY(y));
        else ctx.strokeText(text,x,y);
    },
    makeMovingCamera:function(target,x,y, movingDelay=10){
        Camera.cameraOn=true;
        Camera.e=new Button(x,y,0,0, Game.TEXT_CHANNEL);
        Camera.e.canMove=true;
        Camera.e.temp=target;
        Camera.e.drawCode = function(){
            Camera.e.vx=(Camera.e.temp.x-Camera.e.x)/movingDelay;
            Camera.e.vy=-(Camera.e.temp.y-Camera.e.y)/movingDelay;
        }
    },
    vibrate: function(power){
        Camera.e.x+=power*(Math.random()-0.5>0 ? 1 : -1);
        Camera.e.y+=power*(Math.random()-0.5>0 ? 1 : -1);
    }
}