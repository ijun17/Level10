const WORLD=Game.world;
const SCREEN=Game.screen;
const TIME=Game.time;
const USER_INPUT=Game.userInput;
const IMAGES=Game.resource.images;
/*
GAME SETTING
*/
Game.resource.loadImage([
    "resource/entity/player/player.png",
    "resource/entity/matter/matter_fire.png",
    "resource/entity/matter/matter_ice.png",
    "resource/entity/matter/matter_electricity.png",
    "resource/entity/matter/matter_energy.png",
    "resource/entity/matter/matter_arrow.png",
    "resource/entity/matter/matter_wind.png",
    "resource/entity/matter/matter_explosion.png",
    "resource/entity/matter/matter_lightning.png",
    "resource/entity/monster/monster_mushroom.png",
    "resource/entity/monster/monster_monkey.png",
    "resource/entity/monster/monster_hellfly.png",
    "resource/entity/monster/monster_wyvern.png",
    "resource/entity/monster/monster_golem.png",
    "resource/entity/monster/monster_golden_dragon.png",
    "resource/entity/particle/particle_ash.png",
    "resource/entity/particle/particle_cloud.png",
    "resource/entity/particle/particle_ember.png",
    "resource/entity/particle/particle_magic_effect.png",
    "resource/entity/particle/particle_smoke.png",
    "resource/entity/particle/particle_snow.png",
    "resource/entity/particle/particle_firefly.png"
]);

const TYPE={
    //particle
    ember:0,smoke:1,cloud:2,snow:3,ash:4,magicEffect:5,firefly:6,
    //matter
    fire:0,electricity:1,ice:2,arrow:3,energy:4,wind:5,explosion:6,lightning:7,
    //monster
    crazyMushroom:0,crazyMonkey:1,hellFly:2,wyvern:3,golem:4,goldDragon:5,warrior:6,
    //MapBlock
    wall:1,grass:2,
    //damage
    damageNormal:0,damageFire:1,damageIce:2,damageElectricity:3,damageWind:4,damageEnergy:5,
    //statucEffect
    iceEffect:0,
}

Object.freeze(TYPE)

const PHYSICS_LAYER=0, PARTICLE_LAYER=1, BUTTON_LAYER=2;
SCREEN.setSize(1200,600);
TIME.setFrameRate(100);
WORLD.getLayer(PARTICLE_LAYER).enableInteraction=false;
WORLD.getLayer(BUTTON_LAYER).enableInteraction=false;

USER_INPUT.addEvent(document,"keydown")
USER_INPUT.addEvent(document,"keyup")
USER_INPUT.addEvent(SCREEN.screen,"touchstart",{passive:false})
USER_INPUT.addEvent(SCREEN.screen,"touchmove",{passive:false})
USER_INPUT.addEvent(SCREEN.screen,"touchend")
USER_INPUT.setParameter("player", undefined)
USER_INPUT.setParameter("moveKey", [39,37,38,40])//right left up down
USER_INPUT.setParameter("skillKey", [81,87,69,82])//qwer
USER_INPUT.addEventListener("keydown", function(e,para){if(para.player instanceof Actor)para.player.onkeydown(e.keyCode, para.moveKey, para.skillKey)})
USER_INPUT.addEventListener("keyup",function(e,para){if(para.player instanceof Actor)para.player.onkeyup(e.keyCode, para.moveKey)})
USER_INPUT.addEventListener("touchstart",function(e,para){
    for(let i=0, l=e.touches.length; i<l; i++){
        for(let btn of WORLD.layer[BUTTON_LAYER].gameUnitList){
            if(btn instanceof Button && btn.isTouched(e.touches[i])){
                e.preventDefault();
                btn.ontouchstart(para);
            }
        }
    }
})
USER_INPUT.addEventListener("touchmove",function(e,para){
    for(let i=0, l=e.touches.length; i<l; i++){
        for(let btn of WORLD.layer[BUTTON_LAYER].gameUnitList){
            if(btn instanceof Button && btn.isTouched(e.touches[i])){
                e.preventDefault();
                btn.ontouchmove(para);
            }
        }
    }
})
USER_INPUT.addEventListener("touchend",function(e,para){
    if(e.touches.length==0){
        for(let btn of WORLD.layer[BUTTON_LAYER].gameUnitList){
            if(btn instanceof Button){
                btn.ontouchend(para);
            }
        }
    }
})


Level.loadLevel();
MagicManager.loadMagic();




/*
START GAME
*/
Game.startGame()