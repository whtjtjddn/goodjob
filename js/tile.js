var switchedTiles = new Array(10);
var lavaswitchedTiles = new Array(10);
var anyDown = [];

var Tile = {
	init: function(x, y){
		this.x = x;
		this.y = y;
	},
	update: function() {},
	moving: function(gridsize){	if(!this.hitWall) {
		if(this.vx!=0)
			this.x += gridSize / this.vx;
		if(this.vy!=0)
			this.y += gridSize / this.vy;
	}
	this.hitWall = false;
	},
	onCollide: function(ai) {},
	collide: function(tile){
		if(tile.blocksMovement)
			this.hitWall = true;
	},
	blocksMovement: false,
	blocksOnlyPlayer: false,
	color:"white",
};

// FLOOR TILE
var FloorTile = function(x, y){
	this.init(x, y);
};
FloorTile.prototype = Object.create(Tile);

// WALL TILE
var WallTile = function(x, y){
	this.init(x, y);
	this.blocksMovement = true;
	this.color = "grey";
};
WallTile.prototype = Object.create(Tile);

// VICTORY TILE
var VictoryTile = function(x, y){
	this.init(x, y);
	this.color = "rgb(163, 211, 156)"; //"rgba(95, 255, 80, 1.0)";	
};
VictoryTile.prototype = Object.create(Tile);
VictoryTile.prototype.onCollide = function(ai) {
	world.victory();
};

// LAVA TILE (kills player)
var LavaTile = function(x, y){
	this.init(x, y);
	this.color = "red";
};
LavaTile.prototype = Object.create(Tile);
LavaTile.prototype.onCollide = function(ai) {
	world.death();
};

// SWITCHED TILE (wall that can be on/off)
var SwitchedTile = function(x, y){
	this.init(x, y);
	this.blocksMovement = true;
	this.color = "rgb(253, 198, 137)";
};
SwitchedTile.prototype = Object.create(Tile);
SwitchedTile.prototype.onCollide = function(ai) {
	this.touchingAI = true;
	// console.log(ai);
	this.justTouching = true;
}
SwitchedTile.prototype.update = function() {
	if(!this.justTouching)
		this.touchingAI = false;
	this.justTouching = false;
}
// SWITCHED TILE (wall that can be on/off)
var LavaSwitchedTile = function(x, y){
	this.init(x, y);
	this.blocksMovement = false;
	this.color = "red";
};
LavaSwitchedTile.prototype = Object.create(Tile);
LavaSwitchedTile.prototype.onCollide = function(ai) {
	this.touchingAI = true;
	// console.log(ai);
	this.justTouching = true;
	world.death();
}
LavaSwitchedTile.prototype.update = function() {
	if(!this.justTouching)
		this.touchingAI = false;
	this.justTouching = false;
}

// SWITCH TILE (toggles wall)
var SwitchTile = function(x, y, id){
	this.init(x, y);
	this.switchingId = id;
	this.color = "rgb(255, 247, 153)";
}
SwitchTile.prototype = Object.create(Tile);
SwitchTile.prototype.onCollide = function(ai) {
	this.down = true;
	anyDown[this.switchingId] = true;
	switchedTiles[this.switchingId].blocksMovement = false;
	switchedTiles[this.switchingId].color = "rgb(235, 235, 235)";
}
SwitchTile.prototype.update = function() {
	if(!anyDown[this.switchingId]) {
		if(!switchedTiles[this.switchingId].touchingAI) {
			switchedTiles[this.switchingId].blocksMovement = true;
			switchedTiles[this.switchingId].color = "rgb(253, 198, 137)";
		}
	}
	anyDown[this.switchingId] = false;
}
// SWITCH TILE (toggles wall)
var LavaSwitchTile = function(x, y, id){
	this.init(x, y);
	this.switchingId = id;
	this.color = "rgb(255, 0, 153)";
}
LavaSwitchTile.prototype = Object.create(Tile);
LavaSwitchTile.prototype.onCollide = function(ai) {
	this.down = true;
	anyDown[this.switchingId] = true;
	lavaswitchedTiles[this.switchingId].color = "rgb(235, 235, 235)";
	lavaswitchedTiles[this.switchingId].onCollide = function(ai){};
}
LavaSwitchTile.prototype.update = function() {
	if(!anyDown[this.switchingId]) {
		if(!lavaswitchedTiles[this.switchingId].touchingAI) {
			lavaswitchedTiles[this.switchingId].color = "red";
			lavaswitchedTiles[this.switchingId].onCollide = function(ai){
				world.death();
			};

		}
	}
	anyDown[this.switchingId] = false;
}
// PLAYER WALL TILE (blocks only player)
var PlayerWallTile = function(x, y){
	this.init(x, y);
	this.blocksOnlyPlayer = true;
	this.color = "rgb(155,197,247)";
};
PlayerWallTile.prototype = Object.create(Tile);

var movingTile = function(x,y){
	this.init(x,y);
	this.color = "red";
	this.vx = 7;
	this.vy = 0;
	this.hitWall = false;
}	
movingTile.prototype = Object.create(Tile);
movingTile.prototype.collide = function(tile) {
	if(tile.blocksMovement && !this.hitWall) {
		this.vx *= -1;
		this.hitWall = true;
	}
}
movingTile.prototype.onCollide = function(ai) {
	world.death();
}
movingTile.prototype.moving = function(gridSize) {
	this.hitWall = false;

	if(this.vx!=0)
		this.x += gridSize/this.vx;
	if(this.vy!=0)
		this.y += gridSize/this.vy; 
}


var getTile = function(x, y, id) {
	if(49<id && id<60) {
		t = new LavaSwitchedTile(x, y)
		lavaswitchedTiles[id-20] = t;
		anyDown.push(false);
		return t;
	}
	else if(39<id && id<50) {
		return new LavaSwitchTile(x, y, id-10);
	}
	else if(19<id && id<30) {
		t = new SwitchedTile(x, y)
		switchedTiles[id-20] = t;
		anyDown.push(false);
		return t;
	}
	else if(9<id && id<20) {
		return new SwitchTile(x, y, id-10);
	}
	else {
		switch(id) {
			case 1:
				return new WallTile(x, y);
			case 2:
				return new VictoryTile(x, y);
			case 3:
				return new LavaTile(x, y);
			case 4: 
				return new PlayerWallTile(x, y);
			case 5:
				return new movingTile(x,y);
			default:
				return new FloorTile(x, y);
		}
	}
}

