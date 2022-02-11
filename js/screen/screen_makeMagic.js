Screen.addScreen("makeMagic", function(){
    //BACK
    Component.backButton(function () {Screen.setScreen("select");tb.style.display="none"; });
    Component.screenName("create magic");
    //텍스트박스 생성
    tb.style.display="block";
    const namebox=document.querySelector(".namebox");
    const textbox=document.querySelector(".textbox");
    const compileBtn=document.querySelector(".compilebutton");
    const successInfo=document.querySelector(".successInfo");
    const magicInfo = document.querySelector(".magicInfo");
    function printInfo(text1="", text2=""){
        successInfo.innerText = text1;
        successInfo.style.color="royalblue";
        magicInfo.innerText = text2;
    }
    printInfo("","");
    namebox.value="";
    textbox.value="";
    
    let buttonSelector = Component.buttonSelector();

    let basicMagicButtonCode = function (magicListIndex) {
        namebox.value = "(basic)" + Magic.basicMagic[magicListIndex][0];
        textbox.value = Magic.basicMagic[magicListIndex][1];
        printInfo("Basic magic can not edit.", "cooltime: " + (Magic.magicList[magicListIndex][2] / 100) + "sec\nMP: " + Magic.magicList[magicListIndex][3]);
    }
    let customMagicButtonCode = function (magicListIndex) {
        namebox.value = Magic.customMagic[magicListIndex - Magic.basicMagic.length][0];
        textbox.value = Magic.customMagic[magicListIndex - Magic.basicMagic.length][1];
        printInfo("", "cooltime: " + (Magic.magicList[magicListIndex][2] / 100) + "sec\nMP: " + Magic.magicList[magicListIndex][3]);
    }
    //custom magic list
    let customMagicStackHead=Component.buttonStack(83,8,Magic.customMagic.length,false,function(i){
        return Component.magicButton(0,0,i+Magic.basicMagic.length,buttonSelector,function(btn){customMagicButtonCode(i+Magic.basicMagic.length)})
    })
    customMagicStackHead.drawOption(null,"rgba(0,0,255,0.3)","+magic ("+Magic.customMagic.length+"/10)",Screen.perX(2.2),"rgba(0,0,255,0.3)");
    customMagicStackHead.code=function(){ 
        if(Magic.customMagic.length<10){
            Magic.addEmptyMagic();
            customMagicStackHead.addStack(Component.magicButton(0,0,Magic.magicList.length-1,buttonSelector, function(btn){customMagicButtonCode(Magic.magicList.length-1);}))
            customMagicStackHead.drawOption(null,"rgba(0,0,255,0.3)","+magic ("+Magic.customMagic.length+"/10)",Screen.perX(2.2),"rgba(0,0,255,0.3)");
        }
    };
    //basic magic list
    Component.buttonStack(8,0,Magic.basicMagic.length,true,function(i){
        if(Magic.magicList[i][4]>Level.playerLevel)return null;
        return Component.magicButton(0,0,i,buttonSelector,function(){basicMagicButtonCode(i);})
    })

    //COMPILE BUTTON CLICK EVENT
    compileBtn.onclick = function(){
        let selectMagic=buttonSelector.selectedBtn;
        if(selectMagic.temp[0]<Magic.basicMagic.length)return;
        let cusMag=Magic.customMagic[selectMagic.temp[0]-Magic.basicMagic.length];//현재 선택된 커스텀 매직
        let magic=Magic.convertMagictoJS(namebox.value, textbox.value);
        if(magic!=null){ //마법이 성공적으로 변환되면
            cusMag[0]=namebox.value;
            cusMag[1]=textbox.value;
            Magic.magicList[selectMagic.temp[0]]=magic;
            Magic.saveMagic();
            selectMagic.drawOption("rgba(65, 105, 225,0.8)","black",namebox.value,Screen.perX(2),"black")
        }
    };
    
    //TEST MAP
    Component.worldWall(1000,500,200);
    let player=new Player(Screen.perX(70),0,10);
    player.addEventListener("remove", function(){this.life=100000;this.x=Screen.perX(70);this.y=0;this.vx=0;this.vy=0;return false;})
    Input.addMoveKey(player, Input.KEY_MOVE[0]);
    EntityRenderer.Camera.makeTargetCamera(player);
    function makeTester(){let p=new Player(500, -100,10);p.addEventListener("remove", function(){makeTester();return true;});}
    makeTester();
})