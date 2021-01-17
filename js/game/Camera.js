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
        if(Camera.cameraOn)ctx.fillRect(Camera.getX(x), Camera.getY(y), Camera.getS(w), Camera.getS(h));
        else ctx.fillRect(x,y,w,h);
    },
    // setCamera:function(target,movingDelay=10){
    //     if(Camera.e==null)return;
    //     Camera.cameraOn=true;
    //     Camera.e.temp=target;
    //     Camera.e.drawCode = function(){
    //         Camera.e.vx=(Camera.e.temp.x-Camera.e.x)/movingDelay;
    //         Camera.e.vy=-(Camera.e.temp.y-Camera.e.y)/movingDelay;
    //     }
    // },
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