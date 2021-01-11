import { getMyState, getOthersState, getProjectiles, getMap } from "./state.js"
import { getAsset } from "./manageAssets.js"
import './constants.js'
//import { TILE_HEIGHT, TILE_WIDTH } from "../const/constants.js";
/*
let mapArray = []
let flag = true
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
}*/




var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
//TODO set canvas dimensions 
canvas.width = innerWidth;
canvas.height = innerHeight;

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

	//Rotation
	rotateBase(other)
	ctx.beginPath();
	ctx.lineWidth = "4";
	ctx.strokeStyle = "blue";
	ctx.rect(-(window.Constants.PLAYER_WIDTH / 2), -(window.Constants.PLAYER_HEIGHT / 2), window.Constants.PLAYER_WIDTH, window.Constants.PLAYER_HEIGHT)
	ctx.stroke()
	//ctx.drawImage(getAsset(other.bimg), -(window.Constants.PLAYER_WIDTH / 2), -(window.Constants.PLAYER_HEIGHT / 2), window.Constants.PLAYER_WIDTH, window.Constants.PLAYER_HEIGHT);
	rotateCannon(other)
	ctx.drawImage(getAsset(other.timg), -(window.Constants.PLAYER_WIDTH / 2), -(window.Constants.PLAYER_HEIGHT / 2), window.Constants.PLAYER_WIDTH, window.Constants.PLAYER_HEIGHT);
	ctx.restore()

	//ctx.save()
	//ctx.translate(canvasx, canvasy)
	//ctx.beginPath();
	//ctx.lineWidth = "4";
	//ctx.strokeStyle = "red";
	//ctx.rect(0, 0, 5, 5);
	//ctx.stroke();
	//ctx.restore()
	
}

function renderProjectile(me, projectile){
	let canvasx = canvas.width / 2 + projectile.x - me.x;
	let canvasy = canvas.height / 2 + projectile.y - me.y;
	ctx.save()
	ctx.translate(canvasx, canvasy)
	ctx.drawImage(getAsset(projectile.skin), -(window.Constants.PLAYER_WIDTH / 2), -(window.Constants.PLAYER_HEIGHT / 2), window.Constants.PLAYER_WIDTH, window.Constants.PLAYER_HEIGHT);
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
					ctx.drawImage(getAsset("blackTile.png"), j * window.Constants.TILE_WIDTH, i * window.Constants.TILE_HEIGHT, window.Constants.TILE_WIDTH, window.Constants.TILE_HEIGHT)
				}
			}
			
			ctx.restore()
		}
	}

}

//OVO JE ZA TESTIRANJE
/*
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

}*/


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
		// Render ground
		ctx.drawImage(getAsset("livada.svg"), canvas.width / 2 - me.x, canvas.height / 2 - me.y, window.Constants.MAP_SIZE, window.Constants.MAP_SIZE); 
		renderMap(me, getMap()) 
		//renderMap(me, mapArray) //ovo je za testiranje
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
