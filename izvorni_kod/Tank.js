class Tank {
	constructor(x, y,speed, baseImg, cannonImg){
		this.x = x;
		this.y = y;
		this.speed = speed;

		this.CANNON_ANGLE = 0;
		this.BODY_ANGLE = 0;

		this.baseImg = baseImg;
		this.cannonImg = cannonImg;

		this.width = 50;
		this.height = 70;

		this.forward = false;
		this.backward = false;
		this.left = false;
		this.right = false;
	}

	update(){
		if (this.forward){
			this.y -= this.speed
			if (this.right){
				this.BODY_ANGLE = Math.PI/4;
			} else if (this.left) {
				this.BODY_ANGLE = -Math.PI/4;
			} else {
				this.BODY_ANGLE = 0;
			}
		}
		if (this.backward){
			this.y += this.speed
			if (this.right){
				this.BODY_ANGLE = Math.PI * 3/4;
			} else if (this.left) {
				this.BODY_ANGLE = Math.PI* 5/4;
			} else {
				this.BODY_ANGLE = Math.PI;
			}
		}
		if (this.left){
			this.x -= this.speed;
			if (this.forward == false && this.backward == false){
				this.BODY_ANGLE = -Math.PI/2;
			}
		}
		if (this.right){
			this.x += this.speed
			if (this.forward == false && this.backward == false){
				this.BODY_ANGLE = Math.PI/2;
			}
		}
	}
}

export {Tank}
