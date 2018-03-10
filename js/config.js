/*
* @Author: WC
* @Date:   2017-11-01 16:36:57
* @Last Modified time: 2017-11-03 16:45:50
*/

/*
 *游戏相关配置
 */
var CONFIG = {
    /*飞机大小*/
    planeSize: {
        width: 60,
        height: 45
    },
    planeType: 'bluePlaneIcon',//默认蓝色
    /*子弹大小*/
    bulletSize: {
        width: 20,
        height: 20
    },
    bulletSpeed: 10, // 默认子弹的移动速度
    enemySpeed: 4, // 默认敌人移动距离
    enemyMaxNum: 5, // 敌人最大数量
    /*小敌机大小*/
    enemySmallSize: {
      width: 54,
      height: 40
    },
    /*大敌机大小*/
    enemyBigSize: {
      width: 130,
      height: 100
    },
    resources: {
      backImg: {
        nightAttack: './img/bg_1.jpg',
        lostMonuments: './img/bg_2.jpg',
        virginForest: './img/bg_3.jpg',
        burstedVolcano: './img/bg_4.jpg'
      },
      images: [
        { src: './img/plane_1.png',
          name: 'bluePlaneIcon'
        },
        { src: './img/plane_2.png',
          name: 'pinkPlaneIcon'
        },
        { src: './img/fire.png',
          name: 'fireIcon'
        },
        { src: './img/enemy_big.png',
          name: 'enemyBigIcon'
        },
        { src: './img/enemy_small.png',
          name: 'enemySmallIcon'
        },
        { src: './img/boom_big.png',
          name: 'enemyBigBoomIcon'
        },
        { src: './img/boom_small.png',
          name: 'enemySmallBoomIcon'
        }
      ],
        sounds: [
          {
            src: './sound/biubiubiu.mp3',
            name: 'shootSound'
          },
          { src: './sound/music.mp3',
            name: 'gameSound'
          },
          { src: './sound/die.mp3',
            name: 'dieSound'
          },
          { src: './sound/button.mp3',
            name: 'buttonSound'
          },
          { src: './sound/boom.mp3',
            name: 'boomSound'
          },
        ]
      }
}