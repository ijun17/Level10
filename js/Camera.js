let Camera={
    e:null, //Entity
    cameraOn:false,
    extension:1,
    getX:function(x){
        if(Camera.cameraOn)return ((x-Camera.e.x)*Camera.extension+Screen.perX(50));
        else return x;
    },
    getY:function(y){
        if(Camera.cameraOn)return ((y-Camera.e.y)*Camera.extension+Screen.perY(70));
        else return y;
    },
    getS:function(w){ //size
        if(Camera.cameraOn)return w*Camera.extension;
        else return w;
    }
}