let EntityRenderer={
    canvas:null,
    ctx:null,
    init:function(){
        this.canvas=document.getElementById("myCanvas");
        this.ctx=canvas.getContext("2d");
        
        this.Camera.init();
        this.Shader.init(this.canvas);
    },
    update:function(){
        this.Camera.update();
        this.Shader.update(this.ctx);
    },
    reset:function(){
        this.Camera.init();
        //this.Shader.setShader("")
    },
    drawImage:function(img,e,opt){e=this.calE(e,opt);this.ctx.drawImage(img,e.x, e.y, e.w, e.h);this.ctx.restore();},
    fillRect:function(color,e,opt){this.ctx.fillStyle=color;e=this.calE(e,opt);this.ctx.fillRect(e.x, e.y, e.w, e.h);this.ctx.restore();},
    strokeRect:function(color,e,opt){this.ctx.strokeStyle=color;e=this.calE(e,opt);this.ctx.strokeRect(e.x, e.y, e.w, e.h);this.ctx.restore();},
    fillText:function(text,e,opt){e=this.calE(e,opt);this.ctx.fillText(text,e.x, e.y);this.ctx.restore();},
    strokeText:function(text,e,opt){e=this.calE(e,opt);this.ctx.strokeText(text,e.x, e.y);this.ctx.restore();},
    drawAnimation:function(animation,e,opt){e=this.calE(e,opt);animation.drawByRenderer(this.ctx,e.x, e.y, e.w, e.h);this.ctx.restore();},
    calE:function(e,opt){
        let x=this.Camera.getX(e.x),y=this.Camera.getY(e.y),w=this.Camera.getS(e.w),h=this.Camera.getS(e.h);
        this.ctx.save();
        if(opt!==undefined){
            this.ctx.translate(x+w*0.5, y+h*0.5);
            x=-w*0.5;
            y=-h*0.5;
            if (opt.rotate !== undefined) this.ctx.rotate(opt.rotate);
            if (opt.reverseX !== undefined && opt.reverseX) this.ctx.scale(-1, 1);
            if (opt.reverseY !== undefined && opt.reverseY) this.ctx.scale(1, -1);
        }
        return {x,y,w,h}
    },
    drawLight:function(e){
        if(this.brightness<=0)return;
        let c=this.Camera;
        this.Shader.sumBrightness+=e.brightness;
        const LIGHT_SIZE=400*e.brightness;
        this.Shader.shaderCtx.drawImage(this.Shader.lightImg, c.getX(e.getX()-LIGHT_SIZE*0.5), c.getY(e.getY()-LIGHT_SIZE*0.5), c.getS(LIGHT_SIZE), c.getS(LIGHT_SIZE));
    },
    makeShader:function(bg, ga){
        this.Shader.setShader(bg, ga);
        new Entity(0,0,World.PARTICLE_CHANNEL).update=function(){this.Shader.update(this.ctx);}.bind(this);
    }
    

}

EntityRenderer.Camera={
    camera:null, //Entity
    canMove:false,
    screenX:Screen.perX(50),
    screenY:Screen.perY(65),
    extension:1, // 커지면 엔티티들이 작아짐
    init:function(){this.makeSameSizeScreenCamera()},
    update:function(){},
    getX:function(x){return (x-this.camera.x)*this.extension+this.screenX;},
    getY:function(y){return (y-this.camera.y)*this.extension+this.screenY;},
    getS:function(w){return w*this.extension;},
    makeTargetCamera:function(target, cameraDelay=10){
        const INV_DELAY=1/cameraDelay;
        this.camera.x=target.x;
        this.camera.y=target.y;
        this.canMove=true;
        this.update = function(){
            this.move((target.x-this.camera.x)*INV_DELAY, (target.y-this.camera.y)*INV_DELAY)
        }
    },
    makeTwoTargetCamera:function(target1, target2, cameraDelay=10){
        const INV_DELAY=1/cameraDelay;
        this.camera.x=(target1.x+target2.x)*0.5;
        this.camera.y=(target1.y+target2.y)*0.5;
        this.canMove=true;
        this.update=function(){
            this.move((((target1.x+target2.x)*0.5)-this.camera.x)*INV_DELAY, (((target1.y+target2.y)*0.5)-this.camera.y)*INV_DELAY);
            let distanceX=Math.abs(Math.floor(target1.x-target2.x));
            let distanceY=Math.abs(Math.floor(target1.y-target2.y));
            this.extension=(distanceX>distanceY?this.screenY/(distanceX+this.screenY):this.screenY/(distanceY+this.screenY));
        }
    },
    makeSameSizeScreenCamera:function(){
        this.camera={x:this.screenX,y:this.screenY};
        this.canMove=false;
        this.extension=1;
    },
    vibrate: function(power){
        if(this.canMove){
            this.move(power*(Math.random()-0.5>0 ? 1 : -1), power*(Math.random()-0.5>0 ? 1 : -1))
        }
    },
    move:function(x,y){
        if(this.canMove){
            this.camera.x+=x;
            this.camera.y+=y;
        }
    }
}

