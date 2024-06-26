/**
class GameTime
    class GameSchedule
    class ArrayForSchedule
*/



class GameTime{
    tick=0; //system clock
    fps=100;
    interval=null;
    scheduleList;
    mainSchedule
    constructor(mainSchedule=()=>{}){
        this.mainSchedule=mainSchedule;
        this.scheduleList=new LinkedListForSchedule();
    }
    setFrameRate(fps){
        this.fps=fps;
        if(!this.isStop()){
            this.stop()
            this.start()
        }
    }
    start() {
        if (this.isStop()) {
            const intervalNum = Math.floor(1000 / this.fps);
            this.interval = setInterval(this.doSchedule.bind(this), intervalNum);
        }
    }
    get(){return this.tick}
    reset(){
        this.tick=0;
        this.start()
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
        //메인 스케줄
        this.mainSchedule()
        //사용자 스케줄
        const currentTick=this.tick;
        this.scheduleList.map(function(e,i,l){if(!e.checkSchedule(currentTick))l.remove(i);})
        this.tick++;
    }
    addTimer(endSec, code, stopCondition=function(){return false;}){
        this.addSchedule(endSec,endSec,undefined,code,stopCondition);
    }
    isStop(){
        return this.interval == null
    }
    stop(){
        if(this.isStop())return
        clearInterval(this.interval);
        this.interval=null
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


// class ArrayForSchedule{//집합
//     array;
//     startIndex=0;
//     endIndex=0;
//     count=0;
//     constructor(arraySize=300){
//         this.array=new Array(arraySize);
//     }
//     reset(){
//         let arrayLength=this.array.length;
//         this.array=new Array(arrayLength);

//         this.startIndex=0;//맨처음 원소 인덱스
//         this.endIndex=0;//맨 마지막 원소 인덱스
//         this.count=0;
//     }
//     push(e){
//         if(e===undefined){
//             console.error("CAN NOT PUSH");
//             return;
//         }
//         const arr=this.array;
//         if(this.endIndex-this.startIndex!=this.count){
//             for(let i=this.startIndex, l=this.endIndex; i<l; i++){
//                 if(arr[i]===undefined){
//                     arr[i]=e;
//                     this.count++;
//                     return;
//                 }
//             }
//         }else if(this.startIndex>0){
//             arr[this.startIndex-1]=e;
//             this.startIndex--;
//             this.count++;
//         }else{
//             arr[this.endIndex]=e;
//             this.endIndex++;
//             this.count++;
//         }
//     }
//     remove(i){
//         if(i<this.startIndex||i>=this.endIndex){
//             console.error("CAN NOT REMOVE")
//             return;
//         }
//         this.array[i]=undefined;
//         this.count--;
//         if(i==this.startIndex)this.startIndex++;
//         else if(i==this.endIndex-1)this.endIndex--;
//     }
//     map(f){
//         const array=this.array;
//         for(let i=this.startIndex, l=this.endIndex; i<l; i++)if(array[i]!=undefined)f(array[i], i, this)
//     }
// }


class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedListForSchedule {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    reset() {
        this.head = null;
        this.size = 0;
    }

    push(data) {
        const newNode = new Node(data);
        newNode.next=this.head;
        this.head=newNode
        this.size++;
    }

    remove(previousNode) {
        if(previousNode == null){
            this.head = this.head.next;
        }else{
            previousNode.next = previousNode.next.next;
        }
        this.size--;
    }

    map(callback) {
        let current = this.head;
        let previous = null;
        while (current !== null) {
            let size = this.size;
            callback(current.data, previous, this);
            if(size===this.size)previous = current; 
            current = current.next;
        }
    }
}