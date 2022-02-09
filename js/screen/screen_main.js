Screen.addScreen("main", function () {
    Component.particleSpray(3, { x: Screen.perX(50), y: 0 }, Screen.perX(120), 0, 20, 1, 10);

    var startButton = new Button(Screen.perX(38), Screen.perY(50) - Screen.perX(4), Screen.perX(24), Screen.perX(8));
    startButton.canAct = true;
    startButton.code = function () {
        const ash_interval = Screen.perX(25 / 30);
        for (let i = 0; i < 30; i++) {
            for (let j = 0; j < 10; j++) {
                let e = new Particle(3, startButton.x + i * ash_interval, startButton.y + j * ash_interval);
                e.ga = 0;
                e.w = ash_interval * 1.7;
                e.h = ash_interval * 1.7;
                e.vx *= ash_interval * 0.05;
                e.vy *= ash_interval * 0.05;
            }
        }
        startButton.addAction(50, 50, function () { Screen.setScreen("select"); });
        startButton.draw = function () { };
        startButton.code = function () { };
    };
    startButton.drawOption(null, "black", "START", Screen.perX(6), "black");

    new Text(Screen.perX(50), Screen.perY(62), "click here", Screen.perX(1.6), "black", null, -1, null);

    //decorate1
    new Text(Screen.perX(50), Screen.perY(92), "LEVEL10", Screen.perX(8), "rgb(35, 35, 40)", null, -1, false);
    new Block(Screen.perX(5), Screen.perY(62), Screen.perX(15), Screen.perY(30)).setMapBlock(TYPE.wall);
    new Block(Screen.perX(27), Screen.perY(70), Screen.perX(15), Screen.perY(50)).setMapBlock(TYPE.wall);
    new Block(Screen.perX(58), Screen.perY(70), Screen.perX(15), Screen.perY(50)).setMapBlock(TYPE.wall);
    new Block(Screen.perX(80), Screen.perY(62), Screen.perX(15), Screen.perY(30)).setMapBlock(TYPE.wall);
    new Block(Screen.perX(8), Screen.perY(80), Screen.perX(84), Screen.perY(50)).setMapBlock(TYPE.wall);
})