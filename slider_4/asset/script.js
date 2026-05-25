    let box = document.querySelector(".box");

    let image = [
      "download (1).jpg",
      "download (2).jpg",
      "download (3).jpg",
      "download (4).jpg",
      "download (5).jpg",
      "download (7).jpg",
      "download.jpg",
      "images.jpg"
    ];

    box.innerHTML = image.map((img, i) => `
      <span style="--i:${i}">
        <img src="./images/${img}" alt="">
      </span>
    `).join("");

    document.addEventListener("mousemove", (e) => {
      
      let x = (window.innerWidth / 2 - e.clientX) / 25;

      box.style.transform =`rotateY(${x}deg)`;
    });

    let angle = 0;

    setInterval(() => {
      angle += 0.2;
      box.style.transform = `rotateY(${angle}deg)`;
    }, 30);