/*
class CameraE extends Entity{
    screenX=0;
    screenY=0;
    target=[];
    inv_targetLength
    inv_delay=0.1
    zoom=1;
    constructor(x,y){
        super(x,y,World.TEXT_CHANNEL);
        this.canRemoved=false;
        this.ga=0;

        this.screenX=Screen.perX(50);
        this.screenY=Screen.perY(65);


    }
    update(){
        let pos=this.getTargetPos();
        if(this.inv_delay===0){
            this.x=pos.x;
            this.y=pos.y;
        }else{
            this.x+=(pos.x-this.x)*this.inv_delay;
            this.y+=(pos.y-this.y)*this.inv_delay;
        }
    }
    getX(x){return (x-this.camera.x)*this.zoom+this.screenX;}
    getY(y){return (y-this.camera.y)*this.zoom+this.screenY;}
    getS(w){return w*this.zoom;}
    setDelay(delay){
        if(delay<=0)this.inv_delay=0;
        else this.inv_delay=1/delay;
    }
    setTarget(target){
        this.target=target;
        this.inv_targetLength=1/target.length;
    }
    getTargetPos(){
        let x=0,y=0;
        for(let i=this.target.length-1; i>=0; i--){
            x+=this.target[i].x;
            y+=this.target[i].y;
        }
        return {x:x*this.inv_targetLength,y:y*this.inv_targetLength}
    }
    vibrate(power){
        if(this.canMove){
            this.move(power*(Math.random()-0.5>0 ? 1 : -1), power*(Math.random()-0.5>0 ? 1 : -1))
        }
    }
}
*/


EntityRenderer.Shader={
    shaderCanvas:null,
    shaderCtx:null,
    sumBrightness:0,
    lightImg:null,
    background:"black",
    globalAlpha:0.5,
    init:function(canvas){
        this.lightImg=document.createElement('canvas');
        this.lightImg.width=100;
        this.lightImg.height=100;
        lightCTX=this.lightImg.getContext('2d');
        lightCTX.fillStyle="#FAFFAF";
        function fillArc(r,ga) {
            lightCTX.globalAlpha = ga;
            lightCTX.beginPath();
            lightCTX.arc(50, 50, r, 0, Math.PI * 2, true);
            lightCTX.fill();
            lightCTX.closePath();
        }
        fillArc(50, 0.1);
        fillArc(15, 0.2);
        fillArc(5, 0.4);
        this.shaderCanvas=document.createElement('canvas');
        this.shaderCanvas.width=canvas.width;
        this.shaderCanvas.height=canvas.height;
        this.shaderCtx=this.shaderCanvas.getContext('2d');
        this.shaderCtx.globalCompositeOperation = "xor";
    },
    setShader:function(bg, ga){
        this.background=bg;
        this.globalAlpha=ga;
    },
    update:function(ctx){
        //rendering shader
        if(this.sumBrightness<1)this.shaderCtx.globalAlpha = this.globalAlpha;
        else this.shaderCtx.globalAlpha = this.globalAlpha-0.1;
        this.shaderCtx.fillStyle=this.background;
        this.shaderCtx.fillRect(0,0,this.shaderCanvas.width, this.shaderCanvas.height);
        ctx.drawImage(this.shaderCanvas,0,0);
        //reset shader
        this.shaderCtx.clearRect(0, 0, this.shaderCanvas.width, this.shaderCanvas.height);
        this.sumBrightness=0;
    }
}
