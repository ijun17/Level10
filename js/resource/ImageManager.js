let ImageManager={
    preloading:function(directoryName, imageArray) {
        
        for (let i = 0,n = imageArray.length; i < n; i++) { 
            let img;
            img = new Image();
            img.src=`resource/entity/${directoryName}/${imageArray[i]}.png`;
            ImageManager[imageArray[i]]=document.createElement('canvas');
            img.onload=function(){
                ImageManager[imageArray[i]].width=img.width;
                ImageManager[imageArray[i]].height=img.height;
                ImageManager[imageArray[i]].getContext('2d').drawImage(img,0,0);
            }
            
        } 
    }
}

ImageManager.preloading("player", [`player`]);
ImageManager.preloading("particle", ["ember","cloud","snow","smoke","ash","magiceffect"]);
ImageManager.preloading("monster", ["crazymushroom","crazymonkey","hellfly","wyvern","golem","golden_dragon","warrior"]);
ImageManager.preloading("matter", ["fire","energy","electricity","arrow","ice","wind","explosion","lightning"]);