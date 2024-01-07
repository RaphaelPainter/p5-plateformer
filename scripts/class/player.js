
class Player {
    //INIT
    constructor(position, velocity) {
        this.position = position
        this.velocity = velocity
        this.color = color(255, 204, 0, 255)
        this.collidingPixelColor = undefined
        this.canMove = true
        this.jumpackVelocity = createVector(0, 0)
    }

    //PHYSICS
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

    jumpack() {
        this.position.add(this.jumpackVelocity)
    }

    //DRAW
    draw() {
        noStroke();
        fill(this.color)
        rect(this.position.x, this.position.y, 1, 1)
    }
}