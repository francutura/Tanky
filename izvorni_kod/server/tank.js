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

	update(dt){
		if (this.isThrottling) {
			this.power += Constants.POWER_FACTOR * this.isThrottling;
		} else {
			this.power -= Constants.POWER_FACTOR;
		}
		if (this.isReversing) {
			this.reverse += Constants.REVERSE_FACTOR;
		} else {
			this.reverse -= Constants.REVERSE_FACTOR;
		}
		
		this.power = Math.max(0, Math.min(Constants.MAX_POWER, this.power));
		this.reverse = Math.max(0, Math.min(Constants.MAX_REVERSE, this.reverse));

		let direction = this.power >= this.reverse ? 1 : -1;
		
		if (this.turningLeft) {
			this.angularVelocity -= direction * Constants.TURN_SPEED * this.turningLeft;
		}
		if (this.turningRight) {
			this.angularVelocity += direction * Constants.TURN_SPEED * this.turningRight;
		}

		this.xVelocity += Math.sin(this.bodya) * (this.power - this.reverse);
		this.yVelocity += Math.cos(this.bodya) * (this.power - this.reverse);

		this.x += this.xVelocity;
		this.y -= this.yVelocity;
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
