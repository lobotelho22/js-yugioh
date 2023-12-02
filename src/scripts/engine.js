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
    playerSides: {
        player1: "player_cards",
        playerBOX: document.querySelector("#player_cards"),
        computer: "computer_cards",
        computerBOX: document.querySelector("#computer_cards"),
    },
    actions: {
        button: document.getElementById("next_duel")
    }
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
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${imgPath}magician.png`,
        winOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissor",
        img: `${imgPath}exodia.png`,
        winOf: [0],
        LoseOf: [1],
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

const removeAllCardsImage = async () => {
    const { computerBOX, playerBOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());

    imgElements = playerBOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());
}

const playAudio = async (status) => {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

const checkDuelResults = async (playerCardId, computerCardId) => {
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "Won";
        await playAudio("win")
        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Lose";
        await playAudio("lose")
        state.score.computerScore++;
    }

    return duelResults
}

const drawButton = async(duelResult) => {
    state.actions.button.innerText = duelResult;
    state.actions.button.style.display = "block";
}

const updateScore = async () => {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

const resetDuel = async () => {
    state.cardSprites.avatar.src = ""
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

const setCardsField = async (idCard) => {

    await removeAllCardsImage();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[idCard].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(idCard, computerCardId)

    await drawButton(duelResults);
    await updateScore();
}

const createCardImage = async (idCard, fieldSide) => {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", cardBack);
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(idCard);
        })

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

    }

    return cardImage
}

const drawCards = async (cardNumbers, fieldSide) => {
    for (let i = 0; i < 5; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

function init() {
    drawCards(5, state.playerSides.player1)
    drawCards(5, state.playerSides.computer)
}

init();