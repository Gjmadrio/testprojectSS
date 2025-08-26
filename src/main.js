import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from "gsap";


// Scene
const scene = new THREE.Scene();


// Camera 
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 400); 
camera.position.z = 50;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// add textureLoader
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath('/textures/cubeMap/')

// adding textures
const sunTexture = textureLoader.load('/textures/2k_sun.jpg')
const mercuryTexture = textureLoader.load('/textures/2k_mercury.jpg')
const venusTexture = textureLoader.load('/textures/2k_venus_surface.jpg')
const earthTexture = textureLoader.load('/textures/2k_earth_daymap.jpg')
const marsTexture = textureLoader.load('/textures/2k_mars.jpg')
const moonTexture = textureLoader.load('/textures/2k_moon.jpg')
const jupiterTexture = textureLoader.load('/textures/2k_jupiter.jpg')
const neptuneTexture = textureLoader.load('/textures/2k_neptune.jpg')
const saturnTexture = textureLoader.load('/textures/2k_saturn.jpg');
const ringTexture = textureLoader.load('/textures/2k_saturn_ring_alpha.png');
// const backgroundTexture = textureLoader.load()

const backgroundCubemap = cubeTextureLoader
  .load( [
				'px.png',
				'nx.png',
				'py.png',
				'ny.png',
				'pz.png',
				'nz.png'
			] );

     backgroundCubemap.colorSpace = THREE.SRGBColorSpace;
     scene.background = backgroundCubemap;



// adding materials
const mercuryMaterial = new THREE.MeshStandardMaterial(
  {
    map:mercuryTexture
  }
)
const venusMaterial = new THREE.MeshStandardMaterial(
  {
    map:venusTexture
  }
)
const earthMaterial = new THREE.MeshStandardMaterial(
  {
    map:earthTexture
  }
)
const marsMaterial = new THREE.MeshStandardMaterial(
  {
    map:marsTexture
  }
)
const moonMaterial = new THREE.MeshStandardMaterial(
  {
    map:moonTexture
  }
)
const jupiterMaterial = new THREE.MeshBasicMaterial(
  {
    map:jupiterTexture
  }
)
const neptuneMaterial = new THREE.MeshBasicMaterial(
  {
    map:neptuneTexture
  }
)
const saturnMaterial = new THREE.MeshStandardMaterial(
  {
  map: saturnTexture
  }
)




// add stuff here
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sunMaterial = new THREE.MeshBasicMaterial(
  {
    map: sunTexture
  }
)
 const sun = new THREE.Mesh(
  sphereGeometry,
  sunMaterial
 )
 sun.scale.setScalar(5)
 scene.add(sun)

const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [

    ],

  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [

    ]

  },
  {
    name: 'Earth',
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: 'Moon',
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      }
    ]
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name:"Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name:"Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,

      },
    ],
  },
  {
    name: "Jupiter",
    radius: 0.7,
    distance: 30,
    speed: 0.01,
    material: jupiterMaterial,
    moons: [

    ], 
  },
  {
     name: "Neptune",
    radius: 0.7,
    distance: 30,
    speed: 0.01,
    material: neptuneMaterial,
    moons: [

    ], 
  },
  {
     name: "Saturn",
    radius: 1,
    distance: 30,
    speed: 0.003,
    material: saturnMaterial,
    moons: [

    ], 
  },


]
const planetMeshes = planets.map((planet) => {
  
  // create the mesh
  const planetMesh = new THREE.Mesh(
    sphereGeometry,
    planet.material
  )
  // set the scale
  planetMesh.scale.setScalar(planet.radius)
  planetMesh.position.x = planet.distance
  // add it our scene
  scene.add(planetMesh)
  // loop through each moon and create the moon
  planet.moons.forEach((moon) => {
    const moonMesh = new THREE.Mesh(
      sphereGeometry,
      moonMaterial
    )
    moonMesh.scale.setScalar(moon.radius)
    moonMesh.position.x = moon.distance
    planetMesh.add(moonMesh)
  })
  return planetMesh
  // add the moon to the planet
})

// add lights
const ambientLight = new THREE.AmbientLight(
  0xffffff,
  0.3
)
scene.add(ambientLight);

const pointLight = new THREE.PointLight(
  0xffffff,
  3, 1000
)
scene.add(pointLight)

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;

// Resizing the screen
window.addEventListener('resize', () =>{
   camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // Solution for it will center the screen whatever size

  renderer.setSize(window.innerWidth, window.innerHeight);
}

)



// Render loop
const renderloop = () => {
  
planetMeshes.forEach((planet, planetIndex) => {
  planet.rotation.y += planets[planetIndex].speed
  planet.position.x = Math.sin(planet.rotation.y) * planets[planetIndex].distance
  planet.position.z = Math.cos(planet.rotation.y) * planets[planetIndex].distance
  planet.children.forEach((moon, moonIndex) => {
    moon.rotation.y += planets[planetIndex].moons[moonIndex].speed
    moon.position.x = Math.sin(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance
    moon.position.z = Math.cos(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance
  })
})
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderloop);
}
renderloop();


const introTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "#intro-screen",
    start: "top top",  // animation starts when intro enters viewport
    toggleActions: "play none none reverse", 
    markers: true
  }
});

introTimeline
  .from("#intro-screen h1", { duration: 2, opacity: 0, y: 50, ease: "power3.out" })
  .from("#intro-screen p", { duration: 2, opacity: 0, y: 30, ease: "power3.out" }, "-=0.5")
  .to("#intro-screen", {
    duration: 1,
    opacity: 0,
    ease: "power2.inOut",
    onComplete: () => {
      document.getElementById("intro-screen").style.display = "none";
    }
  });