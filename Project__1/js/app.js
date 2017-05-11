//搭建可以继承的父类
var Item = function(){
    //初始化
    this.initial = function(x, y,v) {
        this.x = x;
        this.y = y;
        this.v = v;
    };

    //图片初始化
    this.sprite = "";
}

Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 这是我们的玩家要躲避的敌人 
var Enemy = function(x, y, v) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    
    // this.initial = function(x, y,v) {
    //     this.x = x;
    //     this.y = y;
    //     this.v = v;
    // }
    Item.call(this, x, y, v);
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

//从父类继承
Enemy.prototype = Object.create(Item.prototype);
Enemy.prototype.constructor = Enemy;

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    
    if(this.x > LEFT * 5){
        this.initial(-LEFT, BUG_TOP + Math.floor(Math.random() * 3) * BUG_TOP_MOVE, Math.floor(Math.random() * 100 + 200));
    }else{
        this.x = this.x + this.v * dt;
    }

    this.render();
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
  //已经继承自父类不用重复new
// Enemy.prototype.render = function() {
//     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function(x, y) {
    Item.call(this, x, y);
    //玩家图片
    this.sprite = 'images/char-boy.png';
};

Player.prototype = Object.create(Item.prototype);
Player.prototype.constructor = Player;

//已经继承自父类可以略去new
// Player.prototype.render = function() {
//     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };
Player.prototype.update = function(){
    this.render();
    //碰撞检测
    this.crush(allEnemies);
}
Player.prototype.handleInput = function(key) {
    //碰撞检测
    this.crush(allEnemies);
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
    
};

//碰撞检测函数
Player.prototype.crush = function(enemy){
    //保存this对象
    var that = this;
    //将和玩家在同一行的虫子对象提出来放入新的数组中
    var atTheSameRow = enemy.filter(function(e){
        return (that.y - PLAY_TOP) / PLAY_TOP_MOVE === (e.y - BUG_TOP) / BUG_TOP_MOVE;
    });
    //玩家与虫子碰撞时的处理
    atTheSameRow.forEach(function(e){
        if( that.x - e.x < LEFT - 50 && that.x - e.x > -LEFT + 20){
             that.initial(LEFT * 2, PLAY_TOP + PLAY_TOP_MOVE * 4);
        }
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
    //可设置的虫子的总数
    MAX_BUG = 4;

//建立玩家和虫子对象
var allEnemies = new Array(MAX_BUG);
var player = new Player();
//初始化玩家位置
player.initial(LEFT * 2, PLAY_TOP + PLAY_TOP_MOVE * 4);

for(var i = 0; i < MAX_BUG; i++){
    allEnemies[i] = new Enemy();
    //初始化虫子对象
    allEnemies[i].initial(-LEFT, BUG_TOP + Math.floor(Math.random() * 3) * BUG_TOP_MOVE, Math.floor(Math.random() * 150 + 80));
}

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
