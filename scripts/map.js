//editor.p5js.org/swirly/sketches/rkA73FnzN

// bloquer le temps quand on regarde la map
// M ou 0 pour ouvrir/fermer la map en transparence
// curseur centrer sur l'index du joueur à la 1ère ouverture
// si on rouvre la map, alors centrer sur le dernier index
// X pour recentrer le curseur sur le joueur
// afficher des informations sur la case ciblée... où ? en dessous (genre le nom)

// la map affiche simplement là où il y a des choses à faire; et c'est mis à jour tout le temps.
// ex: une couleur particulière pour signifier le danger, qqch à faire, les points de tp
// ne montrer que les choses à faire proches du joueur !

// la difficulté s'ajuste tout le temps à son deck -> on alterne entre des moments de farm
// et des moments faciles
// la couleur indique la difficulté de la quête

//faudra modéliser ce qu'est une quête...
// c'est une succession de trigger/réaction
// un trigger = une map (ou non), un check (tel action sur tel asset(s) du jeu)
// une réaction = une action sur tel asset(s) du jeu

//exemple de check
// frapper, lancer et toucher, secouer, battre à raph-duel, obtenir une carte,
// entrer sur une map, parler à un pnj, être à une certaine position sur une map

// exemple de réaction
// apparition/disparition d'un pnj/sprite sur tel map à tel position,
// changement du dialogue d'un pnj,
// déclenchement d'un combat, modification de la hitbox d'une map,

var largeurCarree

function setup() {
    createCanvas(640, 640)
    largeurCarree = width / 8
}

function draw() {
    background(20)
    stroke('black') // bordure noire
    fill('grey')
    for (var ligne = 0; ligne < 8; ligne++) {
        fait_une_ligne(largeurCarree * ligne)
    }
    stroke('red') // bordure noire
    focus(2, 4)
}

function fait_une_ligne(ordonnee) {
    for (var nbCarres = 0; nbCarres < 8; nbCarres++) {
        rect(nbCarres * largeurCarree, ordonnee, largeurCarree, largeurCarree)
    }
}

function focus(abcisse, ordonnee) {
    rect(
        (abcisse - 1) * largeurCarree,
        (ordonnee - 1) * largeurCarree,
        largeurCarree,
        largeurCarree
    )
}
