import { getMyState, getOthersState, getProjectiles, getMap } from "./state.js"
import { getAsset } from "./manageAssets.js"
var canvas = {};
var ctx = {};

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderUserName(me){
	ctx.font = "15px Arial"
	ctx.fillText(me.username, -(window.Constants.PLAYER_WIDTH / 2), -(window.Constants.PLAYER_HEIGHT / 2));

}

function renderTank(me, other){
	
	let canvasx = canvas.width / 2 + other.x - me.x;
	let canvasy = canvas.height / 2 + other.y - me.y;
	
	ctx.save()
	ctx.translate(canvasx, canvasy)
	me === other ? renderUserName(me) : renderUserName(other);
	me === other ? renderHP(me) : renderHP(other);
	//Rotation
	rotateBase(other)
	ctx.drawImage(getAsset(other.bimg), -(window.Constants.PLAYER_WIDTH / 2), -(window.Constants.PLAYER_HEIGHT / 2), window.Constants.PLAYER_WIDTH, window.Constants.PLAYER_HEIGHT);
	rotateCannon(other)
	ctx.drawImage(getAsset(other.timg), -(window.Constants.PLAYER_WIDTH * 1.75 / 2), -(window.Constants.PLAYER_HEIGHT * 1.75 / 2), window.Constants.PLAYER_WIDTH * 1.75, window.Constants.PLAYER_HEIGHT * 1.75);
	ctx.restore()
	
}

function renderProjectile(me, projectile){
	let canvasx = canvas.width / 2 + projectile.x - me.x;
	let canvasy = canvas.height / 2 + projectile.y - me.y;
	ctx.save()
	ctx.translate(canvasx, canvasy)
	ctx.drawImage(getAsset(projectile.skin),  -window.Constants.PROJECTILE_RADIUS / 2, -window.Constants.PROJECTILE_RADIUS / 2, window.Constants.PROJECTILE_RADIUS, window.Constants.PROJECTILE_RADIUS);
	ctx.restore()
}

function renderHP(me){
	ctx.save()
	ctx.translate(-window.Constants.PLAYER_WIDTH/2, window.Constants.PLAYER_HEIGHT/2)
	ctx.fillStyle = 'blue';
	ctx.fillRect(
		0,
		0,
		window.Constants.PLAYER_WIDTH,
		3,
	);
	ctx.fillStyle = 'red';
	ctx.fillRect(
		0 + window.Constants.PLAYER_WIDTH * me.hp / window.Constants.PLAYER_MAX_HP,
		0,
		window.Constants.PLAYER_WIDTH * (1 - me.hp / window.Constants.PLAYER_MAX_HP),
		3,
	);
	ctx.restore()
	}

function rotateBase(player){
	//TODO move to globals
	let width = window.Constants.PLAYER_WIDTH;
	let height = window.Constants.PLAYER_HEIGHT; 
	let rotation = player.bodya
	ctx.translate(width/2 - (window.Constants.PLAYER_WIDTH / 2), height/2 - (window.Constants.PLAYER_HEIGHT / 2))
	ctx.rotate(rotation)
	ctx.translate(- width/2 + (window.Constants.PLAYER_WIDTH / 2), - height/2 + (window.Constants.PLAYER_HEIGHT / 2))
}

function rotateCannon(player){
	let width = window.Constants.PLAYER_WIDTH;
	let height = window.Constants.PLAYER_HEIGHT; 
	let rotation = player.cannona

	ctx.translate(width/2 - (window.Constants.PLAYER_WIDTH / 2), height/2 - (window.Constants.PLAYER_HEIGHT / 2))
	ctx.rotate(rotation + Math.PI/2 - player.bodya)
	ctx.translate(- width/2 + (window.Constants.PLAYER_WIDTH / 2), - height/2 + (window.Constants.PLAYER_HEIGHT / 2))
}
// OVO JE ORIGINALNA

function renderMap(me, tileMap) {
	if (tileMap.length == 0){
			return
	}
	var tileX = me.x / window.Constants.TILE_WIDTH
	var tileY = me.y / window.Constants.TILE_HEIGHT
	var tilesOnScreenWidth = canvas.width / window.Constants.TILE_WIDTH
	var tilesOnScreenHeight = canvas.height / window.Constants.TILE_HEIGHT
	var startJ = Math.ceil(tileX - tilesOnScreenWidth / 2)
	var endJ = Math.ceil(tileX + tilesOnScreenWidth / 2)
	var startI = Math.ceil(tileY - tilesOnScreenHeight / 2)
	var endI = Math.ceil(tileY + tilesOnScreenHeight / 2)
	for (var i = startI - 10; i < endI + 10; i++) { //magic number 10 in both loops is there as a buffer for tiles. if it wasnt there edge tiles would disapper while moving.
		for (var j = startJ - 10; j < endJ + 10; j++) {
			let canvasx = canvas.width / 2 - me.x;
			let canvasy = canvas.height / 2 - me.y;

			ctx.save()
			ctx.translate(canvasx, canvasy)
			if (i >= 0 && i < (Constants.MAP_SIZE / Constants.TILE_HEIGHT) && j >= 0 && j < (Constants.MAP_SIZE / Constants.TILE_WIDTH)){ 
				if (tileMap[i][j] == 1) {
					ctx.drawImage(getAsset("suhozid.svg"), j * window.Constants.TILE_WIDTH, i * window.Constants.TILE_HEIGHT, window.Constants.TILE_WIDTH, window.Constants.TILE_HEIGHT)
				}
				if (tileMap[i][j] == Constants.SPEED_BOOST_TYPE) {
					ctx.drawImage(getAsset("speedBoost.png"), j * window.Constants.TILE_WIDTH, i * window.Constants.TILE_HEIGHT, window.Constants.TILE_WIDTH, window.Constants.TILE_HEIGHT)
				}
				if (tileMap[i][j] == Constants.TRIPLE_SHOT_TYPE) {
					ctx.drawImage(getAsset("tripleShot.png"), j * window.Constants.TILE_WIDTH, i * window.Constants.TILE_HEIGHT, window.Constants.TILE_WIDTH, window.Constants.TILE_HEIGHT)
				}
				
				if (tileMap[i][j] == Constants.HEALTH_REGEN_TYPE) {
					ctx.drawImage(getAsset("healthRegen.png"), j * window.Constants.TILE_WIDTH, i * window.Constants.TILE_HEIGHT, window.Constants.TILE_WIDTH, window.Constants.TILE_HEIGHT)
				}
			}
			ctx.restore()
		}
	}

}


function animate(){
	canvas = document.querySelector('canvas');
	ctx = canvas.getContext('2d');
	//TODO set canvas dimensions 
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	animateLoop()
}

function animateLoop() {
    requestAnimationFrame(animate);

    clear();
	let me = getMyState();
	let others = getOthersState();
	let projectiles = getProjectiles();
	if (me) {
		// Render ground
		ctx.drawImage(getAsset("livada.svg"), canvas.width / 2 - me.x, canvas.height / 2 - me.y, window.Constants.MAP_SIZE, window.Constants.MAP_SIZE); 
		renderMap(me, getMap()) 
	}
	renderTank(me, me);
	Object.values(others).forEach((other) =>{
		renderTank(me, other);
	});
	Object.values(projectiles).forEach((projectile) =>{
		renderProjectile(me, projectile);
	});
	
}

export {animate}
