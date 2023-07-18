Game.setScene("help",function(){
    const ui=SCREEN.ui;
    const perX=SCREEN.perX.bind(SCREEN);
    const perY=SCREEN.perY.bind(SCREEN);
    ReusedModule.createbackButton("select");
    let buttonSelector = ReusedModule.createButtonSelector();
    let menuBtnSize=[perX(16),perX(4)];
    let bg=ui.add("div",[menuBtnSize[0],0],[perX(100)-menuBtnSize[0],perY(100)-perX(6)],"helpBackground");
    
    for(let i=0; i<HELP_MENU.length; i++){
        let menuButton = ui.add("button",[perX(0),perY(100)-perX(6)-menuBtnSize[1]*(i+1)],menuBtnSize,"helpMenuButton");
        menuButton.innerText=HELP_MENU[i][0]
        menuButton.onclick=()=>{
            bg.innerHTML = HELP_MENU[i][1];
            HELP_MENU[i][2](bg);
            if (buttonSelector.ele != null) buttonSelector.ele.classList.remove("selectedHelpMenuButton");
            buttonSelector.ele = menuButton;
            menuButton.classList.add("selectedHelpMenuButton");
        }
    }

})

const HELP_MENU=[
["game",`
<h1>LEVEL10</h1>
<p>이 게임은 마법으로 몬스터를 물리치는 게임입니다.</p>
<p>총 10개의 스테이지가 있고, 각 스테이지마다 몬스터가 한 마리 있습니다.</p>
<p>몬스터를 물리치면 레벨이 오르고, 레벨이 오르면 체력과 마나가 오릅니다.</p>
`,(ele)=>{}],

["조작법",`<h1>조작법</h1>
<ul>
    <li>이동 - 방향키(상하좌우)</li>
    <li>스킬 - Q, W, E, R</li>
</ul>
<br><br>
<label class="switch">
    <input type="checkbox">
    <span class="slider round">모바일 버튼을 사용하려면 체크하세요</span>
</label>
`,(ele)=>{
    const label = ele.querySelector(".switch");
    const input = label.querySelector("input");
    input.checked = (localStorage.getItem("mobile")==='1');
    label.addEventListener("click",function(){
        localStorage.setItem("mobile",(input.checked ? '1' : '0'));
    })
}],

["마법 제작",`
<h1>마법 제작</h1>
<p>이 게임에서 플레이어는 마법을 만들어 사용할 수 있습니다.</p>
<p>"Create Magic" 화면에서 마법을 만들 수 있습니다.</p>
<p>마법은 "자바스크립트"언어를 기초로한 문법으로 작성할 수 있습니다.</p>
<br>
<p>아래는 마법을 제어할 수 있는 함수와 변수 입니다.</p>
<ul>
    <li>create(type, speedX, speedY, width, height) : type에 해당하는 물질을 생성<br> (type = FIRE, ELECTRICITY, ICE, ARROW, ENERGY, WIND, BLOCK, TRIGGER)</li>
    <li>move(unit,x,y) : 물질의 위치를 변경 </li>
    <li>giveForce(unit,speedX,speedY) : 물질의 속도를 변경 </li>
</ul>
<br>
<p>아래는 자바스크립트와 다른 부분입니다.</p>
<ul>
    <li>점(.)을 사용할 수 없습니다.</li>
    <li>let 키워드대신 '@'를 사용합니다. var키워드는 사용할 수 없습니다.</li>
    <li>function 키워드대신 '$'를 사용합니다.</li>
    <li>대괄호('[',']')를 사용할 수 없습니다.</li>
</ul>
`,(ele)=>{}]
]