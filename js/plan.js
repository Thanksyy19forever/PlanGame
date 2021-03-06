
var map = document.getElementById('map');

var hero = document.getElementById('hero');

var gameOverPage = document.getElementById('gameOverPage');

var gameScore = document.getElementById('gameScore');

var panelScore = document.getElementById('panelScore');

var restartBtn = document.getElementById('restartBtn');

var startPage = document.getElementById('startPage');

var playBtn = document.getElementById('playBtn');

var bgm = document.getElementById('bgm');

var bomb = document.getElementById('bomb');



var gameState = 0; 	// 0:游戏未开始或游戏结束     1：正在游戏
var score = 0; 	// 分数
var BestScore = 0; 	// 最好的分数
var bulletSpeed = 20; //子弹的速度
var enemiesBulletSpeed = 3; //敌机子弹的速度
var enemiesSpeed = 5; //敌机的速度

var mapW = map.offsetWidth;
var mapH = map.offsetHeight;

var Bullets = [];	//子弹的数组

var Enemies = [];	//敌机的数组

var EnemiesBullets = [];	//敌机的子弹数组

// 开始游戏
playBtn.onclick = function(){
	startPage.style.display = 'none'
	gameState = 1;
}

// 重新玩
restartBtn.onclick = function(){
	gameState = 1;
	score = 0;
	gameScore.innerHTML = score;
	gameOverPage.style.display = 'none';
	//重新创建一个飞机,并设置位置
	hero = document.createElement('img');
	hero.src = 'img/hero.png';
	map.appendChild(hero);
	hero.style.height = '60px';
	hero.style.width = '80px';
	hero.style.left = '240px';
	hero.style.top = '500px';
	hero.style.position = 'absolute';

	fire = setInterval(addBullet , 200);
	updateTimer = setInterval(update , 30);
	addEnemyTimer = setInterval(addEnemy , 500);
	enemyFire = setInterval(addEnemyBullet , 1000);

}
// 飞机随着鼠标移动
map.onmousemove = function (e) {
	var x = e.clientX;
	var y = e.clientY;

	//offsetWidth是指对象的可见宽度
	//offsetWidth = width + padding + border
	var w = hero.offsetWidth;
	var h = hero.offsetHeight;

	hero.style.left = x - w/2 +'px';
	hero.style.top = y - h/2 +'px';

	if(hero.offsetLeft < 0){
		hero.style.left = '0px';
	}
	if(hero.offsetLeft > (mapW - w)){
		hero.style.left = (mapW - w) +'px';
	}
	if(hero.offsetTop < 0){
		hero.style.top = '0px';
	}
	if(hero.offsetTop > (mapH - h)){
		hero.style.right = (mapH - h) + 'px';
	}

}

// 飞机的子弹
var fire = setInterval(addBullet , 200);
function addBullet() {
	if (gameState == 1){
		var bullet = document.createElement('img');
		bullet.src = 'img/bullet1.png';
		bullet.style.position = 'absolute';
		bullet.style.width = '20px';

		var bx = hero.offsetLeft;
		var by = hero.offsetTop;

		bullet.style.left = (bx + hero.offsetWidth / 2 - 10)+'px';
		bullet.style.top = by - 10 +'px';

		map.appendChild(bullet);
		Bullets.push(bullet);

	}
}

/////////////////// 添加敌机子弹 //////////////////////
var enemyFire = setInterval(addEnemyBullet , 1000);
function addEnemyBullet() {

	for(var i = 0 ; i < Enemies.length ; i++){

		var e = Enemies[i];
		var x = e.offsetLeft;
		var y = e.offsetTop;

		var bullet = document.createElement('img');
		bullet.src = 'img/bullet2.png';
		bullet.style.position='absolute';
		bullet.style.left = x+35+'px';
		bullet.style.top = y+40+'px';
		bullet.style.width = '30px';

		EnemiesBullets.push(bullet);
		map.appendChild(bullet);


	}
}



