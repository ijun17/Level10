Game.setScene("selectMagic",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");
    let buttonSelector=ReusedModule.createButtonSelector();
    ReusedModule.createMagicButtonList([perX(7),perX(1)], [perX(22), perY(100)-perX(2)], buttonSelector)
    ReusedModule.createSelectMagicComponent([perX(30),perY(100)-perX(38)],MagicManager.skillNum,"선택된 스킬(Q,W,E,R)",function(selectMagicBtn,i,skillNum){
        if(buttonSelector.ele===null)return;
        let magicNum=Number(buttonSelector.ele.dataset.magicNum);
        const MAGIC=MagicManager.magicList[magicNum];
        skillNum[i]=magicNum;
        selectMagicBtn.innerText=`${MAGIC.name}\n\nMP: ${MAGIC.requiredMP} / cooltime: ${MAGIC.cooltime}`;
        MagicManager.saveSkillNum();
    })
})