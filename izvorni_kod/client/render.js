import { getMyState, getOthersState } from "./state.js"
import { getAsset } from "./manageAssets.js"

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
//TODO set canvas dimensions 
canvas.width = innerWidth;
canvas.height = innerHeight;

//TODO move to globals
var MAP_SIZE = 3000;

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* function renderTank(me, other){
	const { x, y, bodyAngle, cannonAngle} = other;
	let canvasx = canvas.width / 2 + x - me.x;
	let canvasy = canvas.height / 2 + y - me.y;

	ctx.save()
	ctx.translate(canvasx, canvasy)
	//Rotation
	//rotateBase(me, other)
	ctx.drawImage(getAsset("tankBase.png"), -25, -25, 50, 50);
	//rotateCannon(me, other)
	ctx.drawImage(getAsset("tankTurret.png"), -25, -25, 50, 50);
	ctx.restore()
} */

function renderTank(me, other){
	
	const { x, y, bodyAngle, cannonAngle} = other;
	let canvasx = canvas.width / 2 + x - me.x;
	let canvasy = canvas.height / 2 + y - me.y;
	
	ctx.save()
	ctx.translate(canvasx, canvasy)
	//Rotation
	//rotateBase(me, other)
	ctx.drawImage(getAsset("tankBase.png"), -25, -25, 50, 50);
	//rotateCannon(me, other)
	ctx.drawImage(getAsset("tankTurret.png"), -25, -25, 50, 50);
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

function rotateBase(player, other){
	//TODO move to globals
	let width = 20
	let height = 20 
	let rotation = player.BODY_ANGLE

	ctx.translate(0 + width/2, 0 + height/2)
	ctx.rotate(rotation)
	ctx.translate(0 - width/2, 0 - height/2)
}

function rotateCannon(player, other){
	let width = 50
	let height = 50 
	let rotation = player.CANNON_ANGLE

	ctx.translate(width/2, height/2)
	ctx.rotate(rotation + Math.PI/2 - player.BODY_ANGLE)
	ctx.translate(- width/2, - height/2)
}

function animate(){
	animateLoop()
}

function animateLoop() {
    requestAnimationFrame(animate);

    clear();
	let me = getMyState();
	let others = getOthersState();
	renderTank(me, me);
	Object.values(others).forEach((other) =>{
		renderTank(me, other);
	});
	
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
