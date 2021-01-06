import {downloadAllAssets} from "./manageAssets.js"
import * as Render from "./render.js"
import { initInput } from "./input.js"
import { setState, setMap } from "./state.js"

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

async function connect(){
	socket.on('connect', () => {
		console.log("Connected?");
	});
};

async function start(){
	downloadAllAssets();
	await connect();
	let nickname = sessionStorage.getItem("nick");
	let joinUpdate = {}
	joinUpdate["username"] = nickname
	socket.emit('join', joinUpdate)
	socket.on('update', (update) => setState(update));
    socket.on('setmap', (map) => setMap(map));
	initInput();
	Render.animate()
}

function getSocket(){
	return socket;
}

start();

export { getSocket }
