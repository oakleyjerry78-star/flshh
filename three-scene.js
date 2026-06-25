import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const canvas = document.querySelector("#hero-3d-canvas");
const hero = document.querySelector(".hero");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!canvas || !hero) {
  throw new Error("Hero 3D target not found");
}

try {
  initHeroScene();
} catch (error) {
  document.body.classList.add("three-fallback");
}

function initHeroScene() {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
  const clock = new THREE.Clock();
  const pointer = { x: 0, y: 0 };

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  camera.position.set(0, 0, 8.2);

  scene.add(new THREE.AmbientLight(0x94ffd0, 0.82));

  const keyLight = new THREE.DirectionalLight(0xeafff5, 2.2);
  keyLight.position.set(3.2, 4.2, 4.5);
  scene.add(keyLight);

  const mintLight = new THREE.PointLight(0x58e6a4, 4.8, 10);
  mintLight.position.set(-2.5, 1.2, 2.2);
  scene.add(mintLight);

  const group = new THREE.Group();
  const orbitGroup = new THREE.Group();
  scene.add(group, orbitGroup);

  const coinMaterial = new THREE.MeshStandardMaterial({
    color: 0x58e6a4,
    emissive: 0x062619,
    emissiveIntensity: 0.55,
    metalness: 0.78,
    roughness: 0.24,
  });

  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xdfffee,
    emissive: 0x1bbf7a,
    emissiveIntensity: 0.42,
    metalness: 0.72,
    roughness: 0.26,
  });

  const coin = new THREE.Mesh(new THREE.CylinderGeometry(1.14, 1.14, 0.18, 96), coinMaterial);
  coin.rotation.x = Math.PI / 2;
  group.add(coin);

  const tokenTexture = createTokenTexture();
  const faceMaterial = new THREE.MeshBasicMaterial({
    map: tokenTexture,
    transparent: true,
    opacity: 0.98,
  });

  const frontFace = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 1.72), faceMaterial);
  frontFace.position.z = 0.1;
  group.add(frontFace);

  const backFace = frontFace.clone();
  backFace.position.z = -0.1;
  backFace.rotation.y = Math.PI;
  group.add(backFace);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.028, 16, 140), rimMaterial);
  rim.position.z = 0.115;
  group.add(rim);

  const backRim = rim.clone();
  backRim.position.z = -0.115;
  group.add(backRim);

  const crystal = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.64, 1),
    new THREE.MeshBasicMaterial({
      color: 0xbfffe0,
      wireframe: true,
      transparent: true,
      opacity: 0.085,
      blending: THREE.AdditiveBlending,
    })
  );
  crystal.scale.set(1.28, 1.28, 0.72);
  group.add(crystal);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x84ffd0,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
  });

  const tiltedRingA = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.012, 12, 180), ringMaterial);
  tiltedRingA.rotation.x = Math.PI * 0.58;
  tiltedRingA.rotation.y = Math.PI * 0.12;
  orbitGroup.add(tiltedRingA);

  const tiltedRingB = new THREE.Mesh(new THREE.TorusGeometry(2.42, 0.01, 12, 180), ringMaterial.clone());
  tiltedRingB.material.opacity = 0.18;
  tiltedRingB.rotation.x = Math.PI * 0.28;
  tiltedRingB.rotation.y = -Math.PI * 0.22;
  orbitGroup.add(tiltedRingB);

  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: 0x58e6a4,
    emissive: 0x58e6a4,
    emissiveIntensity: 0.55,
    metalness: 0.3,
    roughness: 0.4,
  });

  const nodes = [
    createNode(0x58e6a4, 1.9, 0.92, 0),
    createNode(0x7fa2ff, 2.28, -0.74, Math.PI * 0.72),
    createNode(0xf3c94d, 2.0, 0.68, Math.PI * 1.3),
    createNode(0xff9f43, 2.42, -0.58, Math.PI * 2.05),
  ];
  nodes.forEach((node) => orbitGroup.add(node.mesh));

  const connectionPositions = new Float32Array((nodes.length + 1) * 3);
  const connectionGeometry = new THREE.BufferGeometry();
  connectionGeometry.setAttribute("position", new THREE.BufferAttribute(connectionPositions, 3));
  const connectionLine = new THREE.Line(
    connectionGeometry,
    new THREE.LineBasicMaterial({
      color: 0xbfffe0,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    })
  );
  orbitGroup.add(connectionLine);

  const glassMaterial = new THREE.MeshBasicMaterial({
    color: 0x58e6a4,
    transparent: true,
    opacity: 0.055,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  const glassPlate = new THREE.Mesh(new THREE.PlaneGeometry(4.7, 2.7, 1, 1), glassMaterial);
  glassPlate.position.set(0, 0, -0.48);
  glassPlate.rotation.z = -0.08;
  orbitGroup.add(glassPlate);

  const scannerRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.88, 0.008, 10, 220),
    new THREE.MeshBasicMaterial({
      color: 0xbfffe0,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    })
  );
  scannerRing.rotation.x = Math.PI * 0.52;
  scannerRing.rotation.y = Math.PI * 0.06;
  orbitGroup.add(scannerRing);

  const haloRing = new THREE.Mesh(
    new THREE.TorusGeometry(3.22, 0.006, 10, 260),
    new THREE.MeshBasicMaterial({
      color: 0x7fa2ff,
      transparent: true,
      opacity: 0.11,
      blending: THREE.AdditiveBlending,
    })
  );
  haloRing.rotation.x = Math.PI * 0.36;
  haloRing.rotation.y = -Math.PI * 0.18;
  orbitGroup.add(haloRing);

  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 68;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const radius = 2.35 + Math.random() * 2.15;
    const angle = Math.random() * Math.PI * 2;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 2.9;
    particlePositions[index * 3 + 2] = Math.sin(angle) * radius * 0.52;
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0x9bf7c7,
      size: 0.035,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(particles);

  function createNode(color, radius, speed, offset) {
    return {
      mesh: new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 24, 24),
        nodeMaterial.clone()
      ),
      radius,
      speed,
      offset,
      yFactor: 0.34 + Math.random() * 0.22,
      color,
    };
  }

  nodes.forEach((node) => {
    node.mesh.material.color.setHex(node.color);
    node.mesh.material.emissive.setHex(node.color);
  });

  function resize() {
    const width = hero.clientWidth;
    const height = hero.clientHeight;

    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();

    if (width < 720) {
      group.position.set(0.55, -0.78, 0);
      orbitGroup.position.copy(group.position);
      group.scale.setScalar(0.68);
      orbitGroup.scale.setScalar(0.68);
    } else if (width < 1040) {
      group.position.set(1.62, -0.08, 0);
      orbitGroup.position.copy(group.position);
      group.scale.setScalar(0.86);
      orbitGroup.scale.setScalar(0.86);
    } else {
      group.position.set(2.25, -0.05, 0);
      orbitGroup.position.copy(group.position);
      group.scale.setScalar(1);
      orbitGroup.scale.setScalar(1);
    }
  }

  function render() {
    const time = clock.getElapsedTime();

    group.rotation.y = Math.sin(time * 0.42) * 0.28 + pointer.x * 0.18;
    group.rotation.x = Math.sin(time * 0.32) * 0.08 + pointer.y * 0.12;
    group.rotation.z = Math.sin(time * 0.28) * 0.04;
    crystal.rotation.y = -time * 0.16;
    crystal.rotation.x = time * 0.08;

    orbitGroup.rotation.y = -time * 0.18;
    orbitGroup.rotation.x = Math.sin(time * 0.18) * 0.08;

    tiltedRingA.rotation.z = time * 0.18;
    tiltedRingB.rotation.z = -time * 0.14;
    scannerRing.rotation.z = time * 0.34;
    haloRing.rotation.z = -time * 0.2;
    glassPlate.material.opacity = 0.045 + Math.sin(time * 1.35) * 0.014;
    particles.rotation.y = time * 0.05;

    nodes.forEach((node) => {
      const orbitTime = time * node.speed + node.offset;
      node.mesh.position.set(
        Math.cos(orbitTime) * node.radius,
        Math.sin(orbitTime * 1.12) * node.radius * node.yFactor,
        Math.sin(orbitTime) * node.radius * 0.38
      );
    });

    nodes.forEach((node, index) => {
      const position = node.mesh.position;
      connectionPositions[index * 3] = position.x;
      connectionPositions[index * 3 + 1] = position.y;
      connectionPositions[index * 3 + 2] = position.z;
    });
    connectionPositions[nodes.length * 3] = connectionPositions[0];
    connectionPositions[nodes.length * 3 + 1] = connectionPositions[1];
    connectionPositions[nodes.length * 3 + 2] = connectionPositions[2];
    connectionGeometry.attributes.position.needsUpdate = true;

    camera.position.x += pointer.x * 0.28 - camera.position.x * 0.06;
    camera.position.y += -pointer.y * 0.2 - camera.position.y * 0.06;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    document.body.classList.add("three-ready");
    window.__crypto3dReady = true;
    window.__crypto3dFrames = (window.__crypto3dFrames || 0) + 1;

    if (!reducedMotion) {
      requestAnimationFrame(render);
    }
  }

  hero.addEventListener(
    "pointermove",
    (event) => {
      const rect = hero.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    },
    { passive: true }
  );

  hero.addEventListener(
    "pointerleave",
    () => {
      pointer.x = 0;
      pointer.y = 0;
    },
    { passive: true }
  );

  window.addEventListener("resize", resize, { passive: true });
  resize();
  render();
}

function createTokenTexture() {
  const textureCanvas = document.createElement("canvas");
  const size = 512;
  const context = textureCanvas.getContext("2d");
  textureCanvas.width = size;
  textureCanvas.height = size;

  const gradient = context.createRadialGradient(256, 220, 40, 256, 256, 250);
  gradient.addColorStop(0, "#f4fff8");
  gradient.addColorStop(0.42, "#bfffe0");
  gradient.addColorStop(1, "#58e6a4");

  context.clearRect(0, 0, size, size);
  context.beginPath();
  context.arc(256, 256, 222, 0, Math.PI * 2);
  context.fillStyle = "rgba(3, 18, 12, 0.45)";
  context.fill();
  context.strokeStyle = "rgba(244, 255, 248, 0.22)";
  context.lineWidth = 10;
  context.stroke();

  context.fillStyle = gradient;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "900 220px Inter, Arial, sans-serif";
  context.fillText("₮", 256, 232);

  context.font = "900 56px Inter, Arial, sans-serif";
  context.fillText("USDT", 256, 372);

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
