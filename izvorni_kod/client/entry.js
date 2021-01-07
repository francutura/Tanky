import { start } from "./index.js"
const nickname = document.getElementById("nickname"); //spremi var iz nick-a
const showtext = document.getElementById("showtext"); //
var playing = false
nickname.addEventListener("input", showNick);
showtext.addEventListener("click", onPlay);
addEventListener("keyup", onKeyUp, false);

function onKeyUp(event){
	let keyCode = event.keyCode;

	switch(keyCode){
		case 13: // ENTER
			if (nickname.value !== "" && playing == false){
				event.preventDefault()
				onPlay();
			}
			break;
	}
}

function showNick() {
		let v_nickname = nickname.value;
		if(v_nickname==""){
				showtext.innerText = "Play";

		}else{
				showtext.innerText = "Play as " + v_nickname;
		}
}

function onPlay(){
		if (nickname.value !== ""){
			$("body").empty()
			$("body").append(`<h1 id="removeme">Loading...</h1>`)
			playing = true
			start(nickname.value)
		}
}

export { showNick, onPlay }
