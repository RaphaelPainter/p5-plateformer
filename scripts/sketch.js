let context = undefined
let level = undefined

let drawRatio = 1
let levelIndex = 0
let COLORS = undefined
let wHeight = window.innerHeight
let wWidth = window.innerWidth

let hitboxCanvas = undefined

const GRAVITY = 0.04
const FRICTION = 0.05
const JUMP_PACK_FRICTION = 0.02
const AIR_FRICTION = 0.006

const BOOST = 0.15
const JETPACKBOOST = 0.25
const VELOCITY = 0.005
const JUMP = 0.4


// Arrow keycode constants
const KEYCODE_ARROW_UP = 38;
const KEYCODE_ARROW_DOWN = 40;
const KEYCODE_ARROW_LEFT = 37;
const KEYCODE_ARROW_RIGHT = 39;

// Letter keycode constants
const KEYCODE_A = 65;
const KEYCODE_B = 66;
const KEYCODE_C = 67;
const KEYCODE_D = 68;
const KEYCODE_E = 69;
const KEYCODE_F = 70;
const KEYCODE_G = 71;
const KEYCODE_H = 72;
const KEYCODE_I = 73;
const KEYCODE_J = 74;
const KEYCODE_K = 75;
const KEYCODE_L = 76;
const KEYCODE_M = 77;
const KEYCODE_N = 78;
const KEYCODE_O = 79;
const KEYCODE_P = 80;
const KEYCODE_Q = 81;
const KEYCODE_R = 82;
const KEYCODE_S = 83;
const KEYCODE_T = 84;
const KEYCODE_U = 85;
const KEYCODE_V = 86;
const KEYCODE_W = 87;
const KEYCODE_X = 88;
const KEYCODE_Y = 89;
const KEYCODE_Z = 90;

// Additional keycode constants
const KEYCODE_SPACE = 32;
const KEYCODE_SHIFT = 16;

let PIXEL_TRIGGER_DIALOG = 185 //dialogs
let PIXEL_TRIGGER_ACTION = 2

let PIXEL_TRIGGER_SUBACTION_RELATIVE_MOVEMENT = 110

function keyPressed() {
    level.inputPressed()
}

async function prepareLevel(index) {
    // load image and prepare level state
    mask = await loadImageSync(`levels/0_0.png`)
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')
    ctx.drawImage(myImage, 0, 0)
    const data = ctx.getImageData(0, 0, myImage.width, myImage.height)

    // update current rendering ratio
    drawRatio = wHeight / mask.height
    playerSprites = []
    playerSprites[0] = await loadImageSync(`characters/demon_1.png`)
    playerSprites[1] = await loadImageSync(`characters/demon_2.png`)
    shadowSprite = await loadImageSync(`characters/demon_shadow.png`)
    return new Level(index, mask.height, mask.width, data, mask, playerSprites, shadowSprite)
}

async function loadImageSync(source) {
    return new Promise((resolve, reject) => {
        loadImage(source, (img) => {
            resolve(img)
        })
    })
}

const loadImageVanilla = async (img) => {
    return new Promise((resolve, reject) => {
        img.onload = async () => {
            resolve(true)
        }
    })
}
let myImage
async function preload() {
    myImage = new Image()
    myImage.src = `levels/0_0.png`
    await loadImageVanilla(myImage)
}

async function setup() {
    hitboxCanvas = createCanvas(wHeight, wHeight)
    context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)

    COLORS = {
        'rgba(255,255,255,1)': 'void',
        'rgba(0,0,0,1)': 'ground',
        'rgba(31,14,0,1)': 'ceiling',
        'rgba(0,255,0,1)': 'start',
        'rgba(255,0,0,1)': 'end',
        'rgba(145,142,142,1)': 'step',
    }

    textSize(2)
    gameFont = loadFont('fonts/webpixel bitmap_regular.otf')
    textFont(gameFont)

    TEXT_BACKGROUND_COLOR = color(50, 50, 50, 255)
    TEXT_FONT_COLOR = color(250, 250, 250, 255)

    level = await prepareLevel(levelIndex)
}

function draw() {
    
    if (!level) return
    level.step()
    level.draw()
}
