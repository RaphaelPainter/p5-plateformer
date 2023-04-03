let NEUTRAL_POSITION = 100

function interpretAdjacentMovement(levelContext, param1, param2) {
    MoveToAdjacentScreen(levelContext, param1, param2)
}

function movePlayerOnScreen(player, x, y) {
    player.position = createVector(x, y)
}

async function MoveToAdjacentScreen(levelContext, x, y) {
    let changeTableau = false

    if (levelContext.player.velocity.x > 0 && x > NEUTRAL_POSITION) {
        movePlayerOnScreen(
            levelContext.player,
            0,
            levelContext.player.position.y
        )
        changeTableau = true
    } else if (levelContext.player.velocity.x < 0 && x < NEUTRAL_POSITION) {
        movePlayerOnScreen(
            levelContext.player,
            level.width - 1,
            levelContext.player.position.y
        )
        changeTableau = true
    }
    if (changeTableau) {
        //CHANGE TABLEAU DISPLAYED
        levelContext.image = await new Promise((resolve, reject) => {
            loadImage(
                `levels/${levelX + x - NEUTRAL_POSITION}*${y}.png`,
                (img) => {
                    resolve(img)
                }
            )
        })
        const c = document.createElement('canvas')
        const ctx = c.getContext('2d')

        //CHANGE TABLEAU HITBOX
        myImage = new Image()
        myImage.src = `levels/${levelX + x - NEUTRAL_POSITION}*${y}.png`
        await loadImageVanilla(myImage)
        ctx.drawImage(myImage, 0, 0)
        levelContext.data = ctx.getImageData(
            0,
            0,
            myImage.width,
            myImage.height
        )
        levelX = levelX + x - NEUTRAL_POSITION
    }
}
