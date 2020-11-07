const Constants = require('./constants');

class Tank {
	constructor(id, username, x, y, speed){
		this.id = id;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.username = username;
		
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

		if(forward == true && right == true) {
			this.bodya = Math.PI/4;
		} else if(forward == true && left == true) {
			this.bodya = -Math.PI/4;
		} else if(backward == true && right == true) {
			this.bodya = Math.PI * 3/4;
		} else if(backward == true && left == true) {
			this.bodya = Math.PI* 5/4;
		} else if (backward == true){
			this.bodya = Math.PI;
		} else if(right == true) {
			this.bodya = Math.PI/2;
		} else if(left == true) {
			this.bodya = -Math.PI/2;
		} else {
			this.bodya = 0
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
		
		if (this.turningLeft) {
			this.angularVelocity -= Constants.TURN_SPEED * this.turningLeft;
		}
		if (this.turningRight) {
			this.angularVelocity += Constants.TURN_SPEED * this.turningRight;
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
		}
	}
}

module.exports = Tank;
