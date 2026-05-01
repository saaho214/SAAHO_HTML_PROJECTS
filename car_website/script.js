

    // Initialize Plugins with Reverse Scroll Enabled
    AOS.init({ 
        duration: 1000, 
        once: false, // Allows re-animation on scroll up
        mirror: true // Triggers while scrolling past
    });

    const swiper = new Swiper(".mySwiper", {
        loop: true,
        effect: "fade",
        speed: 1500,
        autoplay: { delay: 6000, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
    });

    // Theme Toggle Function
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('apex-pref-theme', newTheme);
    }

    // Configurator Logic
    function changeColor(filterValue, colorName) {
        const carImg = document.getElementById('carPreview');
        const label = document.getElementById('colorLabel');
        if(carImg) carImg.style.filter = filterValue;
        if(label) label.innerText = `SELECTED: INR {colorName}`;
    }

    // Auto-Open Modal Popup on first visit
    window.addEventListener('load', () => {
        const hasVisited = localStorage.getItem('apex-visited');
        if (!hasVisited) {
            setTimeout(() => {
                const myModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
                myModal.show();
                localStorage.setItem('apex-visited', 'true');
            }, 2000);
        }
    });

    // Persistence
    const savedTheme = localStorage.getItem('apex-pref-theme') || 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);