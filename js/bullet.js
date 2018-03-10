/*
* @Author: WC
* @Date:   2017-11-02 08:40:23
* @Last Modified time: 2017-11-04 09:07:14
*/

/*子类：子弹类*/
var Bullet = function(opts){
    var opts = opts || {};
    /*继承元素类*/
    Element.call(this,opts);
    this.icon = opts.icon;
};

/*继承Element的方法*/
Bullet.prototype = new Element();

/*子弹射击*/
Bullet.prototype.fly = function(){
    this.move(0, -this.speed);
    return this;
};

/*判断子弹与敌机是否碰撞*/
Bullet.prototype.hasCrash = function(target){
    var crash = false;
    /*判断四边是否都没有空隙*/
    if (!(this.x + this.width < target.x) &&
    !(target.x + target.width < this.x) &&
    !(this.y + this.height < target.y) &&
    !(target.y + target.height < this.y)) {
      /*物体碰撞了*/
      crash = true;
    }
    return crash;
};

/*方法: draw 方法*/
Bullet.prototype.draw = function() {
  /*绘画一个线条*/
  ctx.drawImage(this.icon, this.x, this.y, this.width, this.height);
  /*子弹反射音乐*/
  GAME.gameMusic(optionList[0],'shootSound');
  return this;
};
