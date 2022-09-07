import {downloadAllAssets} from "./manageAssets.js"
import * as Render from "./render.js"
import { initInput, receiveChat } from "./input.js"
import { setState, setMap, spawnCollectible, despawnCollectible } from "./state.js"

var socket = {}
var socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';

async function connect(){
	await socket.on('connect', () => {
		console.log("Connected to server");
	});
};

async function start(nickname){
	socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

	socket.on('update', (update) => setState(update));
    socket.on('setmap', (map) => setMap(map));
	socket.on('chat', (message) => receiveChat(message))
	socket.on('spawn_collectible', (collectible) => spawnCollectible(collectible))
	socket.on('despawn_collectible', (collectible) => despawnCollectible(collectible))
	socket.on('')
	await downloadAllAssets();
	await connect();
    let addMe = `<div id="leaderboard">` + `<div class="rowic">` +`<div id="name" class="name">Player1</div><div class="score">0</div>` +`</div>` +`</div>` +`<div class="frame">` +`<ul></ul>` +`<input class="mytext" placeholder="Type a message" maxlength="160"/>` +`</div>` +`<canvas id = canvas></canvas>`
	$("body").append(addMe)
	$("#removeme").remove()
	let joinUpdate = {}
	joinUpdate["username"] = nickname
	socket.emit('join', joinUpdate)
	initInput();
	Render.animate()
}

function getSocket(){
	return socket;
}

export { getSocket, start }
