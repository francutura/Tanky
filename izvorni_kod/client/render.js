import { getMyState, getOthersState, getProjectiles } from "./state.js"
import { getAsset } from "./manageAssets.js"
import './constants.js'
//import { TILE_HEIGHT, TILE_WIDTH } from "../const/constants.js";

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
//TODO set canvas dimensions 
canvas.width = innerWidth;
canvas.height = innerHeight;

/// for development purpos
var mapArray = []
var flag = true
for (var i = 0; i < 150; i++) {
	mapArray.push([])
	flag = !flag
	for (var j = 0; j < 150; j++) {
		if (flag === true) {
			mapArray[i].push(1)
			flag = !flag
		} else {
			mapArray[i].push(0)
			flag = !flag
		}
	}
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderUserName(me){
	ctx.font = "15px Arial"
	ctx.fillText(me.username, -32, -28);
}

function renderTank(me, other){
	
	let canvasx = canvas.width / 2 + other.x - me.x;
	let canvasy = canvas.height / 2 + other.y - me.y;
	
	ctx.save()
	ctx.translate(canvasx, canvasy)
	me === other ? renderUserName(me) : renderUserName(other);

	//Rotation
	rotateBase(other)
	ctx.drawImage(getAsset(other.bimg), -25, -25, window.Constants.PLAYER_WIDTH, window.Constants.PLAYER_HEIGHT);
	rotateCannon(other)
	ctx.drawImage(getAsset(other.timg), -25, -25, window.Constants.PLAYER_WIDTH, window.Constants.PLAYER_HEIGHT);
	ctx.restore()
}

function renderProjectile(me, projectile){
	let canvasx = canvas.width / 2 + projectile.x - me.x;
	let canvasy = canvas.height / 2 + projectile.y - me.y;
	ctx.save()
	ctx.translate(canvasx, canvasy)
	ctx.drawImage(getAsset(projectile.skin), -25, -25, window.Constants.PLAYER_WIDTH, window.Constants.PLAYER_HEIGHT);
	ctx.restore()
}

function rotateBase(player){
	//TODO move to globals
	let width = window.Constants.PLAYER_WIDTH;
	let height = window.Constants.PLAYER_HEIGHT; 
	let rotation = player.bodya

	ctx.translate(width/2 - 25, height/2 - 25)
	ctx.rotate(rotation)
	ctx.translate(- width/2 + 25, - height/2 + 25)
}

function rotateCannon(player){
	let width = window.Constants.PLAYER_WIDTH;
	let height = window.Constants.PLAYER_HEIGHT; 
	let rotation = player.cannona

	ctx.translate(width/2 - 25, height/2 - 25)
	ctx.rotate(rotation + Math.PI/2 - player.bodya)
	ctx.translate(- width/2 + 25, - height/2 + 25)
}

function renderMap(me, tileMap) {
	var tileX = me.x / window.Constants.TILE_WIDTH
	var tileY = me.y / window.Constants.TILE_HEIGHT
	console.log(tileX, tileY)
	var tilesOnScreenWidth = canvas.width / window.Constants.TILE_WIDTH
	var tilesOnScreenHeight = canvas.height / window.Constants.TILE_HEIGHT
	var startI = Math.ceil(tileX - tilesOnScreenWidth / 2)
	var endI = Math.ceil(tileX + tilesOnScreenWidth / 2)
	var startJ = Math.ceil(tileY - tilesOnScreenHeight / 2)
	var endJ = Math.ceil(tileY + tilesOnScreenHeight / 2)
	for (var i = startI - 10; i < endI + 10; i++) { //magic number 10 in both loops is there as a buffer for tiles. if it wasnt there edge tiles would disapper while moving.
		for (var j = startJ - 10; j < endJ + 10; j++) {
			let canvasx = canvas.width / 2 - me.x;
			let canvasy = canvas.height / 2 - me.y;

			ctx.save()
			ctx.translate(canvasx, canvasy)
			if (i >= 0 && i <= 150 && j >= 0 && j <= 150){ 
				if (tileMap[i][j] == 0) {
					ctx.drawImage(getAsset("blackTile.png"), i * window.Constants.TILE_WIDTH, j * window.Constants.TILE_HEIGHT, window.Constants.TILE_WIDTH, window.Constants.TILE_HEIGHT)
				} else {
					ctx.drawImage(getAsset("pinkTile.png"), i * window.Constants.TILE_WIDTH, j * window.Constants.TILE_HEIGHT, window.Constants.TILE_WIDTH, window.Constants.TILE_HEIGHT)
				}	
			}
			
			ctx.restore()
		}
	}

}

function animate(){
	animateLoop()
}

function animateLoop() {
    requestAnimationFrame(animate);

    clear();
	let me = getMyState();
	let others = getOthersState();
	let projectiles = getProjectiles();
	if (me) {
		renderMap(me, mapArray)
	}
	renderTank(me, me);
	Object.values(others).forEach((other) =>{
		renderTank(me, other);
	});
	Object.values(projectiles).forEach((projectile) =>{
		renderProjectile(me, projectile);
	});
	
	if (me) {
		ctx.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, window.Constants.MAP_SIZE, window.Constants.MAP_SIZE);
	}
}

export {animate}
