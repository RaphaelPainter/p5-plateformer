function interpretAdjacentMovement(levelContext, param1, param2) {
    MoveToAdjacentScreen(levelContext, param1, param2)
}

function movePlayerOnScreen(player, x, y) {
    player.position = createVector(x, y)
}

async function MoveToAdjacentScreen(levelContext, x, y) {
    console.log(x, y)

    //CHANGE TABLEAU DISPLAYED
    levelContext.image = await new Promise((resolve, reject) => {
        loadImage(`levels/${x}*${y}.png`, (img) => {
            resolve(img)
        })
    })
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')

    //CHANGE TABLEAU HITBOX
    myImage = new Image()
    myImage.src = `levels/${x}*${y}.png`
    await loadImageVanilla(myImage)
    ctx.drawImage(myImage, 0, 0)
    levelContext.data = ctx.getImageData(0, 0, myImage.width, myImage.height)

    if (x > 0) {
        movePlayerOnScreen(
            levelContext.player,
            0,
            levelContext.player.position.y
        )
    } else if (x < 0) {
        console.log(level.width)
        movePlayerOnScreen(
            levelContext.player,
            level.width - 1,
            levelContext.player.position.y
        )
    }
}
