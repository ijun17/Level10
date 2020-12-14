function preloading (directory, imageArray) { 
    let n = imageArray.length; 
    for (let i = 0; i < n; i++) { 
        let img = new Image(); 
        img.src = "resource/"+directory+imageArray[i]; 
    } 
} 

preloading("player/", [`player2_right.png`, `player2_left.png`]);
preloading("particle/", ["ember.png", "spark.png", "snow.png", "smoke.png"]);
preloading("monster/", ["crazymushroom.png", "crazymonkey.png", "hellfly.png", "madfish.png"]);
preloading("effect/", ["fire.png", "energy.png", "lightning.png", "explosion.png", "arrow.png", "ice.png"]);
