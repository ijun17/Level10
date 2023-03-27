const WORLD=Game.world;
const SCREEN=Game.screen;
const TIME=Game.time;
const USER_INPUT=Game.userInput;
const IMAGES=Game.resource.images;
const SOUNDS=Game
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
    "resource/entity/particle/particle_snow.png"
]);

const TYPE={
    //particle
    ember:0,smoke:1,cloud:2,snow:3,ash:4,magicEffect:5,
    //matter
    fire:0,electricity:1,ice:2,arrow:3,energy:4,wind:5,explosion:6,lightning:7,
    //monster
    crazyMushroom:0,crazyMonkey:1,hellFly:2,wyvern:3,golem:4,goldDragon:5,warrior:6,
    //MapBlock
    wall:1,grass:2
}

const PHYSICS_LAYER=0, PARTICLE_LAYER=1, UI_LAYER=2;
SCREEN.setSize(1200,600);
TIME.changeFrameRate(100);

USER_INPUT.setParameter("player", undefined)
USER_INPUT.setParameter("moveKey", [39,37,38,40])//right left up down
USER_INPUT.setParameter("skillKey", [39,37,38,40])
USER_INPUT.addEventListener("keydown", function(e,para){if(para.player instanceof Player)para.player.onkeydown(e.keyCode, para.moveKey, para.skillKey)})
USER_INPUT.addEventListener("keyup",function(e,para){if(para.player instanceof Player)para.player.onkeyup(e.keyCode, para.moveKey)})

MagicManager.loadMagic();



/*
START GAME
*/
Game.startGame()