Screen.addScreen("game",function(level) {
    Component.backButton(function(){Screen.setScreen("select")});
    //player
    let player = new Player(10, -60, Level.playerLevel);
    player.removeHandler=function(){
        World.channel[World.BUTTON_CHANNEL].clear();
        World.channel[World.TEXT_CHANNEL].clear();
        let text = new Text(Screen.perX(50),Screen.perY(50),"you die",Screen.perX(10),"red",null,200,false);
        text.removeHandler=function(){Screen.setScreen("select");return true;};
        return true;
    };
    Input.addMoveKey(player, Input.KEY_MOVE[0]);
    Input.addSkillKey(player, Input.KEY_SKILL[0]);
    Camera.makeMovingCamera(player,0,0,10);
    Component.playerStatusView(player, 10,1.5);
    if (Screen.isMobile) Component.mobileButton(player, Screen.perX(8));
    Level.makeStage(level,player)
})