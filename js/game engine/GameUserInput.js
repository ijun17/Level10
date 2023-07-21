class GameUserInput{
    screen;
    parameterSet={}
    enableSet={}
    handlerSet={}
    constructor(html_screen_element){
        // this.screen=html_screen_element;
        // this.addEvent(document,"keydown")
        // this.addEvent(document,"keyup")
        // this.addEvent(screen,"touchstart")
        // this.addEvent(screen,"touchmove")
        // this.addEvent(screen,"touchend")
    }

    addEventListener(eventName, handler){
        if(this.handlerSet[eventName]===undefined)console.error("no "+eventName+" event")
        this.handlerSet[eventName].push(handler);
    }

    addEvent(htmlElement, eventName, opt=false){
        if(this.handlerSet[eventName]===undefined){
            this.handlerSet[eventName]=[];
            this.enableSet[eventName]=[true];
            let eventListener = this.createEventConnecter(this.handlerSet[eventName],this.enableSet[eventName],this.parameterSet)
            htmlElement.addEventListener(eventName, eventListener, opt);
        }
    }
    createEventConnecter(handlerSet, enableSet, parameterSet){
        let eventConnecter=function(e){
            if(enableSet[0])
            for(let i=handlerSet.length-1; i>=0; i--){
                handlerSet[i](e, parameterSet)
            }
        }
        return eventConnecter;
    }

    setParameter(key, value){
        this.parameterSet[key]=value;
    }
}