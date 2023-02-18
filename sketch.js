let context = undefined;
let level = undefined;

let drawRatio = 1;
let levelIndex = 0;
let COLORS = undefined;
let wHeight = window.innerHeight
let wWidth = window.innerWidth

const GRAVITY = 0.04
const FRICTION = 0.03
const BOOST = 0.15
const VELOCITY = 0.005
const JUMP = 0.4

class Level {
    constructor(index, height, width, data, image) {
        this.index = index
        this.height = height
        this.width = width
        this.data = data
        this.image = image
        this.player = new Player(createVector(10, 10), createVector(0, 0))
        console.log(this.data.data)
    }

    getPixelColor(x, y) {
        const i = y * 4 * this.width + x * 4
        const data = this.data.data
        return color(data[i], data[i + 1], data[i + 2], data[i + 3])
    }

    getPixelContent(x, y) {
        const position = createVector(Math.round(x), Math.round(y))
        return COLORS[this.getPixelColor(position.x, position.y).toString()]
    }

    gravity() {
        const position = this.player.position.copy()
        position.y += 1

        const clamped = createVector(Math.round(position.x), Math.round(position.y))
        const content = this.getPixelContent(clamped.x, clamped.y)

        if (content != 'ground') {
            this.player.velocity.add(0, GRAVITY)
        }
    }

    friction() {
        const position = this.player.position.copy()
        if (this.getPixelContent(position.x, position.y + 0.5) == 'ground') {
            if (Math.abs(this.player.velocity.x) > FRICTION) {
                this.player.velocity.x -= Math.sign(this.player.velocity.x) * FRICTION
            } else {
                this.player.velocity.x = 0
            }
        }
    }

    inputPressed() {
        if (keyCode == 37) {
            this.player.velocity.x = Math.min(this.player.velocity.x, -BOOST)
        }
        
        if (keyCode == 39) {
            this.player.velocity.x = Math.max(this.player.velocity.x, BOOST)
        }

        if (keyCode == 32) {
            const position = this.player.position.copy()
            if (this.getPixelContent(position.x, position.y + 0.5) == 'ground') {
                this.player.velocity.y = -JUMP
            }
        }
    }

    inputsHold() {
        if (keyIsDown(37)) {
            this.player.velocity.x -= VELOCITY
        } else if (keyIsDown(39)) {
            this.player.velocity.x += VELOCITY
        } else {
            this.friction()
        }
    }

    collisions() {
        const position = this.player.position.copy()
        const velocity = this.player.velocity.copy()
        
        if (velocity.x > 0) {
            if (this.getPixelContent(position.x + 0.5, position.y) == 'ground') {
                this.player.position.x = Math.floor(this.player.position.x)
                this.player.velocity.x = 0
            }
        } else {
            if (this.getPixelContent(position.x - 0.5, position.y) == 'ground') {
                this.player.position.x = Math.ceil(this.player.position.x)
                this.player.velocity.x = 0
            }
        }

        if (velocity.y > 0) {
            if (this.getPixelContent(position.x, position.y + 0.5) == 'ground') {
                this.player.position.y = Math.floor(this.player.position.y)
                this.player.velocity.y = 0
            }
        } else {
            if (this.getPixelContent(position.x, position.y - 0.5) == 'ground') {
                this.player.position.y = Math.ceil(this.player.position.y)
                this.player.velocity.y = 0
            }
        }
    }

    step() {
        this.inputsHold()
        this.player.step()
        this.collisions()
        this.gravity()
    }

    draw() {
        context.scale(drawRatio, drawRatio)
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        image(this.image, 0, 0);

        //TODO: draw level overlay

        this.player.draw()
    }
}

class Player {
    constructor(position, velocity) {
        this.position = position
        this.velocity = velocity
        this.color = color(255, 204, 0, 255)
    }

    step() {
        this.position.add(this.velocity)

        const MAXSPEED = createVector(0.2, 1.0)

        if (Math.abs(this.velocity.x) > MAXSPEED.x) {
            this.velocity.x = Math.sign(this.velocity.x) * MAXSPEED.x
        }

        if (Math.abs(this.velocity.y) > MAXSPEED.y) {
            this.velocity.y = Math.sign(this.velocity.y) * MAXSPEED.y
        }
    }

    draw() {
        noStroke();
        fill(this.color)
        rect(this.position.x, this.position.y, 1, 1)
    }
}

async function loadImageSync(source) {
    return new Promise((resolve, reject) => {
        loadImage(source, (img) => {
            resolve(img)
        });
    })
}

async function prepareLevel(index) {
    // load image and prepare level state
    const img = await loadImageSync(`levels/${index}.png`);
    image(img, 0, 0);
    const data = context.getImageData(0, 0, img.width, img.height);
    console.log(data)

    // update current rendering ratio
    drawRatio = wHeight / img.height

    return new Level(index, img.height, img.width, data, img)
}

async function setup() {
    createCanvas(wHeight, wHeight);
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    level = await prepareLevel(levelIndex)

    COLORS = {
        'rgba(255,255,255,1)': 'void',
        'rgba(0,0,0,1)': 'ground',
        'rgba(0,255,0,1)': 'start',
        'rgba(255,0,0,1)': 'end'
    }
}

function keyPressed() {
    level.inputPressed()
}

function draw() {
    if (!level) return
    level.step()
    level.draw()
}

function windowResized() {
    //resizeCanvas(wHeight, wHeight);
}
