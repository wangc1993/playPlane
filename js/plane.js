/*
* @Author: WC
* @Date:   2017-11-02 09:02:30
* @Last Modified time: 2017-11-03 19:46:38
*/

/*
 *子类：飞机类
 *继承element
 *依赖bullet类
 */
var Plane = function(opts){
    var opts = opts || {};
    /*继承元素类*/
    Element.call(this,opts);

    /*特有属性*/
    this.status = 'normal';
    this.icon = opts.icon;
    this.score = 0;//飞机的得分
    /*子弹相关*/
    this.bullets = [];
    this.bulletSize = opts.bulletSize;
    this.bulletSpeed = opts.bulletSpeed;
    this.bulletIcon = opts.bulletIcon;
    /*特有属性，爆炸相关*/
    this.boomIcon = opts.boomIcon;
    this.boomCount = 0;
};

/*继承Element的方法*/
Plane.prototype = new Element();

/*方法：判断飞机是否与敌机碰撞*/
Plane.prototype.hasCrash = function(target) {
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

/*方法：判断子弹是否击中目标*/
Plane.prototype.hasHit = function(target) {
  var bullets = this.bullets;
  var hasHit = false;
  /*子弹从后往前遍历，防止下标不对应*/
  for (var j = bullets.length - 1; j >= 0; j--) {
    /*如果子弹击中的是目标对象的范围，则销毁子弹*/
    if (bullets[j].hasCrash(target)){
      /*清除子弹实例*/
      this.bullets.splice(j, 1);
      hasHit = true;
      break;
    }
  }
  return hasHit;
};

/*方法：修改飞机位置*/
Plane.prototype.setPosition = function(newPlaneX, newPlaneY) {
  this.x = newPlaneX;
  this.y = newPlaneY;
  return this;
};

/*方法：子弹自动发射*/
Plane.prototype.startShoot = function() {
  var self = this;
  var bulletWidth = this.bulletSize.width;
  var bulletHeight = this.bulletSize.height;
  /*定时发射子弹*/
  this.shootingInterval = setInterval(function() {
    /*创建子弹,子弹位置是居中射出*/
    var bulletX = self.x + self.width / 2 - bulletWidth / 2;
    var bulletY = self.y - bulletHeight;
    /*创建子弹*/
    self.bullets.push(new Bullet({
      x: bulletX,
      y: bulletY,
      width: bulletWidth,
      height: bulletHeight,
      speed: self.bulletSpeed,
      icon: self.bulletIcon,
    }));
  }, 200);
};

/*方法：爆炸中*/
Plane.prototype.booming = function() {
  this.status = 'booming';
  this.boomCount += 1;
  if (this.boomCount > 10) {
    this.status = 'boomed';
    clearInterval(this.shootingInterval);//清除定时器
  }
  return this;
}

/*方法：画子弹*/
Plane.prototype.drawBullets = function() {
  var bullets = this.bullets;
  var i = bullets.length;
  while (i--) {
    var bullet = bullets[i];
    /*更新子弹的位置*/
    bullet.fly(); // 更新和绘制耦合在一起了
    /*如果子弹对象超出边界,则删除*/
    if (bullet.y <= 0) {
      /*如果子弹实例下降到底部，则需要在drops数组中清除该子弹实例对象*/
      bullets.splice(i, 1);
    } else {
      /*未超出的则绘画子弹*/
      bullet.draw();
    }
  }
};

/*方法：draw*/
Plane.prototype.draw = function() {
  // 绘制飞机
  switch(this.status) {
    case 'booming':
      ctx.drawImage(this.boomIcon, this.x, this.y, this.width, this.height);
      break;
    default:
      ctx.drawImage(this.icon, this.x, this.y, this.width, this.height);
      break;
  }
  // 绘制子弹
  this.drawBullets();
  return this;
};