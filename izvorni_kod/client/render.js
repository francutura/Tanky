import { getMyState, getOthersState, getProjectiles } from "./state.js"
import { getAsset } from "./manageAssets.js"
import './constants.js'

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
	ctx.drawImage(getAsset("tankBase.png"), -25, -25, window.Constants.PLAYER_WIDTH, window.Constants.PLAYER_HEIGHT);
	rotateCannon(other)
	ctx.drawImage(getAsset("tankTurret.png"), -25, -25, window.Constants.PLAYER_WIDTH, window.Constants.PLAYER_HEIGHT);
	ctx.restore()
}

function renderProjectile(me, projectile){
	let canvasx = canvas.width / 2 + projectile.x - me.x;
	let canvasy = canvas.height / 2 + projectile.y - me.y;
	ctx.save()
	ctx.translate(canvasx, canvasy)
	ctx.drawImage(getAsset("bullet.png"), -25, -25, window.Constants.PLAYER_WIDTH, window.Constants.PLAYER_HEIGHT);
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

function animate(){
	animateLoop()
}

function animateLoop() {
    requestAnimationFrame(animate);

    clear();
	let me = getMyState();
	let others = getOthersState();
	let projectiles = getProjectiles();
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
