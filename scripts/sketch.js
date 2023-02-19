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


function keyPressed() {
    level.inputPressed()
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
