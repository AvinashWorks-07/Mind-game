const values = ["🧁","🍧","🍬","🍄","🍉","🍿","🍎","🍇","🧀", "🍓", "🍍", "🍕", "🍔", "🍟", "🌭", "🍩", "🍪", "🎂", "🍰", "🍫"];

let gameLevel = 1;
let fullvalues = [];

const box = document.querySelector(".box");
const score = document.querySelector("#score");
const coins = document.querySelector("#coins");
const mintime = document.querySelector("#min");
const sectime = document.querySelector("#sec");
const levelTimeDisplay = document.querySelector("#level-time");
const pause = document.querySelector("#pause");
const startButton = document.querySelector("#start");
const startGameContainer = document.querySelector(".start-game");
const winContainer = document.querySelector(".win");
const restartButton = document.querySelector("#restart");
const themeToggle = document.querySelector("#theme-toggle");
const shopBtn = document.querySelector("#shop-btn");
const shopModal = document.querySelector("#shop-modal");
const closeBtn = document.querySelector(".close-btn");
const shopItemsContainer = document.querySelector(".shop-items");

let secCount = 0;
let minCount = 0;
let scoreCount = 0;
let coinsCount = 0;
let matchCount = 0;
let isPause = false;
let interval;
let levelInterval;
let gameStarted = false;
let flipCards = [];
let levelTime = 0;

const shopItems = [
    { id: "theme-pastel", name: "Pastel Theme", price: 100, type: "theme" },
    { id: "theme-dark", name: "Dark Theme", price: 150, type: "theme" },
    { id: "cards-fruits", name: "Fruits Emojis", price: 50, type: "card" },
    { id: "cards-animals", name: "Animals Emojis", price: 50, type: "card" },
];

let purchasedItems = [];

const generateCards = () => {
    box.innerHTML = "";
    let numPairs = gameLevel + 1;
    let levelValues = values.slice(0, numPairs);
    fullvalues = [...levelValues, ...levelValues].sort(() => 0.5 - Math.random());

    if (gameLevel % 10 === 0) {
        levelTime = 60; // 60 seconds for timed level
        levelTimeDisplay.textContent = levelTime;
        startLevelTimer();
    }

    fullvalues.forEach((elem) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="inner-card">
                <div class="front-card">?</div>
                <div class="back-card">${elem}</div>
            </div>`;
        card.addEventListener("click", () => cardFlip(card, elem));
        box.appendChild(card);
    });
};

const startTimer = () => {
    interval = setInterval(() => {
        if (!isPause) {
            secCount++;
            sectime.textContent = String(secCount).padStart(2, '0');
            if (secCount === 60) {
                minCount++;
                mintime.textContent = String(minCount).padStart(2, '0');
                secCount = 0;
            }
        }
    }, 1000);
};

const startLevelTimer = () => {
    levelInterval = setInterval(() => {
        if (!isPause) {
            levelTime--;
            levelTimeDisplay.textContent = levelTime;
            if (levelTime <= 0) {
                clearInterval(levelInterval);
                alert("Time is up! Game over.");
                resetGame();
            }
        }
    }, 1000);
};

const stopInterval = () => {
    clearInterval(interval);
    clearInterval(levelInterval);
};

const cardFlip = (card, value) => {
    if (isPause || card.classList.contains("flipped")) return;

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    card.classList.add("flipped");
    flipCards.push({ card, value });

    if (flipCards.length === 2) {
        const [firstCard, secondCard] = flipCards;
        if (firstCard.value === secondCard.value) {
            scoreCount += 10;
            score.textContent = scoreCount;
            matchCount += 2;
            flipCards = [];

            if (matchCount === fullvalues.length) {
                setTimeout(() => {
                    winContainer.classList.remove("hidden");
                    document.querySelector("#time-req").textContent = `${String(minCount).padStart(2, '0')}:${String(secCount).padStart(2, '0')}`;
                    scoreCount += 50; // Bonus for finishing
                    score.textContent = scoreCount;
                    coinsCount += Math.floor(scoreCount / 10);
                    coins.textContent = coinsCount;
                    saveProgress();
                    stopInterval();
                }, 500);
            }
        } else {
            setTimeout(() => {
                firstCard.card.classList.remove("flipped");
                secondCard.card.classList.remove("flipped");
                flipCards = [];
            }, 700);
        }
    }
};

const resetGame = () => {
    secCount = 0;
    minCount = 0;
    matchCount = 0;
    isPause = false;
    gameStarted = false;
    flipCards = [];
    score.textContent = scoreCount;
    coins.textContent = coinsCount;
    mintime.textContent = "00";
    sectime.textContent = "00";
    levelTimeDisplay.textContent = "00";
    pause.innerHTML = `<i class="ri-pause-fill"></i>`;
    winContainer.classList.add("hidden");
    startGameContainer.classList.remove("hidden");
    stopInterval();
}

startButton.addEventListener("click", () => {
    startGameContainer.classList.add("hidden");
    generateCards();
    startTimer();
});

pause.addEventListener("click", () => {
    isPause = !isPause;
    pause.innerHTML = isPause ? `<i class="ri-play-line"></i>` : `<i class="ri-pause-fill"></i>`;
});

restartButton.addEventListener("click", () => {
    gameLevel++;
    resetGame();
});

// Theme switcher
themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

const loadTheme = () => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.checked = true;
    }
};

// Shop
const renderShopItems = () => {
    shopItemsContainer.innerHTML = "";
    shopItems.forEach(item => {
        const itemEl = document.createElement("div");
        itemEl.classList.add("shop-item");
        if (purchasedItems.includes(item.id)) {
            itemEl.classList.add("purchased");
        }
        itemEl.innerHTML = `
            <p>${item.name}</p>
            <p>Price: ${item.price}</p>
        `;
        itemEl.addEventListener("click", () => buyItem(item));
        shopItemsContainer.appendChild(itemEl);
    });
};

const buyItem = (item) => {
    if (purchasedItems.includes(item.id)) return;

    if (coinsCount >= item.price) {
        coinsCount -= item.price;
        coins.textContent = coinsCount;
        purchasedItems.push(item.id);
        saveProgress();
        renderShopItems();
        applyPurchase(item);
    } else {
        alert("Not enough coins!");
    }
};

const applyPurchase = (item) => {
    if (item.type === "theme") {
        document.body.className = ""; // Reset classes
        document.body.classList.add(item.id);
    }
};

shopBtn.addEventListener("click", () => {
    shopModal.classList.remove("hidden");
    renderShopItems();
});

closeBtn.addEventListener("click", () => {
    shopModal.classList.add("hidden");
});

// Local Storage
const saveProgress = () => {
    localStorage.setItem("gameLevel", gameLevel);
    localStorage.setItem("score", scoreCount);
    localStorage.setItem("coins", coinsCount);
    localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems));
};

const loadProgress = () => {
    const savedLevel = localStorage.getItem("gameLevel");
    const savedScore = localStorage.getItem("score");
    const savedCoins = localStorage.getItem("coins");
    const savedPurchasedItems = localStorage.getItem("purchasedItems");

    if (savedLevel) gameLevel = parseInt(savedLevel);
    if (savedScore) scoreCount = parseInt(savedScore);
    if (savedCoins) coinsCount = parseInt(savedCoins);
    if (savedPurchasedItems) purchasedItems = JSON.parse(savedPurchasedItems);

    score.textContent = scoreCount;
    coins.textContent = coinsCount;
};

// Initial setup
loadProgress();
resetGame();
loadTheme();