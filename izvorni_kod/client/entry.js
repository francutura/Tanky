import { start } from "./index.js"
const nickname = document.getElementById("nickname"); //spremi var iz nick-a
const showtext = document.getElementById("showtext"); //
nickname.addEventListener("input", showNick);
showtext.addEventListener("click", onPlay);

function showNick() {
		let v_nickname = nickname.value;
		if(v_nickname==""){
				showtext.innerText = "Play";

		}else{
				showtext.innerText = "Play as " + v_nickname;
		}
}

function onPlay(){
		$("body").empty()
		$("body").append(`<h1 id="removeme">Loading...</h1>`)
	    start(nickname.value)
}

export { showNick, onPlay }
