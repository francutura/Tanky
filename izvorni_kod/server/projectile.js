const Constants = require('../const/constants');

class Projectile {
	constructor(player, x, y, direction){
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
		this.destroyed = false
	}

	update(){
		this.x += this.velocity.x
        this.y += this.velocity.y
		
		// Destruction
		if (this.x < 0 || this.y < 0 || this.x > Constants.MAP_SIZE || this.y > Constants.MAP_SIZE){
			this.destroyed = true
		}
	}

	isDestroyed(){
		return this.destroyed;
	}

	serialize(){
		return {
			id: this.id,
			x: this.x,
			y: this.y
		}
	}
}

module.exports = Projectile;
