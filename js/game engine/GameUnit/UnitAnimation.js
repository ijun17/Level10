/*image sprite
horizon image - change according to time(10)
vertical image - change according to condition

요구사항
1. 조건이 변경될때 - imageY가 해당 조건의 이미지로 바뀌고, imageX=0, counter=0으로 변환
2. 조건이 그대로 일때 - 현재 아무런 변화 없음
3. imageX가 길이를 벗어날때 - 처음 그림으로 돌아옴(imageX%최대길이), sprite에서 최대길이 저장 필요
4. counter가 10일때 - counter=0, imageX++로하고 3번 요구사항 처리

*/

class UnitAnimation {
    image;
    imageW;//스프라이트에서 한 이미지의 가로 길이
    imageH;//스프라이트에서 한 이미지의 세로 길이
    imageX=0;//시간에 따라 변화하는 스프라이트에서 가로 이미지들
    imageY=0;//조건에 따라 변경되는 스프라이트에서 세로 이미지들 
    MAX_X; //스프라이트에서 각 행마다 최대 이미지의 수
    imageStartPointX=[0];//스프라이트에서 각 이미지에 시작점
    imageStartPointY=[0];//스프라이트에서 각 이미지에 시작점
    fps=8;//8틱마다 이미지 변경
    time=0;
    condition=function(){};//imageY를 정하는 메소드
    constructor(image,w=0,h=0,MAX_X=[1],cdt=function(){return 0}){
        this.image=image;
        this.condition=cdt;
        this.MAX_X=MAX_X;
        this.time=this.fps;
        if(w===0){//image가 한개라는 뜻
            this.imageW=image.width;
            this.imageH=image.height;
        }else{
            this.imageW=w;
            this.imageH=h;
            //계산을 줄이기 위해 미리 구함
            for(let i=0;i*w<image.width; i++)this.imageStartPointX[i]=Math.floor(i*w);
            for(let j=0;j*h<image.height; j++)this.imageStartPointY[j]=Math.floor(j*h);
        }
    }

    update(){
        //calculate imageX
        if(this.time--<=0){
            this.time=this.fps;
            if(++this.imageX===this.MAX_X[this.imageY])this.imageX=0;
        }
        //calculate imageY
        let tempY = this.condition();
        if(this.imageY !== tempY){
            this.time=this.fps;
            this.imageX=0;
            this.imageY = tempY;
        }
    }

    draw(r,x,y,w,h){
        r.drawImage(this.image, this.imageStartPointX[this.imageX], this.imageStartPointY[this.imageY], this.imageW,this.imageH,x,y,w,h);
    }
}