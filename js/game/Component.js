/*
재사용하는 ui component
*/

let Component={
    backButton:function(code){
        let backButton = new Button(0, 0, Screen.perX(6), Screen.perX(6));
        backButton.code = code;
        backButton.drawOption(null, null, "<", Screen.perX(6), "black");
        return backButton;
    },
    magicButton:function(x,y,magicListIndex){

    },
    playerStatusView:function(player,perX,perY){
        const viewTextSize=Screen.perX(1.5);
        const MAX_HP = 10000*player.lv;
        const MAX_MP = 30000*player.lv;
        let view = new Button(Screen.perX(perX),Screen.perY(perY),Screen.perX(45),Screen.perX(8),Game.TEXT_CHANNEL);
        view.drawCode=function(){
            ctx.strokeStyle="black";
            ctx.strokeRect(this.x,this.y,Screen.perX(18),Screen.perX(2));
            ctx.strokeRect(this.x,this.y+Screen.perX(2.5),Screen.perX(18),Screen.perX(2));
            ctx.fillStyle="brown";
            ctx.fillRect(this.x,this.y,Screen.perX(18)*(player.life/MAX_HP),Screen.perX(2));
            ctx.fillStyle="royalblue";
            ctx.fillRect(this.x,this.y+Screen.perX(2.5),Screen.perX(18)*(player.mp/MAX_MP),Screen.perX(2));
            ctx.fillStyle="black";
            ctx.font = "bold "+viewTextSize+"px Arial";
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillText(player.life, this.x+Screen.perX(0.5),this.y+Screen.perX(0.5));
            ctx.fillText(player.mp, this.x+Screen.perX(0.5),this.y+Screen.perX(3));
            for (let i = 0; i < 4; i++) {
                let coolT = player.coolTime[i] - Game.time;
                let magic = player.magicList[i];
                ctx.fillText(magic[0] + "(" + magic[3] + "): " + (coolT > 0 ? (coolT * 0.01).toFixed(2) : "ready"), this.x+Screen.perX(20), this.y + Screen.perX(2) * i);
            }
        }
        return view;
    }
}