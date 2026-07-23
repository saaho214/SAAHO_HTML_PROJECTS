    
      const sideItems = document.querySelectorAll(".side-item");

      const swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
          rotate: 0,
          stretch: 100, // Pulls cards closer for overlap
          depth: 200,
          modifier: 1,
          slideShadows: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        on: {
          slideChange: function () {
            sideItems.forEach((item) => item.classList.remove("active"));
            sideItems[this.activeIndex].classList.add("active");
          },
        },
      });

      function goToSlide(index) {
        swiper.slideTo(index);
      }
    