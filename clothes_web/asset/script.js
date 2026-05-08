// 1. GLOBAL FUNCTIONS (Defined outside so they are accessible everywhere)
function initProductAnimations() {
  const cards = document.querySelectorAll(".product-card");
  cards.forEach((card, index) => {
    const anims = ["fade-right", "fade-down", "fade-up", "fade-left"];
    card.setAttribute("data-aos", anims[index % 4]);
  });
}

function filterProducts(category) {
  const cards = document.querySelectorAll(".product-card");
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  if (event && event.currentTarget) event.currentTarget.classList.add("active");

  cards.forEach((card) => {
    card.style.display =
      card.dataset.product === category || category === "featured"
        ? "block"
        : "none";
  });
  if (typeof AOS !== "undefined") AOS.refresh();
}

function openModal(type) {
  const modal = document.getElementById("interactiveModal");
  const title = document.getElementById("modalTitle");
  const desc = document.getElementById("modalDesc");
  if (!modal) return;
  modal.style.display = "block";
  const content = {
    view: ["Quick View", "Viewing details..."],
    like: ["Wishlist", "Added to favorites! ❤️"],
    cart: ["Shopping Cart", "Successfully added to cart! 🛒"],
    shop: ["Welcome", "Explore our collection."],
  };
  [title.innerText, desc.innerText] = content[type] || [
    "Evara Shop",
    "Action completed.",
  ];
}

// --- DYNAMIC ELEMENTS FUNCTIONS ---
function updateLiveTime() {
  const promoArea = document.querySelector(".promo-text");
  if (!promoArea) return;
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  promoArea.innerHTML = `✨ <strong>${dateString} | ${timeString}</strong> - Super Value Deals Today!`;
}

function initTimer(elementId, hours) {
  const timerWrap = document.getElementById(elementId);
  if (!timerWrap) return;
  const targetDate = new Date().getTime() + hours * 60 * 60 * 1000;

  const update = () => {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;
    if (timeLeft <= 0) {
      timerWrap.innerHTML = "DEAL EXPIRED";
      return;
    }
    const d = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const h = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((timeLeft % (1000 * 60)) / 1000);

    const days = timerWrap.querySelector(".days");
    const hoursEl = timerWrap.querySelector(".hours");
    const mins = timerWrap.querySelector(".mins");
    const secs = timerWrap.querySelector(".secs");

    if (days) days.innerText = String(d).padStart(2, "0");
    if (hoursEl) hoursEl.innerText = String(h).padStart(2, "0");
    if (mins) mins.innerText = String(m).padStart(2, "0");
    if (secs) secs.innerText = String(s).padStart(2, "0");
  };
  update();
  setInterval(update, 1000);
}

// 2. INITIALIZATION LOGIC
document.addEventListener("DOMContentLoaded", () => {
  // Start Time and Timers immediately
  updateLiveTime();
  setInterval(updateLiveTime, 1000);
  initTimer("deal-timer-1", 48);
  initTimer("deal-timer-2", 24);

  // Initialize Animations
  initProductAnimations();

  // Initialize AOS
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      container: "#scroll-container",
      offset: 0,
      easing: "ease-out-quad",
    });
  }

  // Scroll Fix for AOS
  const scrollContainer = document.getElementById("scroll-container");
  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", () => {
      if (typeof AOS !== "undefined") AOS.refresh();
    });
  }

  // Slider Logic
  const slider = document.getElementById("categorySlider");
  if (slider) {
    const next = document.getElementById("slideNext");
    const prev = document.getElementById("slidePrev");
    if (next)
      next.onclick = () => slider.scrollBy({ left: 200, behavior: "smooth" });
    if (prev)
      prev.onclick = () => slider.scrollBy({ left: -200, behavior: "smooth" });
  }

  // Theme Toggle
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      document.documentElement.setAttribute(
        "data-theme",
        toggle.checked ? "dark" : "light"
      );
    });
  }

  // Tab Switching
  document.querySelectorAll(".tab-item").forEach((tab) => {
    tab.onclick = function () {
      document.querySelector(".tab-item.active")?.classList.remove("active");
      this.classList.add("active");
    };
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("arrivalsSlider");
  const nextBtn = document.getElementById("arrivalsNext");
  const prevBtn = document.getElementById("arrivalsPrev");

  if (!slider || !nextBtn || !prevBtn) return;

  // 1. Setup Clones
  const originalCards = Array.from(slider.children);
  const cardCount = originalCards.length;
  const gap = 20;

  // Clone 4 from each end for a seamless buffer
  const clonesToAppend = originalCards
    .slice(0, 4)
    .map((card) => card.cloneNode(true));
  const clonesToPrepend = originalCards
    .slice(-4)
    .map((card) => card.cloneNode(true));

  clonesToAppend.forEach((clone) => slider.appendChild(clone));
  clonesToPrepend.reverse().forEach((clone) => slider.prepend(clone));

  // 2. Initial Dimensions and Position
  const getCardWidth = () =>
    slider.querySelector(".arrivals-card").offsetWidth + gap;
  let cardWidth = getCardWidth();

  // Start at the first real card
  slider.scrollLeft = cardWidth * 4;

  let isJumping = false;

  // 3. Seamless Jump Logic
  const handleInfiniteJump = () => {
    if (isJumping) return;

    const scrollLeft = slider.scrollLeft;
    const scrollWidth = slider.scrollWidth;
    const clientWidth = slider.clientWidth;

    // Jump from End back to Start
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      isJumping = true;
      slider.style.scrollBehavior = "auto";
      slider.scrollLeft = cardWidth * 4;
      setTimeout(() => {
        slider.style.scrollBehavior = "smooth";
        isJumping = false;
      }, 50);
    }
    // Jump from Start back to End
    else if (scrollLeft <= 10) {
      isJumping = true;
      slider.style.scrollBehavior = "auto";
      slider.scrollLeft = cardWidth * cardCount;
      setTimeout(() => {
        slider.style.scrollBehavior = "smooth";
        isJumping = false;
      }, 50);
    }
  };

  // 4. Navigation Buttons
  nextBtn.onclick = () => {
    cardWidth = getCardWidth();
    slider.scrollBy({ left: cardWidth, behavior: "smooth" });
  };

  prevBtn.onclick = () => {
    cardWidth = getCardWidth();
    slider.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

  // 5. Unified Scroll Listener
  slider.addEventListener("scroll", () => {
    handleInfiniteJump();

    // Refresh AOS to catch newly visible clones
    if (window.AOS) {
      AOS.refresh();
    }
  });

  // Recalculate on resize for responsiveness
  window.addEventListener("resize", () => {
    cardWidth = getCardWidth();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // 2. Add "Assemble to place" effect using AOS
  AOS.init({
    duration: 1000,
    easing: "ease-out-back",
    once: false, // Set to true if you only want it to happen once
    mirror: true,
  });

  // Optional: Refresh AOS when scrolling for heavy maps
  window.addEventListener("load", () => {
    AOS.refresh();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    duration: 1000,
    offset: 50,
    easing: "ease-in-out",
  });
});
