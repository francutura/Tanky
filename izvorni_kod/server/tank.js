class Tank {
	constructor(id, username, x, y, speed){
		this.id = id;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.username = username;

		this.forward = false;
		this.backward = false;
		this.right = false;
		this.left = false;

		// Used for rotating tank
		// body angle and cannon angle
		this.bodya = 0;
		this.cannona = 0;
	}

	updateDir(forward, backward, left, right){
		if (forward){
			this.forward = true;
		} else {
			this.forward = false;
		}
		if (backward){
			this.backward = true;
		} else {
			this.backward = false;
		}
		if (left){
			this.left = true;
		} else {
			this.left = false;
		}
		if (right){
			this.right = true;
		} else {
			this.right = false;
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
		if (this.forward){
			this.y -= this.speed * dt;
		}
		if (this.backward){
			this.y += this.speed * dt;
		}
		if (this.left){
			this.x -= this.speed * dt;
		}
		if (this.right){
			this.x += this.speed * dt;
		}
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
