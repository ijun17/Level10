const Game={
    screen:null,
    world:null,
    time:null,
    userInput:null,
    resource:null,

    readyGame(){
        let gameScreen_html=document.getElementById("gamescreen")
        if(gameScreen_html==null){
            console.error("There is no HTML element with the 'gamescreen' id to generate a game screen.")
        }
        Game.time=new GameTime();
        Game.screen=new GameScreen(gameScreen_html, 1200, 600);
        Game.world=new GameWorld(3);
        Game.userInput=new GameUserInput(gameScreen_html);
        Game.resource=new GameResource();
        console.log("create Game.time, Game.screen, Game.world, Game.userInput")
    },
    startGame() {
        Game.time.start(Game.updateGame);
        Game.changeScene("main");
    },
    updateGame() {
        Game.screen.update(); 
        Game.world.update(); 
    },
    resetGame() {
        Game.world.reset();
        Game.screen.reset();
        Game.time.reset();
        //Input.resetKeyInput();
        //Screen.bgColor="#b2c3c8";
        //{어두운 배경: #2B2B2B, 붉은빛하늘: #A89A9A,맑은하늘:rgb(121, 155, 206), 녹색하늘색:#94a9ad, 겨울하늘:#b2c3c8}
    },


    //Scene
    scenes:{"main":function(){}},
    setScene(sceneName, f){this.scenes[sceneName]=f.bind(this)},
    changeScene(sceneName, para=undefined){
        if(this.scenes[sceneName]===undefined){console.error(`"${sceneName}" scene is undefined`);return;}
        Game.resetGame();
        Game.scenes[sceneName](para)
    }
}

Game.readyGame();