const Constants = require('../const/constants');

class Tank {
	constructor(id, username, x, y, baseImg, turretImg, bulletSkin){
		this.id = id;
		this.x = x;
		this.y = y;
		this.hp = Constants.PLAYER_MAX_HP;
		this.username = username;
		this.baseImg = baseImg;
		this.turretImg = turretImg;
		this.bulletSkin = bulletSkin;
		this.kills = 0;

		// Collectibles
		this.isSanicActive = false;
		this.sanicTimeRemaining = 0;
		this.isTripleShotActive = false;
		this.tripleShotTimeRemaining = 0;
		
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

	isDestroyed(){
		return (this.hp <= 0);
	}

	respawn(respawn_point){
		this.hp = Constants.PLAYER_MAX_HP
		this.isSanicActive = false;
		this.isTripleShotActive = false;
		this.x = respawn_point.x
		this.y = respawn_point.y
		this.bodya = respawn_point.bodya
	}

	calculateVertices(x, y, bodya){
		if(bodya < 0){
			bodya = bodya + Math.PI * 2
		}
		let hypothenuse = Math.hypot(Constants.PLAYER_WIDTH / 2, Constants.PLAYER_HEIGHT / 2)
		let angles = [0, 0, 0, 0]
		angles[0] = (3 * Math.PI / 2 + Math.atan((Constants.PLAYER_HEIGHT / 2) / (Constants.PLAYER_WIDTH / 2))	) 
		angles[1] = (Math.PI / 2 - Math.atan((Constants.PLAYER_HEIGHT / 2) / (Constants.PLAYER_WIDTH / 2))) 
		angles[2] = (Math.PI - Math.atan((Constants.PLAYER_WIDTH / 2) / (Constants.PLAYER_HEIGHT / 2))) 
		angles[3] = (Math.PI + Math.atan((Constants.PLAYER_WIDTH / 2) / (Constants.PLAYER_HEIGHT / 2)) )

		let edges = [[0, 0], [0, 0], [0, 0], [0, 0]]

		edges[0][0] = Math.ceil((x + hypothenuse * Math.sin((bodya + angles[0]) % (Math.PI * 2)))) 
		edges[0][1] = Math.ceil((y + hypothenuse * - Math.cos((bodya + angles[0]) % (Math.PI * 2))))
		edges[1][0] = Math.ceil((x + hypothenuse * Math.sin((bodya + angles[1]) % (Math.PI * 2))))
		edges[1][1] = Math.ceil((y + hypothenuse * - Math.cos((bodya + angles[1]) % (Math.PI * 2))))
		edges[2][0] = Math.ceil((x + hypothenuse * Math.sin((bodya + angles[2]) % (Math.PI * 2))))
		edges[2][1] = Math.ceil((y + hypothenuse * - Math.cos((bodya + angles[2]) % (Math.PI * 2))))
		edges[3][0] = Math.ceil((x + hypothenuse * Math.sin((bodya + angles[3]) % (Math.PI * 2))))
		edges[3][1] = Math.ceil((y + hypothenuse * - Math.cos((bodya + angles[3]) % (Math.PI * 2))))
		
		return edges;
	}

	vertexEdgeRelation(xp, yp, x1, y1, x2, y2){
		let A = +(y2 - y1)
		let B = x2 - x1
		let C = -(A * x1 - B * y1)
		return (A * xp + B * - yp + C)
	}

	isColidingWithPorjectile(x, y){
		let edges = this.calculateVertices(this.x, this.y, this.bodya)
		edges[4] = edges[0]
		for(let i = 0; i < 4; i++){
			if(this.vertexEdgeRelation(x, y, edges[i][0], edges[i][1], edges[i+1][0], edges[i+1][1]) > 0){
				return false
			}
		}
		return true
	}

	onSegment(p, q, r){
		if( (q[0] <= Math.max(p[0], r[0])) && (q[0] >= Math.min(p[0], r[0])) && (q[1] <= Math.max(p[1], r[1])) && (q[1] >= Math.min(p[1], r[1])))
			return true
		return false
	}

	orientation(p, q, r){
		let value = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1])

