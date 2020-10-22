const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d'); 
canvas.width = innerWidth;
canvas.height = innerHeight;

const image = document.getElementById('source');
const image2 = document.getElementById('source2');

const player = {
  w: 50,
  h: 70,
  x: 20,
  y: 200,
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
  ctx.drawImage(image, player.x, player.y, player.w, player.h);
  ctx.drawImage(image2, player.x, player.y, player.w, player.h);
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
  if (player.x + player.w > canvas.width) {
    player.x = canvas.width - player.w;
  }

  // Top wall
  if (player.y < 0) {
    player.y = 0;
  }

  // Bottom Wall
  if (player.y + player.h > canvas.height) {
    player.y = canvas.height - player.h;
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
animate()

addEventListener("keydown", onKeyDown, false);
addEventListener("keyup", onKeyUp, false);
addEventListener("click", (event) => {
  const angle = Math.atan2(event.clientY - (player.y + player.h / 2), event.clientX - (player.x + player.w / 2))
  console.log(angle)
  const velocity = {
    x: 45 * Math.cos(angle), 
    y: 45 * Math.sin(angle)
  }

  projectiles.push(new Projectile (player.x + player.w / 2, player.y + player.h / 2, 5, 'darkolivegreen', velocity))
});
