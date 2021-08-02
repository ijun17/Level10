let Camera={
    e:null, //Entity
    cameraOn:false,
    extension:1, // 커지면 엔티티들이 작아짐
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
        Camera.e=new Entity(x,y,Game.BUTTON_CHANNEL);
        const MAX_SPEED=100;
        Camera.e.update=function(){
            Camera.e.x+=(((target1.x+target2.x)/2)-Camera.e.x)>>5;
            Camera.e.y+=(((target1.y+target2.y)/2)-Camera.e.y)>>5;
            let distance=Math.abs(Math.floor(target1.x-target2.x));
            Camera.extension=(canvas.width/(distance+canvas.width));

        }
    },
    vibrate: function(power){
        if(this.cameraOn){
            Camera.e.x+=power*(Math.random()-0.5>0 ? 1 : -1);
        Camera.e.y+=power*(Math.random()-0.5>0 ? 1 : -1);
        }
    }
}