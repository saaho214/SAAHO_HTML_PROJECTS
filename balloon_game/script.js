        // Game variables
        let username = '';
        let score = 0;
        let shots = 0;
        let hits = 0;
        let gameActive = false;
        let gameTimer;
        let objectInterval;
        let musicPlaying = true;
        let gamePaused = false;
        let objects = [];
        let particles = [];
        let floatingScores = [];
        let leaderboard = [];
        let currentLevel = 1;
        let timeLeft = 30;
        let objectsCreated = 0;
        let objectsHit = 0;
        let requiredHits = 28;
        let totalObjects = 40;

        // DOM Elements
        const loginScreen = document.getElementById('loginScreen');
        const levelSelection = document.getElementById('levelSelection');
        const gameScreen = document.getElementById('gameScreen');
        const performanceScreen = document.getElementById('performanceScreen');
        const usernameInput = document.getElementById('username');
        const displayUsername = document.getElementById('displayUsername');
        const performanceUsername = document.getElementById('performanceUsername');
        const scoreDisplay = document.getElementById('score');
        const levelDisplay = document.getElementById('level');
        const timerDisplay = document.getElementById('timer');
        const gameArea = document.getElementById('gameArea');
        const starsContainer = document.getElementById('starsContainer');
        const levelCompletedDisplay = document.getElementById('levelCompleted');
        const levelScoreDisplay = document.getElementById('levelScore');
        const objectsHitDisplay = document.getElementById('objectsHit');
        const hitBar = document.getElementById('hitBar');
        const requiredBar = document.getElementById('requiredBar');
        const levelGrid = document.getElementById('levelGrid');
        const muteButton = document.getElementById('muteButton');
        const pauseButton = document.getElementById('pauseButton');

        // Level configurations
        const levelConfigs = [
            { name: "Balloon Pop", color: "#ff6b6b", objects: ["balloon"] },
            { name: "Star Collector", color: "#ffd166", objects: ["star"] },
            { name: "Ice Drop Challenge", color: "#4ecdc4", objects: ["ice-drop"] },
            { name: "Symbol Shooter", color: "#ff9ff3", objects: ["symbol"] },
            { name: "Heart Breaker", color: "#ff6b6b", objects: ["heart"] }
        ];

        // Create clouds for background
        function createClouds() {
            for (let i = 0; i < 5; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'cloud';
                const size = 50 + Math.random() * 100;
                cloud.style.width = `${size}px`;
                cloud.style.height = `${size * 0.6}px`;
                cloud.style.top = `${20 + Math.random() * 60}%`;
                cloud.style.animationDuration = `${30 + Math.random() * 30}s`;
                cloud.style.animationDelay = `${Math.random() * 10}s`;
                document.body.appendChild(cloud);
            }
        }

        // Create level selection grid
        function createLevelGrid() {
            levelGrid.innerHTML = '';
            
            for (let i = 1; i <= 5; i++) {
                const levelItem = document.createElement('div');
                levelItem.className = 'level-item';
                levelItem.dataset.level = i;
                
                const levelNumber = document.createElement('div');
                levelNumber.className = 'level-number';
                levelNumber.textContent = i;
                
                const levelName = document.createElement('div');
                levelName.className = 'level-name';
                levelName.textContent = levelConfigs[i-1].name;
                
                const starsContainer = document.createElement('div');
                starsContainer.className = 'level-stars';
                
                // For demo purposes, unlock all levels
                for (let j = 0; j < 3; j++) {
                    const star = document.createElement('div');
                    star.className = 'star';
                    star.innerHTML = '★';
                    starsContainer.appendChild(star);
                }
                
                levelItem.appendChild(levelNumber);
                levelItem.appendChild(levelName);
                levelItem.appendChild(starsContainer);
                
                levelItem.addEventListener('click', () => {
                    currentLevel = i;
                    startLevel();
                });
                
                levelGrid.appendChild(levelItem);
            }
        }

        // Start the game
        function startGame() {
            username = usernameInput.value.trim();
            if (!username) {
                alert('Please enter a username');
                return;
            }

            // Hide login screen and show level selection
            loginScreen.style.display = 'none';
            levelSelection.style.display = 'flex';
            displayUsername.textContent = username;
        }

        // Start current level
        function startLevel() {
            levelSelection.style.display = 'none';
            gameScreen.style.display = 'block';
            
            levelDisplay.textContent = currentLevel;
            scoreDisplay.textContent = score;
            
            gameActive = true;
            gamePaused = false;
            pauseButton.textContent = '⏸️';
            objectsCreated = 0;
            objectsHit = 0;
            timeLeft = 30;
            timerDisplay.textContent = timeLeft;
            
            // Clear game area
            gameArea.innerHTML = '<div class="gun"><div class="gun-barrel"></div></div>';
            
            // Start level mechanics
            startLevelTimer();
            startObjectGeneration();
        }

        // Start level timer
        function startLevelTimer() {
            gameTimer = setInterval(() => {
                if (gamePaused) return;
                
                timeLeft--;
                timerDisplay.textContent = timeLeft;
                timerDisplay.style.color = timeLeft < 10 ? '#ff6b6b' : '#ffffff';
                
                if (timeLeft <= 0) {
                    endLevel();
                }
            }, 1000);
        }

        // Generate objects based on level
        function startObjectGeneration() {
            objectInterval = setInterval(() => {
                if (gameActive && !gamePaused && objectsCreated < totalObjects) {
                    createObject();
                }
            }, 600);
        }

        // Create a falling object based on current level
        function createObject() {
            const object = document.createElement('div');
            object.className = 'falling-object';
            
            // Random position
            const leftPos = 10 + Math.random() * 80; // 10% to 90% of screen width
            object.style.left = `${leftPos}%`;
            object.style.top = '-100px';
            
            // Configure object based on level
            let points = 0;
            let size = 40 + Math.random() * 20;
            const objectType = levelConfigs[currentLevel - 1].objects[0];
            
            switch(objectType) {
                case "balloon":
                    object.classList.add('balloon');
                    const colors = ['#ff6b6b', '#4ecdc4', '#ffd166'];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    object.style.background = `radial-gradient(circle at 30% 30%, ${lightenColor(color, 20)}, ${color})`;
                    points = 10;
                    size = 50 + Math.random() * 30;
                    break;
                case "star":
                    object.classList.add('star-object');
                    object.style.background = `radial-gradient(circle at 30% 30%, ${lightenColor('#ffd166', 20)}, #ffd166)`;
                    points = 15;
                    size = 40 + Math.random() * 20;
                    break;
                case "ice-drop":
                    object.classList.add('ice-drop');
                    object.style.background = `radial-gradient(circle at 30% 30%, ${lightenColor('#4ecdc4', 20)}, #4ecdc4)`;
                    points = 20;
                    size = 40 + Math.random() * 25;
                    break;
                case "symbol":
                    object.classList.add('symbol');
                    const symbols = ['★', '❤', '♦', '♣', '♠', '☀', '☁', '☂'];
                    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                    object.textContent = symbol;
                    object.style.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
                    points = 25;
                    size = 40 + Math.random() * 20;
                    break;
                case "heart":
                    object.classList.add('heart');
                    object.style.background = `radial-gradient(circle at 30% 30%, ${lightenColor('#ff6b6b', 20)}, #ff6b6b)`;
                    points = 30;
                    size = 40 + Math.random() * 25;
                    break;
            }
            
            object.style.width = `${size}px`;
            object.style.height = `${size}px`;
            object.dataset.points = points;
            
            // Animation
            let posY = -100;
            const speed = 1 + Math.random() * 3;
            const objectId = setInterval(() => {
                if (!gameActive || gamePaused) {
                    clearInterval(objectId);
                    return;
                }
                posY += speed;
                object.style.top = `${posY}px`;
                
                // Remove object if it goes off screen
                if (posY > window.innerHeight + 100) {
                    clearInterval(objectId);
                    object.remove();
                }
            }, 50);
            
            // Store object data
            const objectObj = {
                element: object,
                intervalId: objectId,
                points: parseInt(object.dataset.points)
            };
            
            objects.push(objectObj);
            objectsCreated++;
            
            // Click event to pop object
            object.addEventListener('click', () => {
                if (gameActive && !gamePaused) {
                    popObject(objectObj);
                }
            });
            
            gameArea.appendChild(object);
        }

        // Pop object
        function popObject(objectObj) {
            const object = objectObj.element;
            const points = objectObj.points;
            
            // Create particle burst
            createParticleBurst(object);
            
            // Create floating score
            createFloatingScore(object, points);
            
            // Increase score
            score += points;
            hits++;
            objectsHit++;
            scoreDisplay.textContent = score;
            
            // Remove object
            clearInterval(objectObj.intervalId);
            object.remove();
            
            // Remove from objects array
            const index = objects.indexOf(objectObj);
            if (index > -1) {
                objects.splice(index, 1);
            }
            
            // Check if required hits are reached
            if (objectsHit >= requiredHits) {
                endLevel();
            }
        }

        // Create particle burst effect
        function createParticleBurst(object) {
            const rect = object.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random size
                const size = 3 + Math.random() * 5;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Random color based on object
                particle.style.background = object.style.background || object.style.color;
                
                // Position at object center
                particle.style.left = `${centerX}px`;
                particle.style.top = `${centerY}px`;
                
                // Random movement
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 3;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                
                gameArea.appendChild(particle);
                
                // Animate particle
                let posX = centerX;
                let posY = centerY;
                let opacity = 1;
                
                const particleInterval = setInterval(() => {
                    posX += vx;
                    posY += vy;
                    opacity -= 0.02;
                    
                    particle.style.left = `${posX}px`;
                    particle.style.top = `${posY}px`;
                    particle.style.opacity = opacity;
                    
                    if (opacity <= 0) {
                        clearInterval(particleInterval);
                        particle.remove();
                    }
                }, 50);
            }
        }

        // Create floating score
        function createFloatingScore(object, points) {
            const rect = object.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const floatingScore = document.createElement('div');
            floatingScore.className = 'floating-score';
            floatingScore.textContent = `+${points}`;
            floatingScore.style.left = `${centerX}px`;
            floatingScore.style.top = `${centerY}px`;
            
            // Color based on points
            if (points <= 10) floatingScore.style.color = '#ff6b6b';
            else if (points <= 20) floatingScore.style.color = '#4ecdc4';
            else if (points <= 30) floatingScore.style.color = '#ffd166';
            else floatingScore.style.color = '#ff9ff3';
            
            gameArea.appendChild(floatingScore);
            
            // Remove after animation
            setTimeout(() => {
                floatingScore.remove();
            }, 1000);
        }

        // Lighten color function
        function lightenColor(color, percent) {
            let R = parseInt(color.substring(1, 3), 16);
            let G = parseInt(color.substring(3, 5), 16);
            let B = parseInt(color.substring(5, 7), 16);
            
            R = Math.min(255, Math.floor(R + (255 - R) * percent / 100));
            G = Math.min(255, Math.floor(G + (255 - G) * percent / 100));
            B = Math.min(255, Math.floor(B + (255 - B) * percent / 100));
            
            return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;
        }

        // Rotate gun towards mouse
        function rotateGun(e) {
            if (!gameActive || gamePaused) return;
            
            const gun = document.querySelector('.gun');
            const rect = gun.getBoundingClientRect();
            const gunX = rect.left + rect.width / 2;
            const gunY = rect.top + rect.height / 2;
            
            const angle = Math.atan2(e.clientY - gunY, e.clientX - gunX) * 180 / Math.PI;
            gun.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        }

        // Shoot bullet
        function shoot(e) {
            if (!gameActive || gamePaused) return;
            
            shots++;
            
            // Create bullet
            const bullet = document.createElement('div');
            bullet.style.position = 'absolute';
            bullet.style.width = '8px';
            bullet.style.height = '8px';
            bullet.style.background = '#ffd166';
            bullet.style.borderRadius = '50%';
            bullet.style.boxShadow = '0 0 10px #ffd166';
            bullet.style.zIndex = '10';
            
            const gun = document.querySelector('.gun');
            const rect = gun.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            
            bullet.style.left = `${startX}px`;
            bullet.style.top = `${startY}px`;
            
            gameArea.appendChild(bullet);
            
            // Calculate direction
            const angle = Math.atan2(e.clientY - startY, e.clientX - startX);
            const speed = 10;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            // Animate bullet
            let posX = startX;
            let posY = startY;
            let hit = false;
            
            const bulletInterval = setInterval(() => {
                posX += vx;
                posY += vy;
                
                bullet.style.left = `${posX}px`;
                bullet.style.top = `${posY}px`;
                
                // Check collision with objects
                if (!hit) {
                    for (let i = 0; i < objects.length; i++) {
                        const obj = objects[i];
                        const objRect = obj.element.getBoundingClientRect();
                        
                        // Simple collision detection
                        if (posX > objRect.left && 
                            posX < objRect.right && 
                            posY > objRect.top && 
                            posY < objRect.bottom) {
                            
                            // Hit!
                            popObject(obj);
                            hit = true;
                            break;
                        }
                    }
                }
                
                // Remove bullet if it goes off screen or hits something
                if (posX < 0 || posX > window.innerWidth || posY < 0 || posY > window.innerHeight || hit) {
                    clearInterval(bulletInterval);
                    bullet.remove();
                }
            }, 20);
        }

        // End level
        function endLevel() {
            gameActive = false;
            clearInterval(gameTimer);
            clearInterval(objectInterval);
            
            // Clear remaining objects
            objects.forEach(obj => {
                clearInterval(obj.intervalId);
                obj.element.remove();
            });
            objects = [];
            
            // Show performance screen
            showPerformance();
        }

        // Show performance screen
        function showPerformance() {
            gameScreen.style.display = 'none';
            performanceScreen.style.display = 'flex';
            performanceUsername.textContent = username;
            levelCompletedDisplay.textContent = currentLevel;
            levelScoreDisplay.textContent = score;
            objectsHitDisplay.textContent = objectsHit;
            
            // Display stars based on performance
            displayStars();
            
            // Animate chart bars
            setTimeout(() => {
                const maxBarHeight = 150;
                const hitHeight = (objectsHit / totalObjects) * maxBarHeight;
                const requiredHeight = (requiredHits / totalObjects) * maxBarHeight;
                
                hitBar.style.height = `${hitHeight}px`;
                requiredBar.style.height = `${requiredHeight}px`;
                
                hitBar.querySelector('.chart-label').textContent = `Hit: ${objectsHit}`;
                requiredBar.querySelector('.chart-label').textContent = `Required: ${requiredHits}`;
            }, 300);
        }

        // Display stars based on performance
        function displayStars() {
            starsContainer.innerHTML = '';
            let starCount = 0;
            
            const hitPercentage = (objectsHit / requiredHits) * 100;
            
            if (hitPercentage >= 100) starCount = 3;
            else if (hitPercentage >= 80) starCount = 2;
            else if (hitPercentage >= 60) starCount = 1;
            
            for (let i = 0; i < 3; i++) {
                const star = document.createElement('div');
                star.className = 'star-rating';
                star.innerHTML = i < starCount ? '★' : '☆';
                starsContainer.appendChild(star);
            }
        }

        // Next level
        function nextLevel() {
            performanceScreen.style.display = 'none';
            
            if (currentLevel < 5) {
                currentLevel++;
                startLevel();
            } else {
                // Game completed - show level selection
                levelSelection.style.display = 'flex';
            }
        }

        // Show level selection
        function showLevelSelect() {
            performanceScreen.style.display = 'none';
            levelSelection.style.display = 'flex';
        }

        // Toggle music
        function toggleMusic() {
            musicPlaying = !musicPlaying;
            muteButton.textContent = musicPlaying ? '🔊' : '🔇';
        }

        // Toggle pause
        function togglePause() {
            gamePaused = !gamePaused;
            pauseButton.textContent = gamePaused ? '▶️' : '⏸️';
        }

        // Initialize the game
        function init() {
            createClouds();
            createLevelGrid();
            
            // Event listeners
            document.getElementById('startButton').addEventListener('click', startGame);
            document.getElementById('nextLevelButton').addEventListener('click', nextLevel);
            document.getElementById('levelSelectButton').addEventListener('click', showLevelSelect);
            muteButton.addEventListener('click', toggleMusic);
            pauseButton.addEventListener('click', togglePause);
            
            gameArea.addEventListener('mousemove', rotateGun);
            gameArea.addEventListener('click', shoot);
        }

        // Start when page loads
        window.onload = init;