Game.setScene("createMagic",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");

    let magicInput = ui.add("div",[perX(30),perY(2)],[perX(40),perY(96)],"magicInput");
    let magicInfo = ui.add("div", [perX(71),perY(2)], [perX(28),perY(96)],"magicInfo");
    //magicInput.
    magicInput.innerHTML=`
    <p style="color: cornsilk;">magic name</p>
    <div style="display:inline-block;position:relative;width:100%;">
        <textarea class="createMagicName" spellcheck="false" maxlength="20"></textarea>
        <button class="createMagicbutton">create</button>
    </div>
    <p style="color: cornsilk;">magic code</p>
    <textarea class="createMagicCode" spellcheck="false"></textarea>
    `
    
    function setMagicInfo(name, magicSkill, createInfo="", color="goldenrod"){
        magicInfo.innerHTML=`
        <h1 style="color:royalblue;margin:10px 10px;">${name}</h1>
        <div style="margin:20px;text-align:left;color:blanchedalmond">
            <h2 style="color:${color};">${createInfo}</h2>
            </br>
            <h2>Required MP: ${magicSkill.getRequiredMP()}</h2>
            <h2>Cooltime: ${magicSkill.getCoolTime()}</h2>
        </div>`
    }

    let createMagicbutton = magicInput.querySelector(".createMagicbutton")
    let createMagicName = magicInput.querySelector(".createMagicName")
    let createMagicCode = magicInput.querySelector(".createMagicCode")


    let buttonSelector=ReusedModule.createButtonSelector();
    function setMagicInput(num){
        const basicMagicCount=MagicManager.primitiveBasicMagic.length;
        if(num<basicMagicCount){
            createMagicName.value=MagicManager.primitiveBasicMagic[num].name;
            createMagicCode.value=MagicManager.primitiveBasicMagic[num].code;
            setMagicInfo(createMagicName.value, MagicManager.magicList[num], "Basic Magic Can Not Edit", "red");
        }else{
            createMagicName.value=MagicManager.primitiveCustomMagic[num-basicMagicCount].name;
            createMagicCode.value=MagicManager.primitiveCustomMagic[num-basicMagicCount].code;
            let isSuccess = (MagicManager.magicList[num].error===undefined)
            let resultColor=(isSuccess ? "goldenrod" : "red");
            let resultText=(isSuccess ? "CREATE SUCCESSFULLY": MagicManager.magicList[num].error)
            setMagicInfo(createMagicName.value, MagicManager.magicList[num], resultText, resultColor);
        }
    }
    let magicButtonList = ReusedModule.createMagicButtonList([perX(7),perY(2)], [perX(22), perY(100)-perX(8)],buttonSelector, setMagicInput)
    let addCustomMagicButton=ui.add("button",[perX(7),perY(100)-perX(6)],[perX(22),perX(5)],"addCustomMagicButton");
    addCustomMagicButton.innerText="New Magic";
    addCustomMagicButton.onclick=function(){
        //커스텀 마법을 추가가능한지 검사
        if(MagicManager.primitiveCustomMagic.length>9)return;
        //커스텀 마법 리스트, 마법 리스트에 빈 마법 추가
        MagicManager.addCustomMagic();
        //마법 리스트 엘레멘트에 버튼 추가
        magicButtonList.append(ReusedModule.createMagicButton(MagicManager.magicList.length-1,buttonSelector,()=>{setMagicInput(index);}))
    }


    
    createMagicbutton.onclick = function(){
        if(buttonSelector.ele===null)return;
        let magicNum=Number(buttonSelector.ele.dataset.magicNum)
        if(magicNum<MagicManager.primitiveBasicMagic.length)return;
        let primitiveMagic={code:createMagicCode.value, name:createMagicName.value, level:0};
        let createdMagic = MagicManager.createMagicSkill(primitiveMagic);
        let basicMagicCount=MagicManager.primitiveBasicMagic.length;
        MagicManager.magicList[magicNum]=createdMagic;
        MagicManager.primitiveCustomMagic[magicNum-basicMagicCount]=primitiveMagic;
        MagicManager.saveMagic();
        buttonSelector.ele.innerText=createMagicName.value;
        let isSuccess = (createdMagic.error===undefined)
        let resultColor=(isSuccess ? "goldenrod" : "red");
        let resultText=(isSuccess ? "CREATE SUCCESSFULLY": createdMagic.error)
        setMagicInfo(createMagicName.value,createdMagic,resultText,resultColor);
    }
})