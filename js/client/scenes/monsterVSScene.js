Game.setScene("monsterVS",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");

    let bst1=ReusedModule.createButtonSelector();
    let bst2=ReusedModule.createButtonSelector();
    let scorll1=ReusedModule.createScroll([perX(6),perX(1)],[perX(20),perY(100)-perX(2)]);
    let scorll2=ReusedModule.createScroll([perX(79),perX(1)],[perX(20),perY(100)-perX(2)]);


    for(let i=0,l=Level.monsters.length; i<l; i++){
        let monsterBtn1=ui.create("button",[0,0],[18,3],"levelButton");
        let monsterBtn2=ui.create("button",[0,0],[18,3],"levelButton");
        monsterBtn1.innerText="LEVEL"+(i+1);
        monsterBtn2.innerText="LEVEL"+(i+1);
        monsterBtn1.onclick=()=>{bst1.ele=monsterBtn1;}
        monsterBtn2.onclick=()=>{bst2.ele=monsterBtn2;}
    }





    let player=WORLD.add(new Player([2000,500]));
    player.renderStatusBar([perX(10),perY(100)-perX(10)])
    player.addEventListener("remove", ()=>{
        let stageClearText=SCREEN.ui.add("div",[0,0],[SCREEN.perX(100),SCREEN.perY(100)],"playerDieText");
        stageClearText.innerText="YOU DIE";
        TIME.addSchedule(2,2,undefined,()=>{Game.changeScene("select")});
    })
    SCREEN.renderer.camera.addTarget(player.body);
    USER_INPUT.setParameter("player",player);
    USER_INPUT.setParameter("moveKey",[39,37,38,40]);
    if(localStorage.getItem("mobile")==='1')ReusedModule.createMobileButton(player);

    ReusedModule.createGameMap(4000, 1000);
    WORLD.environment.addGravity([-20000, -20000], [40000, 40000], [0, -0.2]);
    WORLD.environment.addDrag([-20000, -20000], [40000, 40000], [0, 0], 0.02);
    ReusedModule.createParticleSpray(TYPE.snow, player.body.pos, 2200, 10, 0, 0.05);




    let m1 = Level.createMainMonster(level, MonsterWyvern, [1000, 0]);
    let m2 = Level.createMainMonster(level, MonsterDragon, [2000, 0]);
    m1.target = m2;
    m2.target = m1;
    player.setObserver();
    SCREEN.renderer.camera.zoom = 0.5;

    //TIME.addSchedule(0,undefined,1,()=>{console.log(player.moveModule.footDirection)});
})