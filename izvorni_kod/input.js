import { getMe, addProjectile } from "./state.js";
import { Projectile } from "./Projectile.js"

var player;
var canvas = document.querySelector('canvas');

function onKeyDown(event) {
	var keyCode = event.keyCode;
	switch (keyCode) {
		case 68: //d
			player.right = true;
			break;
		case 83: //s
			player.backward = true;
			break;
		case 65: //a
			player.left = true;
			break;
		case 87: //w
			player.forward = true;
			break;
	}
}

function onKeyUp(event) {
	var keyCode = event.keyCode;

	switch (keyCode) {
		case 68: //d
			player.right = false;
			break;
		case 83: //s
			player.backward = false;
			break;
		case 65: //a
			player.left = false;
			break;
		case 87: //w
			player.forward = false;
			break;
	}
}


function initInput(){
	player = getMe()
	addEventListener("keydown", onKeyDown, false);
	addEventListener("keyup", onKeyUp, false);
	addEventListener("click", (event) => {
	  const angle = Math.atan2(event.clientY - (canvas.height / 2 + player.height / 2), event.clientX - (canvas.width / 2 + player.width / 2))
	  const velocity = {
		x: 10 * Math.cos(angle), 
		y: 10 * Math.sin(angle)
	  }
	  
	  addProjectile(new Projectile (canvas.width / 2 + player.width / 2, canvas.height / 2 + player.height / 2, 5, 'darkolivegreen', velocity))
	});
	addEventListener("mousemove", e => {
	   player.CANNON_ANGLE = Math.atan2(e.offsetY - (canvas.height / 2 + player.height / 2), e.offsetX - (canvas.width / 2 + player.width / 2))
	})
}

export { initInput }
