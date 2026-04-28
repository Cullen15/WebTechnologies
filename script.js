import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202030);

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 6;
camera.position.y = 2;

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight - 80);
document.body.appendChild(renderer.domElement);

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight(0xffffff, 1);
directionLight.position.set(3, 5, 4);
scene.add(directionLight);

// cube shape
const cubeGeometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x3fa7d6 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -2.5;
scene.add(cube);

// sphere shape
const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xf5b942 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 2.5;
scene.add(sphere);

// wireframe ring
const ringGeometry = new THREE.TorusGeometry(1.2, 0.05, 16, 100);
const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.position.y = -1.5;
scene.add(ring);

// load model
let model;

const loader = new GLTFLoader();

loader.load(
  "assets/model.glb",
  function (gltf) {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, -0.7, 0);
    scene.add(model);
  },
  undefined,
  function (error) {
    console.log("Model did not load:", error);
  }
);

// animation loop
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  sphere.rotation.y += 0.015;
  sphere.position.y = Math.sin(Date.now() * 0.002) * 0.5;

  ring.rotation.x += 0.01;
  ring.rotation.z += 0.01;

  if (model) {
    model.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

animate();

// resize fix
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight - 80);
});