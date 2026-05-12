// --- 3D Scene Setup (Three.js) for Main View ---
const canvas = document.getElementById("scene-canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});

// Add ambient and directional lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Initial camera position. Adjusted for the new planet path.
camera.position.z = 10;
camera.position.y = 3;
camera.position.x = 0;

// --- Planet Data ---
const planetsData = [
  {
    name: "Mars",
    subtitle: "The Red Planet",
    description:
      "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. It is often referred to as the Red Planet because of the iron oxide prevalent on its surface.",
    color: 0xff6600,
    points: [
      "Fourth planet from the Sun.",
      "Has a thin atmosphere composed mainly of carbon dioxide.",
      "Home to the largest volcano in the Solar System, Olympus Mons.",
      "Has two moons, Phobos and Deimos.",
      "Currently a major focus of space exploration for signs of past life.",
    ],
  },
  {
    name: "Earth",
    subtitle: "The Blue Planet",
    description:
      "Our home planet, with its vast oceans, lush continents, and diverse life forms. Earth's axis of rotation is tilted with respect to its orbital plane, producing seasons on Earth.",
    color: 0x0066ff,
    points: [
      "Third planet from the Sun.",
      "The only astronomical object known to harbor life.",
      "Composed of 71% water, with continents covering the remaining 29%.",
      "Has one natural satellite, the Moon.",
      "Its magnetic field protects life from harmful solar winds.",
    ],
  },
  {
    name: "Saturn",
    subtitle: "The Ringed Giant",
    description:
      "A gas giant famous for its spectacular ring system made of ice particles. It is the sixth planet from the Sun and the second-largest planet in our solar system.",
    color: 0xffff99,
    points: [
      "Sixth planet from the Sun.",
      "A gas giant with an average radius about nine times that of Earth.",
      "Its most famous feature is its extensive ring system.",
      "Has 82 confirmed moons, the largest being Titan.",
      "The rings are made of billions of small particles, ranging in size from micrometers to meters.",
    ],
  },
  {
    name: "Neptune",
    subtitle: "The Windy Planet",
    description:
      "A distant ice giant with powerful winds, giving it a vibrant blue color. It is the eighth and farthest known planet from the Sun.",
    color: 0x0033cc,
    points: [
      "Eighth and farthest known planet from the Sun.",
      "An ice giant, with a thick atmosphere of hydrogen, helium, and methane.",
      "Experiences the fastest wind speeds recorded in the Solar System, reaching over 1,200 mph.",
      "Has 14 known moons, including its largest moon, Triton.",
      "It is the smallest of the gas giants.",
    ],
  },
  {
    name: "Venus",
    subtitle: "The Morning Star",
    description:
      'A planet with a thick, toxic atmosphere and scorching surface temperatures. It is the second planet from the Sun and is often called Earth\'s "sister planet".',
    color: 0xffa500,
    points: [
      "Second planet from the Sun.",
      'Often called Earth\'s "sister planet" due to their similar size and mass.',
      "Has a dense, toxic atmosphere of carbon dioxide and sulfuric acid.",
      "The surface temperature is hot enough to melt lead due to a runaway greenhouse effect.",
      "It rotates on its axis in the opposite direction to most planets.",
    ],
  },
];

let planets = [];
let activePlanetIndex = 0;
let planetDetailViewActive = false;

// Vars for the new detail scene
let detailScene,
  detailCamera,
  detailRenderer,
  detailPlanetMesh,
  detailAnimationId;

// --- Planet Creation and Positioning for Main View ---
function createPlanets() {
  planetsData.forEach((data, index) => {
    const geometry = new THREE.SphereGeometry(0.7, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      roughness: 0.8,
    });
    const planet = new THREE.Mesh(geometry, material);

    planet.userData = { ...data, index };

    scene.add(planet);
    planets.push(planet);
  });
}

