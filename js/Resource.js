function preloading (imageArray) { 
    let n = imageArray.length; 
    for (let i = 0; i < n; i++) { 
        let img = new Image(); 
        img.src = "resource/"+imageArray[i]; 
    } 
} 

preloading([`player_right.png`, `player_left.png`, `fire.png`, `lightning.png`, `giratina.png` ]);
