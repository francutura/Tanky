const Constants = require('../const/constants');

class Projectile {
	constructor(player, x, y, direction, skin){
		// Player who owns the projectile
		this.player = player;
		this.id = ("" + player.id) + ("" + player.num_projectiles)
		player.num_projectiles += 1
		this.x = x;
		this.y = y;
		this.velocity = {
			x: 10 * Math.cos(direction), 
			y: 10 * Math.sin(direction)
		}
		this.destroyed = false;
		this.skin = skin;
	}

	update(dt, map){
		let x = this.x
		let y = this.y
		x += this.velocity.x
        y += this.velocity.y
		
		// Destruction
		if (x < 0 || y < 0 || x > Constants.MAP_SIZE || y > Constants.MAP_SIZE){
			this.destroyed = true;
			return
		}


		let xkor = Math.round(x/Constants.TILE_WIDTH)
		let ykor = Math.round(y/Constants.TILE_HEIGHT)
		if (ykor < map.length && xkor < map[0].length){
			if (map[ykor][xkor] != 0){
				this.destroyed = true;
				return
			}
		}

		this.x = x;
		this.y = y;
	}

	isDestroyed(){
		return this.destroyed;
	}

	serialize(){
		return {
			id: this.id,
			x: this.x,
			y: this.y,
			skin: this.skin
		}
	}
}

module.exports = Projectile;
