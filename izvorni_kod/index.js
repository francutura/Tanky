import {downloadAllAssets, getAsset} from "./manageAssets.js"
import * as Render from "./Render.js"
import { Tank } from "./Tank.js"
import { initMe } from "./state.js"
import { initInput } from "./input.js"

async function setup(){
	await downloadAllAssets();
	let me = new Tank(10, 10, 10, getAsset("tankBase.png"), getAsset("tankTurret.png"));
	initMe(me);
	initInput();
}

async function main(){
	await setup()
	Render.animate()
}
main();
