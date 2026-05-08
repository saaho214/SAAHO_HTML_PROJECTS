let list = document.querySelectorAll(".carousel .list .item");
let carousel = document.querySelector(".carousel");
let next = document.getElementById("next");
let prev = document.getElementById("prev");
let mockup = document.querySelector(".mockup");

let count = list.length;
let active = 0;
let left_each_item = 100 / (count - 1);
let leftMockup = 0;

// Flag to prevent animation overlap
let isAnimating = false;

const updateMockupPosition = () => {
  // Reset position logic to ensure the background doesn't vanish
  // when the carousel loops back to the start
  leftMockup = active * left_each_item;
  mockup.style.setProperty("--left", leftMockup + "%");
};

next.onclick = () => {
  if (isAnimating) return;
  active = active >= count - 1 ? 0 : active + 1;
  carousel.classList.remove("right");
  changeCarousel();
};

prev.onclick = () => {
  if (isAnimating) return;
  active = active <= 0 ? count - 1 : active - 1;
  carousel.classList.add("right");
  changeCarousel();
};

function changeCarousel() {
  isAnimating = true;

  // 1. Handle Class Swapping
  let hidden_old = document.querySelector(".item.hidden");
  if (hidden_old) hidden_old.classList.remove("hidden");

  let active_old = document.querySelector(".item.active");
  if (active_old) {
    active_old.classList.remove("active");
    active_old.classList.add("hidden");
  }

  list[active].classList.add("active");

  // 2. Update Mockup Background Position
  updateMockupPosition();

  // 3. Reset Auto-Play Timer
  clearInterval(refreshInterval);
  refreshInterval = setInterval(() => {
    next.click();
  }, 5000); // Increased to 5s for better UX

  // 4. Re-enable clicking after animation finishes (approx 800ms)
  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

// Initial Auto-run
let refreshInterval = setInterval(() => {
  next.click();
}, 5000);

// Optional: Pause auto-run when user hovers over the carousel
carousel.addEventListener("mouseenter", () => clearInterval(refreshInterval));
carousel.addEventListener("mouseleave", () => {
  refreshInterval = setInterval(() => {
    next.click();
  }, 5000);
});
