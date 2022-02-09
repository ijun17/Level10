let Camera={
    e:null, //Entity
    cameraOn:false,
    screenX:Screen.perX(50),
    screenY:Screen.perY(65),
    extension:1, // 커지면 엔티티들이 작아짐
    getX:function(x){
        if(this.cameraOn)return (x-this.e.x)*this.extension+this.screenX;
        else return x;
    },
    getY:function(y){
        if(this.cameraOn)return (y-this.e.y)*this.extension+this.screenY;
        else return y;
    },
    getS:function(w){ //size
        if(Camera.cameraOn)return w*Camera.extension;
        else return w;
    },
    drawImage:function(img,x,y,w,h){
        if(this.cameraOn)ctx.drawImage(img,this.getX(x), this.getY(y), this.getS(w), this.getS(h));
        else ctx.drawImage(img,x,y,w,h);
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
        Camera.e.temp=target;
        Camera.e.update = function(){
            Camera.e.x+=(Camera.e.temp.x-Camera.e.x)/movingDelay;
            Camera.e.y+=(Camera.e.temp.y-Camera.e.y)/movingDelay;
        }
    },
    makeTwoTargetCamera:function(target1, target2 ,x,y, movingDelay=10){
        Camera.cameraOn=true;
        Camera.e=new Entity(x,y,Game.TEXT_CHANNEL);
        const MAX_SPEED=100;
        Camera.e.update=function(){
            Camera.e.x+=(((target1.x+target2.x)*0.5)-Camera.e.x)>>5;
            Camera.e.y+=(((target1.y+target2.y)*0.5)-Camera.e.y)>>5;
            let distanceX=Math.abs(Math.floor(target1.x-target2.x));
            let distanceY=Math.abs(Math.floor(target1.y-target2.y));
            Camera.extension=(distanceX>distanceY?canvas.height/(distanceX+canvas.height):canvas.height/(distanceY+canvas.height));

        }
    },
    makeSameSizeScreenCamera:function(){
        Camera.cameraOn=true;
        Camera.e={x:canvas.width/2,y:canvas.height/2};
        Camera.extension=1;
    },
    vibrate: function(power){
        
        if(this.cameraOn){
            Camera.e.x+=power*(Math.random()-0.5>0 ? 1 : -1);
        Camera.e.y+=power*(Math.random()-0.5>0 ? 1 : -1);
        }
    }
}