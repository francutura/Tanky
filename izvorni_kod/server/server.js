const express = require('express');
const socketio = require('socket.io');
const Tank = require('./tank');
const Projectile = require('./projectile');
const Constants = require('../const/constants');

const sockets = {};
const players = {};
const projectiles = [];
const map = [];

const app = express();
app.use(express.static('../client'))
app.use(express.static('../const'))

const port = 6969
const server = app.listen(port);
console.log(`Server listening on port ${port}`);


//SETUP MAP
for (let i = 0; i < (Constants.MAP_SIZE / Constants.TILE_WIDTH); i++){
		map.push([])
		for (let j = 0; j < (Constants.MAP_SIZE / Constants.TILE_HEIGHT); j++){
				map[i].push(0)
		}
}

//dodani dio
function make_line(starting_point_x, starting_point_y, length_x, length_y){
	for (let i = starting_point_y; i < starting_point_y + length_y; i++){
		for(let j = starting_point_x; j < starting_point_x + length_x; j++){
			map[i][j] = 1
		}
	}
}

function make_diagonal_line(starting_point_x, starting_point_y, length, direction){
	for (let i = 0; i < length; i++){
		if (direction == true)
			map[starting_point_y + i][starting_point_x + i] = 1
		else
			map[starting_point_y + i][starting_point_x - i] = 1
	}
}

function make_U_Z(starting_point_x, starting_point_y, length_x, length_y, left_direction, right_direction){
	for (let i = 0; i < length_x; i++){
		map[starting_point_y][starting_point_x + i] = 1
	}

	for (let i = 0; i < length_y; i++){
		if(left_direction == true)
			map[starting_point_y - i][starting_point_x] = 1
		else
			map[starting_point_y + i][starting_point_x] = 1
	}

	for (let i = 0; i < length_y; i++){
		if(right_direction == true)
			map[starting_point_y - i][starting_point_x + length_x - 1] = 1
		else
			map[starting_point_y + i][starting_point_x + length_x - 1] = 1
	}
}

function make_simbol(starting_point_x, starting_point_y, length){
	for(let i = 0; i < length; i++){
		map[starting_point_y][starting_point_x + i] = 1 //gornja horizontalna
		map[starting_point_y + length][starting_point_x + i] = 1 //donja horizontalna
		map[starting_point_y + i][starting_point_x + length - 1] = 1 //desna vertikalna
		map[starting_point_y + Math.round(i/2)][starting_point_x] = 1 //pola lijeve vertikalne
		map[starting_point_y + Math.round(length/2)][starting_point_x + Math.round(i/2)] = 1 //pola horizontalne
	}
}

make_line(5, 5, 10, 3)
make_line(5, 10, 3, 10)

make_line(28, 5, 1, 11)
make_line(23, 4, 9, 1)

make_diagonal_line(15, 25, 6, true)
make_diagonal_line(11, 25, 6, false)
make_U_Z(8, 40, 10, 5, true, true)
make_line(5, 45, 10, 2)
make_line(23, 48, 2, 8)


make_U_Z(20, 20, 10, 10, true, false)


make_simbol(35, 20, 15)

//SETUP MAP

const io = socketio(server);

setInterval(update.bind(this), 1000 / 60);

io.on('connection', socket => {
	console.log('Player connected!', socket.id);

	sockets[socket.id] = socket;

	socket.emit('setmap', map);
	socket.on('join', onJoin);
});

function onJoin(join){
	let socket = this;
	if (!join["username"]){
		join["username"] = "None"
	}
	else if (join["username"].length > 20){
		join["username"] = join["username"].slice(0, 20)
	}

	let tenkici = [
		["M1A.svg", "M1A_top.svg"],
		["matilda.svg", "matilda_top.svg"],
		["pl-01.svg", "pl-01_top.svg"],
		["sherman.svg", "sherman_top.svg"],
		["t-34.svg", "t-34_top.svg"],
		//["tankBase.png", "tankTurret.png"],
		["tiger_131.svg", "tiger_131_top.svg"],
	]
	
	let projektili = [
		//"boom.svg",
		//"bullet.png",
		"kugla.svg"
	]

	let itenkic = Math.floor(Math.random() * tenkici.length)
	let tb = tenkici[itenkic][0]
	let tt = tenkici[itenkic][1]
	let pp = projektili[Math.floor(Math.random() * projektili.length)]

    players[socket.id] = new Tank(socket.id, join["username"], 400, 400, tb, tt, pp);

	socket.on('input', handleInput);
	socket.on('fire', handleShot);
	socket.on('cangle', changeCannonAngle);
	socket.on('disconnect', onDisconnect);
	socket.on('chat', handleChat)
}

function handleChat(message){

	if (message.text.length > 160){
		message.text = message.text.slice(0, 160)
	}
	
	Object.keys(players).forEach(playerID => {
		const socket = sockets[playerID];
		if (socket !== this) {
				socket.emit('chat', message);
		}
	});
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
function handleShot(angle){
	let socket = this;
	if (players[socket.id] && Date.now() - players[socket.id].last_shot_date > 1000){
		let projectile = new Projectile(players[socket.id], players[socket.id].x, players[socket.id].y, angle, players[socket.id].bulletSkin)
		projectiles.push(projectile);
		players[socket.id].last_shot_date = Date.now();
	}
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
function getNearbyProjectiles(id){
	temp = []
	Object.keys(projectiles).forEach(projectile => {
		temp.push(projectiles[projectile].serialize());
	});
	return temp
}

function update(){
	Object.keys(players).forEach(playerID => {
		const player = players[playerID];
		player.update(1, map);
	});
	Object.keys(projectiles).forEach(projectileID => {
		let projectile = projectiles[projectileID];
		projectile.update(1, map);
		Object.keys(players).forEach(playerID => {
			let player = players[playerID]
			if ((Math.abs(player.x - projectile.x) < 20
			  && Math.abs(player.y - projectile.y) < 20)
			  && projectile.player.id != playerID){
				projectile.player.kills++;
				projectile.destroyed = true
				players[playerID].x = 100
				players[playerID].y = 100
				players[playerID].bodya = 1.57
			}
		});
	})
	Object.keys(players).forEach(playerID => {
		const socket = sockets[playerID];
		update = {}
		update['me'] = players[playerID].serialize();
		update['others'] = getNearbyPlayers(playerID);
		update['projectiles'] = getNearbyProjectiles(playerID);
		socket.emit('update', update);
	});
	Object.keys(projectiles).forEach(projectileID => {
		if (projectiles[projectileID].isDestroyed()){
			delete projectiles[projectileID];
		}
	});
}
