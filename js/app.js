/*
* @Author: WC
* @Date:   2017-11-01 16:36:57
* @Last Modified time: 2017-11-05 19:23:01
*/

/*常用的元素和变量*/
var body = document.getElementsByTagName('body')[0];
/*定义一个游戏设置空数组*/
var optionList = new Array();


/*画布相关*/
var canvas = document.getElementById('game');
var ctx = canvas.getContext("2d");
/*设置画布的宽、高*/
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/*获取画布相关信息*/
var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;

/*判断设备是否支持requestAnimFrame方法，若没有则模拟实现*/
window.requestAnimFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
    window.setTimeout(callback, 1000 / 30);
};

/*获取类名对应元素*/
function getEle(className){
    return document.getElementsByClassName(className)[0];
}
/*将seetting获取的值放入optionList数组*/
function valuePush(value){
    optionList.push(value);
}


/*
 *基本事件绑定
 */
function bindEvent(){
    /*绑定事件*/
    var self = this;

    /*点击开始游戏按钮*/
    var btnStart = document.getElementsByClassName('js-start');
    for(var i=0; i< btnStart.length; i++){
        btnStart[i].onclick = function(){
            body.setAttribute('data-status', 'start');
            GAME.start(optionList[2]);
            GAME.gameMusic(optionList[0],'gameSound');
            GAME.gameMusic(optionList[0],'buttonSound');
        }
    }

    /*点击游戏说明按钮*/
    var btnRule = document.getElementsByClassName('js-rule');
    for(var i=0; i< btnRule.length; i++){
        btnRule[i].onclick = function(){
            body.setAttribute('data-status', 'rule');
            GAME.gameMusic(optionList[0],'buttonSound');
        }
    }

    /*点击游戏设置按钮*/
    var btnSetting = document.getElementsByClassName('js-setting');
    for(var i=0; i<btnSetting.length; i++){
        btnSetting[i].onclick = function(){
            body.setAttribute('data-status', 'setting');
            GAME.gameMusic(optionList[0],'buttonSound');
        }
    }

    /*点击规则确定按钮*/
    var btnConfirmRule = document.getElementsByClassName('js-confirm-rule')[0];
    btnConfirmRule.onclick = function(){
        body.setAttribute('data-status', 'index');
        GAME.gameMusic(optionList[0],'buttonSound');
    }

    /*点击设置确定按钮*/
    var btnConfirmSetting = document.getElementsByClassName('js-confirm-setting')[0];
    /*将配置的当前值放到optionList的数组中*/
    var musicSec = getEle('music-setting');
    valuePush(musicSec.value);
    var backgroundOpt = getEle('background-setting');
    valuePush(backgroundOpt.value);
    var planeOpt = getEle('plane-setting');
    valuePush(planeOpt.value);

    btnConfirmSetting.onclick = function(){
        body.setAttribute('data-status', 'index');
        optionList[0] = musicSec.value;
        optionList[1] = backgroundOpt.value;
        optionList[2] = planeOpt.value;
        GAME.gameBackImg(optionList[1]);
        GAME.gameMusic(optionList[0],'gameSound');
        GAME.gameMusic(optionList[0],'buttonSound');
    }
}

/*
 *游戏对象
 */
