

class Game{
    //static entitys = new Array();
    //static time=0;
    //static p;

    static clearEntitys(){entitys=[];}

    static startGame(){
        Game.menuScreen();
    }

    static updateWorld(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var e of entitys){e.update();}
        time++;
    }

    static menuScreen(){
        this.clearEntitys();
        var startButton = new Button((canvas.width-300)*0.5,250,300,100,"start.png",function(){Game.levelSelectedScreen();});
        
        
    }

    static levelSelectedScreen(){
        Game.clearEntitys();
        //var levelButton = new Button((canvas.width-300)*0.5,250,300,100,"start.png",function(){Game.levelSelectedScreen();});
        Game.gameScreen();
    }

    static makeMagicScreen(){

    }

    static gameScreen(){
        var backButton = new Button(0,0,80,80,"back.png",function(){Game.menuScreen();});
        new MapBlock(-10,0,10,canvas.height); //left
        new MapBlock(canvas.width,0,10,canvas.height);//right
        new MapBlock(0,-10,canvas.width,10);//top
        new MapBlock(0,canvas.height-50,canvas.width,10,"#2B650D");//bottom
        new MapBlock(0,canvas.height-40,canvas.width,40,"#54341E");

        new MapBlock(100, canvas.height-80, 100, 20);

        new MapBlock(500, canvas.height-300, 50, 20);
        new MapBlock(550, canvas.height-300, 50, 20);
        new MapBlock(600, canvas.height-300, 50, 20);
        new MapBlock(650, canvas.height-300, 50, 20);

        p = new Player(10,canvas.height-200);
        new Player(300,200);
        new Monster(0,700, 200);
        //new Monster(1,500, 200);
    }
}