// Updates the position, scale, and opacity of all planets
function updatePlanetsPosition() {
  const totalPlanets = planets.length;
  const orbitRadius = 10;
  const angleStep = (2 * Math.PI) / totalPlanets;

  planets.forEach((planet, index) => {
    let opacity = 0;
    let targetScale = new THREE.Vector3(0.01, 0.01, 0.01);
    let targetPos = new THREE.Vector3(0, -10, 0);

    const currentAngle = (index - activePlanetIndex) * angleStep;

    if (index === activePlanetIndex) {
      targetPos.x = 0;
      targetPos.z = 5;
      targetPos.y = 1.5;
      targetScale = new THREE.Vector3(2.5, 2.5, 2.5);
      opacity = 1;
    } else {
      targetPos.x = orbitRadius * Math.sin(currentAngle);
      targetPos.z = 2 + orbitRadius * Math.cos(currentAngle);
      targetPos.y = 3;
      targetScale = new THREE.Vector3(1, 1, 1);
      opacity = 0.5;
    }

    gsap.to(planet.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 1.5,
      ease: "power2.inOut",
    });
    gsap.to(planet.scale, {
      x: targetScale.x,
      y: targetScale.y,
      z: targetScale.z,
      duration: 1.5,
      ease: "power2.inOut",
    });
    gsap.to(planet.material, { opacity: opacity, duration: 1.5 });
  });

  // Update homepage info
  const activePlanetData = planetsData[activePlanetIndex];
  document.getElementById("homepage-subtitle").textContent =
    activePlanetData.subtitle;
  document.getElementById("homepage-title").textContent = activePlanetData.name;
  document.getElementById("homepage-description").textContent =
    activePlanetData.description;
}

// --- Detail Scene Logic ---
function createDetailModel(planetData) {
  // Check for and remove existing canvas
  const existingCanvas = document.querySelector(
    "#planet-model-container canvas"
  );
  if (existingCanvas) {
    existingCanvas.remove();
  }

  // Create a new canvas for the detail view
  const detailCanvas = document.createElement("canvas");
  document.getElementById("planet-model-container").appendChild(detailCanvas);

  // Setup new scene, camera, and renderer
  detailScene = new THREE.Scene();
  detailCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
  detailRenderer = new THREE.WebGLRenderer({
    canvas: detailCanvas,
    antialias: true,
    alpha: true,
  });

  // Add lighting
  const detailAmbientLight = new THREE.AmbientLight(0xffffff, 0.8);
  detailScene.add(detailAmbientLight);
  const detailPointLight = new THREE.PointLight(0xffffff, 0.8);
  detailPointLight.position.set(5, 5, 5);
  detailScene.add(detailPointLight);

  // Create the planet model
  const geometry = new THREE.SphereGeometry(2, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: planetData.color,
    roughness: 0.7,
    metalness: 0.3,
  });
  detailPlanetMesh = new THREE.Mesh(geometry, material);
  detailScene.add(detailPlanetMesh);

  // Position camera
  detailCamera.position.z = 5;

  // Start new animation loop
  animateDetailScene();
}

function animateDetailScene() {
  detailAnimationId = requestAnimationFrame(animateDetailScene);
  if (detailPlanetMesh) {
    detailPlanetMesh.rotation.y += 0.005;
  }
  if (detailRenderer && detailScene && detailCamera) {
    detailRenderer.render(detailScene, detailCamera);
  }
}

function disposeDetailScene() {
  if (detailAnimationId) cancelAnimationFrame(detailAnimationId);
  if (detailRenderer) {
    detailRenderer.dispose();
  }
  if (detailScene) {
    detailScene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => mat.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }
  const detailCanvas = document.querySelector("#planet-model-container canvas");
  if (detailCanvas) {
    detailCanvas.remove();
  }
}

