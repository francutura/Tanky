const me = {x: 0, y: "0"};

function getMyState(){
	return me;
}

function setMyState(update){
	me.x = update['x'];
	me.y = update['y'];
}

export { getMyState, setMyState }
