const express = require('express');
const socketio = require('socket.io');
const Tank = require('./tank');
const Projectile = require('./projectile');
const Constants = require('../const/constants');
const Game = require('./game');
const MapGenerator = require('./map');

const app = express();
app.use(express.static('../client'))
app.use(express.static('../const'))

const port = 8000
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const deepCopyFunction = (inObject) => {
  let outObject, value, key

  if (typeof inObject !== "object" || inObject === null) {
    return inObject
  }

  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    outObject[key] = deepCopyFunction(value)
  }

  return outObject
}

let mg = new MapGenerator()
mg.random_map()
const io = socketio(server);
const first = new Game();
const runningGames = []
runningGames.push(first)
first.setMap(deepCopyFunction(mg.map))
first.spawn_points = deepCopyFunction(mg.spawn_points)

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
			mg.random_map()
			runningGames.push(temp)
			temp.setMap(deepCopyFunction(mg.map))
			temp.spawn_points = deepCopyFunction(mg.spawn_points)
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
