const express = require('express');
const socketio = require('socket.io');
const Tank = require('./tank');
const Projectile = require('./projectile');
const Constants = require('../const/constants');
const Game = require('./game');

const app = express();
app.use(express.static('../client'))
app.use(express.static('../const'))

const port = 6969
const server = app.listen(port);
console.log(`Server listening on port ${port}`);


let map = []
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
const first = new Game();
const runningGames = []
runningGames.push(first)
first.setMap(map)

io.on('connection', socket => {
	let handshake = socket.handshake;
	console.log(handshake.time + ': Connected ' + handshake.address);
	socket.on('join', joinGame);
});

function joinGame(join){
		let all_full = true
		for (let i = 0; i < runningGames.length; i++){
			let game = runningGames[i];
			if (game.playernum <= Constants.MAX_PLAYERS_ALLOWED - 1){
					all_full = false
			}
		}
		if (all_full == true){
			let temp = new Game()
			runningGames.push(temp)
			temp.setMap(map)
			temp.onJoin(this, join);
			console.log("joined new game");
			return;
		}

		for (let i = 0; i < runningGames.length; i++){
			let game = runningGames[i];
			if (game.playernum <= Constants.MAX_PLAYERS_ALLOWED - 1){
					game.onJoin(this, join)
					console.log("joined old game: " + i);
					return
			}
		}
}
