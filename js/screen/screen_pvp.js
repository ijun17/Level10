Screen.screens["pvp"]=function(playerType=[0,0]){
    Component.backButton(function(){Screen.setScreen("select")});
    Component.screenName("PVP","rgba(128, 0, 128,0.5)");

    let magicSelector=Component.buttonSelector();
    let magicList=Component.buttonStack(0,0,Magic.magicList.length,true,function(i){
        if(Magic.magicList[i][4]>Level.playerLevel)return null;
        else return Component.magicButton(0,0,i,magicSelector)
    })
    let keyButton1=Component.keyButton(0,canvas.height,['r','t','y','u'],Magic.pvp_skillNum[0],magicSelector,"player1");
    let keyButton2=Component.keyButton(0,canvas.height,['0','1','2','3'],Magic.pvp_skillNum[1],magicSelector,"player2");

    let background=new Button(0,0,canvas.width,canvas.heigth);
    background.drawOption("rgba(0,0,0,0.85)");
    background.code=function(){
        this.w=0;this.h=0;
        magicList.moveComponent(Screen.perX(-30)-magicList.x,0)
        keyButton1.moveComponent(Screen.perX(37)-keyButton1.x,canvas.height-keyButton1.y+Screen.perX(5));
        keyButton2.moveComponent(Screen.perX(37)-keyButton2.x,canvas.height-keyButton2.y+Screen.perX(5));
    }
    background.code();

    function playerButton(num,selector){
        let btn = new Button(0,0,Screen.perX(16),Screen.perX(3.5));
        btn.drawOption(`rgb(65, 105, 225)`,"black","wizard",Screen.perX(3), "black")
        btn.code=function(){
            background.w=canvas.width;background.h=canvas.height;//검은 배경 생성
            magicList.addAction(1,Screen.perX(2),function(){magicList.moveComponent(20,0)})
            if(num===0)keyButton1.addAction(1,Screen.perX(2),function(){keyButton1.moveComponent(0,-23)})
            else keyButton2.addAction(1,Screen.perX(2),function(){keyButton2.moveComponent(0,-23)})
            selector.selectedBtn=btn;
        }
        btn.player_type=0;
        return btn;
    }

    function monsterButton(i,selector){
        let btn = new Button(0,0,Screen.perX(16),Screen.perX(3.5));
        btn.drawOption("rgb("+(255-i*25)+","+(255-i*25)+","+(255-i*20)+")","black",`LEVEL${i}`,Screen.perX(3), "black")//
        btn.code=function(){selector.selectedBtn=btn;}
        btn.player_type=i;
        return btn;
    }

    function createPlayerSelectInterface(playerNum, perX){
        let playerSelctor=Component.buttonSelector();
        let playerList = Component.buttonStack(perX,3,1+10,false,function(i){
            if(i-1>Level.playerLevel||i>MONSTERS.length)return null;
            let btn=(i===0 ? playerButton(playerNum,playerSelctor) : monsterButton(i,playerSelctor));
            if(i===playerType[0])playerSelctor.selectedBtn=btn;
            return btn;
        })
        playerList.drawOption(null,null,"player"+(playerNum+1),Screen.perX(2.5),"rgba(255,255,255,0.8)");
        return playerSelctor;
    }
    let ps1=createPlayerSelectInterface(0, 13);
    let ps2=createPlayerSelectInterface(1, 30);
    let startButton = new Button(Screen.perX(90), Screen.perY(10), Screen.perX(9), Screen.perY(90)-Screen.perX(1));
    startButton.drawOption("rgba(128, 0, 128,0.8)","white","START",Screen.perX(2),"white");
    startButton.code=function(){Screen.setScreen("pvpGame",[ps1.selectedBtn.player_type,ps2.selectedBtn.player_type]);}
}