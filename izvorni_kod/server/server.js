const express = require('express');
const socketio = require('socket.io');
const Tank = require('./tank');
const Projectile = require('./projectile');

const sockets = {};
const players = {};
const projectiles = [];

const app = express();
app.use(express.static('../client'))
app.use(express.static('../const'))

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
		["t-34.svg", "t34_top.svg"],
		["tankBase.png", "tankTurret.png"],
		["tiger_131.svg", "tiger_131_top.svg"],
	]
	
	let projektili = [
		"boom.svg",
		"bullet.png",
		"kugla.svg"
	]

	let itenkic = Math.floor(Math.random() * tenkici.length)
	let tb = tenkici[itenkic][0]
	let tt = tenkici[itenkic][1]
	let pp = projektili[Math.floor(Math.random() * projektili.length)]

    players[socket.id] = new Tank(socket.id, join["username"], 10, 10, tb, tt, pp);

	socket.on('input', handleInput);
	socket.on('fire', handleShot);
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
		player.update(1);
	});
	Object.keys(projectiles).forEach(projectileID => {
		let projectile = projectiles[projectileID];
		projectile.update();
		Object.keys(players).forEach(playerID => {
			let player = players[playerID]
			if ((Math.abs(player.x - projectile.x) < 20
			  && Math.abs(player.y - projectile.y) < 20)
			  && projectile.player.id != playerID){
				projectile.destroyed = true
				players[playerID].x = 10
				players[playerID].y = 10
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