// --- Interaction Logic ---
function showPlanetDetails(planetData) {
  planetDetailViewActive = true;

  // Hide main UI elements
  document.getElementById("main-header").classList.add("hidden");
  document.getElementById("homepage-info").classList.add("hidden");
  document.getElementById("controls").classList.add("hidden");

  document.getElementById("detail-planet-title").textContent = planetData.name;
  const detailPointsList = document.getElementById("detail-planet-points");
  detailPointsList.innerHTML = "";

  planetData.points.forEach((point, index) => {
    const li = document.createElement("li");
    li.textContent = point;
    detailPointsList.appendChild(li);
    gsap.to(li, { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1 });
  });

  document.getElementById("planet-details-overlay").classList.add("active");

  // Animate main planets away
  planets.forEach((p) => {
    gsap.to(p.scale, {
      x: 0.1,
      y: 0.1,
      z: 0.1,
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.to(p.material, { opacity: 0, duration: 1, ease: "power2.inOut" });
  });

  // Create and show the new detail model
  createDetailModel(planetData);
}

function hidePlanetDetails() {
  planetDetailViewActive = false;

  // Show main UI elements
  document.getElementById("main-header").classList.remove("hidden");
  document.getElementById("homepage-info").classList.remove("hidden");
  document.getElementById("controls").classList.remove("hidden");

  document.getElementById("planet-details-overlay").classList.remove("active");

  // Dispose of the detail scene to free up memory
  disposeDetailScene();

  // Reset camera and planet positions
  gsap.to(camera.position, {
    x: 0,
    y: 3,
    z: 10,
    duration: 1.5,
    ease: "power2.inOut",
  });
  gsap.to(camera.rotation, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1.5,
    ease: "power2.inOut",
  });
  updatePlanetsPosition();
}

// --- Event Listeners ---
document.getElementById("next-button").addEventListener("click", () => {
  if (planetDetailViewActive) return;
  activePlanetIndex = (activePlanetIndex + 1) % planets.length;
  updatePlanetsPosition();
});

document.getElementById("prev-button").addEventListener("click", () => {
  if (planetDetailViewActive) return;
  activePlanetIndex = (activePlanetIndex - 1 + planets.length) % planets.length;
  updatePlanetsPosition();
});

document
  .getElementById("close-details-button")
  .addEventListener("click", () => {
    hidePlanetDetails();
  });

// Mouse click detection on planets
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener("click", (event) => {
  if (planetDetailViewActive) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets);

  if (intersects.length > 0) {
    const clickedPlanet = intersects[0].object;
    if (clickedPlanet.userData.index === activePlanetIndex) {
      showPlanetDetails(clickedPlanet.userData);
    }
  }
});

let isDragging = false;
let startX = 0;

window.addEventListener("mousedown", (event) => {
  isDragging = true;
  startX = event.clientX;
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

window.addEventListener("mousemove", (event) => {
  if (!isDragging || planetDetailViewActive) return;

  const deltaX = event.clientX - startX;
  if (Math.abs(deltaX) > 50) {
    // Threshold for a "slide"
    if (deltaX < 0) {
      // Swiping left
      activePlanetIndex = (activePlanetIndex + 1) % planets.length;
    } else {
      // Swiping right
      activePlanetIndex =
        (activePlanetIndex - 1 + planets.length) % planets.length;
    }
    updatePlanetsPosition();
    startX = event.clientX; // Reset start position
  }
});

// --- Window Resize Handling ---
function onWindowResize() {
  // Resize main canvas
  const mainCanvas = document.getElementById("scene-canvas");
  const mainContainer = mainCanvas.parentElement;
  const newWidth = mainContainer.offsetWidth;
  const newHeight = mainContainer.offsetHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);

  // Resize detail canvas if it exists
  const detailCanvas = document.querySelector("#planet-model-container canvas");
  if (detailCanvas) {
    const newDetailWidth = detailCanvas.offsetWidth;
    const newDetailHeight = detailCanvas.offsetHeight;
    detailCamera.aspect = newDetailWidth / newDetailHeight;
    detailCamera.updateProjectionMatrix();
    detailRenderer.setSize(newDetailWidth, newDetailHeight);
  }

  updatePlanetsPosition();
}
window.addEventListener("resize", onWindowResize);

// --- Main Animation Loop ---
function animate() {
  requestAnimationFrame(animate);
  if (!planetDetailViewActive) {
    planets.forEach((p) => (p.rotation.y += 0.001));
  }
  renderer.render(scene, camera);
}

// --- Initialization ---
window.onload = function () {
  createPlanets();
  onWindowResize(); // Set initial size and positions
  animate();
};
