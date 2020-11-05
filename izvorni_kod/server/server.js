const express = require('express');
const socketio = require('socket.io');
const Tank = require('./tank');

const sockets = {};
const players = {};
const bullets = [];

const app = express();
app.use(express.static('../client'))

const port = 6969
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const io = socketio(server);

setInterval(update.bind(this), 1000 / 60);

io.on('connection', socket => {
	console.log('Player connected!', socket.id);

	sockets[socket.id] = socket;

	socket.on('join', onJoin);
});

function onJoin(join){
	let socket = this;
    players[socket.id] = new Tank(socket.id, join["username"], 10, 10, 20);

	socket.on('input', handleInput);
	socket.on('shoot', handleShot);
	socket.on('cangle', changeCannonAngle);
	socket.on('disconnect', onDisconnect);
}

function onDisconnect(){
	delete sockets[this.id];
    delete players[this.id];
}

function handleInput(input){
	let socket = this;
	if (players[socket.id]){
		let forward = input['forward'];
		let backward = input['backward'];
		let left = input['left'];
		let right = input['right'];
		players[socket.id].updateDir(forward, backward, left, right);
	}
}

function changeCannonAngle(angle){
	let socket = this;
	if (players[socket.id]){
		players[socket.id].cannona = angle
	}
}

//TODO implement
function handleShot(input){
	let socket = this;
}

//TODO implement
function getNearbyPlayers(id){
	temp = []
	Object.keys(players).forEach(playerID => {
		if(id != playerID){
			temp.push(players[playerID].serialize());
		}
	});
	return temp
}

//TODO implement
function getNearbyBullets(id){
	return []
}

function update(){
	Object.keys(players).forEach(playerID => {
		const player = players[playerID];
		player.update(1);
	});
	Object.keys(players).forEach(playerID => {
		const socket = sockets[playerID];
		update = {}
		update['me'] = players[playerID].serialize();
		update['others'] = getNearbyPlayers(playerID);
		update['bullets'] = getNearbyBullets(playerID);
		socket.emit('update', update);
	});
}
