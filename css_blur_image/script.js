// 1. Your Data - Add more objects here to create more cards!
const cardData = [
    {
        title: "UI Layout",
        category: "ui",
        image: "https://i.pinimg.com/474x/50/ae/b0/50aeb003e9ec766cef3df47ba167ca60.jpg",
        desc: "A modern user interface design with clean lines."
    },
    {
        title: "Brand Identity",
        category: "branding",
        image: "https://i.pinimg.com/736x/f4/47/47/f44747e2992b2414142f0beb3412ec79.jpg",
        desc: "Minimalist branding concept exploring bold typography."
    },
    {
        title: "Mobile App",
        category: "app",
        image: "https://i.pinimg.com/736x/c8/fa/1d/c8fa1daa7cc88125c7f321aafde36689.jpg",
        desc: "Mobile-first application design focused on transitions."
    },
    {
        title: "Glassmorphism",
        category: "ui",
        image: "https://i.pinimg.com/474x/50/ae/b0/50aeb003e9ec766cef3df47ba167ca60.jpg", 
        desc: "Exploring the frosted glass aesthetic in modern UI."
    },
    {
        title: "Logo Concept",
        category: "branding",
        image: "https://i.pinimg.com/736x/c8/fa/1d/c8fa1daa7cc88125c7f321aafde36689.jpg",
        desc: "A vector-based logo design for a tech startup."
    }
];

const cardContainer = document.getElementById('cardContainer');
const searchInput = document.getElementById('searchBar');
const filterBtns = document.querySelectorAll('.filter-btn');

// 2. Function to Render Cards
function displayCards(data) {
    cardContainer.innerHTML = data.map(item => `
        <div class="card" data-category="${item.category}">
            <div class="imageBox" style="--img:url('${item.image}')"></div>
            <div class="content">
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                <button class="action-btn">View Project</button>
            </div>
        </div>
    `).join('');
}

// Initial render
displayCards(cardData);

// 3. Search Logic
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = cardData.filter(item => 
        item.title.toLowerCase().includes(query)
    );
    displayCards(filtered);
});

// 4. Filter Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');
        const filtered = category === 'all' 
            ? cardData 
            : cardData.filter(item => item.category === category);
            
        displayCards(filtered);
    });
});