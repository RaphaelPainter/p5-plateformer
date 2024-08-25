let json
let dialogContext = undefined

let levelX = 0
let levelY = 0

class Level {
    //INIT
    constructor(index, height, width, data, mask, playerSprites, shadowSprite) {
        this.index = index
        this.height = height
        this.width = width
        this.data = data
        this.mask = mask
        this.player = new Player(
            this.getStartingPosition(),
            createVector(0, 0),
            playerSprites,
            shadowSprite
        )
        this.dialogSystem = new DialogSystem(this.mask)
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

    //TODO : get all camera points (position, + distance of attraction)

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

        const clamped = createVector(
            Math.round(position.x),
            Math.round(position.y)
        )
        const content = this.getPixelContent(clamped.x, clamped.y)
        if (content != 'ground') {
            if (
                (this.player.wallLeft || this.player.wallRight) &&
                this.player.walljumpedCounter > 0 &&
                this.player.velocity.y > 0 &&
                this.player.velocity.x == 0
            ) {
                this.player.velocity.add(0, GRAVITY / 500)
            } else {
                this.player.velocity.add(0, GRAVITY)
            }
            this.player.grounded = false
        } else {
            this.player.grounded = true
            this.player.walljumped = false
        }
    }
    friction() {
        const position = this.player.position.copy()
        //ground

        if (this.getPixelContent(position.x, position.y + 0.5) == 'ground') {
            if (this.player.stepped) {
                this.player.stepped = false
                this.player.canMove = true
            }
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
            keyIsDown(87) &&
            this.player.jumpackVelocity.x == 0 &&
            !(keyCode == KEYCODE_ARROW_RIGHT) &&
            !(keyCode == KEYCODE_ARROW_LEFT)
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
        if (keyCode == KEYCODE_ARROW_LEFT) {
            this.player.wallRight = false
        }
        if (keyCode == KEYCODE_ARROW_LEFT && this.player.canMove) {
            this.player.velocity.x = Math.min(this.player.velocity.x, -BOOST)
            if (
                this.player.jumpackVelocity.x > 0 &&
                this.getPixelContent(position.x, position.y + 0.5) == 'ground'
            ) {
                this.player.jumpackVelocity.x = 0
            }
        }
        if (keyCode == KEYCODE_ARROW_RIGHT) {
            this.player.wallLeft = false
        }
        if (keyCode == KEYCODE_ARROW_RIGHT && this.player.canMove) {
            this.player.velocity.x = Math.max(this.player.velocity.x, BOOST)
            if (
                this.player.jumpackVelocity.x < 0 &&
                this.getPixelContent(position.x, position.y + 0.5) == 'ground'
            ) {
                this.player.jumpackVelocity.x = 0
            }
        }
        if (keyCode == KEYCODE_SHIFT && this.player.canMove) {
            const position = this.player.position.copy()
            if (
                this.getPixelContent(position.x, position.y + 0.5) == 'ground'
            ) {
                this.player.velocity.y = -JUMP
            } else if (this.player.wallLeft || this.player.wallRight) {
                this.player.velocity.y = -JUMP * 1.1
                this.player.jumpackVelocity.x =
                    0.3 * (this.player.wallLeft ? 1 : -1)
                this.player.wallLeft = false
                this.player.wallRight = false
                this.player.walljumped = true
            } else if (
                this.player.energy >= this.player.energyConsumptionPerJump
            ) {
                this.player.velocity.y = -JUMP
                this.player.energy -= this.player.energyConsumptionPerJump
            }
        }
    }
    inputsHold() {
        //TODO: change to generic input managing
        const position = this.player.position.copy()
        if (
            keyIsDown(KEYCODE_ARROW_RIGHT) &&
            this.getPixelContent(position.x, position.y + 0.5) == 'ground' &&
            this.player.jumpackVelocity.x < 0
        ) {
            this.player.jumpackVelocity.x = 0
        } else if (
            keyIsDown(KEYCODE_ARROW_LEFT) &&
            this.getPixelContent(position.x, position.y + 0.5) == 'ground' &&
            this.player.jumpackVelocity.x > 0
        ) {
            this.player.jumpackVelocity.x = 0
        }
        if(this.player.canMove){
            console.log("blah")
        }
        if (
            keyIsDown(KEYCODE_W) &&
            this.player.velocity.x == 0 &&
            this.player.canMove &&
            (keyIsDown(KEYCODE_ARROW_LEFT) || keyIsDown(KEYCODE_ARROW_RIGHT)) &&
            this.player.energy > 0 &&
            (this.player.wallLeft || this.player.wallRight)
        ) {
            this.player.velocity.y = -JUMP * 1.1
            this.player.energy -= this.player.energyConsumptionPerFrame
            this.player.wallClimbing = true
        } else if (
            !keyIsDown(KEYCODE_W) &&
            this.player.velocity.x == 0 &&
            this.player.canMove &&
            (keyIsDown(KEYCODE_ARROW_LEFT) || keyIsDown(KEYCODE_ARROW_RIGHT)) &&
            this.getPixelContent(position.x, position.y + 0.5) == 'ground' &&
            this.getPixelContent(position.x - 1, position.y - 1) != 'ground' &&
            this.getPixelContent(position.x + 1, position.y - 1) != 'ground' &&
            (this.player.wallLeft || this.player.wallRight)
        ) {
            this.player.animationIndex = 0
            this.player.canMove = false
            setTimeout(() => {
                this.player.canMove = true

                this.player.velocity.y = -JUMP * 0.7
            }, 75)
        } else {
            this.player.wallClimbing = false
        }

        if (this.player.energy > 0) {
            if (
                keyIsDown(KEYCODE_W) &&
                this.player.velocity.x < 0 &&
                this.player.canMove
            ) {
                this.player.wallRight = false
                if (
                    (keyIsDown(KEYCODE_ARROW_RIGHT) && this.player.wallRight) ||
                    (keyIsDown(KEYCODE_ARROW_LEFT) && this.player.wallLeft)
                ) {
                    this.player.jumpackVelocity.x = -JETPACKBOOST / 4
                    this.player.energy -= this.player.energyConsumptionPerFrame
                } else {
                    this.player.jumpackVelocity.x = -JETPACKBOOST
                    this.player.energy -= this.player.energyConsumptionPerFrame
                }
            } else if (
                keyIsDown(KEYCODE_W) &&
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
        }
        this.frictionJetPack()

        if (keyIsDown(KEYCODE_ARROW_LEFT) && this.player.canMove) {
            this.player.velocity.x -= VELOCITY
        } else if (keyIsDown(KEYCODE_ARROW_RIGHT) && this.player.canMove) {
            this.player.velocity.x += VELOCITY
        } else {
            this.friction()
        }
        if (
            !keyIsDown(KEYCODE_W) &&
            this.player.energy < this.player.maxEnergy &&
            this.getPixelContent(position.x, position.y + 0.5) == 'ground'
        ) {
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
        console.log(velocity.x)

        if (velocity.x > 0 || this.player.jumpackVelocity.x > 0) {
            if (
                this.getPixelContent(position.x + 0.5, position.y - 0.5) ==
                'ground'
            ) {
                this.player.velocity.x = 0

                this.player.position.x = Math.floor(this.player.position.x)
                this.player.jumpackVelocity.x = 0
                this.player.wallRight = true

                this.player.walljumpedCounter = 1
            }
            if (
                this.getPixelContent(position.x + 0.5, position.y - 0.5) ==
                    'step' &&
                this.player.velocity.y < 0
            ) {
                this.player.wallRight = false
                this.player.canMove = false
                const player = this.player
                this.player.velocity.y = -0.4
                this.player.jumpackVelocity.x = 0.08
                this.player.stepped = true
            }
        } if((velocity.x < 0 || this.player.jumpackVelocity.x < 0)) {
            if (
                this.getPixelContent(position.x - 0.5, position.y - 0.5) ==
                'ground'
            ) {
                this.player.position.x = Math.ceil(this.player.position.x)
                this.player.velocity.x = 0
                this.player.jumpackVelocity.x = 0
                this.player.wallLeft = true
                this.player.walljumpedCounter = 1
            }
            if (
                this.getPixelContent(position.x - 0.5, position.y - 0.5) ==
                    'step' &&
                this.player.velocity.y < 0
            ) {
                this.player.wallLeft = false
                this.player.canMove = false
                const player = this.player
                this.player.velocity.y = -0.4

                this.player.jumpackVelocity.x = -0.08
                this.player.stepped = true
            }
        }
        if (velocity.y > 0) {
            if (
                this.getPixelContent(position.x, position.y + 0.5) == 'ground'
            ) {
                this.player.position.y = Math.floor(this.player.position.y)
                this.player.velocity.y = 0
            }
        } else {
            if (
                this.getPixelContent(position.x, position.y - 0.5) == 'ceiling'
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
            this.player.jumpackVelocity = createVector(0, 0)
            this.player.velocity = createVector(0, 0)

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
        // Apply zoom
        context.scale(drawRatio, drawRatio)
        context.mozImageSmoothingEnabled = false
        context.webkitImageSmoothingEnabled = false
        context.msImageSmoothingEnabled = false
        context.imageSmoothingEnabled = false

        //TODO: process camera position according to nearest enable camera point

        const zoom = 7
        // Translate the canvas based on the player's position
        translate(
            this.width - this.player.position.x * zoom-10,
            this.height / 2 - this.player.position.y * zoom
        )

        // Apply zoom
        scale(zoom)
        //scale(2); // Apply the zoom factor

        clear()
        image(this.mask, 0, 0)

        //TODO: draw level overlay
        this.player.draw()
        this.dialogSystem.draw(this.player.position, this.mask)

        noStroke()
    }
}

async function jsonCallback(mynewdata) {
    dialogContext.dialogSystem.dialog = new Dialog(mynewdata.dialog)
}
