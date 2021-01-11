import { getSocket } from './index.js'
import { getMyState } from "./state.js"
import './constants.js'

const player = {
	left: false,
	right: false,
	backward: false,
	forward: false
};

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
		case 13: //ENTER for chat input
			inputChat()
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

function inputChat(){

		let text = document.querySelector(".mytext").value;
		if (text !== ""){
			let message = {
					isMe: true,
					username: getMyState().username,
					text: text
			}
			receiveChat(message)
			message.isMe = false;
			getSocket().emit('chat', message)
		}
		document.querySelector(".mytext").value = ""
}

function sanitize(string) {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match)=>(map[match]));
}

function receiveChat(message){
	let isMe = message.isMe;
	let username = message.username;
	let text = message.text;
	text = sanitize(text)
	username = sanitize(username)
	let appendMe = ""

	if (isMe){
			appendMe = '<li style="width:90%;">' +
				'<div class="msj-rta macro">' +
					'<div class="text text-r">' +
						`<p> ${text} </p>` +
						`<p><small>${username}</small></p>` +
					'</div>' +
				'<div class="avatar" style="padding:0px 0px 0px 10px !important"></div>' +
		  '</li>';
	} else {
			appendMe = '<li style="width:90%">' +
				'<div class="msj macro">' +
					'<div class="text text-l">' +
						`<p> ${text} </p>` +
						`<p><small>${username}</small></p>` +
					'</div>' +
				'</div>' +
			'</li>';                    
	}

	document.querySelector('ul').insertAdjacentHTML('beforeend', appendMe);
	let scroll = document.querySelector("ul");
	scroll.scrollTop = scroll.scrollHeight;
}


function initInput(){
	var canvas = document.querySelector('canvas');
	addEventListener("keydown", onKeyDown, false);
	addEventListener("keyup", onKeyUp, false);

	addEventListener("click", (event) => {
		let angle = Math.atan2(event.clientY - (canvas.height / 2 + window.Constants.PLAYER_HEIGHT / 2), event.clientX - (canvas.width / 2 + window.Constants.PLAYER_HEIGHT / 2))
		getSocket().emit('fire', angle)
	});

	addEventListener("mousemove", e => {
		let angle = Math.atan2(e.offsetY - (canvas.height / 2 + window.Constants.PLAYER_HEIGHT / 2), e.offsetX - (canvas.width / 2 + window.Constants.PLAYER_WIDTH / 2))
		getSocket().emit('cangle', angle)
	});
}

export { initInput, receiveChat }
