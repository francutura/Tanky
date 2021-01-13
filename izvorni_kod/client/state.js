const me = {x: 0, y: 0, username:"None", bodya: 0, cannona: 0, bimg: "tankBase.png", timg: "tankTurret.png", kills: 0};
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
	me.kills = main['kills'];

	document.getElementById("leaderboard").innerHTML = ""
	let row = document.createElement('div');
	row.setAttribute('class', 'rowic');
	let entry_name = document.createElement("div")
	let entry_score = document.createElement("div")
	entry_name.setAttribute('class', 'name');
	entry_score.setAttribute('class', 'score');
	entry_name.setAttribute('id', '1_name');
	entry_score.setAttribute('id', '1_score');
	entry_name.innerHTML = me.username;
	entry_score.innerHTML = me.kills;
	row.appendChild(entry_name)
	row.appendChild(entry_score)
	document.getElementById("leaderboard").appendChild(row);
	
}

function setOthersState(update){
	for (var ele in others) delete others[ele];
	update['others'].forEach((other) =>{
		others[other.id] = other;

		let row = document.createElement('div');
		row.setAttribute('class', 'rowic');
		let entry_name = document.createElement("div")
		let entry_score = document.createElement("div")
		entry_name.setAttribute('class', 'name');
		entry_score.setAttribute('class', 'score');
		entry_name.setAttribute('id', 'name');
		entry_score.setAttribute('id', 'score');
		entry_name.innerHTML = other.username;
		entry_score.innerHTML = other.kills;
		row.appendChild(entry_name)
		row.appendChild(entry_score)
		document.getElementById("leaderboard").appendChild(row);

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

function spawnCollectible(collectible){
	gameMap[collectible.mapY][collectible.mapX] = collectible.type;
}

function despawnCollectible(collectible){
	gameMap[collectible.mapY][collectible.mapX] = 0;
}

export { getMyState, getOthersState, setState, getProjectiles, setMap, getMap, spawnCollectible, despawnCollectible }
