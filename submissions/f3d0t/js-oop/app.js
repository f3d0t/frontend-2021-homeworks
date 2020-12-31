const enemyInfo = {
	minSpeed: 100,
	maxSpeed: 300,
	sprite: "images/enemy-bug.png",
	width: 75,
	startPositionX: -75
};
const cellInfo = {
	width: 101,
	height: 83,
	beingPositionCorrection: 28,
};
const playerInfo = {
	sprite: "images/char-boy.png",
	startPositionX: cellInfo.width * 2,
	startPositionY: cellInfo.height * 5 - cellInfo.beingPositionCorrection,
};
const playingAreaInfo = {
	width: cellInfo.width * 5,
	height: cellInfo.height * 5,
};

const generateEnemySpeed = function () {
	return Math.floor(Math.random() * (enemyInfo.maxSpeed - enemyInfo.minSpeed)) + enemyInfo.minSpeed;
};

const Being = function (x, y, sprite) {
	this.x = x;
	this.y = y;
	this.sprite = sprite;
};

Being.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

const Enemy = function (x, y, playerInstance) {
	Being.call(this, x, y, enemyInfo.sprite);
	this.speed = generateEnemySpeed();
	this.player = playerInstance;
};

Enemy.prototype = Object.create(Being.prototype);

Enemy.prototype.update = function (dt) {
	this.x += this.speed * dt;
	if (this.x > cellInfo.width * 5) {
		this.x = enemyInfo.startPositionX;
		this.speed = generateEnemySpeed();
	}
	this.checkCollision();
};

Enemy.prototype.checkCollision = function () {
	if (this.x + enemyInfo.width >= this.player.x && this.x < this.player.x + enemyInfo.width && this.y === this.player.y) {
		this.win();
	}
};

Enemy.prototype.win = function () {
	alert("Bugs win\n(You DIE...)");
	this.player.resetGame();
};

const Player = function (x, y) {
	Being.call(this, x, y, playerInfo.sprite);
};

Player.prototype = Object.create(Being.prototype);

Player.prototype.update = function () {};

Player.prototype.win = function () {
	setTimeout(() => {
		alert("You win YEAH!");
		this.resetGame();
	}, 100);
};

Player.prototype.resetGame = function () {
	player.x = playerInfo.startPositionX;
	player.y = playerInfo.startPositionY;
};

Player.prototype.updatePosition = function (newX, newY) {
	if (newX >= 0 && newX <= playingAreaInfo.width) {
		this.x = newX;
	}
	if (newY >= 0 && newY <= playingAreaInfo.height) {
		this.y = newY;
	}
	if (newY < 0) {
		this.y = newY;
		this.win();
	}
};

Player.prototype.handleInput = function (keycode) {
	let newX = this.x,
		newY = this.y;
	switch (keycode) {
		case "up":
			newY = this.y - cellInfo.height;
			break;
		case "right":
			newX = this.x + cellInfo.width;
			break;
		case "down":
			newY = this.y + cellInfo.height;
			break;
		case "left":
			newX = this.x - cellInfo.width;
			break;
		default:
			break;
	}
	this.updatePosition(newX, newY);
};

const player = new Player(playerInfo.startPositionX, playerInfo.startPositionY);

const enemyStartPostionsY = Array.from({ length: 3 }, (v, rowNum) => rowNum + 1).map((rowNumber) => cellInfo.height * rowNumber - cellInfo.beingPositionCorrection);
const allEnemies = enemyStartPostionsY.map((posY) => new Enemy(enemyInfo.startPositionX, posY, player));
document.addEventListener("keyup", function (e) {
	var allowedKeys = {
		37: "left",
		38: "up",
		39: "right",
		40: "down",
	};

	player.handleInput(allowedKeys[e.keyCode]);
});
