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

let PIXEL_TRIGGER_COLOR_R = 185

let TEXT_BACKGROUND_COLOR =  undefined
let TEXT_FONT_COLOR = undefined

let TEXT_BACKGROUND_COEF_X = 0.02
let TEXT_BACKGROUND_COEF_Y_DOWN = 0.9
let TEXT_BACKGROUND_COEF_WIDTH = 0.96
let TEXT_BACKGROUND_COEF_HEIGHT = 0.08
let TEXT_COEF_X = 0.04
let TEXT_COEF_Y = 0.955
let TEXT_COEF_Y_UP =  0.0725
let TEXT_BACKGROUND_COEF_Y_UP = 0.02
let TEXT_BACKGROUND_X =  undefined
let TEXT_BACKGROUND_WIDTH =  undefined
let TEXT_BACKGROUND_HEIGHT = undefined
let TEXT_X = undefined

let text_y_up =  undefined
let text_background_y_up =  undefined
let text_y_down =  undefined
let text_background_y_down = undefined

let text_background_y_coef = undefined
let text_y_coef = undefined

let UP_DOWN_TRESHOLD = 0.4


class Level {
    constructor(index, height, width, data, image) {
        this.index = index
        this.height = height
        this.width = width
        this.data = data
        this.image = image
        this.player = new Player(this.getStartingPosition(), createVector(0, 0))
    }

    getPixelColor(x, y) {
        x = Math.round(x)
        y = Math.round(y)
        const i = y * 4 * this.width + x * 4
        const data = this.data.data
        return color(data[i], data[i + 1], data[i + 2], data[i + 3])
    }

    getPixelContent(x, y) {
        return COLORS[this.getPixelColor(x, y).toString()]
    }



    getStartingPosition(){
        const data = this.data.data
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.getPixelContent(x, y) == 'start') {
                    return createVector(x, y);
                }
            }
        }
        return createVector(10, 10);
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

        let collidingPixelColor = this.getPixelColor(position.x, position.y).levels
        if (JSON.stringify(collidingPixelColor) != JSON.stringify(this.player.collidingPixelColor)) {
            this.player.collidingPixelColor = collidingPixelColor
            console.log(this.player.collidingPixelColor)
            //TODO: display a dialog
        }
        
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

        //compute text and background position
        TEXT_BACKGROUND_X = this.image.width * TEXT_BACKGROUND_COEF_X
        TEXT_BACKGROUND_WIDTH = this.image.width * TEXT_BACKGROUND_COEF_WIDTH
        TEXT_BACKGROUND_HEIGHT = this.image.height * TEXT_BACKGROUND_COEF_HEIGHT
        TEXT_X = this.image.width * TEXT_COEF_X
        if (text_background_y_coef == null) {
            text_background_y_coef = TEXT_BACKGROUND_COEF_Y_DOWN
        }
        text_background_y_coef = this.player.position.y < this.image.height *UP_DOWN_TRESHOLD ? TEXT_BACKGROUND_COEF_Y_DOWN : text_background_y_coef
        text_background_y_coef =  this.player.position.y > this.image.height*(1-UP_DOWN_TRESHOLD) ? TEXT_BACKGROUND_COEF_Y_UP : text_background_y_coef
        if (text_y_coef == null) {
            text_y_coef = TEXT_COEF_Y
        }
        text_y_coef = this.player.position.y < this.image.height *UP_DOWN_TRESHOLD ? TEXT_COEF_Y : text_y_coef
        text_y_coef =  this.player.position.y > this.image.height*(1-UP_DOWN_TRESHOLD) ? TEXT_COEF_Y_UP : text_y_coef

        text_background_y_down = this.image.height * text_background_y_coef
        text_y_down = this.image.height * text_y_coef

        fill(TEXT_BACKGROUND_COLOR);
        rect(TEXT_BACKGROUND_X, text_background_y_down, TEXT_BACKGROUND_WIDTH, TEXT_BACKGROUND_HEIGHT)

        fill(TEXT_FONT_COLOR);
        text('Hello sir !',TEXT_X, text_y_down);//44 char max
    }
}



function keyPressed() {
    level.inputPressed()
}

class Player {
    constructor(position, velocity) {
        this.position = position
        this.velocity = velocity
        this.color = color(255, 204, 0, 255)
        this.collidingPixelColor = undefined
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

    // update current rendering ratio
    drawRatio = wHeight / img.height

    return new Level(index, img.height, img.width, data, img)
}

async function setup() {
    createCanvas(wHeight, wHeight);
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    COLORS = {
        'rgba(255,255,255,1)': 'void',
        'rgba(0,0,0,1)': 'ground',
        'rgba(0,255,0,1)': 'start',
        'rgba(255,0,0,1)': 'end'
    }
    
    textSize(2);
    gameFont = loadFont('fonts/webpixel bitmap_regular.otf');
    textFont(gameFont);

    TEXT_BACKGROUND_COLOR = color(50, 50, 50, 255)
    TEXT_FONT_COLOR = color(250, 250, 250, 255)

    level = await prepareLevel(levelIndex)
}




function draw() {
    if (!level) return
    level.step()
    level.draw()
}
