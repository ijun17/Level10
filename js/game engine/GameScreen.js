/*
class GameScreen
    class GameScreenRenderer
        class RendererCamera
    class GameScreenUserInterface
*/

class GameScreen{
    screen;
    renderer;
    ui;

    widthDividedBy100;
    heightDividedBy100;
    isMobile=false;
    constructor(htmlElement){
        this.screen=htmlElement;
        this.screen.style.position="relative";
        this.renderer=new GameScreenRenderer();
        this.ui=new GameScreenUI();
        this.screen.append(this.renderer.getCanvas(), this.ui.getUI());
    }
    update(){
        this.renderer.update();
    }
    reset(){
        this.ui.reset();
        this.renderer.reset();
    }
    setSize(w,h){
        w = Math.floor(w)
        h = Math.floor(h)
        this.screen.style.width=w+"px";
        this.screen.style.height=h+"px";
        this.widthDividedBy100=w/100;
        this.heightDividedBy100=h/100;
        this.renderer.setSize(w,h);
        this.ui.setSize(w,h);
        console.log(`[Screen]change screen size: ${w}, ${h}`)
    };
    perX(percentile){return Math.ceil(this.widthDividedBy100*percentile);};
    perY(percentile){return Math.ceil(this.heightDividedBy100*percentile);};
    setFitSize(){
        const sw=window.innerWidth, sh=window.innerHeight;
        this.setSize(sw,sw*(sh<sw ? sh/sw : sw/sh));
    }
}

class GameScreenRenderer{
    canvas;
    ctx;
    camera;
    bgColor="#b2c3c8";
    width;
    height;
    constructor(){
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.position="absolute";
        this.camera=new GameScreenRendererCamera([0,0]);
    }
    update(){
        this.clear();
        this.camera.update();
    }
    getCanvas(){return this.canvas}
    setSize(w,h){
        this.width=Math.floor(w);
        this.height=Math.floor(h);
        this.canvas.width=this.width;
        this.canvas.height=this.height;
        this.camera.setScreenPos([this.width*0.5, this.height*0.5]);
        
    };
    reset(){
        this.bgColor="#b2c3c8";
        this.camera.reset();
    }
    //useCamera(enable){this.camera.enable=enable;}
    clear(){this.ctx.fillStyle=this.bgColor;this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);};
    drawImage(img,body,opt){this.draw((e)=>this.ctx.drawImage(img,e.x, e.y, e.w, e.h),body,opt);}
    fillRect(color,body,opt){this.ctx.fillStyle=color;this.draw((e)=>this.ctx.fillRect(e.x, e.y, e.w, e.h),body,opt);}
    strokeRect(color,body,opt){this.ctx.strokeStyle=color;this.draw((e)=>this.ctx.strokeRect(e.x, e.y, e.w, e.h),body,opt);}
    fillText(text,body,opt){this.draw((e)=>this.ctx.fillText(text,e.x, e.y),body,opt);}
    strokeText(text,body,opt){this.draw((e)=>this.ctx.strokeText(text,e.x, e.y),body,opt);}
    drawAnimation(animation,body,opt){this.draw((e)=>animation.draw(this.ctx,e.x,e.y,e.w,e.h),body,opt);}
    draw(f, body, opt){
        let rp=this.camera.getRenderPos(body.pos);
        let rs=this.camera.getRenderSize(body.size);
        if(opt!==undefined){
            this.ctx.save();
            if (opt.cameraOn !== undefined && !opt.cameraOn){
                rp=body.pos;
                rs=body.size;
            }
            this.ctx.translate(rp[0]+rs[0]*0.5, -rp[1]-rs[1]*0.5+this.canvas.height);
            if (opt.rotate !== undefined) this.ctx.rotate(opt.rotate);
            if (opt.reverseX !== undefined && opt.reverseX) this.ctx.scale(-1, 1);
            if (opt.reverseY !== undefined && opt.reverseY) this.ctx.scale(1, -1);
            f({x:-rs[0]*0.5, y:-rs[1]*0.5, w:rs[0], h:rs[1]});
            this.ctx.restore();
        }else f({x:rp[0], y:-rp[1]-rs[1]+this.canvas.height, w:rs[0], h:rs[1]});
    }
    drawLight(e){
        if(this.brightness<=0)return;
        this.Shader.sumBrightness+=e.brightness;
        const LIGHT_SIZE=400*e.brightness;
        e={x:e.midX-LIGHT_SIZE*0.5, y:e.midY-LIGHT_SIZE*0.5, w:LIGHT_SIZE, h: LIGHT_SIZE};
        this.draw((e)=>this.Shader.shaderCtx.drawImage(this.Shader.lightImg, e.x, e.y, e.w, e.h),e);
    }
}

