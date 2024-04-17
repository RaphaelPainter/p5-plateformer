let key_jump = [32, 16]
let key_left = [37]
let key_right = [39]
let key_talk = [87]
let json
let dialogContext = undefined

let levelX = 0
let levelY = 0

class Level {
    //INIT
    constructor(index, height, width, data, image) {
        this.index = index
        this.height = height
        this.width = width
        this.data = data
        this.image = image
        this.player = new Player(this.getStartingPosition(), createVector(0, 0))
        this.dialogSystem = new DialogSystem(this.image)
        dialogContext = this
    }
    getStartingPosition() {
        const data = this.data.data
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.getPixelContent(x, y) == 'start') {
                    return createVector(x, y)
                }
            }
        }
        return createVector(10, 10)
    }

    //IMAGE DATA
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

    //PHYSICS
    gravity() {
        const position = this.player.position.copy()
        position.y += 1

        const clamped = createVector(
            Math.round(position.x),
            Math.round(position.y)
        )
        const content = this.getPixelContent(clamped.x, clamped.y)

        if (content != 'ground') {
            this.player.velocity.add(0, GRAVITY)
        }
    }
    friction() {
        const position = this.player.position.copy()
        //ground

        if (this.getPixelContent(position.x, position.y + 0.5) == 'ground') {
            //normal movement
            if (Math.abs(this.player.velocity.x) > FRICTION) {
                this.player.velocity.x -=
                    Math.sign(this.player.velocity.x) * FRICTION
            } else {
                this.player.velocity.x = 0
            }
            //jetpack
            if (Math.abs(this.player.jumpackVelocity.x) > JUMP_PACK_FRICTION) {
                this.player.jumpackVelocity.x -=
                    Math.sign(this.player.jumpackVelocity.x) *
                    JUMP_PACK_FRICTION
            } else {
                this.player.jumpackVelocity.x = 0
            }
            //air
        } else {
            if (Math.abs(this.player.velocity.x) > AIR_FRICTION) {
                this.player.velocity.x -=
                    Math.sign(this.player.velocity.x) * AIR_FRICTION
            } else {
                this.player.velocity.x = 0
            }
        }
    }
    frictionJetPack() {
        const position = this.player.position.copy()
        //ground

        if (this.getPixelContent(position.x, position.y + 0.5) == 'ground') {
            //jetpack
            if (Math.abs(this.player.jumpackVelocity.x) > JUMP_PACK_FRICTION) {
                this.player.jumpackVelocity.x -=
                    Math.sign(this.player.jumpackVelocity.x) *
                    JUMP_PACK_FRICTION
            } else {
                this.player.jumpackVelocity.x = 0
            }
            //air
        } else {
        }
    }
    step() {
        this.inputsHold()
        this.player.step()
        this.player.jumpack()
        this.collisions()
        this.gravity()
    }

    //INPUTS
    async inputPressed() {
        //INTERRACTIONS
        if (
            this.player.collidingPixelColor[0] == PIXEL_TRIGGER_DIALOG &&
            keyIsDown(87)
        ) {
            if (this.dialogSystem.dialog && !this.dialogSystem.isLastLine()) {
                this.player.canMove = false
                this.dialogSystem.nextLine()
            } else {
                this.player.canMove = true
                this.dialogSystem.resetLine()
            }
        }

        const position = this.player.position.copy()
        //MOVE
        if (key_left.includes(keyCode) && this.player.canMove ) {
            this.player.velocity.x = Math.min(this.player.velocity.x, -BOOST)
            this.player.wallRight == false
            if (
                this.player.jumpackVelocity.x > 0 &&
                this.getPixelContent(position.x, position.y + 0.5) == 'ground'
            ) {
                this.player.jumpackVelocity.x = 0
            }
        }
        if (key_right.includes(keyCode) && this.player.canMove) {
            this.player.velocity.x = Math.max(this.player.velocity.x, BOOST)
            this.player.wallLeft == false
            if (
                this.player.jumpackVelocity.x < 0 &&
                this.getPixelContent(position.x, position.y + 0.5) == 'ground'
            ) {
                this.player.jumpackVelocity.x = 0
            }
        }
        if (key_jump.includes(keyCode) && this.player.canMove) {
            const position = this.player.position.copy()
            if (
                this.getPixelContent(position.x, position.y + 0.5) == 'ground'
            ) {
                this.player.velocity.y = -JUMP
            }else if(this.player.energy >= this.player.energyConsumptionPerJump){
                this.player.velocity.y = -JUMP                
                this.player.energy -= this.player.energyConsumptionPerJump
            }
        }
    }
    inputsHold() {
        //TODO: change to generic input managing
        const position = this.player.position.copy()
        if (
            keyIsDown(87) &&
            this.player.velocity.x == 0 &&
            this.player.canMove &&
            (keyIsDown(37) || keyIsDown(39)) &&  (this.player.energy > 0) 
        ) {
            this.player.velocity.y = -JUMP * 1.1
            this.player.energy -= this.player.energyConsumptionPerFrame
        }
        console.log(this.player.wallLeft + " " +this.player.wallRight)
        if (this.player.energy > 0) {
            if (
                keyIsDown(87) &&
                this.player.velocity.x < 0 &&
                this.player.canMove
            ) {
                this.player.wallRight = false
                if ((keyIsDown(39) &&this.player.wallRight) || (keyIsDown(37) && this.player.wallLeft)) {
                    this.player.jumpackVelocity.x = -JETPACKBOOST / 4
                    this.player.energy -= this.player.energyConsumptionPerFrame
                } else {
                    this.player.jumpackVelocity.x = -JETPACKBOOST
                    this.player.energy -= this.player.energyConsumptionPerFrame
                }
            } else if (
                keyIsDown(87) &&
                this.player.velocity.x > 0 &&
                this.player.canMove
            ) {
                this.player.wallLeft = false
                if (this.player.wallRight || this.player.wallLeft) {
                    this.player.jumpackVelocity.x = +JETPACKBOOST / 4
                    this.player.energy -= this.player.energyConsumptionPerFrame
                } else {
                    this.player.jumpackVelocity.x = +JETPACKBOOST
                    this.player.energy -= this.player.energyConsumptionPerFrame
                }
            }
        } else {
            this.frictionJetPack()
        }
        if (keyIsDown(37) && this.player.canMove) {
            this.player.velocity.x -= VELOCITY
        } else if (keyIsDown(39) && this.player.canMove) {
            this.player.velocity.x += VELOCITY
        } else {
            this.friction()
        }
        if((!keyIsDown(87)) && this.player.energy < this.player.maxEnergy){
            this.player.energy += this.player.energyRegenerationPerFrame
        }
    }

    //COLLISIONS
    collisions() {
        const position = this.player.position.copy()
        const velocity = this.player.velocity.copy()

        let collidingPixelColor = this.getPixelColor(
            position.x,
            position.y
        ).levels
        if (
            JSON.stringify(collidingPixelColor) !=
            JSON.stringify(this.player.collidingPixelColor)
        ) {
            this.player.collidingPixelColor = collidingPixelColor
        }

        if (velocity.x > 0 || this.player.jumpackVelocity.x > 0) {
            if (
                this.getPixelContent(position.x + 0.5, position.y - 0.5) ==
                'ground'
            ) {
                this.player.position.x = Math.floor(this.player.position.x)
                this.player.velocity.x = 0
                this.player.jumpackVelocity.x = 0
                this.player.wallRight = true
            } 
        } else {
            if (
                this.getPixelContent(position.x - 0.5, position.y - 0.5) ==
                'ground'
            ) {
                this.player.position.x = Math.ceil(this.player.position.x)
                this.player.velocity.x = 0
                this.player.jumpackVelocity.x = 0
                this.player.wallLeft = true
            }
        }
        if (velocity.y > 0) {
            if (
                this.getPixelContent(position.x, position.y + 0.5) == 'ground'
            ) {
                this.player.position.y = Math.floor(this.player.position.y)
                this.player.velocity.y = 0
                this.player.wallRight = false
                this.player.wallLeft = false
            }
        } else {
            if (
                this.getPixelContent(position.x, position.y - 0.5) == 'ground'
            ) {
                this.player.position.y = Math.ceil(this.player.position.y)
                this.player.velocity.y = 0
            }
        }
        //console.log(this.player.collidingPixelColor)

        //LOAD DIALOG
        let levelContext = this
        //TODO: let's add a CASE here !!
        if (
            this.player.collidingPixelColor[0] == PIXEL_TRIGGER_DIALOG &&
            (!this.dialogSystem.currentDialogId ||
                this.dialogSystem.currentDialogId !=
                    this.player.collidingPixelColor[1])
        ) {
            let dialogId = this.player.collidingPixelColor[1]
            this.dialogSystem.currentDialogId = dialogId
            loadJSON('./dialogs/' + dialogId + '.json', jsonCallback)
        } else if (this.player.collidingPixelColor[0] == PIXEL_TRIGGER_ACTION) {
            if (
                this.player.collidingPixelColor[1] ==
                PIXEL_TRIGGER_SUBACTION_RELATIVE_MOVEMENT
            ) {
                interpretAdjacentMovement(
                    levelContext,
                    levelContext.player.collidingPixelColor[2]
                )
            }
        }
    }

    //DRAW
    draw() {
        context.scale(drawRatio, drawRatio)
        context.mozImageSmoothingEnabled = false
        context.webkitImageSmoothingEnabled = false
        context.msImageSmoothingEnabled = false
        context.imageSmoothingEnabled = false
        image(this.image, 0, 0)

        //TODO: draw level overlay

        this.player.draw()
        noStroke()
        this.dialogSystem.draw(this.player.position, this.image)
    }
}

async function jsonCallback(mynewdata) {
    dialogContext.dialogSystem.dialog = new Dialog(mynewdata.dialog)
}
