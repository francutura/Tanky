import { getMyState } from "./state.js"
import { getAsset } from "./manageAssets.js"

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
	//rotateBase(me)
	ctx.drawImage(getAsset("tankBase.png"), me.x, me.y, 50, 50);
	//rotateCannon(me)
	ctx.drawImage(getAsset("tankTurret.png"), me.x, me.y, 50, 50);
	ctx.restore()
}

/*
function renderProjectile(projectile){
        ctx.beginPath()
        ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = projectile.color
        ctx.fill()
}
*/

function rotateBase(player){
	//TODO move to globals
	let width = 20
	let height = 20 
	let rotation = player.BODY_ANGLE

	ctx.translate(player.x + width/2, player.y + height/2)
	ctx.rotate(rotation)
	ctx.translate(-player.x - width/2, -player.y - height/2)
}

function rotateCannon(player){
	let width = 20
	let height = 20 
	let rotation = player.CANNON_ANGLE

	ctx.translate(player.x + width/2, player.y + height/2)
	ctx.rotate(rotation + Math.PI/2 - player.BODY_ANGLE)
	ctx.translate(-player.x - width/2, -player.y - height/2)
}

function animate(){
	animateLoop()
}

function animateLoop() {
    requestAnimationFrame(animate);

    clear();
	let me = getMyState();
	renderTank(me);
	
	if (me) {
		ctx.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);
	}
	/*
    
    detectWalls(me);
	let projectiles = getProjectiles()

	projectiles.forEach(projectile => {
		projectile.update()
		renderProjectile(projectile)
	});
	*/
}

export {animate}