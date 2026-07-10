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
  const mobileScene = window.matchMedia("(max-width: 760px)");
  const lowCoreScene =
    (Number(navigator.hardwareConcurrency) > 0 && Number(navigator.hardwareConcurrency) <= 4) ||
    (Number(navigator.deviceMemory) > 0 && Number(navigator.deviceMemory) <= 4);
  const isSceneLite = () => mobileScene.matches || lowCoreScene;
  const getPixelRatio = () =>
    Math.min(window.devicePixelRatio || 1, mobileScene.matches ? 1 : lowCoreScene ? 1.2 : 1.5);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isSceneLite(),
    powerPreference: isSceneLite() ? "low-power" : "high-performance",
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 90);
  const clock = new THREE.Clock();
  const pointer = { x: 0, y: 0 };
  const smoothPointer = { x: 0, y: 0 };
  const cameraHome = { x: 0, y: 0, z: 10.2 };
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.setPixelRatio(getPixelRatio());

  camera.position.set(cameraHome.x, cameraHome.y, cameraHome.z);

  scene.fog = new THREE.FogExp2(0x020604, 0.024);
  scene.add(new THREE.AmbientLight(0x94ffd0, 0.72));

  const keyLight = new THREE.DirectionalLight(0xeafff5, 2.2);
  keyLight.position.set(3.2, 4.2, 4.5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x78ffd0, 1.35);
  rimLight.position.set(-4.8, -1.5, 4.2);
  scene.add(rimLight);

  const mintLight = new THREE.PointLight(0x58e6a4, 4.8, 10);
  mintLight.position.set(-2.5, 1.2, 2.2);
  scene.add(mintLight);

  const violetLight = new THREE.PointLight(0x7fa2ff, 1.9, 9);
  violetLight.position.set(2.8, -1.4, 2.8);
  scene.add(violetLight);

  const group = new THREE.Group();
  const orbitGroup = new THREE.Group();
  const portalGroup = new THREE.Group();
  const ribbonGroup = new THREE.Group();
  group.userData.baseY = 0;
  group.userData.baseScale = 1;
  scene.add(portalGroup, ribbonGroup, group, orbitGroup);

  const coinMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0f8f62,
    emissive: 0x03150f,
    emissiveIntensity: 0.26,
    metalness: 0.94,
    roughness: 0.12,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    reflectivity: 0.8,
    side: THREE.DoubleSide,
  });

  const rimMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xbfffe0,
    emissive: 0x0b4f37,
    emissiveIntensity: 0.36,
    metalness: 0.96,
    roughness: 0.11,
    clearcoat: 0.82,
    clearcoatRoughness: 0.06,
    transparent: true,
    opacity: 0.96,
    side: THREE.DoubleSide,
  });

  const coinSegments = isSceneLite() ? 64 : 88;
  const rimSegments = isSceneLite() ? 100 : 130;
  const orbitSegments = isSceneLite() ? 120 : 168;
  const scannerSegments = isSceneLite() ? 140 : 190;

  const coin = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.36, coinSegments), coinMaterial);
  coin.rotation.x = Math.PI / 2;
  group.add(coin);

  const glowTexture = createRadialGlowTexture();
  const premiumHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x9fffd0,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  premiumHalo.position.set(0, 0, -0.82);
  premiumHalo.scale.set(5.8, 5.8, 1);
  orbitGroup.add(premiumHalo);

  const deepHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x7fa2ff,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  deepHalo.position.set(0.18, -0.04, -1.05);
  deepHalo.scale.set(8.2, 4.6, 1);
  orbitGroup.add(deepHalo);

  const auraShell = new THREE.Mesh(
    new THREE.SphereGeometry(2.58, isSceneLite() ? 34 : 54, isSceneLite() ? 16 : 26),
    new THREE.MeshBasicMaterial({
      color: 0xa9ffd8,
      wireframe: true,
      transparent: true,
      opacity: 0.075,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  auraShell.scale.set(1.18, 0.74, 0.46);
  portalGroup.add(auraShell);

  const auraGlass = new THREE.Mesh(
    new THREE.SphereGeometry(2.42, isSceneLite() ? 30 : 46, isSceneLite() ? 14 : 22),
    new THREE.MeshBasicMaterial({
      color: 0x65f3ad,
      transparent: true,
      opacity: 0.03,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  auraGlass.scale.copy(auraShell.scale);
  portalGroup.add(auraGlass);

  const horizonRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.72, 0.018, 8, orbitSegments),
    new THREE.MeshBasicMaterial({
      color: 0xd8ffe9,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  horizonRing.rotation.x = Math.PI * 0.48;
  horizonRing.rotation.y = -Math.PI * 0.06;
  portalGroup.add(horizonRing);

  const tokenTexture = createTokenTexture();
  const faceMaterial = new THREE.MeshStandardMaterial({
    map: tokenTexture,
    transparent: true,
    opacity: 0.98,
    metalness: 0.22,
    roughness: 0.38,
    alphaTest: 0.02,
    side: THREE.DoubleSide,
  });

  const frontFace = new THREE.Mesh(new THREE.PlaneGeometry(2.32, 2.32), faceMaterial);
  frontFace.position.z = 0.19;
  group.add(frontFace);

  const backFace = frontFace.clone();
  backFace.position.z = -0.19;
  backFace.rotation.y = Math.PI;
  group.add(backFace);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.035, 14, rimSegments), rimMaterial);
  rim.position.z = 0.206;
  group.add(rim);

  const backRim = rim.clone();
  backRim.position.z = -0.206;
  backRim.rotation.y = Math.PI;
  group.add(backRim);

  const innerRim = new THREE.Mesh(new THREE.TorusGeometry(1.06, 0.007, 8, rimSegments), rimMaterial.clone());
  innerRim.material.opacity = 0.76;
  innerRim.position.z = 0.22;
  group.add(innerRim);

  const outerGroove = new THREE.Mesh(new THREE.TorusGeometry(1.16, 0.005, 8, rimSegments), rimMaterial.clone());
  outerGroove.material.opacity = 0.54;
  outerGroove.position.z = -0.22;
  outerGroove.rotation.y = Math.PI;
  group.add(outerGroove);

  const rimTicks = createRimTicks(1.29, 0.21, isSceneLite() ? 72 : 112);
  group.add(rimTicks);

  const sweepPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.34, 2.34),
    new THREE.MeshBasicMaterial({
      map: createSweepTexture(),
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  sweepPlane.position.z = 0.196;
  group.add(sweepPlane);

  const crystal = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.92, 2),
    new THREE.MeshBasicMaterial({
      color: 0xbfffe0,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
      blending: THREE.AdditiveBlending,
    })
  );
  crystal.scale.set(1.34, 1.34, 0.68);
  group.add(crystal);

  const energyRibbons = [
    createEnergyRibbon(1.78, 0.16, 2.1, 0x65f3ad, 0.36, 0),
    createEnergyRibbon(2.18, 0.24, 1.62, 0xc9ffe2, 0.22, Math.PI * 0.72),
    createEnergyRibbon(2.58, 0.18, 1.38, 0x8aa7ff, 0.18, Math.PI * 1.34),
  ];
  energyRibbons.forEach((ribbon) => ribbonGroup.add(ribbon));

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x84ffd0,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
  });

  const tiltedRingA = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.012, 10, orbitSegments), ringMaterial);
  tiltedRingA.rotation.x = Math.PI * 0.58;
  tiltedRingA.rotation.y = Math.PI * 0.12;
  orbitGroup.add(tiltedRingA);

  const tiltedRingB = new THREE.Mesh(new THREE.TorusGeometry(2.42, 0.01, 10, orbitSegments), ringMaterial.clone());
  tiltedRingB.material.opacity = 0.18;
  tiltedRingB.rotation.x = Math.PI * 0.28;
  tiltedRingB.rotation.y = -Math.PI * 0.22;
  orbitGroup.add(tiltedRingB);

  const premiumArcs = [
    createArcLine(2.78, Math.PI * 0.08, Math.PI * 0.84, 0xbfffe0, 0.22),
    createArcLine(3.05, Math.PI * 1.08, Math.PI * 1.72, 0x7fa2ff, 0.16),
    createArcLine(3.34, Math.PI * 1.84, Math.PI * 2.42, 0xf3c94d, 0.14),
  ];
  premiumArcs.forEach((arc) => orbitGroup.add(arc));

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

  const sparkSprites = Array.from({ length: isSceneLite() ? 7 : 12 }, (_, index) => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: index % 3 === 0 ? 0xffffff : index % 3 === 1 ? 0x65f3ad : 0x8aa7ff,
        transparent: true,
        opacity: 0.62,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      })
    );
    sprite.scale.setScalar(index % 4 === 0 ? 0.26 : 0.16);
    sprite.userData = {
      radius: 2.2 + Math.random() * 2.25,
      speed: 0.18 + Math.random() * 0.34,
      offset: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * 1.7,
    };
    orbitGroup.add(sprite);
    return sprite;
  });

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

  const glassPlate = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 3.1, 1, 1), glassMaterial);
  glassPlate.position.set(0, 0, -0.48);
  glassPlate.rotation.z = -0.08;
  orbitGroup.add(glassPlate);

  const scannerRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.88, 0.008, 8, scannerSegments),
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
    new THREE.TorusGeometry(3.22, 0.006, 8, scannerSegments),
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
  const particleCount = mobileScene.matches ? 24 : lowCoreScene ? 42 : 58;
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
      depthWrite: false,
    })
  );
  scene.add(particles);

  const fieldGeometry = new THREE.BufferGeometry();
  const fieldCount = mobileScene.matches ? 130 : lowCoreScene ? 260 : 340;
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
  const meshNodeCount = mobileScene.matches ? 18 : lowCoreScene ? 34 : 46;
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

  function createRimTicks(radius, z, count) {
    const positions = [];

    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count;
      const inner = radius - (index % 4 === 0 ? 0.055 : 0.034);
      const outer = radius + (index % 4 === 0 ? 0.052 : 0.024);
      positions.push(Math.cos(angle) * inner, Math.sin(angle) * inner, z);
      positions.push(Math.cos(angle) * outer, Math.sin(angle) * outer, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    return new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({
        color: 0xe9fff2,
        transparent: true,
        opacity: 0.26,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
  }

  function createEnergyRibbon(radius, verticalScale, turns, color, opacity, offset) {
    const points = [];
    const segments = isSceneLite() ? 74 : 132;

    for (let index = 0; index <= segments; index += 1) {
      const progress = index / segments;
      const angle = offset + progress * turns * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 0.74 + offset) * verticalScale + (progress - 0.5) * 0.34,
          Math.sin(angle) * radius * 0.34
        )
      );
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, segments, isSceneLite() ? 0.009 : 0.012, 6, false);
    return new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
  }

  function createNode(color, radius, speed, offset) {
    const widthSegments = mobileScene.matches ? 12 : lowCoreScene ? 16 : 20;
    const heightSegments = mobileScene.matches ? 8 : lowCoreScene ? 12 : 16;

    return {
      mesh: new THREE.Mesh(
        new THREE.SphereGeometry(0.08, widthSegments, heightSegments),
        nodeMaterial.clone()
      ),
      radius,
      speed,
      offset,
      yFactor: 0.34 + Math.random() * 0.22,
      color,
    };
  }

  function createArcLine(radius, startAngle, endAngle, color, opacity) {
    const segments = isSceneLite() ? 48 : 78;
    const positions = [];

    for (let index = 0; index <= segments; index += 1) {
      const progress = index / segments;
      const angle = startAngle + (endAngle - startAngle) * progress;
      positions.push(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.34, Math.sin(angle) * radius * 0.32);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    return new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
  }

  nodes.forEach((node) => {
    node.mesh.material.color.setHex(node.color);
    node.mesh.material.emissive.setHex(node.color);
  });

  function resize() {
    const width = hero.clientWidth;
    const height = hero.clientHeight;

    renderer.setPixelRatio(getPixelRatio());
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();

    if (width < 720) {
      group.position.set(0.12, -0.5, 0);
      group.userData.baseY = -0.5;
      orbitGroup.position.copy(group.position);
      group.scale.setScalar(0.66);
      group.userData.baseScale = 0.66;
      orbitGroup.scale.setScalar(0.66);
    } else if (width < 1040) {
      group.position.set(0.74, -0.02, 0);
      group.userData.baseY = -0.02;
      orbitGroup.position.copy(group.position);
      group.scale.setScalar(0.82);
      group.userData.baseScale = 0.82;
      orbitGroup.scale.setScalar(0.82);
    } else {
      group.position.set(0.92, -0.04, 0);
      group.userData.baseY = -0.04;
      orbitGroup.position.copy(group.position);
      group.scale.setScalar(0.94);
      group.userData.baseScale = 0.94;
      orbitGroup.scale.setScalar(0.94);
    }

    portalGroup.position.copy(group.position);
    ribbonGroup.position.copy(group.position);
    portalGroup.scale.copy(orbitGroup.scale);
    ribbonGroup.scale.copy(orbitGroup.scale);
  }

  let heroSceneVisible = true;
  let lastRenderFrame = 0;

  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        heroSceneVisible = entry.isIntersecting;
      },
      { rootMargin: "160px 0px" }
    );
    visibilityObserver.observe(hero);
  }

  function render(timestamp = 0) {
    const introPlaying = document.body.classList.contains("intro-playing");

    // Render one frame beneath the opaque intro so the scene is ready when
    // the reveal starts, then pause until the exit transition begins.
    if (introPlaying && window.__crypto3dReady) {
      if (!reducedMotion) {
        window.setTimeout(() => requestAnimationFrame(render), isSceneLite() ? 100 : 58);
      }
      return;
    }

    if (document.hidden || !heroSceneVisible) {
      if (!reducedMotion) {
        window.setTimeout(() => requestAnimationFrame(render), document.hidden ? 360 : 180);
      }
      return;
    }

    const renderGap = mobileScene.matches ? 38 : lowCoreScene ? 30 : 20;
    if (timestamp - lastRenderFrame < renderGap) {
      if (!reducedMotion) {
        requestAnimationFrame(render);
      }
      return;
    }

    lastRenderFrame = timestamp;
    const time = clock.getElapsedTime();
    smoothPointer.x += (pointer.x - smoothPointer.x) * 0.08;
    smoothPointer.y += (pointer.y - smoothPointer.y) * 0.08;
    const premiumPulse = 0.5 + Math.sin(time * 0.72) * 0.5;

    // Keep the branded faces visible while preserving a convincing 3D turn.
    // A full, slow Y rotation left the coin edge-on long enough to look absent.
    group.rotation.y = Math.sin(time * 0.34) * 0.26 + smoothPointer.x * 0.055;
    group.rotation.x = 0.07 + Math.sin(time * 0.28) * 0.045 + smoothPointer.y * 0.055;
    group.rotation.z = time * 0.052 + Math.sin(time * 0.22) * 0.03;
    group.position.y = group.userData.baseY + Math.sin(time * 0.62) * 0.06;
    group.scale.setScalar(group.userData.baseScale * (1 + Math.sin(time * 0.82) * 0.01));
    crystal.rotation.y = -time * 0.16;
    crystal.rotation.x = time * 0.08;

    orbitGroup.rotation.y = -time * 0.13;
    orbitGroup.rotation.x = Math.sin(time * 0.18) * 0.08;
    portalGroup.position.y = group.position.y * 0.82;
    ribbonGroup.position.y = group.position.y;
    portalGroup.rotation.y = -time * 0.054 + smoothPointer.x * 0.045;
    portalGroup.rotation.x = Math.sin(time * 0.16) * 0.055 + smoothPointer.y * 0.035;
    ribbonGroup.rotation.y = time * 0.18 + smoothPointer.x * 0.08;
    ribbonGroup.rotation.x = Math.sin(time * 0.2) * 0.09;
    auraShell.rotation.y = time * 0.06;
    auraShell.rotation.z = -time * 0.038;
    auraShell.material.opacity = 0.052 + premiumPulse * 0.052;
    auraGlass.rotation.y = -time * 0.032;
    auraGlass.material.opacity = 0.018 + (1 - premiumPulse) * 0.028;
    horizonRing.rotation.z = time * 0.2;
    horizonRing.material.opacity = 0.14 + premiumPulse * 0.12;
    rimTicks.rotation.z = -time * 0.18;
    rimTicks.material.opacity = 0.16 + premiumPulse * 0.18;
    energyRibbons.forEach((ribbon, index) => {
      ribbon.rotation.z = time * (index % 2 ? -0.2 : 0.24) + index * 0.72;
      ribbon.rotation.y = Math.sin(time * 0.17 + index) * 0.18;
      ribbon.material.opacity = (index === 0 ? 0.22 : 0.12) + premiumPulse * (index === 0 ? 0.18 : 0.1);
    });

    tiltedRingA.rotation.z = time * 0.16;
    tiltedRingB.rotation.z = -time * 0.12;
    scannerRing.rotation.z = time * 0.26;
    haloRing.rotation.z = -time * 0.16;
    premiumArcs.forEach((arc, index) => {
      arc.rotation.z = time * (index % 2 ? -0.18 : 0.16) + index * 0.7;
      arc.material.opacity = (index === 0 ? 0.16 : 0.1) + premiumPulse * (index === 0 ? 0.08 : 0.045);
    });
    premiumHalo.material.opacity = 0.22 + premiumPulse * 0.2;
    deepHalo.material.opacity = 0.08 + (1 - premiumPulse) * 0.11;
    premiumHalo.scale.setScalar(5.55 + premiumPulse * 0.5);
    deepHalo.scale.set(7.6 + premiumPulse * 0.8, 4.2 + premiumPulse * 0.5, 1);
    sweepPlane.rotation.z = -0.52 + Math.sin(time * 0.45) * 0.34;
    sweepPlane.material.opacity = 0.1 + premiumPulse * 0.12;
    innerRim.rotation.z = -time * 0.12;
    outerGroove.rotation.z = time * 0.1;
    glassPlate.material.opacity = 0.035 + Math.sin(time * 1.12) * 0.012;
    particles.rotation.y = time * 0.05;
    particles.rotation.z = Math.sin(time * 0.12) * 0.035;
    mintLight.intensity = 4.35 + premiumPulse * 0.62;
    violetLight.intensity = 1.25 + (1 - premiumPulse) * 0.85;
    violetLight.position.x = 2.6 + Math.sin(time * 0.34) * 0.58;
    keyLight.position.x = 3.2 + Math.sin(time * 0.36) * 0.55;
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

    sparkSprites.forEach((spark, index) => {
      const orbitTime = time * spark.userData.speed + spark.userData.offset;
      spark.position.set(
        Math.cos(orbitTime) * spark.userData.radius,
        spark.userData.y + Math.sin(orbitTime * 1.7) * 0.34,
        Math.sin(orbitTime) * spark.userData.radius * 0.36
      );
      spark.material.opacity = 0.24 + (Math.sin(time * 1.2 + index) * 0.5 + 0.5) * 0.58;
      spark.scale.setScalar((index % 4 === 0 ? 0.2 : 0.12) + premiumPulse * 0.06);
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

    const cameraParallaxX = mobileScene.matches ? 0.12 : 0.24;
    const cameraParallaxY = mobileScene.matches ? 0.08 : 0.16;
    const targetCameraX = smoothPointer.x * cameraParallaxX;
    const targetCameraY = -smoothPointer.y * cameraParallaxY;

    camera.position.x += (targetCameraX - camera.position.x) * 0.075;
    camera.position.y += (targetCameraY - camera.position.y) * 0.075;
    camera.position.z += (cameraHome.z - camera.position.z) * 0.055;
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
      pointer.x = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -0.86, 0.86);
      pointer.y = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -0.76, 0.76);
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
  context.shadowBlur = 16;
  context.shadowOffsetY = 10;
  context.beginPath();
  context.arc(256, 256, 238, 0, Math.PI * 2);
  context.fillStyle = "#062d20";
  context.fill();
  context.restore();

  context.beginPath();
  context.arc(256, 256, 234, 0, Math.PI * 2);
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
    context.moveTo(0, -228);
    context.lineTo(0, -216);
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
  context.arc(256, 256, 218, 0, Math.PI * 2);
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

function createRadialGlowTexture() {
  const textureCanvas = document.createElement("canvas");
  const size = 384;
  const context = textureCanvas.getContext("2d");
  textureCanvas.width = size;
  textureCanvas.height = size;

  const gradient = context.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
  gradient.addColorStop(0.18, "rgba(170, 255, 214, 0.36)");
  gradient.addColorStop(0.44, "rgba(101, 243, 173, 0.13)");
  gradient.addColorStop(0.72, "rgba(127, 162, 255, 0.06)");
  gradient.addColorStop(1, "rgba(101, 243, 173, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createSweepTexture() {
  const textureCanvas = document.createElement("canvas");
  const size = 384;
  const context = textureCanvas.getContext("2d");
  textureCanvas.width = size;
  textureCanvas.height = size;

  const mask = context.createRadialGradient(size / 2, size / 2, 72, size / 2, size / 2, size / 2);
  mask.addColorStop(0, "rgba(255, 255, 255, 1)");
  mask.addColorStop(0.78, "rgba(255, 255, 255, 0.8)");
  mask.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = mask;
  context.beginPath();
  context.arc(size / 2, size / 2, size * 0.48, 0, Math.PI * 2);
  context.fill();
  context.globalCompositeOperation = "source-in";

  const sweep = context.createLinearGradient(40, 48, 324, 336);
  sweep.addColorStop(0, "rgba(255, 255, 255, 0)");
  sweep.addColorStop(0.34, "rgba(255, 255, 255, 0)");
  sweep.addColorStop(0.48, "rgba(255, 255, 255, 0.44)");
  sweep.addColorStop(0.54, "rgba(255, 255, 255, 0.2)");
  sweep.addColorStop(0.7, "rgba(255, 255, 255, 0)");
  sweep.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = sweep;
  context.fillRect(0, 0, size, size);

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
