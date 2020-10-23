var me;
var tanks;
var projectiles = [];

function initMe(ime){
	me = ime;
}

function getMe(){
	return me;
}

function addProjectile(projectile){
	projectiles.push(projectile);
}

function getProjectiles(){
	return projectiles;
}

export { getMe, initMe, addProjectile, getProjectiles }
