const me = {x: 0, y: 0, username:"None", BODY_ANGLE: 0, CANNON_ANGLE: 0};
const others = {}

function setState(update){
	setMyState(update);
	setOthersState(update);
}

function getMyState(){
	return me;
}

function getOthersState(){
	return others;
}

function setMyState(update){
	let main = update['me']
	me.x = main['x'];
	me.y = main['y'];
	me.username = main['username'];
	me.BODY_ANGLE = main['bodya'];
	me.CANNON_ANGLE = main['cannona'];
}

function setOthersState(update){
	for (var ele in others) delete others[ele];
	update['others'].forEach((other) =>{
		others[other.id] = other;
	});
}

export { getMyState, getOthersState, setState }
