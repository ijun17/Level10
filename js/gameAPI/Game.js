let Game = {
    startGame:function() {
        //check mobile
        let UserAgent = navigator.userAgent;
        if (UserAgent.match(/iPhone|ipad|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
            Screen.isMobile=true;
            Input.convertToMobileMode(true);
            document.querySelector(".textbox").style.fontSize="30px";
        }
        World.init();
        EntityRenderer.init();
        Time.init();
        Time.mainSchedule=function(){Screen.clear(); World.updateWorld(); EntityRenderer.Camera.update()}
        Screen.init();
    },
    resetGame:function() {
        World.resetWorld();
        Time.resetTime();
        EntityRenderer.Camera.extension=EntityRenderer.canvas.width/(Screen.isMobile ? 1200 : 1600);
        Input.resetKeyInput();
        Screen.bgColor="#b2c3c8";
        //{어두운 배경: #2B2B2B, 붉은빛하늘: #A89A9A,맑은하늘:rgb(121, 155, 206), 녹색하늘색:#94a9ad, 겨울하늘:#b2c3c8}
        if(this.developerMode)Component.developerTool()
    }
}