const users = [
    { name: "SAAHO", prof: "Frontend Dev", shape: "shape--original", theme: "" },
    { name: "SARA", prof: "UI Designer", shape: "shape--diamond", theme: "card--orange" },
    { name: "MIKE", prof: "Backend Expert", shape: "shape--pill", theme: "card--yellow" },
    { name: "ALEX", prof: "Security Eng", shape: "shape--hexagon", theme: "card--blue" },
    { name: "TONY", prof: "Product Lead", shape: "shape--ticket", theme: "card--pink" },
    { name: "JOE", prof: "Motion Artist", shape: "shape--pentagon", theme: "card--purple" },
    { name: "ARJUN", prof: "Data Scientist", shape: "shape--blob", theme: "card--orange" },
    { name: "MAK", prof: "Cloud Architect", shape: "shape--beveled", theme: "card--red" },
    { name: "MARK", prof: "UX Researcher", shape: "shape--chat", theme: "card--yellow" },
    { name: "Victor", prof: "Fullstack Dev", shape: "shape--leaf", theme: "card--green" }
];

const renderCards = () => {
    const container = document.getElementById('card-container');
    
    container.innerHTML = users.map(user => `
        <div class="card ${user.theme} ${user.shape}">
            <div class="card__border">
                <div class="card__perfil">
                    <img src="assets/img/perfil.png" alt="" class="card__img">
                </div>
            </div>
            <h3 class="card__name">${user.name}</h3>
            <span class="card__profession">${user.prof}</span>

            <div class="info">
                <div class="info__icon"><i class="ri-information-line"></i></div>
                <div class="info__border">
                    <div class="info__perfil">
                        <img src="assets/img/perfil.png" alt="" class="info__img">
                    </div>
                </div>
                <div class="info__data">
                    <h3 class="info__name">${user.name}</h3>
                    <span class="info__profession">Expert ${user.prof}</span>
                    <span class="info__location">Remote / Global</span>
                </div>
                <div class="info__social">
                    <a href="#" class="info__social-link"><span class="info__social-icon"><i class="ri-linkedin-box-line"></i></span></a>
                    <a href="#" class="info__social-link"><span class="info__social-icon"><i class="ri-github-fill"></i></span></a>
                </div>
            </div>
        </div>
    `).join('');
};

renderCards();