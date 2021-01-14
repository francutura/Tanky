const socketio = require('socket.io');
const Tank = require('./tank');
const Projectile = require('./projectile');
const Constants = require('../const/constants');
const Collectible = require('./collectibles');

class Game{

		constructor(){
				this.gameID = "test";
				this.sockets = {};
				this.players = {};
				this.projectiles = [];
				this.collectibles = [];
				this.map = [];
				this.playernum = 0;
				this.collectible_spawn_date = 0;
				setInterval(this.update.bind(this), 1000 / 60);
		}

		setMap(map){
				this.map = map;
		}

		onJoin(socket, join){
			this.playernum += 1;
			this.sockets[socket.id] = socket;
			socket.emit('setmap', this.map);

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

			this.players[socket.id] = new Tank(socket.id, join["username"], 400, 400, tb, tt, pp);

				socket.on('input', (input) => this.handleInput(socket, input));
				socket.on('fire', (shot) => this.handleShot(socket, shot));
				socket.on('cangle', (cangle) => this.changeCannonAngle(socket, cangle));
				socket.on('disconnect', () => this.onDisconnect(socket));
				socket.on('chat', (message) => this.handleChat(socket, message))
		}

		handleChat(socket, message){

			if (message.text.length > 160){
				message.text = message.text.slice(0, 160)
			}
			
			Object.keys(this.players).forEach(playerID => {
				const otherSocket = this.sockets[playerID];
				if (otherSocket !== socket) {
						otherSocket.emit('chat', message);
				}
			});
		}

		onDisconnect(socket){
			this.playernum -= 1;
			delete this.sockets[socket.id];
			delete this.players[socket.id];
		}

		handleInput(socket, input){
			if (this.players[socket.id]){
				let forward = input['forward'];
				let backward = input['backward'];
				let left = input['left'];
				let right = input['right'];
				this.players[socket.id].updateDir(forward, backward, left, right);
			}
		}

		changeCannonAngle(socket, angle){
			if (this.players[socket.id]){
				this.players[socket.id].cannona = angle
			}
		}

		//TODO implement
		handleShot(socket, angle){
			if (this.players[socket.id] && Date.now() - this.players[socket.id].last_shot_date > 1000){
				if (this.players[socket.id].isTripleShotActive === true){
					let projectile2 = new Projectile(this.players[socket.id], this.players[socket.id].x, this.players[socket.id].y, angle + Constants.TRIPLE_SHOT_ANGLE, this.players[socket.id].bulletSkin)
					let projectile3 = new Projectile(this.players[socket.id], this.players[socket.id].x, this.players[socket.id].y, angle - Constants.TRIPLE_SHOT_ANGLE, this.players[socket.id].bulletSkin)
				this.projectiles.push(projectile2);
				this.projectiles.push(projectile3);
				}
				let projectile = new Projectile(this.players[socket.id], this.players[socket.id].x, this.players[socket.id].y, angle, this.players[socket.id].bulletSkin)
				this.projectiles.push(projectile);
				this.players[socket.id].last_shot_date = Date.now();
			}
		}

		//TODO implement
		getNearbyPlayers(id){
			let temp = []
			Object.keys(this.players).forEach(playerID => {
				if(id != playerID){
					temp.push(this.players[playerID].serialize());
				}
			});
			return temp
		}

		//TODO implement
		getNearbyProjectiles(id){
			let temp = []
			Object.keys(this.projectiles).forEach(projectile => {
				temp.push(this.projectiles[projectile].serialize());
			});
			return temp
		}

		spawnCollectible(){
			let mapx = 0;
			let mapy = 0;

			do{
				mapx = Math.floor(Math.random() * this.map.length)
				mapy = Math.floor(Math.random() * this.map[0].length)
			} while(this.map[mapx][mapy] != 0)

			let collectible_type = Constants.LIST_OF_COLLECTIBLES[Math.floor(Math.random() * Constants.LIST_OF_COLLECTIBLES.length)]
			let tmp = new Collectible(Date.now(), collectible_type, mapx, mapy)
			this.collectibles.push(tmp);
			this.map[mapy][mapx] = collectible_type;
			Object.keys(this.players).forEach(playerID => {
				const socket = this.sockets[playerID];
				socket.emit('spawn_collectible', tmp.serialize());
			});
		}

		update(){

			if (this.playernum > 0 && Date.now() - this.collectible_spawn_date > (Constants.COLLECTIBLES_SPAWN_RATE * 1000)){
				this.collectible_spawn_date = Date.now();
				this.spawnCollectible()
			}

			for (let i = 0; i < this.collectibles.length; i++){
				let collectible = this.collectibles[i];
				collectible.update()
				if (collectible.isDestroyed()){
					this.collectibles.splice(i, 1);
					this.map[collectible.mapY][collectible.mapX] = 0;
					Object.keys(this.players).forEach(playerID => {
						const socket = this.sockets[playerID];
						socket.emit('despawn_collectible', collectible.serialize());
					});
					break;
				}
			}

			Object.keys(this.players).forEach(playerID => {
				const player = this.players[playerID];
				player.update(1, this.map, this.collectibles);
			});

			Object.keys(this.projectiles).forEach(projectileID => {
				let projectile = this.projectiles[projectileID];
				projectile.update(1, this.map);

				Object.keys(this.players).forEach(playerID => {
					let player = this.players[playerID]
					if ((Math.abs(player.x - projectile.x) < Constants.PROJECTILE_RADIUS
					  && Math.abs(player.y - projectile.y) < Constants.PROJECTILE_RADIUS)
					  && projectile.player.id != playerID){
						projectile.player.kills++;
						projectile.destroyed = true
						this.players[playerID].x = 100
						this.players[playerID].y = 100
						this.players[playerID].bodya = 1.57
					}
				});
			})

			Object.keys(this.players).forEach(playerID => {
				const socket = this.sockets[playerID];
				let update = {}
				update['me'] = this.players[playerID].serialize();
				update['others'] = this.getNearbyPlayers(playerID);
				update['projectiles'] = this.getNearbyProjectiles(playerID);
				socket.emit('update', update);
			});

			Object.keys(this.projectiles).forEach(projectileID => {
				if (this.projectiles[projectileID].isDestroyed()){
					delete this.projectiles[projectileID];
				}
			});
		}
}

module.exports = Game;