var updateTimer = setInterval(update , 30);
function update() {
	if (gameState == 1) {

		///////////   英雄的子弹移动  /////////
		for (var i = 0; i < Bullets.length; i++) {

			var b = Bullets[i];

			b.style.top = b.offsetTop - bulletSpeed + 'px';

			if (b.offsetTop < 0) {
				map.removeChild(b);
				// 从第i个位置开始删除一个元素
				Bullets.splice(i, 1);
			}

			for (var j = 0; j < Enemies.length; j++) {
				var e = Enemies[j];
				var result = collision(b, e);
				if (result) {

					e.src = 'img/bomb.png';
					//闭包
					(function (node) {
						setTimeout(function () {
							map.removeChild(node);
						}, 200);
					})(e);

//				bomb.play();
					playEffect();

					map.removeChild(b);
					Bullets.splice(i, 1);
					Enemies.splice(j, 1);
					score++;
					gameScore.innerHTML = score;
				}
			}

		}


		///////////  敌机移动    /////////
		for (var i = 0; i < Enemies.length; i++) {

			var e = Enemies[i];

			e.style.top = e.offsetTop + enemiesSpeed + 'px';

			if (e.offsetTop > 768 - 80) {
				map.removeChild(e);
				Enemies.splice(i, 1);
			}

			var result = collision(e, hero);
			if (result) {
				Enemies.splice(i, 1);
				map.removeChild(e);
				map.removeChild(hero);

				gameOver();
			}

		}

		// 遍历敌机子弹数组
		for (var i = 0; i < EnemiesBullets.length; i++) {
			var eb = EnemiesBullets[i];
			//b.style.top = b.offsetTop  - bulletSpeed + 'px';
			eb.style.top = eb.offsetTop + enemiesBulletSpeed + 'px';

			if (eb.offsetTop > 768) {
				EnemiesBullets.splice(i, 1);
				map.removeChild(eb);
			}

			var result = collision(eb, hero);
			if (result) {
				EnemiesBullets.splice(i, 1);
				map.removeChild(eb);
				map.removeChild(hero);
				gameOver();
			}
		}
	}

}

	//播放音效
	function playEffect(){
		bomb.currentTime = 0;
		bomb.play();
	}


////////////////  游戏结束  ////////////////////
	function gameOver(){
		gameOverPage.style.display = 'block';

		clearInterval(addEnemyTimer);
		clearInterval(updateTimer);
		clearInterval(fire);
		clearInterval(enemyFire);

		Enemies.splice(0 , Enemies.length);
		Bullets.splice(0 , Bullets.length);
		EnemiesBullets.splice(0 , EnemiesBullets.length);

		while(map.hasChildNodes()) //当div下还存在子节点时 循环继续
		{
			map.removeChild(map.firstChild);
		}



		if(localStorage['BestScore']){
			if(score > localStorage['BestScore']){
				BestScore = score;
				localStorage['BestScore'] = BestScore;
			}
		}else{
			BestScore = score;
			localStorage['BestScore'] = BestScore;
		}
		// localStorage
		panelScore.innerHTML = '最高分：' + localStorage['BestScore'] +"<br>" + "分数：" + SCORE;

		gameState = 0;
	}




////////////////  判断是否撞机  /////////////
	function collision(a,b){
		var ax = a.offsetLeft;
		var ay = a.offsetTop;
		var aw = a.offsetWidth;
		var ah = a.offsetHeight;

		var bx = b.offsetLeft;
		var by = b.offsetTop;
		var bw = b.offsetWidth;
		var bh = b.offsetHeight;

		if(bx+bw>ax && bx<ax+aw && by+bh>ay && by<ay+ah){
			return true;
		}else{
			return false;
		}
}

//////////////////////  添加敌机   //////////////////////////
// 敌机类型数组
var EnemyTex = [
	'img/enemy1.png',
	'img/enemy2.png',
	'img/enemy3.png',
	'img/enemy4.png',
]
var addEnemyTimer = setInterval(addEnemy , 500);
function addEnemy() {
	if (gameState == 1){
		var enemy = document.createElement('img');
		var index = Math.floor(Math.random()*4);

		enemy.src = EnemyTex[index];
		enemy.style.position = 'absolute';
		enemy.style.width = '100px'

		// 水平位置随机
		var x = Math.random()*(mapW - 100);
		enemy.style.left = x+'px';
		enemy.style.top = '0px';

		map.appendChild(enemy);
		Enemies.push(enemy);

	}
}



//////////////  地图的滚动  ///////////////////
var scrollMap1 = document.getElementById('scrollmap1');
var scrollMap2 = document.getElementById('scrollmap2');
// setTimeOut(表达式,延时时间)在执行时,是在载入后延迟指定时间后,去执行一次表达式,记住,次数是一次
// setInterval(表达式,交互时间)则不一样,它从载入后,每隔指定的时间就执行一次表达式 
var scrollTimer = setInterval(function(){
	scrollMap1.style.top = scrollMap1.offsetTop + 1 + 'px';
	scrollMap2.style.top = scrollMap2.offsetTop + 1 + 'px';
	
	if(scrollMap1.offsetTop > 766){
		scrollMap1.style.top = '-768px';
	}
	if(scrollMap2.offsetTop > 766){
		scrollMap2.style.top = '-768px';
	}
	
} ,20);

