Screen.addScreen("selectMagic", function() {
    Component.backButton(function(){Screen.setScreen("select")})
    Component.screenName("select magic");

    let buttonSelector=Component.buttonSelector();
    let kb=Component.keyButton(1-32,10,['q','w','e','r'],Magic.skillNum,buttonSelector,"선택된 마법");
    kb.addAction(1,Screen.perX(2),function(){kb.moveComponent(16,0)})

    let magicView=Component.textPanel(Screen.perX(53),Screen.perX(6))//new TextPanel(Screen.perX(53),Screen.perX(6),0,0);
    magicView.colors=[null, "black"];
    magicView.px=[0, Screen.perX(2.5)];
    magicView.texts=[[0,""]];

    let bs=Component.buttonStack(0,0,Magic.magicList.length,true,function(i){
        if(Magic.magicList[i][4]>Level.playerLevel)return null;
        else return Component.magicButton(0,0,i,buttonSelector,function(btn){
            magicView.texts=[[1,`<${Magic.magicList[btn.temp[0]][0]}>`],
            [1,`cooltime: ${Magic.magicList[btn.temp[0]][2]/100}`],
            [1,`mp: ${Magic.magicList[btn.temp[0]][3]}`]];
        })
    })
    bs.addAction(1,Screen.perX(2),function(){bs.moveComponent(16,0)})

    //TEST WORLD
    new Block(canvas.width*5/9, 2*canvas.height/3, canvas.width-canvas.width/2, 2*canvas.height/3).setMapBlock(TYPE.wall);
    Game.p=new Player(Screen.perX(63),0,10);
    Game.p.removeHandler=function(){this.life=100000;this.x=Screen.perX(70);this.y=0;this.vx=0;this.vy=0;return false;}
    Input.addMoveKey(Game.p, Input.KEY_MOVE[0]);
    Camera.cameraOn=false;
    
    let monster = new Monster(0,Screen.perX(87), 0,false);
    monster.life = 0;
    monster.inv_mass=0;
    monster.canRemoved = false;
})