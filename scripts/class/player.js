class Player {
    //INIT
    constructor(position, velocity) {
        this.position = position
        this.velocity = velocity
        this.color = color(255, 204, 0, 255)
        this.collidingPixelColor = undefined
        this.canMove = true
        this.jumpackVelocity = createVector(0, 0)
        this.maxEnergy = 100
        this.energy = this.maxEnergy
        this.energyConsumptionPerFrame = 1
        this.energyRegenerationPerFrame = 1
        this.energyConsumptionPerJump = 40
        this.afterImages = new Deque()
        this.afterImagePopStartCounter = 2
        this.afterImagePopCounter = this.afterImagePopStartCounter
        this.jetpack
        this.wallClimbing = false
        this.grounded = false
        this.walljumped = false
        this.walljumpedCounter = 0
        setInterval(() => {
            if(this.walljumpedCounter >= 1){
                this.walljumpedCounter--;
            }
        }, 500)
    }

    //PHYSICS
    step() {
        this.position.add(this.velocity)

        const MAXSPEED = createVector(0.2, 1.0)

        if (Math.abs(this.velocity.x) > MAXSPEED.x && !this.walljumped) {
            this.velocity.x = Math.sign(this.velocity.x) * MAXSPEED.x
        }

        if (Math.abs(this.velocity.y) > MAXSPEED.y) {
            this.velocity.y = Math.sign(this.velocity.y) * MAXSPEED.y
        }

        this.afterImagePopCounter--
        if (this.afterImagePopCounter <= 0) {
            this.afterImages.removeRear()
            this.afterImagePopCounter = this.afterImagePopStartCounter
        }
        let numberOfAfterImageToRemove = this.afterImages.asArray().length - 10
        while (numberOfAfterImageToRemove > 0) {
            this.afterImages.removeRear()
            numberOfAfterImageToRemove--
        }
    }

    jumpack() {
        this.position.add(this.jumpackVelocity)
    }

    //DRAW
    draw() {
        noStroke()

        //after images
        if (this.jumpackVelocity.x != 0 || this.wallClimbing) {
            this.afterImages.addFront({
                x: this.position.x,
                y: this.position.y,
                ttl: 10,
            })
        }
        this.afterImages.asArray().forEach((image) => {
            fill(color(0, 0, 0, 10))
            rect(image.x, image.y, 1, 1)
        })

        //player
        fill(this.color)
        rect(this.position.x, this.position.y, 1, 1)

        //jetpack bar
        fill(color(70, 130, 180, 100))
        rect(
            this.position.x - 1,
            this.position.y - 1.5,
            0.03 * this.energy,
            0.5
        )
    }
}

class Deque {
    constructor() {
        this.deque = []
    }

    asArray() {
        return this.deque
    }

    addFront(element) {
        this.deque.unshift(element)
    }

    addRear(element) {
        this.deque.push(element)
    }

    removeFront() {
        if (!this.isEmpty()) {
            return this.deque.shift()
        }
        return null
    }

    removeRear() {
        if (!this.isEmpty()) {
            return this.deque.pop()
        }
        return null
    }

    getFront() {
        if (!this.isEmpty()) {
            return this.deque[0]
        }
        return null
    }

    getRear() {
        if (!this.isEmpty()) {
            return this.deque[this.size() - 1]
        }
        return null
    }

    isEmpty() {
        return this.deque.length === 0
    }

    size() {
        return this.deque.length
    }
}
