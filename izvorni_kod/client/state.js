const me = {x: 0, y: "0"};
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
}

function setOthersState(update){
	update['others'].forEach((other) =>{
		others[other.id] = other;
	});
}

export { getMyState, getOthersState, setState }
