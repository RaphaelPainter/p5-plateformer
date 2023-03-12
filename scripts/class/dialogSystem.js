let TEXT_BACKGROUND_COLOR =  undefined
let TEXT_FONT_COLOR = undefined

let TEXT_BACKGROUND_COEF_X = 0.02
let TEXT_BACKGROUND_COEF_Y_DOWN = 0.9
let TEXT_BACKGROUND_COEF_WIDTH = 0.96
let TEXT_BACKGROUND_COEF_HEIGHT = 0.08
let TEXT_COEF_X = 0.04
let TEXT_COEF_Y_DOWN = 0.955
let TEXT_COEF_Y_UP =  0.0725
let TEXT_BACKGROUND_COEF_Y_UP = 0.02
let TEXT_BACKGROUND_X =  undefined
let TEXT_BACKGROUND_WIDTH =  undefined
let TEXT_BACKGROUND_HEIGHT = undefined

let STROKE_COLOR_R = 100
let STROKE_COLOR_G = 100
let STROKE_COLOR_B = 100
let STROKE_WEIGHT = 0.75


let UP_DOWN_TRESHOLD = 0.4

let DELAY_BETWEEN_CHAR_DISPLAY = 50
let STARTING_INDEX = -1



class DialogSystem {
    //INIT
    constructor(image) {
        this.textBackground_x =  image.width * TEXT_BACKGROUND_COEF_X
        this.textBackground_width =  image.width * TEXT_BACKGROUND_COEF_WIDTH
        this.textBackground_height =  image.height * TEXT_BACKGROUND_COEF_HEIGHT
        this.text_x =  image.width * TEXT_COEF_X

        this.text_y =  undefined
        this.textBackground_y = undefined

        this.textBackground_y_coef = undefined
        this.text_y_coef = undefined
        this.dialog = undefined
        this.index = STARTING_INDEX
        this.charIndex = 0
        this.charInterval =  undefined
    }

    resetLine() {
        this.index = STARTING_INDEX
    }

    isLastLine() {
        if (this.index >= this.dialog.lines.length - 1
        &&  this.charIndex >= this.dialog.lines[this.index].length) {
            return true
         } else {
             return false
        }
    }

    nextLine() {
        let context = this
        if (this.charInterval != null) {
             clearInterval(this.charInterval);
        }
        if (this.index != STARTING_INDEX && this.charIndex < this.dialog.lines[this.index].length) {
            this.charIndex = this.dialog.lines[this.index].length
        } else {
            this.index = this.index + 1
            this.charIndex = 0
            this.charInterval = setInterval(
                function () {
                    context.charIndex++
                }, DELAY_BETWEEN_CHAR_DISPLAY);
        }
    }

    //DRAW
    draw(playerPos, image) {

        //compute x for background and text
        TEXT_BACKGROUND_X = image.width * TEXT_BACKGROUND_COEF_X

        //compute background dimensions
        TEXT_BACKGROUND_WIDTH = image.width * TEXT_BACKGROUND_COEF_WIDTH
        TEXT_BACKGROUND_HEIGHT = image.height * TEXT_BACKGROUND_COEF_HEIGHT

        //display down by default
        if (this.textBackground_y_coef == null) {
            this.textBackground_y_coef = TEXT_BACKGROUND_COEF_Y_DOWN
        }
        if (this.text_y_coef == null) {
            this.text_y_coef = TEXT_COEF_Y_DOWN
        }

        //compute background y position down or up
        this.textBackground_y_coef = playerPos.y < image.height *UP_DOWN_TRESHOLD ? TEXT_BACKGROUND_COEF_Y_DOWN : this.textBackground_y_coef
        this.textBackground_y_coef =  playerPos.y > image.height*(1-UP_DOWN_TRESHOLD) ? TEXT_BACKGROUND_COEF_Y_UP : this.textBackground_y_coef
        this.textBackground_y = image.height * this.textBackground_y_coef

        //compute text y position down or up
        this.text_y_coef = playerPos.y < image.height *UP_DOWN_TRESHOLD ? TEXT_COEF_Y_DOWN : this.text_y_coef
        this.text_y_coef =  playerPos.y > image.height*(1-UP_DOWN_TRESHOLD) ? TEXT_COEF_Y_UP : this.text_y_coef
        this.text_y = image.height * this.text_y_coef

        //draw
        stroke(STROKE_COLOR_R, STROKE_COLOR_G, STROKE_COLOR_B);
        if (this.dialog && this.index != STARTING_INDEX && this.dialog.lines[this.index] !== "") {
            strokeWeight(STROKE_WEIGHT);
            fill(TEXT_BACKGROUND_COLOR);
            rect(TEXT_BACKGROUND_X,  this.textBackground_y, TEXT_BACKGROUND_WIDTH, TEXT_BACKGROUND_HEIGHT)

            noStroke()
            fill(TEXT_FONT_COLOR);
            text(this.dialog.lines[this.index].substring(0, this.charIndex)
                , this.text_x, this.text_y);
        }
    }
}