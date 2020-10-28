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
			x: this.x,
			y: this.y
		}
	}
}

module.exports = Tank;
