class GameResource{
    sounds={};
    images={};
    constructor(){}

    loadImage(imageArray) {
        let resultText="<GameResource>\n";
        for (let i = 0,n = imageArray.length; i < n; i++) { 
            let img = new Image();
            img.src=imageArray[i];
            let fileName = (imageArray[i].match(/\/([\w-]+)\.[\w]+$/))[1];
            let images=this.images;
            images[fileName]=document.createElement('canvas');
            img.onload=function(){
                images[fileName].width=img.width;
                images[fileName].height=img.height;
                images[fileName].getContext('2d').drawImage(img,0,0);
                resultText+=i+". load "+fileName+" image\n";
                if(i==imageArray.length-1)console.log(resultText);
            }
        } 
    }
    getImage(name){return this.images[name];}
}