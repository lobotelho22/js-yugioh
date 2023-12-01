const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card_image"),
        name: document.getElementById("card_name"),
        type: document.getElementById("card_type"),
    },
    fieldCards: {
        player: document.getElementById("player_field_card"),
        computer: document.getElementById("computer_field_card"),
    },
    actions: {
        button: document.getElementById("next_duel")
    }
}

const playerSides = {
    player1: "player_cards",
    computer: "computer_cards",
}

const imgPath = "./src/assets/icons/"
const cardBack = `${imgPath}card-back.png`

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${imgPath}dragon.png`,
        winOf: [1],
        Lose: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${imgPath}magician.png`,
        winOf: [2],
        Lose: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissor",
        img: `${imgPath}exodia.png`,
        winOf: [0],
        Lose: [1],
    }
]

const getRandomCardId = async () => {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id
}

const drawSelectedCard = (idCard) => {
    state.cardSprites.avatar.src = cardData[idCard].img;
    state.cardSprites.name.innerText = cardData[idCard].name;
    state.cardSprites.type.innerText = `Attribute: ${cardData[idCard].type}`;
}

const setCardsField = async (idCard) => {

    await removeAllCardsImage();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[idCard].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore();
    await drawButton(duelResults);
}

const createCardImage = async (idCard, fieldSide) => {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", cardBack);
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(idCard);
        })

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
            console.log("calma...")
        });

    }

    return cardImage
}

const drawCards = async (cardNumbers, fieldSide) => {
    for (let i = 0; i < 5; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage)
        console.log(fieldSide)
    }
}

function init() {
    drawCards(5, playerSides.player1)
    drawCards(5, playerSides.computer)
}

init();