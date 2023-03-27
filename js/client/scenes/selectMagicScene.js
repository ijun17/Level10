Game.setScene("selectMagic",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");
    let selectedMagicNum
    ReusedModule.createMagicButtonList([perX(7),perX(1)], [perX(22), perY(100)-perX(2)], function(num){selectedMagicNum=num;})
    ReusedModule.createSelectMagicComponent([perX(30),perY(100)-perX(38)],MagicManager.skillNum,"선택된 스킬(Q,W,E,R)",function(selectMagicBtn,i,skillNum){
        skillNum[i]=selectedMagicNum;
        selectMagicBtn.innerText=MagicManager.magicList[skillNum[i]].name;
        MagicManager.saveSkillNum();
    })
})