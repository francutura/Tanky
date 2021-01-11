const Constants = Object.freeze({
MAX_POWER: 0.175,
MAX_REVERSE: 0.0375,
POWER_FACTOR: 0.004,
REVERSE_FACTOR: 0.0005,

DRAG: 0.95,
ANGULAR_DRAG: 0.95,
TURN_SPEED: 0.002,


//PLAYER
	PLAYER_WIDTH: 100,
	PLAYER_HEIGHT: 150,

//MAP
	MAP_SIZE: 3000,
	TILE_WIDTH: 50,
	TILE_HEIGHT: 50,

// MATCHMAKING
	MAX_PLAYERS_ALLOWED: 2,

});
if (typeof window === 'undefined') {
	module.exports = Constants;
} else {
	window.Constants = Constants;
}
