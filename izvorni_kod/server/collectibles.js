const Constants = require('../const/constants');

class Collectible {
	constructor(time_created, type, mapX, mapY){
		this.mapX = mapX;
		this.mapY = mapY;
		this.time_created = time_created;
		this.type = type;
		this.destroyed = false;
	}

	isDestroyed(){
		return this.destroyed;
	}

	update(){
		if (this.type == Constants.SPEED_BOOST_TYPE && Date.now() - this.time_created > (Constants.SPEED_BOOST_TIME * 1000)){
			this.destroyed = true;
		} else if (this.type == Constants.TRIPLE_SHOT_TYPE && Date.now() - this.time_created > (Constants.TRIPLE_SHOT_TIME * 1000)){
			this.destroyed = true;
		}
	}

	serialize(){
		return {
			mapX: this.mapX,
			mapY: this.mapY,
			type: this.type
		}
	}

}
module.exports = Collectible;
