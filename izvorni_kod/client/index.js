import {downloadAllAssets, getAsset} from "./manageAssets.js"
import * as Render from "./render.js"
import { initInput } from "./input.js"
import { setMyState } from "./state.js"

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

async function connect(){
	socket.on('connect', () => {
		console.log("Connected?");
	});
};

async function start(){
	await downloadAllAssets();
	await connect();
	socket.on('update', (update) => setMyState(update));
	initInput();
	Render.animate()
}

function getSocket(){
	return socket;
}

console.log("started?")
start();
console.log("2started?")

export { getSocket }
