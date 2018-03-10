/*
* @Author: WC
* @Date:   2017-11-01 18:44:15
* @Last Modified time: 2017-11-03 19:38:55
*/

/*
 *子类：敌机对象
 */
var Enemy = function(opts){
    var opts = opts || {};
    /*继承父类*/
    Element.call(this,opts);

    /*特有属性状态和图标*/
    this.status = 'normal';//nirmal、booming、boomed
    this.icon = opts.icon;
    this.live = opts.live;
    this.enemyType = opts.enemyType;
    /*与爆炸相关属性*/
    this.boomIcon = opts.boomIcon;
    this.boomCount = 0;
};

/*继承Element的方法*/
Enemy.prototype = new Element();

/*特有方法：dowm向下移动一个身位*/
Enemy.prototype.down = function(){
    this.move(0,this.speed);
};

/*booming爆炸*/
Enemy.prototype.booming = function() {
  // 设置状态为 booming
  this.status = 'booming';
  this.boomCount += 1;
  // 如果已经 booming 了 6次，则设置状态为 boomed
  if (this.boomCount > 6) {
    this.status = 'boomed';
  }
};

/*draw 方法*/
Enemy.prototype.draw = function() {
  /*ctx.fillRect(this.x, this.y, this.width, this.height);*/
  /*绘制怪兽*/
  switch(this.status) {
    case 'normal':
      ctx.drawImage(this.icon, this.x, this.y, this.width, this.height);
      break;
    case 'booming':
      ctx.drawImage(this.boomIcon, this.x, this.y, this.width, this.height);
      break;
  }
};
