class Player {
    //INIT
    constructor(position, velocity, playerSprites, shadowSprite) {
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
            if (this.walljumpedCounter >= 1) {
                this.walljumpedCounter--
            }
        }, 500)
        this.sprites = playerSprites
        this.animationIndex = 0;
        this.animationIndexCount = 1;
        this.animationCounter = 0;
        this.animationCounterLimit = 100;
        this.shadowSprite = shadowSprite;
        

        
    }

    //PHYSICS
    step() {
        this.position.add(this.velocity)
        if(this.velocity.y < 0){
            this.animationIndex = 1;
            this.animationCounter = 0;
        }
        else if(this.velocity.x == 0){
            this.animationIndex = 0;
            this.animationCounter = 0;
        }else{
        this.animationCounter += Math.abs(Math.round(this.velocity.x*100));
        this.animationCounter += Math.abs(Math.round(this.jumpackVelocity.x*100));

        if(this.animationCounter >= this.animationCounterLimit){
            this.animationIndex += 1;
            if(this.animationIndex > this.animationIndexCount){
                this.animationIndex = 0;
            }
            this.animationCounter = 0;
        }
        }
        

        const MAXSPEED = createVector(0.15, 1.0)

        if (Math.abs(this.velocity.x) > MAXSPEED.x) {
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
        let numberOfAfterImageToRemove = this.afterImages.asArray().length - 4
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
        if (Math.abs(this.jumpackVelocity.x) > 0.2 || this.wallClimbing) {
            this.afterImages.addFront({
                x: this.position.x,
                y: this.position.y,
            })
        }
        this.afterImages.asArray().forEach((sprite) => {
            image(
                this.shadowSprite,
                sprite.x - this.shadowSprite.width / 4 / 20,
                sprite.y - this.shadowSprite.height / 1.65 / 20,
                this.shadowSprite.width / 20,
                this.shadowSprite.height / 20
            )

        })

        //player
        if(this.velocity.x > 0 || this.jumpackVelocity.x > 0){
            this.facingRight = true;
        } else if (this.velocity.x < 0 || this.jumpackVelocity.x < 0) {
                        this.facingRight = false;

        }

        if (this.facingRight) {            
            image(
                this.sprites[this.animationIndex],
                this.position.x - this.sprites[this.animationIndex].width / 4 / 20,
                this.position.y - this.sprites[this.animationIndex].height / 1.65 / 20,
                this.sprites[this.animationIndex].width / 20,
                this.sprites[this.animationIndex].height / 20
            )
        } else {
            scale(-1, 1)

            image(
                this.sprites[this.animationIndex],
                this.position.x * -1 - 1.5,
                this.position.y - this.sprites[this.animationIndex].height / 1.65 / 20,
                this.sprites[this.animationIndex].width / 20,
                this.sprites[this.animationIndex].height / 20
            )            
            scale(-1, 1)

        } 
        //fill(this.color)

        //rect(this.position.x, this.position.y, 1, 1)

        //jetpack bar
        fill(color(70, 130, 180, 100))
        rect(
            this.position.x - 1,
            this.position.y - 2.5,
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
