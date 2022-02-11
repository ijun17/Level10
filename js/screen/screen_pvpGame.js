Screen.addScreen("pvpGame", function(playerType){
    Component.backButton(function(){Screen.setScreen("pvp",playerType)});

    Component.worldWall(2000,1000,300);
    let player1 = (playerType[0]===0 ? new Player(1000-200,-60,10,Magic.pvp_skillNum[0]):new Monster(playerType[0]-1,1000-200,-60,false))
    let player2 = (playerType[1]===0 ? new Player(1000+200,-60,10,Magic.pvp_skillNum[1]):new Monster(playerType[1]-1,1000+200,-60,false))
    player2.isRight=false;
    function printWin(text){
        let winText = new Text(Screen.perX(50),Screen.perY(50), text, Screen.perX(10), "yellow", null,300,false);
        winText.addEventListener("remove", function(){Screen.setScreen("pvp",playerType);return true;});
        player2.canRemoved=false;player1.canRemoved=false;
    }
    player1.addEventListener("remove", function(){printWin("PLAYER 2  WIN");return true;})
    player2.addEventListener("remove", function(){printWin("PLAYER 1  WIN");return true;})
    player1.getNameTag=function(){ctx.fillStyle="green";return "player1"}
    player2.getNameTag=function(){ctx.fillStyle="red";return "player2"}
    player1.target=player2;
    player2.target=player1;
    if(player1.isFlying)Input.addFlyKey(player1, Input.KEY_MOVE[1]);
    else Input.addMoveKey(player1, Input.KEY_MOVE[1]);
    if(player2.isFlying)Input.addFlyKey(player2, Input.KEY_MOVE[0]);
    else Input.addMoveKey(player2, Input.KEY_MOVE[0]);
    if(Screen.isMobile)Component.mobileButton(player1, Screen.perX(8));

    EntityRenderer.Camera.makeTwoTargetCamera(player1, player2);

    Component.playerStatusView(player1, 1, 7, "player1");
    Component.playerStatusView(player2, 57, 7, "player2");

    function countdown(textset, index){
        let text = new Text(Screen.perX(50),Screen.perY(50), textset[index], Screen.perX(20), "yellow", null,100,false);
        if(index==textset.length-1){Input.addSkillKey(player1, Input.KEY_SKILL[2]);Input.addSkillKey(player2, Input.KEY_SKILL[1]);
        }else text.onremove=function(){countdown(textset, index+1);return true;}
    }
    countdown(['3','2','1',"FIGHT"],0);
})