// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    
    this.initial = function(x, y) {
        this.x = x;
        this.y = y;
    }
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    
    if(this.x > LEFT * 5){
        this.x = -LEFT;
    }else{
        this.x = this.x + BUG_SPEED * BUG_SPEED_RATE  * dt;
    }
    this.render();
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var item = function(x, y) {
    Enemy.call(this, x, y);
    //玩家图片
    this.sprite = 'images/char-boy.png';
};

item.prototype = Object.create(Enemy.prototype);
item.prototype.constructor = item;
// item.prototype.render = function() {
//     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };
item.prototype.update = function(){
    this.render();
}
item.prototype.handleInput = function(key) {
    //键盘控制的玩家位移操作
    switch(key) {
        case 'left':
            this.x -= LEFT;
            break;
        case 'up':
            this.y -= PLAY_TOP_MOVE;
            break;
        case 'right':
            this.x += LEFT;
            break;
        case 'down':
            this.y += PLAY_TOP_MOVE;
            break;
        default:
            break;
    }
    
    //边缘检测
    if(this.y < 0){
        return this.initial(LEFT * 2, PLAY_TOP + PLAY_TOP_MOVE * 4);
    }
    if(this.y > PLAY_TOP + PLAY_TOP_MOVE * 4){
        this.y = PLAY_TOP + PLAY_TOP_MOVE * 4;
    }
    if(this.x < 0){
        this.x = 0;
    }
    if(this.x > LEFT * 4){
        this.x = LEFT * 4;
    }
    this.render();
    //碰撞检测
    allEnemies.forEach(function(e){
        if( player.x - e.x < 101 || player.x - e.x > -101 && player.y - e.y < 67){
             //player.initial(202, 380);
        }
        //console.log(player.x - e.x, player.y - e.y);
    });
    
    

};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面

//定义相关常量 
var PLAY_TOP = 48,
    PLAY_TOP_MOVE = 83,
    LEFT = 101,
    BUG_TOP = 60,
    BUG_TOP_MOVE = 85,
    BUG_SPEED = 60,
    BUG_SPEED_RATE = Math.floor(Math.random() * 8 + 1),
    MAX_BUG = 3,
    RANDOM = Math.floor(Math.random() * 3);

var allEnemies = new Array(MAX_BUG);
var player = new item();
//初始化玩家位置
player.initial(LEFT * 2, PLAY_TOP + PLAY_TOP_MOVE * 4);

allEnemies[0] = new Enemy();
allEnemies[1] = new Enemy();
allEnemies[2] = new Enemy();
allEnemies[0].initial(0, 60);
allEnemies[1].initial(101, 145);
allEnemies[2].initial(202, 230);

// allEnemies.forEach(function(e){
//     // if(player.x - e.x < 101 && player.y === e.y){
//     //     player.initial(202, 380);
//     // }
//     console.log(player.x - e.x);
// });

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    //console.log(player.x);
    player.handleInput(allowedKeys[e.keyCode]);
});
