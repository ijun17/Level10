<a href="https://ijun17.github.io/Level10/">
    <img src="https://github.com/user-attachments/assets/2dacf8df-c33f-4410-89bd-6447834db6bc" alt="LEVEL10 바로가기" width="100%"/>
</a>

# 프로젝트 소개


- 코딩으로 스킬을 만들어 몬스터를 물리치는 게임입니다. 
- 자신이 만든 스킬로 다른 플레이어와 PVP를 할 수 있습니다

# 핵심 기능

## 스킬을 만들어 몬스터와 전투할 수 있습니다. 

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/d7012c45-a930-4c69-9daa-7e7c8a5fb9f7" width="100%" alt="LEVEL10 바로가기" /></td>
    <td><img src="https://github.com/user-attachments/assets/03e90a16-a5e0-4a0a-8e6e-0732eed6c782" width="100%" alt="LEVEL10 바로가기" /></td>
  </tr>
    <tr>
  <td align="center">
    <p>몬스터와 전투</p>
  </td>
  <td align="center">
    <p>스킬 제작</p>
  </td>
</tr>
</table>

## 멀티 플레이 & 몬스터 시뮬레이션

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/ef049d62-0721-45d3-b78a-3cb32cd309b6" width="100%" alt="LEVEL10 바로가기" /></td>
    <td><img src="https://github.com/user-attachments/assets/913f69fa-b89e-4e04-9360-b7f01d83b473" width="100%" alt="LEVEL10 바로가기" /></td>
  </tr>
    <tr>
  <td align="center">
    <p>멀티 플레이</p>
  </td>
  <td align="center">
    <p>몬스터 시뮬레이션</p>
  </td>
</tr>
</table>


# 프로젝트 정보

## 실행 방법

- 별도 빌드 없이 index.html 파일만 실행하면 됩니다.
- 크롬 최신 버전을 권장합니다.

## 기술 스택

<div>
    <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> 
    <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> 
    <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
</div>

# 게임 이용 안내

## 조작법

- 이동(방향키), 스킬(Q,W,E,R)
- 모바일의 경우 `?` 화면에서 버튼이 나오게 설정할 수 있습니다. 

## 스킬 제작

스킬을 만들기 위한 기본적인 함수를 제공합니다. 

```js
const FIRE=0,
    ELECTRICITY=1,
    ICE=2,
    ARROW=3,
    ENERGY=4,
    WIND=5,
    BLOCK=6

const create=function(typenum=BLOCK,vx=0,vy=0,w=30,h=30){
    let e;
    let p=player;
    switch(typenum){
        case BLOCK : e=new Block([0,0],[w,h]); break;
        case FIRE : e=new MatterFire([0,0],[vx,vy]); break;
        case ICE : e=new MatterIce([0,0],[vx,vy]); break;
        case ELECTRICITY : e=new MatterElectricity([0,0],[vx,vy]); break;
        case ARROW : e=new MatterArrow([0,0],[vx,vy]); break;
        case ENERGY : e=new MatterEnergy([0,0],[vx,vy]); break;
        case WIND : e=new MatterWind([0,0],[vx,vy]); break;
        default : e=new Block([0,0],[w,h]); break;
    }
    WORLD.add(e);
    e.body.setPos([p.body.midX+front(e.body.size[0]*0.5+p.body.size[0]*0.5)-e.body.size[0]*0.5, p.body.midY-e.body.size[1]*0.5]);
    return e;
}
const giveForce=function(e,ax,ay){e.body.addVel([ax,ay])}
const giveLife=function(e,d){e.lifeModule.addLife(d)}
const invisible=function(e,time){e.canDraw=false;TIME.addTimer(time,function(){e.canDraw=true;});}
const move=function(e,vx,vy){if(e instanceof Actor&&e!==player)return;e.body.addPos([vx,vy])}
const addSchedule=function(startSec,endSec,intervalSec,f){TIME.addSchedule(startSec,endSec,intervalSec,f,function(){return player.getState()==0});}
const getX=function(e){return e.body.midX-player.body.midX;}
const getY=function(e){return e.body.midY-player.body.midY;}
const getVX=function(e){return e.body.vel[0];}
const getVY=function(e){return e.body.vel[1];}
const front=function(d=1){return (player.moveModule.moveDirection[0] ? d : -d);};
```

  
