let SoundManager={
    explosion:new Audio("resource/sound/explosion.mp3"),
    blockCrashing:new Audio("resource/sound/broken.mp3"),
    play:function(sound, volume){
        //만약 사운드가 겹치면 이전의 소리는 없애고 더 큰소리로 처음부터 다시
        if(sound.ended){
            sound.volume=(volume>1?1:volume);
        }else{
            let temp=volume+sound.volume;
            sound.volume=(temp>1?1:temp);
            sound.currentTime=0;
        }
        //sound.play();
    },
    resetVolume:function(){
        for(let a in this){
            if(a instanceof Audio)this.audios[a].volume=0;
        }
    }
}

SoundManager.resetVolume();