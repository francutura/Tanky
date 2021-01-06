const me = {x: 0, y: 0, username:"None", bodya: 0, cannona: 0, bimg: "tankBase.png", timg: "tankTurret.png"};
const others = {}
const projectiles = {}
var gameMap = []

function setState(update){
	setMyState(update);
	setOthersState(update);
	setProjectileState(update);
}

function getMap(){
		return gameMap;
}

function getMyState(){
	return me;
}

function getOthersState(){
	return others;
}

function getProjectiles(){
	return projectiles;
}

function setMyState(update){
	let main = update['me']
	me.x = main['x'];
	me.y = main['y'];
	me.username = main['username'];
	me.bodya = main['bodya'];
	me.cannona = main['cannona'];
	me.bimg = main['bimg']
	me.timg = main['timg']
}

function setOthersState(update){
	for (var ele in others) delete others[ele];
	update['others'].forEach((other) =>{
		others[other.id] = other;
	});
}

function setMap(map){
		console.log(map)
		gameMap = [...map];
}

function setProjectileState(update){
	for (var ele in projectiles) delete projectiles[ele];
	update['projectiles'].forEach((projectile) =>{
		projectiles[projectile.id] = projectile;
	});
}

export { getMyState, getOthersState, setState, getProjectiles, setMap, getMap }
