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
    players[socket.id] = new Tank(socket.id, "test", 10, 10, 20);

	socket.on('input', handleInput);
	socket.on('disconnect', onDisconnect);
});

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

function update(){
	Object.keys(sockets).forEach(playerID => {
		const player = players[playerID];
		const socket = sockets[playerID];
		player.update(1);
		socket.emit('update', player.serialize());
	});
}
