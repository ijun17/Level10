/**
class GameTime
    class GameSchedule
    class ArrayForSchedule
*/



class GameTime{
    isStop=false;
    tick=0; //system clock
    fps=100;
    interval=null;
    scheduleList;
    mainSchedule=function(){}
    constructor(){
        this.scheduleList=new ArrayForSchedule(300);
    }
    setFrameRate(fps){
        if(this.interval==null)this.fps=fps;
        else console.error("Cannot change the frame rate because the game has already started.")
    }
    start(mainSchedule){
        this.mainSchedule=mainSchedule;
        const intervalNum=Math.floor(1000/this.fps);
        this.interval=setInterval(()=>{
            if(this.isStop)return;
            this.mainSchedule();
            this.doSchedule();
            this.tick++;
        }, intervalNum);
    }
    get(){return this.tick}
    reset(){
        this.tick=0;
        this.isStop=false; 
        this.scheduleList.reset()
    }
    /**
     * @param {number} startSec 
     * @param {number} endSec :number or undefined
     * @param {number} intervalSec :number or undefined
     * @param {function} code 
     * @param {function} stopCondition 
     */
    addSchedule(startSec, endSec, intervalSec, code, stopCondition=function(){return false;}) {
        let startTick=this.tick+startSec*this.fps;
        let endTick=(endSec===undefined ? undefined : this.tick+endSec*this.fps)
        let intervalTick=(intervalSec===undefined || intervalSec===0 ? undefined : intervalSec*this.fps)
        this.scheduleList.push(new GameSchedule(startTick, endTick, intervalTick, code, stopCondition));
    }
    doSchedule(){
        const currentTick=this.tick;
        this.scheduleList.map(function(e,i,l){if(!e.checkSchedule(currentTick))l.remove(i);})
    }
    addTimer(endSec, code, stopCondition=function(){return false;}){
        this.addSchedule(endSec,endSec,undefined,code,stopCondition);
    }
    stop(){
        this.isStop=true;
    }
}

class GameSchedule{
    startTick;
    endTick;
    intervalTick;
    f; // 
    stopCondition; // true를 반환하면 스케줄 삭제
    constructor(startTick, endTick, intervalTick, f, stopCondition){
        this.startTick=startTick;
        this.endTick=endTick;
        this.intervalTick=intervalTick;
        this.f=f;
        this.stopCondition=stopCondition;
    }
    checkSchedule(currentTick){
        if(this.stopCondition()||(this.endTick!=undefined&&this.endTick<currentTick)) return false;
        if(this.startTick<=currentTick){
            if(this.intervalTick!=undefined)this.startTick+=this.intervalTick;
            this.f();
        }
        return true;
    }
}


class ArrayForSchedule{//집합
    array;
    startIndex=0;
    endIndex=0;
    count=0;
    constructor(arraySize=300){
        this.array=new Array(arraySize);
    }
    reset(){
        let arrayLength=this.array.length;
        this.array=new Array(arrayLength);

        this.startIndex=0;//맨처음 원소 인덱스
        this.endIndex=0;//맨 마지막 원소 인덱스
        this.count=0;
    }
    push(e){
        if(e===undefined){
            console.error("CAN NOT PUSH");
            return;
        }
        const arr=this.array;
        if(this.endIndex-this.startIndex!=this.count){
            for(let i=this.startIndex, l=this.endIndex; i<l; i++){
                if(arr[i]===undefined){
                    arr[i]=e;
                    this.count++;
                    return;
                }
            }
        }else if(this.startIndex>0){
            arr[this.startIndex-1]=e;
            this.startIndex--;
            this.count++;
        }else{
            arr[this.endIndex]=e;
            this.endIndex++;
            this.count++;
        }
    }
    remove(i){
        if(i<this.startIndex||i>=this.endIndex){
            console.error("CAN NOT REMOVE")
            return;
        }
        this.array[i]=undefined;
        this.count--;
        if(i==this.startIndex)this.startIndex++;
        else if(i==this.endIndex-1)this.endIndex--;
    }
    map(f){
        const array=this.array;
        for(let i=this.startIndex, l=this.endIndex; i<l; i++)if(array[i]!=undefined)f(array[i], i, this)
    }
}