		if (value > 0){
    	// Clockwise orientation 
		return 1
	} else if (value < 0){ 
        // Counterclockwise orientation 
		return 2
	} else {     
        // Colinear orientation 
        return 0
	}
	}

	intersect(p1, q1, p2 ,q2){
		let o1 = this.orientation(p1, q1, p2) 
    	let o2 = this.orientation(p1, q1, q2) 
    	let o3 = this.orientation(p2, q2, p1) 
		let o4 = this.orientation(p2, q2, q1) 
		
		if((o1 != o2) && (o3 != o4))
			return true
		if ((o1 == 0) && this.onSegment(p1, p2, q1)) 
			return true
		if ((o2 == 0) && this.onSegment(p1, q2, q1))
        	return true
    	// p2 , q2 and p1 are colinear and p1 lies on segment p2q2 
    	if ((o3 == 0) && this.onSegment(p2, p1, q2))
    	    return true
    	// p2 , q2 and q1 are colinear and q1 lies on segment p2q2 
    	if ((o4 == 0) && this.onSegment(p2, q1, q2))
    	    return true
    	//If none of the cases 
    	return false
	}

	update(dt, map, collectibles){
		if (this.isSanicActive && Date.now() - this.sanicTimeRemaining > 0){
			this.isSanicActive = false;
		}

		if (this.isTripleShotActive && Date.now() - this.tripleShotTimeRemaining > 0){
			this.isTripleShotActive = false;
		}

		let xVelocity = this.xVelocity
		let yVelocity = this.yVelocity
		let power = this.power
		let reverse = this.reverse
		let angularVelocity = this.angularVelocity
		let x = this.x
		let y = this.y

		if (this.isThrottling) {
			power += Constants.POWER_FACTOR;
		} else {
			power -= Constants.POWER_FACTOR;
		}
		if (this.isReversing) {
			reverse += Constants.REVERSE_FACTOR;
		} else {
			reverse -= Constants.REVERSE_FACTOR;
		}
		
		if (this.isSanicActive == true){
			power = Math.max(0, Math.min(Constants.MAX_POWER * 2, power));
		} else {
			power = Math.max(0, Math.min(Constants.MAX_POWER, power));
		}
		if (this.isSanicActive == true){
			reverse = Math.max(0, Math.min(Constants.MAX_REVERSE * 2, reverse));
		} else {
			reverse = Math.max(0, Math.min(Constants.MAX_REVERSE, reverse));
		}
		

		let direction = power >= reverse ? 1 : -1;
		
		if (this.turningLeft) {
			angularVelocity -= direction * Constants.TURN_SPEED;
		}
		if (this.turningRight) {
			angularVelocity += direction * Constants.TURN_SPEED;
		}

		

		//COLISION DETECTION BETWEEN MAP AND TANK
		
		let edges = this.calculateVertices(this.x, this.y, this.bodya)
		edges[4] = edges[0]
		let tankTileLength = Math.ceil(Constants.PLAYER_HEIGHT / Constants.TILE_WIDTH) + 1
		let xStart = Math.ceil(this.x / Constants.TILE_WIDTH) - tankTileLength
		let yStart = Math.ceil(this.y / Constants.TILE_HEIGHT) - tankTileLength 
		let mapEdges = [[0, 0], [Constants.MAP_SIZE, 0], [Constants.MAP_SIZE, Constants.MAP_SIZE], [0, Constants.MAP_SIZE], [0, 0]]

		for(let i = 0; i < 4; i++){
			for(let j = 0; j < 4; j++){
				if (this.intersect(edges[i], edges[i + 1], mapEdges[j], mapEdges[j + 1])){
					if (i == 0){
						xVelocity += Math.sin((this.bodya + Math.PI) % (Math.PI * 2)) * 0.5;
						yVelocity += Math.cos((this.bodya + Math.PI) % (Math.PI * 2)) * 0.5;
											
						this.x += xVelocity;
						this.y -= yVelocity;
					}
					if (i == 2){
						xVelocity += Math.sin((this.bodya) % (Math.PI * 2)) * 0.5;
						yVelocity += Math.cos((this.bodya) % (Math.PI * 2)) * 0.5;
											
						this.x += xVelocity;
						this.y -= yVelocity;
					}
					if(i == 3){
						xVelocity += Math.sin((this.bodya + Math.PI/2) % (Math.PI * 2)) * 0.5;
						yVelocity += Math.cos((this.bodya + Math.PI/2) % (Math.PI * 2)) * 0.5;
											
						this.x += xVelocity;
						this.y -= yVelocity;
					}
					if(i == 1){
						xVelocity += Math.sin((this.bodya - Math.PI/2) % (Math.PI * 2)) * 0.5;
						yVelocity += Math.cos((this.bodya - Math.PI/2) % (Math.PI * 2)) * 0.5;
											
						this.x += xVelocity;
						this.y -= yVelocity;
					}				
				}
			}
		}

		for(let i = xStart ; i < xStart + 2 * tankTileLength + 1; i++){
			for(let j = yStart; j < yStart + 2 * tankTileLength + 1; j++){
				let tileVertices = [[i * Constants.TILE_WIDTH, j * Constants.TILE_HEIGHT], [i * Constants.TILE_WIDTH + Constants.TILE_WIDTH, j * Constants.TILE_HEIGHT],
									[i * Constants.TILE_WIDTH + Constants.TILE_WIDTH, j * Constants.TILE_HEIGHT + Constants.TILE_HEIGHT], 
									[i * Constants.TILE_WIDTH, j * Constants.TILE_HEIGHT + Constants.TILE_HEIGHT], [i * Constants.TILE_WIDTH, j * Constants.TILE_HEIGHT]]
				
				for(let k = 0; k < 4; k++){
					for(let l = 0; l < 4; l++){
						if ((this.intersect(edges[k], edges[k + 1], tileVertices[l], tileVertices[l + 1])) && i >= 0 && 
							i < Constants.MAP_SIZE / Constants.TILE_WIDTH && j >= 0 && j < Constants.MAP_SIZE / Constants.TILE_HEIGHT && (map[j][i] == 1)){ 	
							if (k == 0){
								xVelocity += Math.sin((this.bodya + Math.PI) % (Math.PI * 2)) * 0.5;
								yVelocity += Math.cos((this.bodya + Math.PI) % (Math.PI * 2)) * 0.5;
													
								this.x += xVelocity;
								this.y -= yVelocity;
							}
							if (k ==2){
								xVelocity += Math.sin((this.bodya) % (Math.PI * 2)) * 0.5;
								yVelocity += Math.cos((this.bodya) % (Math.PI * 2)) * 0.5;
													
								this.x += xVelocity;
								this.y -= yVelocity;
							}
							if(k == 3){
								xVelocity += Math.sin((this.bodya + Math.PI/2) % (Math.PI * 2)) * 0.5;
								yVelocity += Math.cos((this.bodya + Math.PI/2) % (Math.PI * 2)) * 0.5;
													
								this.x += xVelocity;
								this.y -= yVelocity;
							}
							if(k == 1){
								xVelocity += Math.sin((this.bodya - Math.PI/2) % (Math.PI * 2)) * 0.5;
								yVelocity += Math.cos((this.bodya - Math.PI/2) % (Math.PI * 2)) * 0.5;
													
								this.x += xVelocity;
								this.y -= yVelocity;
							}							
						}
						if ((this.intersect(edges[k], edges[k + 1], tileVertices[l], tileVertices[l + 1])) && i >= 0 && 
							i < Constants.MAP_SIZE / Constants.TILE_WIDTH && j >= 0 && 
							j < Constants.MAP_SIZE / Constants.TILE_HEIGHT){
								if (map[j][i] == Constants.SPEED_BOOST_TYPE){
										for (let ii = 0; ii < collectibles.length; ii++){
											let collectible = collectibles[ii];
											if (collectible.mapX == i && collectible.mapY == j){
												collectible.destroyed = true;
												map[j][i] = 0;
												this.sanicTimeRemaining = Date.now() + Constants.SPEED_BOOST_DURATION * 1000;
												this.isSanicActive = true;
												break;
											}
										}
								} else if (map[j][i] == Constants.TRIPLE_SHOT_TYPE){
										for (let ii = 0; ii < collectibles.length; ii++){
											let collectible = collectibles[ii];
											if (collectible.mapX == i && collectible.mapY == j){
												collectible.destroyed = true;
												map[j][i] = 0;
												this.tripleShotTimeRemaining = Date.now() + Constants.TRIPLE_SHOT_DURATION * 1000;
												this.isTripleShotActive = true;
												break;
											}
										}
								} else if (map[j][i] == Constants.HEALTH_REGEN_TYPE){
										for (let ii = 0; ii < collectibles.length; ii++){
											let collectible = collectibles[ii];
											if (collectible.mapX == i && collectible.mapY == j){
												collectible.destroyed = true;
												map[j][i] = 0;
												this.hp = Constants.PLAYER_MAX_HP;
												break;
											}
										}
								}
						}
					}
				}
			}
		}

		

		xVelocity += Math.sin(this.bodya) * (power - reverse);
		yVelocity += Math.cos(this.bodya) * (power - reverse);

		x += xVelocity;
		y -= yVelocity;

		this.xVelocity = xVelocity
		this.yVelocity = yVelocity
		this.power = power
		this.reverse = reverse

		
		this.x = x;
		this.y = y;
		this.angularVelocity = angularVelocity

		this.xVelocity *= Constants.DRAG;
		this.yVelocity *= Constants.DRAG;
		this.bodya = 0 + (this.bodya + this.angularVelocity)
		if(this.bodya >= (2 * Math.PI) || this.bodya <= (-2 * Math.PI)){
			this.bodya = 0
		}
		this.angularVelocity *= Constants.ANGULAR_DRAG;
		//
	}

	serialize(){
		return {
			id: this.id,
			username: this.username,
			x: this.x,
			y: this.y,
			hp: this.hp,
			bodya: this.bodya,
			cannona: this.cannona,
			bimg: this.baseImg,
			timg: this.turretImg,
			kills: this.kills
		}
	}
}

module.exports = Tank;
