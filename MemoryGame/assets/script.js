const decks = {
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
  emojis: ["😀", "😍", "🤣", "😎", "🥳", "😴", "🤔", "🥺"],
  flags: ["🦃", "🦅", "🦢", "🦆", "🕊", "🦜", "🐦‍🔥", "🦤"],
  electronics: ["🖲", "💻", "🖥", "🖨", "💿", "⌨", "🔋", "📸"],
  food: ["🧇", "🍟", "🍔", "🥖", "🧈", "🫓", "🥗", "🧀"],
  fruit: ["🍇", "🍌", "🍋‍", "🍐", "🍓", "🍒", "🍑", "🥭"],
  flower: ["🌵", "🌻", "🌼", "🌷", "🪻", "🏵", "🌸", "🍁"],
  vehicles: ["🚗", "🛺", "🚕", "🚛", "🚒", "🛻", "🚜", "✈"],
  buildings: ["🏩", "🏥", "🕌", "🏠", "🏘", "🏯", "🏭", "🏰"],
  moons: ["🌑", "🌖", "🌕", "🌔", "🌓", "🌙", "🌒", "🌜"],
  hearts: ["💛", "🧡", "🩷", "❤", "💜", "💗", "💕", "💞"],
  symbols: ["🚭", "🚷", "🚫", "🚯", "🚱", "🚳", "🔞", "📵"],
  colors: ["🟥", "🟨", "🟩", "🟦", "⬜", "⬛", "🟫"],
  signs: ["⬆", "⬇", "↗", "↘", "↙", "↖", "➡", "⬅"],
};

let currentDeck = "animals";
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let startTime = null;
let timerInterval = null;
let customImages = [];

function initializeGame() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";

  let symbols = customImages.length > 0 ? customImages : decks[currentDeck];
  symbols = [...symbols, ...symbols];
  symbols = symbols.sort(() => Math.random() - 0.5);

  cards = [];
  symbols.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty("--index", index);
    card.innerHTML = `
                    <div class="card-face card-front">?</div>
                    <div class="card-face card-back">${symbol}</div>
                `;
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
    cards.push(card);
  });

  resetStats();
  setTimeout(() => showPreview(), 100);
}

function showPreview() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.classList.add("preview-mode");

  cards.forEach((card) => {
    card.classList.add("flipped");
  });

  setTimeout(() => {
    cards.forEach((card) => {
      card.classList.remove("flipped");
    });
    gameBoard.classList.remove("preview-mode");
    startTimer();
  }, 3000);
}

function flipCard(card) {
  if (
    flippedCards.length === 2 ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {
    return;
  }

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    document.getElementById("moves").textContent = moves;

    if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
      setTimeout(() => {
        flippedCards.forEach((card) => {
          card.classList.add("matched");
          card.style.pointerEvents = "none";
        });
        matchedPairs++;
        updateMatches();
        checkWin();
        flippedCards = [];
      }, 600);
    } else {
      setTimeout(() => {
        flippedCards.forEach((card) => card.classList.remove("flipped"));
        flippedCards = [];
      }, 1000);
    }
  }
}

function updateMatches() {
  document.getElementById("matches").textContent = `${matchedPairs}/8`;
  const progress = (matchedPairs / 8) * 100;
  document.getElementById("progress").style.width = `${progress}%`;
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (elapsed % 60).toString().padStart(2, "0");
    document.getElementById("timer").textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function checkWin() {
  if (matchedPairs === 8) {
    clearInterval(timerInterval);
    setTimeout(() => {
      document.getElementById("finalTime").textContent =
        document.getElementById("timer").textContent;
      document.getElementById("finalMoves").textContent = moves;
      document.getElementById("gameComplete").style.display = "block";
    }, 500);
  }
}

function resetStats() {
  matchedPairs = 0;
  moves = 0;
  flippedCards = [];
  document.getElementById("moves").textContent = "0";
  document.getElementById("matches").textContent = "0/8";
  document.getElementById("timer").textContent = "00:00";
  document.getElementById("progress").style.width = "0%";
  document.getElementById("gameComplete").style.display = "none";
  if (timerInterval) clearInterval(timerInterval);
}

function resetGame() {
  resetStats();
  initializeGame();
}

document.querySelectorAll(".deck-option").forEach((option) => {
  option.addEventListener("click", (e) => {
    if (e.target.classList.contains("custom-upload")) return;

    document
      .querySelectorAll(".deck-option")
      .forEach((opt) => opt.classList.remove("active"));
    e.target.classList.add("active");
    currentDeck = e.target.dataset.deck;
    resetGame();
  });
});

document.getElementById("customImages").addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  if (files.length >= 8) {
    customImages = files.slice(0, 8).map((file) => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      return img.outerHTML;
    });
    currentDeck = "custom";
    resetGame();
  }
});

initializeGame();
