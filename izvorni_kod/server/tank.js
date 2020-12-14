const Constants = require('../const/constants');

class Tank {
	constructor(id, username, x, y, baseImg, turretImg, bulletSkin){
		this.id = id;
		this.x = x;
		this.y = y;
		this.username = username;
		this.baseImg = baseImg;
		this.turretImg = turretImg;
		this.bulletSkin = bulletSkin;
		
		//Physics
		this.xVelocity = 0;
		this.yVelocity = 0;
		this.power = 0;
		this.reverse = 0;
		this.angularVelocity = 0;
		this.isThrottling = false;
		this.isReversing = false;
		this.turningRight = false;
		this.turningLeft = false;

		// Used for rotating tank
		// body angle and cannon angle
		this.bodya = 0;
		this.cannona = 0;

		//Used to track num of active projectiles
		//Constructs id of projectile using this number
		this.num_projectiles = 0
		this.last_shot_date = 0
	}

	updateDir(forward, backward, left, right){
		if (forward){
			this.isThrottling = true;
		} else {
			this.isThrottling = false;
		}
		if (backward){
			this.isReversing = true;
		} else {
			this.isReversing = false;
		}
		if (left){
			this.turningLeft = true;
		} else {
			this.turningLeft = false;
		}
		if (right){
			this.turningRight = true;
		} else {
			this.turningRight = false;
		}
	}

	update(dt, map){
		let xVelocity = this.xVelocity
		let yVelocity = this.yVelocity
		let power = this.power
		let reverse = this.reverse
		let angularVelocity = this.angularVelocity
		let x = this.x
		let y = this.y

		if (this.isThrottling) {
			power += Constants.POWER_FACTOR * this.isThrottling;
		} else {
			power -= Constants.POWER_FACTOR;
		}
		if (this.isReversing) {
			reverse += Constants.REVERSE_FACTOR;
		} else {
			reverse -= Constants.REVERSE_FACTOR;
		}
		
		power = Math.max(0, Math.min(Constants.MAX_POWER, power));
		reverse = Math.max(0, Math.min(Constants.MAX_REVERSE, reverse));

		let direction = power >= reverse ? 1 : -1;
		
		if (this.turningLeft) {
			angularVelocity -= direction * Constants.TURN_SPEED * this.turningLeft;
		}
		if (this.turningRight) {
			angularVelocity += direction * Constants.TURN_SPEED * this.turningRight;
		}

		xVelocity += Math.sin(this.bodya) * (power - reverse);
		yVelocity += Math.cos(this.bodya) * (power - reverse);

		x += xVelocity;
		y -= yVelocity;

		this.xVelocity = xVelocity
		this.yVelocity = yVelocity
		this.power = power
		this.reverse = reverse

		if (x < 0 || y < 0 || x > Constants.MAP_SIZE || y > Constants.MAP_SIZE){
				this.xVelocity = 0;
				this.yVelocity = 0;
				this.power = 0;
				this.reverse = 0;
				this.angularVelocity = 0;
				return
		}

		if (map.length != 0){
			if (map[Math.round((x)/Constants.TILE_WIDTH)][Math.round((y)/Constants.TILE_HEIGHT)] != 0){
					this.xVelocity = 0;
					this.yVelocity = 0;
					this.power = 0;
					this.reverse = 0;
					this.angularVelocity = 0;
				return
			}
		}

		this.x = x;
		this.y = y;
		this.xVelocity = xVelocity
		this.yVelocity = yVelocity
		this.power = power
		this.reverse = reverse
		this.angularVelocity = angularVelocity

		this.xVelocity *= Constants.DRAG;
		this.yVelocity *= Constants.DRAG;
		this.bodya += this.angularVelocity;
		this.angularVelocity *= Constants.ANGULAR_DRAG;
		//
	}

	serialize(){
		return {
			id: this.id,
			username: this.username,
			x: this.x,
			y: this.y,
			bodya: this.bodya,
			cannona: this.cannona,
			bimg: this.baseImg,
			timg: this.turretImg,
		}
	}
}

module.exports = Tank;
