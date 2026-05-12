const dragons = [
  {
    title: "Stormrunner",
    desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque alias dolores ut quam cum atque eaque excepturi, maxime doloribus suscipit eum est iure nam quos.",
    img: "images/img1.png",
    bg: "linear-gradient(135deg, #1aa7ec, #126e9f)"
  },
  {
    title: "Flameclaw",
    desc: "Fiery and fierce, Flameclaw scorches the battlefield with unstoppable energy.",
    img: "images/img2.png",
    bg: "linear-gradient(135deg, #ff4c1a, #a62400)"
  },
  {
    title: "Shadowfang",
    desc: "A master of stealth and shadow, Shadowfang strikes without warning.",
    img: "images/img3.png",
    bg: "linear-gradient(135deg, #9a4cff, #4a1c7c)"
  },
  {
    title: "Goldenscale",
    desc: "The radiant guardian of the skies, shimmering with golden power.",
    img: "images/img4.png",
    bg: "linear-gradient(135deg, #f9c82f, #c79800)"
  },
  {
    title: "Verdantwing",
    desc: "Guardian of nature, Verdantwing soars over lush forests and valleys.",
    img: "images/img5.png",
    bg: "linear-gradient(135deg, #2fe87a, #008f4a)"
  }
];

const titleEl = document.getElementById("dragon-title");
const descEl = document.getElementById("dragon-desc");
const imgEl = document.getElementById("dragon-img");
const container = document.querySelector(".slider-container");
const controls = document.querySelectorAll(".control-btn");

// Typewriter animation function
function typeWriter(element, text, speed = 40, callback) {
  element.textContent = "";
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  type();
}

function showDragon(index) {
  controls.forEach(btn => btn.classList.remove("active"));
  controls[index].classList.add("active");

  // Image exit animation
  imgEl.style.animation = "fadeZoomOut 0.4s forwards";

  setTimeout(() => {
    // Update background and image
    container.style.background = dragons[index].bg;
    imgEl.src = dragons[index].img;
    imgEl.style.animation = "fadeZoomIn 0.6s ease forwards";

    // Run typing animations for text
    typeWriter(titleEl, dragons[index].title, 60, () => {
      typeWriter(descEl, dragons[index].desc, 25);
    });

  }, 300);
}

// Set control button images & events
controls.forEach((btn, i) => {
  btn.style.backgroundImage = `url('${dragons[i].img}')`;
  btn.style.backgroundSize = "cover";
  btn.style.backgroundPosition = "center";
  btn.addEventListener("click", () => showDragon(i));
});

// Show first dragon on load
showDragon(0);
