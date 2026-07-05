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
  group.userData.baseY = 0;
  group.userData.baseScale = 1;
  scene.add(group, orbitGroup);

  const coinMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f8f62,
    emissive: 0x03150f,
    emissiveIntensity: 0.2,
    metalness: 0.94,
    roughness: 0.18,
    side: THREE.DoubleSide,
  });

  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xbfffe0,
    emissive: 0x0b4f37,
    emissiveIntensity: 0.24,
    metalness: 0.9,
    roughness: 0.2,
    side: THREE.DoubleSide,
  });

  const coin = new THREE.Mesh(new THREE.CylinderGeometry(1.14, 1.14, 0.3, 96), coinMaterial);
  coin.rotation.x = Math.PI / 2;
  group.add(coin);

  const tokenTexture = createTokenTexture();
  const faceMaterial = new THREE.MeshBasicMaterial({
    map: tokenTexture,
    transparent: true,
    opacity: 0.98,
    side: THREE.DoubleSide,
  });

  const frontFace = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 1.72), faceMaterial);
  frontFace.position.z = 0.158;
  group.add(frontFace);

  const backFace = frontFace.clone();
  backFace.position.z = -0.158;
  backFace.rotation.y = Math.PI;
  group.add(backFace);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.028, 16, 140), rimMaterial);
  rim.position.z = 0.17;
  group.add(rim);

  const backRim = rim.clone();
  backRim.position.z = -0.17;
  backRim.rotation.y = Math.PI;
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

  const fieldGeometry = new THREE.BufferGeometry();
  const fieldCount = 420;
  const fieldPositions = new Float32Array(fieldCount * 3);

  for (let index = 0; index < fieldCount; index += 1) {
    const spread = 8 + Math.random() * 8;
    fieldPositions[index * 3] = (Math.random() - 0.5) * spread;
    fieldPositions[index * 3 + 1] = (Math.random() - 0.5) * 6.8;
    fieldPositions[index * 3 + 2] = -1.8 - Math.random() * 5.6;
  }

  fieldGeometry.setAttribute("position", new THREE.BufferAttribute(fieldPositions, 3));
  const field = new THREE.Points(
    fieldGeometry,
    new THREE.PointsMaterial({
      color: 0xc9ffe2,
      size: 0.026,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(field);

  const meshPositions = [];
  const meshNodeCount = 54;
  const meshNodes = Array.from({ length: meshNodeCount }, () => ({
    x: (Math.random() - 0.5) * 8.4,
    y: (Math.random() - 0.5) * 5.4,
    z: -2.6 - Math.random() * 3.6,
  }));

  meshNodes.forEach((node, index) => {
    const next = meshNodes[(index + 7) % meshNodeCount];
    meshPositions.push(node.x, node.y, node.z, next.x, next.y, next.z);

    if (index % 3 === 0) {
      const cross = meshNodes[(index + 19) % meshNodeCount];
      meshPositions.push(node.x, node.y, node.z, cross.x, cross.y, cross.z);
    }
  });

  const fieldLinksGeometry = new THREE.BufferGeometry();
  fieldLinksGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(meshPositions, 3)
  );
  const fieldLinks = new THREE.LineSegments(
    fieldLinksGeometry,
    new THREE.LineBasicMaterial({
      color: 0x65f3ad,
      transparent: true,
      opacity: 0.055,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(fieldLinks);

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
      group.userData.baseY = -0.78;
      orbitGroup.position.copy(group.position);
      group.scale.setScalar(0.68);
      group.userData.baseScale = 0.68;
      orbitGroup.scale.setScalar(0.68);
    } else if (width < 1040) {
      group.position.set(1.62, -0.08, 0);
      group.userData.baseY = -0.08;
      orbitGroup.position.copy(group.position);
      group.scale.setScalar(0.86);
      group.userData.baseScale = 0.86;
      orbitGroup.scale.setScalar(0.86);
    } else {
      group.position.set(2.25, -0.05, 0);
      group.userData.baseY = -0.05;
      orbitGroup.position.copy(group.position);
      group.scale.setScalar(1);
      group.userData.baseScale = 1;
      orbitGroup.scale.setScalar(1);
    }
  }

  function render() {
    const time = clock.getElapsedTime();
    const introPlaying = document.body.classList.contains("intro-playing");

    // Render one frame beneath the opaque intro so the scene is ready when
    // the reveal starts, then pause until the exit transition begins.
    if (introPlaying && window.__crypto3dReady) {
      if (!reducedMotion) {
        requestAnimationFrame(render);
      }
      return;
    }

    // Keep the branded faces visible while preserving a convincing 3D turn.
    // A full, slow Y rotation left the coin edge-on long enough to look absent.
    group.rotation.y = Math.sin(time * 0.48) * 0.66 + pointer.x * 0.16;
    group.rotation.x = 0.11 + Math.sin(time * 0.32) * 0.07 + pointer.y * 0.1;
    group.rotation.z = time * 0.075 + Math.sin(time * 0.28) * 0.035;
    group.position.y = group.userData.baseY + Math.sin(time * 0.72) * 0.07;
    group.scale.setScalar(group.userData.baseScale * (1 + Math.sin(time * 0.9) * 0.012));
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
    mintLight.intensity = 4.7 + Math.sin(time * 1.1) * 0.42;
    keyLight.position.x = 3.2 + Math.sin(time * 0.44) * 0.7;
    field.rotation.y = time * 0.008;
    field.rotation.x = Math.sin(time * 0.08) * 0.016;
    fieldLinks.rotation.y = -time * 0.006;
    fieldLinks.material.opacity = 0.045 + Math.sin(time * 0.42) * 0.016;

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

  const coinGradient = context.createRadialGradient(198, 136, 18, 256, 256, 236);
  coinGradient.addColorStop(0, "#d7fff0");
  coinGradient.addColorStop(0.22, "#55e1a2");
  coinGradient.addColorStop(0.58, "#119265");
  coinGradient.addColorStop(1, "#063c2b");

  context.clearRect(0, 0, size, size);

  context.save();
  context.shadowColor = "rgba(0, 0, 0, 0.34)";
  context.shadowBlur = 22;
  context.shadowOffsetY = 16;
  context.beginPath();
  context.arc(256, 256, 226, 0, Math.PI * 2);
  context.fillStyle = "#062d20";
  context.fill();
  context.restore();

  context.beginPath();
  context.arc(256, 256, 222, 0, Math.PI * 2);
  context.fillStyle = coinGradient;
  context.fill();

  context.lineWidth = 18;
  context.strokeStyle = "rgba(244, 255, 248, 0.2)";
  context.stroke();
  context.lineWidth = 6;
  context.strokeStyle = "rgba(3, 18, 12, 0.24)";
  context.stroke();

  context.save();
  context.translate(256, 256);
  context.lineCap = "round";
  for (let index = 0; index < 96; index += 1) {
    context.rotate((Math.PI * 2) / 96);
    context.beginPath();
    context.moveTo(0, -215);
    context.lineTo(0, -205);
    context.lineWidth = index % 2 === 0 ? 2.2 : 1.2;
    context.strokeStyle = index % 2 === 0 ? "rgba(244,255,248,0.18)" : "rgba(3,18,12,0.22)";
    context.stroke();
  }
  context.restore();

  context.save();
  context.globalAlpha = 0.5;
  const shineGradient = context.createLinearGradient(92, 72, 350, 330);
  shineGradient.addColorStop(0, "rgba(255,255,255,0.82)");
  shineGradient.addColorStop(0.22, "rgba(255,255,255,0.18)");
  shineGradient.addColorStop(0.5, "rgba(255,255,255,0)");
  context.beginPath();
  context.arc(256, 256, 206, 0, Math.PI * 2);
  context.fillStyle = shineGradient;
  context.fill();
  context.restore();

  context.save();
  context.fillStyle = "#fbfff9";
  context.shadowColor = "rgba(0, 0, 0, 0.22)";
  context.shadowBlur = 12;
  context.shadowOffsetY = 5;

  roundRect(context, 148, 144, 216, 42, 22);
  context.fill();
  roundRect(context, 232, 172, 48, 156, 24);
  context.fill();

  context.lineWidth = 21;
  context.strokeStyle = "#fbfff9";
  context.beginPath();
  context.ellipse(256, 236, 132, 34, 0, 0, Math.PI * 2);
  context.stroke();
  context.restore();

  context.save();
  context.globalCompositeOperation = "source-atop";
  context.strokeStyle = "rgba(4, 18, 13, 0.16)";
  context.lineWidth = 2;
  context.beginPath();
  context.ellipse(256, 236, 106, 23, 0, 0, Math.PI * 2);
  context.stroke();
  context.restore();

  context.save();
  context.globalCompositeOperation = "source-atop";
  context.fillStyle = "rgba(255, 255, 255, 0.18)";
  context.beginPath();
  context.arc(190, 138, 68, 0, Math.PI * 2);
  context.fill();
  context.restore();

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function roundRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}
