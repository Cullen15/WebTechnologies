import * as THREE from "three";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202030);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / (window.innerHeight - 100),
  0.1,
  1000
);

camera.position.set(0, 2, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight - 100);
document.body.appendChild(renderer.domElement);

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

// cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.4, 1.4, 1.4),
  new THREE.MeshStandardMaterial({ color: 0x3498db })
);
cube.position.set(-2.5, 0, 0);
scene.add(cube);

// sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xf1c40f })
);
sphere.position.set(2.5, 0, 0);
scene.add(sphere);

// wireframe  ring
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(1.5, 0.05, 16, 100),
  new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
);
ring.position.set(0, -1.8, 0);
scene.add(ring);

// 3D model
let model;
const loader = new GLTFLoader();

loader.load(
  "./assets/model.glb",
  function (gltf) {
    model = gltf.scene;

    model.scale.set(0.08, 0.08, 0.08);
    model.position.set(0, -1.6, -1.5);

    scene.add(model);
    console.log("model loaded");
  },
  undefined,
  function (error) {
    console.log("model failed", error);
  }
);

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  sphere.rotation.y += 0.02;
  sphere.position.y = Math.sin(Date.now() * 0.002) * 0.5;

  ring.rotation.x += 0.01;
  ring.rotation.z += 0.01;

  if (model) {
    model.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

animate();