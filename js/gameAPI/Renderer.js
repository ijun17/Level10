let Renderer={
    canvas:null,
    ctx:null,
    init:function(){
        this.canvas = document.getElementById("myCanvas");
        this.ctx = canvas.getContext("2d");
        const sw=screen.width,sh=screen.height;
        if(this.isMobile)this.setSize(1200,1200*(sh<sw?sh/sw:sw/sh));
        else this.setSize(1200,600);
        this.setScreen("main");
    },
}