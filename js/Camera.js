class Camera{
    static e; //Entity
    static cameraOn=false;
    static extension=1;
    static getX(x){
        if(Camera.cameraOn)return ((x-Camera.e.x)*Camera.extension+Screen.perX(50));
        else return x;
    }
    static getY(y){
        if(Camera.cameraOn)return ((y-Camera.e.y)*Camera.extension+Screen.perY(70));
        else return y;
    }
    static getS(w){ //size
        if(Camera.cameraOn)return w*Camera.extension;
        else return w;
    }
}