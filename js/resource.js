/*
* @Author: WC
* @Date:   2017-11-01 20:50:35
* @Last Modified time: 2017-11-05 15:44:46
*/

/* 资源管理器*/
var resourceHelper = {
  /*加载图片*/
  imageLoader: function(src, callback) {
    var image = new Image();
    /*图片加载完成*/
    image.addEventListener('load', callback);
    image.addEventListener('error', function() {
      console.log('imagerror');
    });
    image.src = src;
    return image;
  },
  /*加载音乐*/
  musicLoader: function(src, callback) {
    var audio = new Audio();
    /*音乐加载完成*/
    audio.addEventListener('load', callback);
    audio.addEventListener('error', function() {
      console.log('audiorror');
    });
    audio.src = src;
    return audio;
  },
  /*根据名称返回图片对象*/
  getImage: function(imageName) {
    var imageName = imageName || 'bluePlaneIcon';
    return  this.resources.images[imageName];
  },
  /*根据名称返回音乐对象*/
  getAudio: function(audioName) {
    var audioName = audioName;
    return  this.resources.sounds[audioName];
  },
  /*资源加载:资源列表*/
  load: function(resources, callback) {
    var images = resources.images;
    var sounds = resources.sounds;
    var total = images.length;
    var finish = 0; // 已完成的个数
    /*保存加载后的图片对象和声音对象*/
    this.resources = {
      images: {},
      sounds: {}
    };
    var self = this;

    /*遍历加载图片*/
    for(var i = 0 ; i < images.length; i++) {
      var name = images[i].name;
      var src = images[i].src;
      self.resources.images[name] = self.imageLoader(src, function() {
        /*加载完成*/
        finish++;
        if( finish == total){
          /*全部加载完成*/
          finish = 0;
          callback();
        }
      });
    };

    /*遍历加载背景音乐*/
    for(var i = 0 ; i < sounds.length; i++) {
      var name = sounds[i].name;
      var src = sounds[i].src;
      self.resources.sounds[name] = self.musicLoader(src, function() {
        /*加载完成*/
        finish++;
        if( finish == total){
          /*全部加载完成*/
          callback();
        }
      });
    };
  }
}

