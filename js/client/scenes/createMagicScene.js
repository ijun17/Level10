Game.setScene("createMagic",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");
    let createMagicbutton;
    let createMagicName;
    let createMagicCode;
    let selectedMagicNum=0;
    ReusedModule.createMagicButtonList([perX(7),perY(2)], [perX(22), perY(96)], function(num){
        selectedMagicNum=num;
        let basicMagicCount=MagicManager.primitiveBasicMagic.length;
        if(selectedMagicNum<MagicManager.primitiveBasicMagic.length){
            createMagicName.value=MagicManager.primitiveBasicMagic[selectedMagicNum].name;
            createMagicCode.value=MagicManager.primitiveBasicMagic[selectedMagicNum].code;
        }else{
            createMagicName.value=MagicManager.primitiveCustomMagic[selectedMagicNum-basicMagicCount].name;
            createMagicCode.value=MagicManager.primitiveCustomMagic[selectedMagicNum-basicMagicCount].code;
        }
    })
    

    let createMagicInput = ui.add("div",[perX(30),perY(2)],[perX(40),perY(96)],"createMagicInput");
    let createMagicResult = ui.add("div", [perX(71),perY(2)], [perX(28),perY(96)],"createMagicResult");
    //createMagicInput.
    createMagicInput.innerHTML=`
    <p style="color: cornsilk;">magic name</p>
    <div style="display:inline-block;position:relative;width:100%;">
        <textarea class="createMagicName" spellcheck="false" maxlength="20"></textarea>
        <button class="createMagicbutton">create</button>
    </div>
    <p style="color: cornsilk;">magic code</p>
    <textarea class="createMagicCode" spellcheck="false"></textarea>
    `
    createMagicResult.innerHTML=`
    <h1 style="color:blanchedalmond">Info</h1>
    <h2 class="successInfo" style="margin:20px;text-align:left;color:royalblue"></p>
    <h2 class="magicInfo" style="margin:20px;text-align:left;color:blanchedalmond"></p>
    `
    createMagicbutton = createMagicInput.querySelector(".createMagicbutton")
    createMagicName = createMagicInput.querySelector(".createMagicName")
    createMagicCode = createMagicInput.querySelector(".createMagicCode")
    createMagicbutton.onclick = function(){
        if(selectedMagicNum<MagicManager.primitiveBasicMagic.length)return;
        let primitiveMagic={code:createMagicCode.value, name:createMagicName.value, level:0};
        let createdMagic = MagicManager.createMagicSkill(primitiveMagic);
        let basicMagicCount=MagicManager.primitiveBasicMagic.length;
        MagicManager.magicList[selectedMagicNum]=createdMagic;
        MagicManager.primitiveCustomMagic[selectedMagicNum-basicMagicCount]=primitiveMagic;
        MagicManager.saveMagic();
    }

})