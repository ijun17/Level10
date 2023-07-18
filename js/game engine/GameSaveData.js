class GameSaveData{
    datas={}
    constructor(){
        this.load();
    }
    get(key){
        return JSON.parse(this.datas[key]);
    }
    load(){

    }
    save(key,value){
        localStorage.setItem(key, JSON.stringify(value));
    }
}