var GAME = {
    /*游戏初始化*/
    init: function(opts){

        /*设置opts*/
        var opts = Object.assign({}, opts, CONFIG);//将括号中的对象合在一起
        this.opts = opts;

        /*计算飞机对象的初始坐标*/
        this.planePosX = canvas.width/2 - opts.planeSize.width/2;
        this.planePosY = canvas.height - opts.planeSize.height - 50;

        /*初始化背景音乐*/
        getEle('gameSound').setAttribute('src', resourceHelper.getAudio('gameSound').getAttribute('src'));

        /*初始化动作音乐*/
        getEle('shootSound').setAttribute('src', resourceHelper.getAudio('shootSound').getAttribute('src'));
        getEle('dieSound').setAttribute('src', resourceHelper.getAudio('dieSound').getAttribute('src'));
        getEle('buttonSound').setAttribute('src', resourceHelper.getAudio('buttonSound').getAttribute('src'));
        getEle('boomSound').setAttribute('src', resourceHelper.getAudio('boomSound').getAttribute('src'));

        /*背景音乐初始化:播放状态*/
        this.gameMusic('open','gameSound');
    },

    /*游戏背景图像设置*/
    gameBackImg: function(imgName){
        body.style.backgroundImage = 'url("'+ CONFIG.resources.backImg[imgName] +'")';
        /*注意点：json对象点取取不到，用中括号取*/
    },

    /*游戏背景音乐设置*/
    gameMusic: function(status,className){
        if(status == 'open'){
            getEle(className).play();
        }else{
            getEle(className).pause();
        }
    },

    /*开始游戏*/
    start: function(planeOpt){
        var self = this;
        var opts = this.opts;
        var images = this.images;
        /*清空敌机对象数组*/
        this.enemies = [];

        /*随机生成大、小敌机*/
        this.createSmallEnemyInterval = setInterval(function () {
            self.createEnemy('normal');
        }, 500);
        this.createBigEnemyInterval = setInterval(function () {
            self.createEnemy('big');
        }, 1500);

        /*创建飞机*/
        this.plane = new Plane({
            x: this.planePosX,
            y: this.planePosY,
            width: opts.planeSize.width,
            height: opts.planeSize.height,
            /*子弹大小、速度*/
            bulletSize: opts.bulletSize,
            bulletSpeed: opts.bulletSpeed,
            /*图标相关*/
            icon: resourceHelper.getImage(planeOpt),
            bulletIcon: resourceHelper.getImage('fireIcon'),
            boomIcon: resourceHelper.getImage('enemyBigBoomIcon')
        });

        /*飞机开始射击*/
        this.plane.startShoot();

        /*更新游戏*/
        this.update();
    },
    /*更新游戏*/
    update: function(){
        var self = this;
        var opts = this.opts;

        /*更新飞机、敌机*/
        this.updateElement();

        /*先清理画布*/
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        /*判断飞机是否爆炸完*/
        if(this.plane.status == 'boomed'){
            this.end();
            return;
        }

        /*绘制画布*/
        this.draw();

        /*不断循环update*/
        requestAnimFrame(function(){
            self.update()
        });
    },

    /*更新元素状态*/
    updateElement: function(){
        var opts = this.opts;
        var enemySize = opts.enemySize;
        var enemies = this.enemies;
        var plane = this.plane;
        var i = enemies.length;

        /*判断飞机状态*/
        if(plane.status == 'booming'){
            plane.booming();
            /*设置飞机爆炸音乐*/
            this.gameMusic(optionList[0],'dieSound');
            return;//游戏结束，不再更新敌机了
        }

        /*更新敌机*/
        while(i--){
            var enemy = enemies[i];
            /*console.log(enemy);*/
            enemy.down();
            if(enemy.y >= canvasHeight){
                this.enemies.splice(i,1);
            }else{
                /*判断飞机状态*/
                if(plane.status == 'normal'){
                    if(plane.hasCrash(enemy)){
                        plane.booming();
                    }
                }

                /*根据敌机的状态*/
                switch(enemy.status){
                    case 'normal':{
                        if(plane.hasHit(enemy)){
                            enemy.live -= 1;
                            if(enemy.live == 0){
                                if(enemy.enemyType === 'big'){
                                    plane.score += 5;
                                }else{
                                    plane.score += 1;
                                }
                                enemy.booming();
                                this.gameMusic(optionList[0],'boomSound');
                            }
                        }
                        break;
                    }
                    case 'booming':{
                        enemy.booming();
                        break;
                    }
                    case 'boomed':{
                        enemies.splice(i,1);
                        break;
                    }
                }
            }
        }
    },

    /*绑定手指触摸*/
    bindTouchAction: function(){
        var opts = this.opts;
        var self = this;
        /*飞机极限坐标*/
        var planeMinX = 0;
        var planeMinY = 0;
        var planeMaxX = canvasWidth - opts.planeSize.width;
        var planeMaxY = canvasHeight - opts.planeSize.height;
        /*手指初始位置*/
        var startTouchX;
        var startTouchY;
        /*飞机初始位置*/
        var startPlaneX;
        var satrtPlaneY;

        /*首次触屏*/
        var onTouchstart = function(e){
            var plane = self.plane;
            /*记录首次触摸位置*/
            startTouchX = e.touches[0].clientX;
            startTouchY = e.touches[0].clientY;
            /*记录飞机初始位置*/
            startPlaneX = plane.x;
            startPlaneY = plane.y;
            /*console.log('startTouch',startTouchX,startTouchY);*/
        };
        canvas.addEventListener('touchstart',onTouchstart,false);
        /*手指移动*/
        var onTouchmove =function(e){
            /*记录触摸新位置*/
            var newTouchX = e.touches[0].clientX;
            var newTouchY = e.touches[0].clientY;
            /*console.log('newTouch',newTouchX,newTouchY);*/

            /*计算飞机的新坐标：手指滑动的距离加上飞机初始位置*/
            var newPlaneX = startPlaneX + newTouchX - startTouchX;
            var newPlaneY = startPlaneY + newTouchY - startTouchY;
            /*判断是否超出位置*/
            if(newPlaneX < planeMinX){
              newPlaneX = planeMinX;
            }
            if(newPlaneX > planeMaxX){
              newPlaneX = planeMaxX;
            }
            if(newPlaneY < planeMinY){
              newPlaneY = planeMinY;
            }
            if(newPlaneY > planeMaxY){
              newPlaneY = planeMaxY;
            }
            /*更新飞机的位置*/
            self.plane.setPosition(newPlaneX, newPlaneY);
            /*禁止默认事件，防止滚动屏幕*/
            e.preventDefault();
        };
        canvas.addEventListener('touchmove',onTouchmove,false);
    },

    /*生成敌机*/
    createEnemy: function(enemyType){
        var enemies = this.enemies;
        var opts = this.opts;
        var images = this.images || {};
        var enemySize = opts.enemySmallSize;
        var enemySpeed = opts.enemySpeed;
        /*console.log(enemySpeed);*/
        var enemyIcon = resourceHelper.getImage('enemySmallIcon');
        var enemyBoomIcon = resourceHelper.getImage('enemySmallBoomIcon');
        var enemyLive = 1;

        /*大型敌机参数*/
        if (enemyType === 'big') {
          enemySize = opts.enemyBigSize;
          enemyIcon = resourceHelper.getImage('enemyBigIcon');
          enemyBoomIcon = resourceHelper.getImage('enemyBigBoomIcon');
          enemySpeed = opts.enemySpeed * 0.6;
          enemyLive = 10;
        }

        /*综合元素的参数*/
        var initOpt = {
          x: Math.floor(Math.random() * (canvasWidth - enemySize.width)),
          y: -enemySize.height,
          enemyType: enemyType,
          live: enemyLive,
          width: enemySize.width,
          height: enemySize.height,
          speed: enemySpeed,
          icon: enemyIcon,
          boomIcon: enemyBoomIcon
        }

        /*判断敌机的数量是否超出最大值*/
        if(enemies.length < opts.enemyMaxNum){
            enemies.push(new Enemy(initOpt));
        }
    },
    /*游戏结束*/
    end: function(){
        /*alert(this.plane.score);*/
        body.setAttribute('data-status', 'result');
        var result = document.getElementsByClassName('js-result')[0];
        result.innerHTML = '本次得分：' + this.plane.score;
        clearInterval(this.createSmallEnemyInterval);
        clearInterval(this.createBigEnemyInterval);
    },
    /*绘制游戏画面*/
    draw: function(){
        this.enemies.forEach(function(enemy){
            enemy.draw();
        });
        this.plane.draw();
    }
}

/*
 *页面主入口
 */
 function init(){
    resourceHelper.load(CONFIG.resources,function(){
        /*GAME对象初始化*/
        GAME.init();
        /*绑定触摸事件*/
        GAME.bindTouchAction();
        /*绑定各种点击事件*/
        bindEvent();
    });
 }

 init();