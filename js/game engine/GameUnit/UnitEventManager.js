class UnitEventManager{
    eventList={
        collision:[],
        remove:[],
        overlap:[],
        click:[],
    }
    constructor(){

    }
    onremove(event){return this.handleEvent(this.eventList.remove, event)}
    onoverlap(event){return this.handleEvent(this.eventList.overlap, event)}
    oncollision(event){return this.handleEvent(this.eventList.collision, event)}
    onclick(event){return this.handleEvent(this.eventList.click, event)}

    addEvent(eventName){
        let eventList=[];
        this.eventList[eventName]=eventList;
        this["on"+eventName]=function(event){return this.handleEvent(eventList, event)}
    }
    addEventListener(eventName,code){
        if(this.eventList[eventName]===undefined)console.error(`${eventName} event not exist`);
        this.eventList[eventName].push(code);
    }
    handleEvent(handler, event) {
        event.do=true;
        for(let i=handler.length-1; i>=0; i--)if(handler[i](event)===false)event.do=false;
        return event.do;
    }
}