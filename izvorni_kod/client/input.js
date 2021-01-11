import { getSocket } from './index.js'
import './constants.js'

const player = {
	left: false,
	right: false,
	backward: false,
	forward: false
};
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
	const emit = {
		"right": player.right,
		"left": player.left,
		"backward": player.backward,
		"forward": player.forward
	}
	getSocket().emit('input', emit);
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
	const emit = {
		"left": player.left,
		"right": player.right,
		"backward": player.backward,
		"forward": player.forward
	}
	getSocket().emit('input', emit);
}


function initInput(){
	addEventListener("keydown", onKeyDown, false);
	addEventListener("keyup", onKeyUp, false);
	addEventListener("click", (event) => {
		let angle = Math.atan2(event.clientY - (canvas.height / 2), event.clientX - (canvas.width / 2))
		getSocket().emit('fire', angle)
	});

	addEventListener("mousemove", e => {
		let angle = Math.atan2(e.clientY - (canvas.height / 2), e.clientX - (canvas.width / 2))
		getSocket().emit('cangle', angle)
	});
	/*
	addEventListener("click", (event) => {
		let angle = Math.atan2(event.clientY - (canvas.height / 2 - window.Constants.PLAYER_HEIGHT / 2), event.clientX - (canvas.width / 2 - window.Constants.PLAYER_HEIGHT / 2))
		getSocket().emit('fire', angle)
	});

	addEventListener("mousemove", e => {
		let angle = Math.atan2(e.clientY - (canvas.height / 2 - window.Constants.PLAYER_HEIGHT / 2), e.clientX - (canvas.width / 2 - window.Constants.PLAYER_WIDTH / 2))
		getSocket().emit('cangle', angle)
	});*/
}

export { initInput }
