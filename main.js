// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousemove', function(event)
{
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener('mouseup', function(event)
{
    mouse.click = false;
});

// Layer
class Layer {
    constructor(game, image, speedModifier){
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = 1920;
        this.height = 1080;
        this.x = 0;
        this.y = 0;
    }
    update(){
        if(this.x <= - this.width) this.x = 0;
        else if( this.game.player.direction == 'left'){
            if(this.x + this.width < this.width) 
                this.x += this.game.speed * this.speedModifier;
        }
        else this.x -= this.game.speed * this.speedModifier;
    }
    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y);;
    }
}

class Background {
    constructor(game){
        this.game = game;
        this.image1 = document.getElementById('layer1');
        this.layer1 = new Layer(this.game, this.image1, 0.5);
        this.layers = [ this.layer1 ];
    }
    update(){
        this.layers.forEach(layer => layer.update());
    }
    draw(ctx){
        this.layers.forEach (layer => layer.draw(ctx));
    }
}

// Player
const playerLeft = new Image(); // 960x720
playerLeft.src = './sprites/diver-left.png';
const playerRight = new Image();
playerRight.src = './sprites/diver-right.png';

class Player{
    constructor(game){
        this.game = game;
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 788;
        this.spriteHeight = 356;
        this.width = this.spriteWidth/4;
        this.height = this.spriteHeight/4;
        this.direction = 'right';
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        if(Math.abs(dx/20)>0.5)
            this.frame++;
        if(mouse.x != this.x) {
            this.x -= dx/20;
        }
        if(mouse.y != this.y) {
            this.y -= dy/20;
        }
        if(this.x >= mouse.x){
            this.direction = 'left';
        }else{
            this.direction = 'right';
        }
        if(this.frame > 4){
            // if(this.direction == 'left')
            // {
            //     this.frameX--;
            //     //this.frameY++;
            //     if(this.frameX<0){
            //         this.frameX = 3;
            //         this.frameY++;
            //     } 
            //     if(this.frameY>3){
            //         this.frameX = 3;
            //         this.frameY = 0;
            //     } 
            //     this.frame = 0;
            // }
            // else
            // {
                this.frameX++;
                //this.frameY++;
                if(this.frameX>3){
                    this.frameX = 0;
                    //this.frameY++;
                } 
                if(this.frameY>2){
                    this.frameX = 0;
                    this.frameY = 0;
                } 
                this.frame = 0;
            // }
        }

    }
    draw(ctx){
        if(mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle = 'rgba(255,255,224,0.5)';
        
        //ctx.fillRect(this.x, this.y, this.radius, 10);
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        if(this.direction == 'left'){
            ctx.beginPath();
            ctx.arc(-55, 15, this.radius/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - this.width/4 , 0 - this.height/2 , this.width, this.height);
        }else{
            ctx.beginPath();
            ctx.arc(-40, -10, this.radius/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.drawImage(playerRight, (3 - this.frameX) * this.spriteWidth, (2 - this.frameY) * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - this.width/4 , 0 - this.height/2 , this.width, this.height);
        }
        ctx.restore();
    }
}

// Bubbles
class Bubble {
    constructor(game){
        this.game = game;
        this.type = Bubble.types[Math.random()*(Bubble.types.length - 1)];
        this.x = Math.random() * game.width;
        this.y = game.height + Math.random() * game.height;
        this.radius = 50;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }
    update(){
        this.y -= this.speed; 
        if(this.y < this.height) {
            this.counted = true;
        }
        // const dx = this.x - player.x;
        // const dy = this.y - player.y;  
        // this.distance = Math.sqrt(dx*dx + dy*dy);
    }
    draw(ctx){
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        //ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
Bubble.types = ['bottle', 'can', 'bag'];
const trash = new Image();
trash.src = './sprites/trash2.png'

class Bottle extends Bubble {
    constructor(game){
        super(game)
        this.radius = 20;
        this.y = 0 + Math.random() * (game.height/2);
        this.spriteWidth = 18;
        this.spriteHeight = 64;
        this.frame = 0;   
    }
    update(){
        this.y += this.speed; 
        if(this.y < this.height) {
            this.counted = true;
        }
    }
    draw(ctx){
        // ctx.fillStyle = 'cyan';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(trash, (this.frame) * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x - this.spriteWidth/2 , this.y - this.spriteHeight/2 , this.spriteWidth, this.spriteHeight);

    }
}

class Can extends Bubble {
    constructor(game){
        super(game)
        this.radius = 20;
        this.y = 0 + Math.random() * (game.height/2);
        this.spriteWidth = 20;
        this.spriteHeight = 64;
        this.frame = 1;   
    }
    update(){
        this.y += this.speed; 
        if(this.y < this.height) {
            this.counted = true;
        }
    }
    draw(ctx){
        // ctx.fillStyle = 'cyan';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(trash, (this.frame) * this.spriteWidth, 10, this.spriteWidth, this.spriteHeight, this.x - this.spriteWidth/2 , this.y - this.spriteHeight/2 , this.spriteWidth, this.spriteHeight);

    }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = './sounds/Plop.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = './sounds/bubbles-single.wav';


//Game
class Game {
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.speed = 1;
        this.background = new Background(this);
        this.player = new Player(this);
        this.bubblesArray = [];
        this.input;
        this.gameFrame = 0;
        this.gameOver = false;
    }
    update(dt){
        if(this.gameFrame % 50 == 0){
            this.addBubble();
        }
        this.background.update();
        this.player.update();
        this.bubblesArray.forEach(bubble => {
            bubble.update();
            if(this.checkRoundCollision(this.player, bubble)){
                bubble.counted = true;
                if(bubble.sound == 'sound1'){
                    bubblePop1.play();
                }else{
                    bubblePop2.play();
                }
            }
        })
        this.bubblesArray = this.bubblesArray.filter(bubble => !bubble.counted);
        this.gameFrame++;
    }
    draw(ctx){
        this.background.draw(ctx);
        this.player.draw(ctx);
        this.bubblesArray.forEach(bubble => {
            bubble.draw(ctx);
        })
    }
    addBubble(){
        let type =  Bubble.types[Math.floor(Math.random()*(Bubble.types.length - 1))];
        switch(type){
            case 'bottle':
                this.bubblesArray.push(new Bottle(this));
                break;
            case 'can':
                this.bubblesArray.push(new Can(this));
                break;
            default:
                this.bubblesArray.push(new Bubble(this));
                break;
        }
    }
    checkRectangularCollision(obj1, obj2){
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.height + obj1.y > obj2.y
        )
    }
    checkRoundCollision(obj1, obj2){
        const dx = obj2.x - obj1.x;
        const dy = obj2.y - obj1.y;  
        let distance = Math.sqrt(dx*dx + dy*dy);
        return distance < obj1.radius + obj2.radius;
    }
}

const game = new Game(canvas.width, canvas.height);
// Animation Loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    game.update();
    game.draw(ctx);
    requestAnimationFrame(animate);
}
animate();