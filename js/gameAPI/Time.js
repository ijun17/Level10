let Time={
    time:0,
    interval:null,
    scheduleList:[],
    init:function(speed=10){
        this.time=0;
        this.interval=setInterval(function(){this.mainSchedule();this.doSchedule();this.time++;}.bind(this), speed);
    },
    get:function(){return this.time},
    resetTime:function(){this.time=0; this.scheduleList=[];},
    mainSchedule:function(){},
    addSchedule:function(start, end, code) {
        let i,j;
        for (i = 0, j=this.scheduleList.length; i < j; i++) {
            if (this.scheduleList[i][1] >= end + this.time) break;
        }
        this.scheduleList.splice(i, 0, [start + this.time, end + this.time, code]);
    },
    doSchedule:function(){
        let i;
        for(i=this.scheduleList.length-1; i>=0; i--){
            if (this.scheduleList[i][1] < this.time) break;
            else if (this.scheduleList[i][0] <= this.time) (this.scheduleList[i][2])();  
        }
        this.scheduleList.splice(0, i+1);
    }
}