class GameScreenRendererCamera{
    screenPos=[0,0];
    pos=[0,0];
    zoom=1;
    isFollow=false;
    followSpeed=0.1;//0~1
    target=[]
    inv_targetCount=0;
    vibratePower=0;
    constructor(screenPos){
        this.setScreenPos(screenPos);
        this.reset();
    }
    reset(){
        this.zoom=1;
        this.resetTarget();
        calvec(this.pos,'=',this.screenPos);
    }
    update(){
        if(this.isFollow)this.follow();
    }
    addTarget(target){
        this.isFollow=true;
        this.target.push(target);
        this.inv_targetCount=1/this.target.length;
    }
    resetTarget(){
        this.isFollow=false;
        this.followSpeed=0.1;
        this.target=[];
    }
    move(xy){
        this.pos[0]+=xy[0];
        this.pos[1]+=xy[1];
    }
    follow(){
        let followX=0;
        let followY=0;
        for(let i=this.target.length-1; i>=0; i--){
            followX+=this.target[i].midX;
            followY+=this.target[i].midY;
        }
        //this.move([(followX*this.inv_targetCount-this.pos[0])*this.followSpeed,(followY*this.inv_targetCount-this.pos[1])*this.followSpeed]);
        this.pos[0]+=(followX*this.inv_targetCount-this.pos[0])*this.followSpeed;
        this.pos[1]+=(followY*this.inv_targetCount-this.pos[1])*this.followSpeed;
        let r = (Math.random()>0.5 ? 1 : -1)
        this.move([this.vibratePower*r,this.vibratePower*r]);
        this.vibratePower=0;
    }
    getRenderPos(pos){
        //if(!this.enable)return pos;
        return [(pos[0]-this.pos[0])*this.zoom+this.screenPos[0], (pos[1]-this.pos[1])*this.zoom+this.screenPos[1]];
    }
    getRenderSize(size){
        //if(!this.enable)return size;
        return [size[0]*this.zoom, size[1]*this.zoom];
    }
    setScreenPos(screenPos){
        calvec(this.screenPos,'=',screenPos);
    }
    vibrate(power){
        if(this.vibratePower<power)this.vibratePower=power;
    }
}


class GameScreenUI{
    ui;
    constructor(){
        this.ui = document.createElement("div");
        this.ui.style.position="absolute";
        this.ui.style.overflow="hidden";
    }
    setSize(w,h){
        this.ui.style.width=Math.floor(w)+"px";
        this.ui.style.height=Math.floor(h)+"px";
        this.ui.style.fontSize=Math.floor(w*16/1200)+"px"
    };
    reset(){this.ui.innerHTML=""}
    getUI(){return this.ui;}
    create(name, pos, size, className=""){
        let ele = document.createElement(name);
        ele.style.position="absolute"
        this.setElementPos(ele,pos);
        this.setElementSize(ele,size);
        ele.className=className;
        return ele;
    }
    add(name, pos, size, className="", isAppend=true){
        let ele = this.create(name, pos, size, className, isAppend);
        if(isAppend)this.ui.append(ele);
        return ele;
    }
    setElementPos(ele, pos){
        ele.style.left=pos[0]+"px";
        ele.style.bottom=pos[1]+"px";
    }
    setElementSize(ele, size){
        ele.style.width=size[0]+"px";
        ele.style.height=size[1]+"px";
    }
}



