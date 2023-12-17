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
    "resource/entity/particle/particle_firefly.png",
    "resource/entity/particle/particle_spark.png"
]);

const TYPE={
    //particle
    ember:0,smoke:1,cloud:2,snow:3,ash:4,magicEffect:5,firefly:6,spark:7,
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
SCREEN.setFitSize();
TIME.setFrameRate(100);
WORLD.getLayer(PARTICLE_LAYER).enableInteraction=false;
WORLD.getLayer(BUTTON_LAYER).enableInteraction=false;

USER_INPUT.addEvent(document,"keydown")
USER_INPUT.addEvent(document,"keyup")
USER_INPUT.addEvent(SCREEN.screen,"touchstart",{passive:false})
USER_INPUT.addEvent(SCREEN.screen,"touchmove",{passive:false})
USER_INPUT.addEvent(SCREEN.screen,"touchend")


Level.loadLevel();
MagicManager.loadMagic();




/*
START GAME
*/
Game.startGame()

//Game.changeScene("pvp")

if(localStorage.getItem("log-viewer")==='1'){
    const box = document.getElementById("screenbox")
    const log_viewer=document.createElement("div")
    box.appendChild(log_viewer)
    log_viewer.style.cssText=`
        width:1200px; 
        height:600px; 
        max-height:600px;
        background-color:#222; 
        font-size:20px;
        position:absolute; 
        top:600px; 
        color:white;
        overflow-y:auto;
        padding:20px;`
    
    
    var originalConsoleLog = console.log;
    var originalConsoleError = console.log;

    function addLog(arg){
        let messages = (Array.from(arg));
        let trace="";
        try { throw new Error('Trace capture');} 
        catch (error) { if(localStorage.getItem("log-viewer-trace")==='1')trace=error.stack+"\n"}
        log_viewer.innerText+=trace+messages.join(' ')+"\n\n"
        log_viewer.scrollTop = log_viewer.scrollHeight;
        return messages
    }
    console.log = function () {originalConsoleLog.apply(console, addLog(arguments));};
    console.error = function () {originalConsoleError.apply(console, addLog(arguments));};
    console.log("log-viewer on")
}