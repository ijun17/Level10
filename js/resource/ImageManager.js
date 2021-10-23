let ImageManager={
    preloading:function(directoryName, imageArray) {
        let img;
        for (let i = 0,n = imageArray.length; i < n; i++) { 
            img = new Image();
            img.src=`resource/${directoryName}/${imageArray[i]}.png`;
            ImageManager[imageArray[i]]=img;
        } 
    }
}

ImageManager.preloading("player", [`player`]);
ImageManager.preloading("particle", ["ember","cloud","snow","smoke","ash","magiceffect"]);
ImageManager.preloading("monster", ["crazymushroom","crazymonkey","hellfly","wyvern","golem","golden_dragon","warrior"]);
ImageManager.preloading("matter", ["fire","energy","electricity","arrow","ice","wind","explosion","lightning"]);