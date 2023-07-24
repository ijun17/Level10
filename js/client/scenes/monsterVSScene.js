Game.setScene("monsterVS",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");

    let bst1=ReusedModule.createButtonSelector();
    let bst2=ReusedModule.createButtonSelector();
    let scorll1=ReusedModule.createScroll([perX(1),perX(1)],[perX(20),perY(100)-perX(7)]);
    let scorll2=ReusedModule.createScroll([perX(79),perX(1)],[perX(20),perY(100)-perX(7)]);


    for(let i=0,l=Level.monsters.length; i<l; i++){
        let monsterBtn1=ui.create("button",[0,0],[perX(18),perX(4)],"levelButton");
        let monsterBtn2=ui.create("button",[0,0],[perX(18),perX(4)],"levelButton");
        monsterBtn1.style.position="static"
        monsterBtn2.style.position="static"
        monsterBtn1.innerText="LEVEL"+i;
        monsterBtn2.innerText="LEVEL"+i;
        monsterBtn1.onclick=()=>{
            if (bst1.ele != null) bst1.ele.classList.remove("selectedMagic");
            bst1.ele=monsterBtn1;
            bst1.level=i;
            bst1.ele.classList.add("selectedMagic");
        }
        monsterBtn2.onclick=()=>{
            if (bst2.ele != null) bst2.ele.classList.remove("selectedMagic");
            bst2.ele=monsterBtn2;
            bst2.level=i;
            bst2.ele.classList.add("selectedMagic");
        }
        scorll1.append(monsterBtn1);
        scorll2.append(monsterBtn2);
    }

    const VS_BTN_SIZE=[perX(15),perX(15)]
    let vsBtn=ui.add("button",[perX(50)-VS_BTN_SIZE[0]/2, perY(50)-VS_BTN_SIZE[1]/2],VS_BTN_SIZE,"vsButton");
    vsBtn.innerText="VS";

    vsBtn.onclick=fightStart;
    let m1,m2;
    function fightStart(){
        if(bst1.ele==null || bst2.ele==null)return;
        m1 = WORLD.add(new Level.monsters[bst1.level]([1000,0]))
        m2 = WORLD.add(new Level.monsters[bst2.level]([2000,0]))
        m1.setTarget(m2);
        m2.setTarget(m1);
        TIME.addSchedule(1,1,0,function(){
            m1.activateAI()
            m2.activateAI()
        });
        m1.addEventListener("remove",fightEnd);
        m2.addEventListener("remove",fightEnd);
        m1.renderStatusBar("LEVEL"+bst1.level,[perX(6),perY(100)-perX(8.5)],()=>{return m1.getState()==0})
        m2.renderStatusBar("LEVEL"+bst2.level,[perX(59), perY(100)-perX(8.5)],()=>{return m2.getState()==0});
        scorll1.style.display="none"
        scorll2.style.display="none"
        vsBtn.style.display="none"
        SCREEN.renderer.camera.addTarget(m1.body);
    }
    function fightEnd(){
        if(m1.getState()===0 && m2.getState()===0)return;
        SCREEN.renderer.camera.resetTarget();
        TIME.addSchedule(1,1,undefined,()=>{
            m1.setState(0);
            m2.setState(0);
        })
        TIME.addSchedule(1.5,1.5,undefined,()=>{
            scorll1.style.display="block"
            scorll2.style.display="block"
            vsBtn.style.display="block"
        })
        
    }



    // let player=WORLD.add(new Player([2000,500]));
    // SCREEN.renderer.camera.addTarget(player.body);
    // USER_INPUT.setParameter("player",player);
    // USER_INPUT.setParameter("moveKey",[39,37,38,40]);
    // player.setObserver();
    // if(localStorage.getItem("mobile")==='1')ReusedModule.createMobileButton(player);

    ReusedModule.createGameMap(4000, 1000);
    WORLD.environment.addGravity([-20000, -20000], [40000, 40000], [0, -0.2]);
    WORLD.environment.addDrag([-20000, -20000], [40000, 40000], [0, 0], 0.02);
    ReusedModule.createParticleSpray(TYPE.snow, SCREEN.renderer.camera.pos, 2200, 10, 0, 0.05);

    
    SCREEN.renderer.camera.zoom = 0.5;

    //TIME.addSchedule(0,undefined,1,()=>{console.log(player.moveModule.footDirection)});
})