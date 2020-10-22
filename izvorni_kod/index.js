import {downloadAllAssets, getAsset} from "./manageAssets.js"

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d'); 
canvas.width = innerWidth;
canvas.height = innerHeight;

// Moze se mijenjati value za velicinu mape
const MAP_SIZE = 3000;

let image = {};
let image2 = {};

async function setup(){
	await downloadAllAssets();
	image = getAsset("tankBase.png")
	image2 = getAsset("tankTurret.png")
}

const player = {
  w: 50,
  h: 70,
  x: 10,
  y: 10,
  speed: 10,
  dx: 0,
  dy: 0
};

class Projectile {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

function drawPlayer() {
	let canvasx = canvas.width / 2 - player.x;
	let canvasy = canvas.height / 2 - player.y;

	ctx.save()
	ctx.translate(canvasx, canvasy)

	ctx.drawImage(image, player.x, player.y, player.w, player.h);
	ctx.drawImage(image2, player.x, player.y, player.w, player.h);

	ctx.restore()
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function detectWalls() {
  // Left wall
  if (player.x < 0) {
    player.x = 0;
  }

  // Right Wall
  if (player.x + player.w > MAP_SIZE) {
    player.x = MAP_SIZE - player.w;
  }

  // Top wall
  if (player.y < 0) {
    player.y = 0;
  }

  // Bottom Wall
  if (player.y + player.h > MAP_SIZE) {
    player.y = MAP_SIZE - player.h;
  }
}



function onKeyDown(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
      case 68: //d
        keyD = true;
        break;
      case 83: //s
        keyS = true;
        break;
      case 65: //a
        keyA = true;
        break;
      case 87: //w
        keyW = true;
        break;
    }
  }

  function onKeyUp(event) {
    var keyCode = event.keyCode;
  
    switch (keyCode) {
      case 68: //d
        keyD = false;
        break;
      case 83: //s
        keyS = false;
        break;
      case 65: //a
        keyA = false;
        break;
      case 87: //w
        keyW = false;
        break;
    }
  }
  
const projectiles = []

  var keyW = false;
  var keyA = false;
  var keyS = false;
  var keyD = false;

  //main animation function
  function animate() {
    requestAnimationFrame(animate);

    clear();
    drawPlayer();
	ctx.strokeRect(canvas.width / 2 - player.x, canvas.height / 2 - player.y, MAP_SIZE, MAP_SIZE);
    
    if (keyD == true) {
      player.x += player.speed;
    }
    if (keyS == true) {
        player.y += player.speed;
    }
    if (keyA == true) {
        player.x -= player.speed;
    }
    if (keyW == true) {
        player.y -= player.speed;
    }
    detectWalls();

    projectiles.forEach(projectile => {
      projectile.update()
    })
  }

addEventListener("keydown", onKeyDown, false);
addEventListener("keyup", onKeyUp, false);
//vise ne radi? :(
/*
addEventListener("click", (event) => {
  const angle = Math.atan2(canvas.height / 2 - event.clientY, canvas.width / 2 - event.clientX)
  console.log(angle)
  const velocity = {
    x: 45 * Math.cos(angle), 
    y: 45 * Math.sin(angle)
  }

  projectiles.push(new Projectile (canvas.width / 2 - player.x, canvas.height / 2 - player.y, 5, 'darkolivegreen', velocity))
});
*/

//TODO prebaciti main neđe drugdje
async function temp_main(){
	await setup()
	animate()
}
temp_main();
