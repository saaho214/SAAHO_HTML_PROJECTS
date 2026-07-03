/*=============== SWIPER JS ===============*/
let swiperCards = new Swiper(".card__content", {
  loop: true,
  spaceBetween: 32,
  grabCursor: true,
  centeredSlides: true,

  effect: "coverflow",
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 120,
    modifier: 2.5,
    slideShadows: false,
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints:{
    0: { slidesPerView: 1 },
    600: { slidesPerView: 2 },
    968: { slidesPerView: 3 },
  },
});


/*=============== POPUP ===============*/
const buttons = document.querySelectorAll(".card__button");
const popup = document.getElementById("popup");
const popupName = document.getElementById("popupName");
const popupDesc = document.getElementById("popupDesc");
const closePopup = document.getElementById("closePopup");

buttons.forEach(button => {
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const card = button.closest(".card__article");
    const name = card.querySelector(".card__name").innerText;
    const desc = card.querySelector(".card__description").innerText;

    popupName.textContent = name;
    popupDesc.textContent = desc;

    popup.style.display = "flex";
  });
});

closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});