/*image sprite
horizon image - change according to time(10)
vertical image - change according to condition

요구사항
1. 조건이 변경될때 - imageY가 해당 조건의 이미지로 바뀌고, imageX=0, counter=0으로 변환
2. 조건이 그대로 일때 - 현재 아무런 변화 없음
3. imageX가 길이를 벗어날때 - 처음 그림으로 돌아옴(imageX%최대길이), sprite에서 최대길이 저장 필요
4. counter가 10일때 - counter=0, imageX++로하고 3번 요구사항 처리

*/

class Animation {
    image=new Image();
    imageW;//스프라이트에서 한 이미지의 가로 길이
    imageH;//스프라이트에서 한 이미지의 세로 길이
    imageX;//시간에 따라 변화하는 스프라이트에서 가로 이미지들
    MAX_X; //스프라이트에서 가로 이미지의 수
    fps=8;
    imageY;//조건에 따라 변경되는 스프라이트에서 세로 이미지들 
    counter;//draw()할때마다 더해지는 시계
    condition=function(){};//imageY를 정하는 메소드
    constructor(src,w,h,MAX_X,cdt){
        this.image.src=src;
        this.imageW=w;
        this.imageH=h;
        this.condition=cdt;
        this.MAX_X=MAX_X;//array

    }
    draw(x,y,w,h,isNotInverse){
        //calculate imageX
        if((this.counter++)==this.fps){
            this.counter=0;
            this.imageX=(this.imageX+1)%this.MAX_X[this.imageY];
        }
        //calculate imageY
        let tempY = this.condition();
        if(this.imageY != tempY){
            this.counter=0;
            this.imageX=0;
            this.imageY = tempY;
        }
        //draw 
        if(isNotInverse)ctx.drawImage(this.image, this.imageX*this.imageW, Math.floor(this.imageY*this.imageH), this.imageW,this.imageH,x,y,w,h);
        else {
            ctx.save();
            ctx.translate(x, y);
			ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.imageX*this.imageW, Math.floor(this.imageY*this.imageH),  this.imageW,this.imageH,-w,0,w,h);
            ctx.restore();
        }
    }
}