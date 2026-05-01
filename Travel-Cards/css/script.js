// Database of cards
const locations = [
    { name: "Banff National Park", country: "Canada", desc: "Canada's first national park, famous for turquoise lakes.", img: "./images/canada.png" },
    { name: "Plitvice Lakes", country: "Croatia", desc: "Known for a chain of 16 terraced lakes and waterfalls.", img: "./images/Croatia.png" },
    { name: "Lake Como", country: "Italy", desc: "Elegant dramatic scenery and luxurious villas.", img: "./images/Italy.png" },
    { name: "Santorini", country: "Greece", desc: "Iconic white buildings overlooking the Aegean Sea.", img: "./images/Greece.png" },
    { name: "Mount Fuji", country: "Japan", desc: "An active volcano and Japan's highest peak.", img: "./images/Japan.png" },
    { name: "Machu Picchu", country: "Peru", desc: "The legendary lost city of the Incas.", img: "./images/peru.png" }
];

const cardContainer = document.getElementById('cardContainer');
const searchInput = document.getElementById('searchInput');

// Function to render cards to the UI
function renderCards(data) {
    cardContainer.innerHTML = data.map(item => `
        <div class="card">
            <div class="card-header">
                <img src="${item.img}" alt="${item.name}">
                <div class="location">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${item.country}</span>
                </div>
            </div>
            <div class="card-body">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
            </div>
            <div class="card-footer">
                <button class="apply">Let's Travel</button>
            </div>
        </div>
    `).join('');
}

// Initial Call
renderCards(locations);

// Search Filter Logic
searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = locations.filter(item => 
        item.name.toLowerCase().includes(value) || 
        item.country.toLowerCase().includes(value)
    );
    renderCards(filteredData);
});