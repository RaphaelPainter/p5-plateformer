let NEUTRAL_POSITION = 0
let thislevelContext

function interpretAdjacentMovement(levelContext, jsonID) {
    thislevelContext = levelContext
    loadJSON(
        './actions/' + jsonID + '.json',
        jsonCallback_interpretAdjacentMovement
    )
}

async function jsonCallback_interpretAdjacentMovement(mynewdata) {
    MoveToAdjacentScreen(thislevelContext, mynewdata.x, mynewdata.y)
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
    } else if (levelContext.player.velocity.y > 0 && y < NEUTRAL_POSITION) {
        movePlayerOnScreen(
            levelContext.player,
            levelContext.player.position.x,
            0
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

    function movePlayerOnScreen(player, x, y) {
        player.position = createVector(x, y)
    }
}
