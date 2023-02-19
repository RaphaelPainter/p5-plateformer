
class Level {
    //INIT
    constructor(index, height, width, data, image) {
        this.index = index
        this.height = height
        this.width = width
        this.data = data
        this.image = image
        this.player = new Player(this.getStartingPosition(), createVector(0, 0))
        console.log(image)
        this.dialog = new Dialog(this.image)
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
     step() {
        this.inputsHold()
        this.player.step()
        this.collisions()
        this.gravity()
    }

    //INPUTS
    inputPressed() {
        if (keyCode == 37 && this.player.canMove) {
            this.player.velocity.x = Math.min(this.player.velocity.x, -BOOST)
        }
        
        if (keyCode == 39 && this.player.canMove) {
            this.player.velocity.x = Math.max(this.player.velocity.x, BOOST)
        }

        if (keyCode == 32 && this.player.canMove) {
            const position = this.player.position.copy()
            if (this.getPixelContent(position.x, position.y + 0.5) == 'ground') {
                this.player.velocity.y = -JUMP
            }
        }
    }
    inputsHold() {
        if (keyIsDown(37) && this.player.canMove) {
            this.player.velocity.x -= VELOCITY
        } else if (keyIsDown(39) && this.player.canMove) {
            this.player.velocity.x += VELOCITY
        } else {
            this.friction()
        }
    }

    //COLLISIONS
    collisions() {
        const position = this.player.position.copy()
        const velocity = this.player.velocity.copy()

        let collidingPixelColor = this.getPixelColor(position.x, position.y).levels
        if (JSON.stringify(collidingPixelColor) != JSON.stringify(this.player.collidingPixelColor)) {
            this.player.collidingPixelColor = collidingPixelColor
            console.log(this.player.collidingPixelColor)
            //TODO: display a dialog
            if (this.player.collidingPixelColor[0] == PIXEL_TRIGGER_COLOR_R) {
                this.player.canMove = false
                textToDisplay = "test"
            }
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

    //DRAW
    draw() {
        context.scale(drawRatio, drawRatio)
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        image(this.image, 0, 0);

        //TODO: draw level overlay

        this.player.draw()
        this.dialog.draw(this.player.position, this.image)
    }

}