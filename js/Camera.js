class Camera{
    static e; //Entity
    static cameraOn=false;
    static getX(x){
        if(Camera.cameraOn)return (x-Camera.e.x+canvas.width/2);
        else return x;
    }
    static getY(y){
        if(Camera.cameraOn)return (y-Camera.e.y+Screen.perY(70));
        else return y;
    }
}