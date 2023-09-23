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
<p>이 게임은 마법을 만들어 몬스터를 물리치는 게임입니다.</p>
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
<p>My Magic 화면에서 마법을 만들 수 있습니다.</p>
<p>마법은 플레이어에게 기본적으로 제공하는 basic magic과 <br>플레이어가 직접 수정할 수 있는 user magic이 있습니다.</p>
<p>마법은 "자바스크립트" 기반의 언어로 작성할 수 있습니다.<br>(작성 방법은 basic magic을 참고하세요)</p>
<br>
<p>아래는 마법을 제어할 수 있는 함수와 변수 입니다.</p>
<ul>
    <li>create(type,vx,vy,width,height) : type에 해당하는 물질을 생성<br> (type = FIRE, ELECTRICITY, ICE, ARROW, ENERGY, WIND, BLOCK, TRIGGER)</li>
    <li>move(target,x,y) : 대상의 위치를 변경 </li>
    <li>giveForce(target,vx,vy) : 대상의 속도를 변경 </li>
    <li>giveLife(target,life) : 대상에게 라이프를 줌</li>
    <li>giveLife(target,life) : 대상에게 라이프를 줌</li>
    <li>addSchedule(시작(초),종료(초),시간간격(초),$) : 시작시간부터 종료시간까지 시간간격이 지날 때마다 함수 $를 실행</li>
    <li>getX(target) : 대상의 x 좌표를 반환</li>
    <li>getY(target) : 대상의 y 좌표를 반환</li>
    <li>getVX(target) : 대상의 x 속력을 반환</li>
    <li>getVY(target) : 대상의 y 속력을 반환</li>
    <li>front(distance) : 플레이어의 방향이 오른쪽이면 distance, 왼쪽이면 -distance를 반환</li>
</ul>
<br>
<p>아래는 자바스크립트와 다른 부분입니다.</p>
<ul>
    <li>변수 선언 - @(변수명)</li>
    <li>함수 선언 - \${함수정의}</li>
    <li>금지 기호 - 점(.), 대괄호([])를 사용할 수 없습니다.</li>
</ul>
`,(ele)=>{}]
]