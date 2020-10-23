import { getMe, getProjectiles } from "./state.js"

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d'); 
canvas.width = innerWidth;
canvas.height = innerHeight;

//TODO move to globals
var MAP_SIZE = 3000;

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderTank(me){
	let canvasx = canvas.width / 2 - me.x;
	let canvasy = canvas.height / 2 - me.y;

	ctx.save()
	ctx.translate(canvasx, canvasy)
	//Rotacija
	rotateBase(me)
	ctx.drawImage(me.baseImg, me.x, me.y, me.width, me.height);
	rotateCannon(me)
	ctx.drawImage(me.cannonImg, me.x, me.y, me.width, me.height);
	ctx.restore()
}

function renderProjectile(projectile){
        ctx.beginPath()
        ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = projectile.color
        ctx.fill()
}

function rotateBase(player){
	let width = player.width
	let height = player.height
	let rotation = player.BODY_ANGLE

	ctx.translate(player.x + width/2, player.y + height/2)
	ctx.rotate(rotation)
	ctx.translate(-player.x - width/2, -player.y - height/2)
}

function rotateCannon(player){
	let width = player.width
	let height = player.height
	let rotation = player.CANNON_ANGLE

	ctx.translate(player.x + width/2, player.y + height/2)
	ctx.rotate(rotation + Math.PI/2 - player.BODY_ANGLE)
	ctx.translate(-player.x - width/2, -player.y - height/2)
}

//TODO implement
function detectWalls(player){
	if (player.x < 0) {
		player.x = 0;
	}

	// Right Wall
	if (player.x + player.width > MAP_SIZE) {
		player.x = MAP_SIZE - player.w;
	}

	// Top wall
	if (player.y < 0) {
		player.y = 0;
	}

	// Bottom Wall
	if (player.y + player.height > MAP_SIZE) {
		player.y = MAP_SIZE - player.h;
	}
}
function updateState(){
	return true;
}

function animate(){
	animateLoop()
}

function animateLoop() {
    requestAnimationFrame(animate);

    clear();
	let me = getMe()
	me.update()
    renderTank(me, me);
	updateState(me);

	ctx.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);
    
    detectWalls(me);
	let projectiles = getProjectiles()

	projectiles.forEach(projectile => {
		projectile.update()
		renderProjectile(projectile)
	});
}

export {animate}
