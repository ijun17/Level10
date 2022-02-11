let Screen= {
    canvas:null,
    ctx:null,
    //const
    CANVAS_W:1200,
    CANVAS_H:600,

    widthDividedBy100:0,
    heightDividedBy100:0,
    isMobile : false,
    bgColor : "black",

    init:function(){
        this.canvas = document.getElementById("myCanvas");
        this.ctx = canvas.getContext("2d");
        const sw=screen.width,sh=screen.height;
        if(this.isMobile)this.setSize(1200,1200*(sh<sw?sh/sw:sw/sh));
        else this.setSize(1200,600);
        this.setScreen("main");
    },
    setSize:function(w,h){this.canvas.width=Math.floor(w); this.canvas.height=Math.floor(h)},
    clear:function(){this.ctx.fillStyle=this.bgColor;this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);},
    perX:function(percentile){return Math.floor(canvas.width*0.01*percentile);},
    perY:function(percentile){return Math.floor(canvas.height*0.01*percentile);},


    screens:{"main":function(){}},
    addScreen:function(screenName, f){this.screens[screenName]=f.bind(this)},
    setScreen:function(screenName, para=undefined){
        if(this.screens[screenName]===undefined){console.error(`"${screenName}" screen is undefined`);return;}
        Game.resetGame();
        EntityRenderer.Camera.makeSameSizeScreenCamera();
        (this.screens[screenName])(para)
    }
}