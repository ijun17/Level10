Game.setScene("manageMagic",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");
    let buttonSelector=ReusedModule.createButtonSelector();
    ReusedModule.createMagicButtonList([perX(7),perX(1)], [perX(22), perY(100)-perX(2)], buttonSelector,(num)=>{
        const MAGIC=MagicManager.magicList[num];
        const IS_BASIC=MagicManager.isBasicMagic(num);
        createMagicName.value=MAGIC.name;
        createMagicCode.value=MAGIC.getPrimitiveCode();
        createMagicInfo.innerText=`MP: ${MAGIC.requiredMP} / cooltime: ${MAGIC.cooltime}`;
        createMagicName.readOnly =IS_BASIC
        createMagicCode.readOnly =IS_BASIC
        createMagicbutton.style.display=IS_BASIC ? "none" : "block"
    })
    ReusedModule.createSelectMagicComponent([perX(71),perY(100)-perX(36)],MagicManager.skillNum,"선택된 스킬(Q,W,E,R)",buttonSelector)


    //magicInput
    let magicInput = ui.add("div",[perX(30),perY(2)],[perX(40),perY(96)],"magicInput");
    magicInput.innerHTML=`
    <div style="display:inline-block;position:relative;width:100%;">
        <textarea class="createMagicName" spellcheck="false" maxlength="20"></textarea>
        <button class="createMagicbutton">EDIT</button>
    </div>
    <textarea class="createMagicCode" spellcheck="false"></textarea>
    <div class="createMagicInfo"></div>
    `

    let createMagicbutton = magicInput.querySelector(".createMagicbutton")
    let createMagicName = magicInput.querySelector(".createMagicName")
    let createMagicCode = magicInput.querySelector(".createMagicCode")
    let createMagicInfo = magicInput.querySelector(".createMagicInfo")


    
    createMagicbutton.onclick = function(){
        if(buttonSelector.ele===null)return;
        let magicNum=Number(buttonSelector.ele.dataset.magicNum)
        if(MagicManager.isBasicMagic(magicNum))return;
        let primitiveCustomMagic=MagicManager.primitiveCustomMagic[magicNum-MagicManager.primitiveBasicMagic.length];
        primitiveCustomMagic.name=createMagicName.value;
        primitiveCustomMagic.code=createMagicCode.value;
        MagicManager.saveMagic();
        let createdMagic = MagicManager.createMagicSkill(primitiveCustomMagic);
        MagicManager.magicList[magicNum]=createdMagic;
        buttonSelector.ele.innerText=createMagicName.value;
        let isSuccess = (createdMagic.error===undefined)
        let resultColor=(isSuccess ? "goldenrod" : "red");
        let resultText=(isSuccess ? "CREATE SUCCESSFULLY": createdMagic.error)
    }
})