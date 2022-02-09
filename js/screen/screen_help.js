Screen.addScreen("help",function(){
    //MENU BAR
    new Block(0,0,Screen.perX(20), Screen.perY(100)).setMapBlock(TYPE.wall); //어두운 바탕
    Component.backButton(function(){Screen.setScreen("select");})
    Component.screenName("help");
    //let howToText = new Text(Screen.perX(15), Screen.perY(5),"About",Screen.perX(2),"black",null,-1,false);
    let nextBtnY=Screen.perX(6);
    function makeMenuButton(text,f=function(){clearPanel();},isEmphasis=true){
        let btn = new Button(0,nextBtnY,Screen.perX(20),Screen.perX(4));
        if(isEmphasis){
            btn.drawOption(null,null,text, Screen.perX(2.5), "white");
            nextBtnY+=Screen.perX(4);
        }
        else {
            btn.drawOption(null,null,text,Screen.perX(2),"grey");
            nextBtnY+=Screen.perX(2.5);
        }
        btn.code=f;
    }
    makeMenuButton("조작법",gameControlPanel);
    makeMenuButton("마법을선택하는법",howToSelectMagicPanel);
    makeMenuButton("마법을만드는법",howToCreateMagicPanel);
    makeMenuButton("물질 생성 마법",create_magicCodePanel,false);
    makeMenuButton("물질 속성 변환 마법",magicCodePanel,false);
    makeMenuButton("물질 정보 탐색 마법",info_magicCodePanel,false);
    makeMenuButton("prohibited code",prohibitedPanel,false);
    makeMenuButton("magic evaluation",magicEvaluationPanel,false);
    nextBtnY += Screen.perX(8);
    makeMenuButton("",developerPanel);

    let textPanel = Component.textPanel(Screen.perX(25),Screen.perX(3))//new TextPanel(Screen.perX(25),Screen.perX(3),0,0);
        textPanel.colors=[null, "white", "black"];
        textPanel.px=[Screen.perX(1), Screen.perX(3), Screen.perX(2)];
    function developerPanel(){
        textPanel.texts=[];
    }
    function howToCreateMagicPanel(){
        textPanel.texts=[
            [1,"마법을 만드는 방법"],
            [2,"1. create magic 화면으로 이동"],
            [2,"2. +magic 버튼을 클릭해서 빈 마법을 생성"],
            [2,"3. 새로 만들어진 파란색 버튼 클릭"],
            [2,"4. magic name 칸에 마법의 이름을 magic code 칸에 마법코드를 적음"],
            [2,"5. 그 밑에 있는 create 버튼 클릭(성공해야 저장됨)"],
            [0,2],
            [2,"*물질생성마법, 물질속성변환마법, 물질정보탐색마법을 참고하세요."],
            [2,"*create magic 화면에서 기본 마법의 코드를 볼 수 있습니다."],
            [2,"*모바일에서 이용하려면 모바일 모드로 바꾸지 말고 이용하세요."],
            [2,"*캐시 삭제를 하면 저장된 마법이 지워질 수 있습니다."]
        ];
    }
    function howToSelectMagicPanel(){
        textPanel.texts=[
            [1,"마법을 선택하는 방법"],
            [2,"키 q,w,e,r에 원하는 마법을 지정할 수 있음"],
            [0,1],
            [2,"1. select magic 화면으로 이동"],
            [2,"2. 마법 버튼(파란색 또는 보라색 버튼)을 클릭"],
            [2,"3. 키 버튼(Q,W,E,R)을 클릭"],
            [0,2],
            [2,"*마법 버튼을 클릭하면 마법을 테스트할 수 있음"]
        ]
    }

    function gameControlPanel(){
        textPanel.texts=[
            [1,"이동하는법"],
            [2,"pc - 키보드 방향키"],
            [2,"모바일 - 스크린 하단 방향 버튼"],
            [0,3],
            [1,"마법을쓰는법"],
            [2,"pc - 키보드 q,w,e,r키"],
            [2,"모바일 - 스크린 하단 Q,W,E,R 버튼"]
        ]
    }

    function create_magicCodePanel(){
        textPanel.texts=[
            [1,"물질 생성 마법"],
            [2,"생성할 수 있는 물질 - 불, 전기, 얼음, 화살, 에너지, 검격, 블럭, 트리거"],
            [2,"마법코드 - create(type, vx, vy, w, h)"],
            [0,1],
            [2,"type - FIRE,ELECTRICITY,ICE,ARROW,ENERGY,WIND,BLOCK,TRIGGER"],
            [2,"vx - 가로방향 속력(오른쪽방향이 플러스)"],
            [2,"vy - 세로방향 속력(위 방향이 플러스)"],
            [2,"w - 가로크기"],
            [2,"h - 세로크기"],
            [0,2],
            [2,"ex) create(FIRE,20,-10)"],
            [2,"   불(FIRE)을 생성하고 오른쪽으로 20, 아래쪽으로 -10만큼 속도를 지정한다."]
        ]
    }

    function magicCodePanel(){
        textPanel.texts=[
            [1,"물질 속성 변환 마법"],
            [2,"물질의 속성 - 속도, 위치, 가시성, 생명력, 행동 등"],
            [0,2],
            [2,"giveForce(e,vx,vy) - 대상(e)을 vx, vy만큼 속력을 변화시킨다."],
            [2,"move(e,x,y) - 대상(e)을 현재 위치에서 x, y만큼 이동시킨다."],
            [2,"invisible(e,time) - 대상(e)을 time동안 보이지 않게 한다."],
            [2,"giveLife(e,life) - 대상(e)의 생명력을 life만큼 증가시킨다."],
            [2,"order(e,startT,endT,f) - 대상(e)에게 startT부터 endT까지 행동(f)을 시킨다."],
            [2,"setTrigger(t,f) - 트리거(t)와 충돌한 대상에게 할 행동(f)을 정한다."]
        ]
    }

    function info_magicCodePanel(){
        textPanel.texts=[
            [1,"물질 정보 탐색 마법"],
            [2,"얻을 수 있는 정보 - 속도, 위치, 플레이어 방향"],
            [0,2],
            [2,"getVX(e) - 대상(e)의 x축 속도를 얻는다."],
            [2,"getVY(e) - 대상(e)의 y축 속도를 얻는다."],
            [2,"getX(e) - 플레이어를 기준으로 대상(e)의 x축 거리를 얻는다."],
            [2,"getY(e) - 플레이어를 기준으로 대상(e)의 y축 거리를 얻는다."],
            [2,"front(n) - 플레이어가 보고있는 방향이 오른쪽이면 n, 왼쪽이면 -n을 반환"],
            [2,"player - 마법을 시전한 플레이어"]
        ]
    }

    function prohibitedPanel(){
        textPanel.texts=[
            [1,"금지어"],
            [2,JSON.stringify(MAGIC_DATA.prohibitedWord)],
            [2,JSON.stringify(MAGIC_DATA.prohibitedSymbol)]
        ]
    }

    function magicEvaluationPanel(){
        textPanel.texts=[
            [1,"마법 평가"],
            [2,"마법이 생성될 때 소비마나, 재사용 대기시간이 자동으로 평가됩니다."]
        ]
    }
})