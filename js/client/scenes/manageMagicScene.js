Game.setScene("manageMagic",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");
    ReusedModule.fireflyWeather(50);
    let buttonSelector=ReusedModule.createButtonSelector();
    ReusedModule.createMagicButtonList([perX(7),perX(1)], [perX(22), perY(100)-perX(2)], buttonSelector,(num)=>{
        const MAGIC=MagicManager.magicList[num];
        const IS_BASIC=MagicManager.isBasicMagic(num);
        createMagicName.value=MAGIC.getName();
        createMagicCode.value=MAGIC.getPrimitiveCode();
        createMagicName.readOnly =IS_BASIC
        createMagicCode.readOnly =IS_BASIC
        createMagicbutton.style.display=IS_BASIC ? "none" : "block"
        printCreateMagicInfo(MAGIC);
    })
    ReusedModule.createSelectMagicComponent([perX(71),perY(100)-perX(36)],MagicManager.skillNum,"선택된 스킬(Q,W,E,R)",buttonSelector)


    //magicInput
    let magicInput = ui.add("div",[perX(30),perY(2)],[perX(40),perY(96)],"magicInput");
    magicInput.innerHTML=`
    <div style="position:relative;width:100%;">
        <textarea class="createMagicName" placeholder="이름을 입력하세요" spellcheck="false" maxlength="20" readonly></textarea>
        <button class="createMagicbutton">🪄 Create</button>
    </div>
    <textarea class="createMagicCode" placeholder="코드를 입력하세요" spellcheck="false" readonly></textarea>
    <div class="createMagicInfo" style="font-weight:bold"></div>
    `

    let createMagicbutton = magicInput.querySelector(".createMagicbutton")
    let createMagicName = magicInput.querySelector(".createMagicName")
    let createMagicCode = magicInput.querySelector(".createMagicCode")
    let createMagicInfo = magicInput.querySelector(".createMagicInfo")
    function printCreateMagicInfo(magic){
        if(magic.errorMessageList.length===0){
            createMagicInfo.innerText=`MP: ${magic.requiredMP} / cooltime: ${magic.cooltime/100}`;
            createMagicInfo.style.color="white"
        }else{
            createMagicInfo.innerText="ERROR: "+magic.errorMessageList.join(" / ");
            createMagicInfo.style.color="brown"
        }
        
    }


    
    createMagicbutton.onclick = function(){
        if(buttonSelector.ele===null)return;
        const MAGIC_NUM=Number(buttonSelector.ele.dataset.magicNum)
        buttonSelector.ele.innerText=createMagicName.value;
        printCreateMagicInfo(MagicManager.setMagicSkill(MAGIC_NUM, createMagicName.value, createMagicCode.value));
    }
})