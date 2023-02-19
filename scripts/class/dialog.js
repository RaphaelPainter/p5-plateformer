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


let UP_DOWN_TRESHOLD = 0.4

let textToDisplay = "test"

class Dialog {
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

        if (textToDisplay !== "") {
            fill(TEXT_BACKGROUND_COLOR);
            rect(TEXT_BACKGROUND_X,  this.textBackground_y, TEXT_BACKGROUND_WIDTH, TEXT_BACKGROUND_HEIGHT)

            fill(TEXT_FONT_COLOR);
            text(textToDisplay,this.text_x, this.text_y);
        }
    }
}