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
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const compactQuery = window.matchMedia("(max-width: 1080px)");
  const lowPower =
    (Number(navigator.hardwareConcurrency) > 0 && Number(navigator.hardwareConcurrency) <= 4) ||
    (Number(navigator.deviceMemory) > 0 && Number(navigator.deviceMemory) <= 4);
  const isLite = () => mobileQuery.matches || lowPower;
  const pixelRatio = () =>
    Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1 : lowPower ? 1.15 : 1.45);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isLite(),
    powerPreference: isLite() ? "low-power" : "high-performance",
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 70);
  const clock = new THREE.Clock();
  const pointer = new THREE.Vector2();
  const smoothPointer = new THREE.Vector2();
  const cameraHome = new THREE.Vector3(0, 0, 10.6);
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;
  renderer.setPixelRatio(pixelRatio());
  camera.position.copy(cameraHome);

  scene.fog = new THREE.FogExp2(0x010403, 0.032);

  const ambientLight = new THREE.AmbientLight(0xbfffe0, 0.76);
  const keyLight = new THREE.DirectionalLight(0xf1fff7, 2.7);
  const edgeLight = new THREE.DirectionalLight(0x70ffc2, 2.2);
  const violetLight = new THREE.PointLight(0x8b92ff, 3.6, 12);
  const mintLight = new THREE.PointLight(0x3dffad, 5.2, 11);
  const goldLight = new THREE.PointLight(0xffd46e, 1.5, 9);
  keyLight.position.set(-2.6, 4.8, 5.2);
  edgeLight.position.set(4.4, -1.2, 4.6);
  violetLight.position.set(3.4, 1.4, 2.8);
  mintLight.position.set(-2.8, 0.4, 3.2);
  goldLight.position.set(1.2, -3.2, 2.4);
  scene.add(ambientLight, keyLight, edgeLight, violetLight, mintLight, goldLight);

  const stage = new THREE.Group();
  const backdropRig = new THREE.Group();
  const orbitRig = new THREE.Group();
  const coinRig = new THREE.Group();
  stage.add(backdropRig, orbitRig, coinRig);
  scene.add(stage);

  const glowTexture = createGlowTexture();
  const sparkleTexture = createSparkleTexture();
  const tokenTexture = createTokenTexture();
  const radarTexture = createRadarTexture();
  const sweepTexture = createSweepTexture();

  const mintHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x52f5ae,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  mintHalo.position.set(0, 0, -1.7);
  mintHalo.scale.set(7.2, 7.2, 1);
  backdropRig.add(mintHalo);

  const violetHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x7d86ff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  violetHalo.position.set(0.9, 0.2, -2.1);
  violetHalo.scale.set(9.2, 5.4, 1);
  backdropRig.add(violetHalo);

  const radar = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 6.4),
    new THREE.MeshBasicMaterial({
      map: radarTexture,
      transparent: true,
      opacity: 0.2,
      color: 0xa8ffd5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  radar.position.z = -1.35;
  radar.rotation.z = -0.08;
  backdropRig.add(radar);

  const vaultShell = new THREE.Mesh(
    new THREE.SphereGeometry(2.64, isLite() ? 30 : 52, isLite() ? 18 : 30),
    new THREE.MeshBasicMaterial({
      color: 0x7df9c0,
      wireframe: true,
      transparent: true,
      opacity: 0.055,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  vaultShell.scale.set(1.18, 0.94, 0.54);
  vaultShell.position.z = -0.72;
  backdropRig.add(vaultShell);

  const sideMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x087c54,
    emissive: 0x03150f,
    emissiveIntensity: 0.22,
    metalness: 0.94,
    roughness: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    reflectivity: 0.9,
  });

  const faceMaterial = new THREE.MeshPhysicalMaterial({
    map: tokenTexture,
    color: 0xffffff,
    metalness: 0.38,
    roughness: 0.23,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    side: THREE.DoubleSide,
  });

  const bezelMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xbffff0,
    emissive: 0x0a6244,
    emissiveIntensity: 0.42,
    metalness: 0.98,
    roughness: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    transparent: true,
    opacity: 0.94,
  });

  const segments = isLite() ? 64 : 112;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.42, 0.36, segments), sideMaterial);
  body.rotation.x = Math.PI / 2;
  coinRig.add(body);

  const frontFace = new THREE.Mesh(new THREE.CircleGeometry(1.365, segments), faceMaterial);
  frontFace.position.z = 0.188;
  coinRig.add(frontFace);

  const backFace = frontFace.clone();
  backFace.position.z = -0.188;
  backFace.rotation.y = Math.PI;
  coinRig.add(backFace);

  const frontBezel = new THREE.Mesh(new THREE.TorusGeometry(1.405, 0.052, 18, segments), bezelMaterial);
  frontBezel.position.z = 0.205;
  coinRig.add(frontBezel);

  const backBezel = frontBezel.clone();
  backBezel.position.z = -0.205;
  backBezel.rotation.y = Math.PI;
  coinRig.add(backBezel);

  const innerBezel = new THREE.Mesh(
    new THREE.TorusGeometry(1.17, 0.012, 10, segments),
    bezelMaterial.clone()
  );
  innerBezel.material.opacity = 0.55;
  innerBezel.position.z = 0.218;
  coinRig.add(innerBezel);

  const tickRing = createTickRing(1.43, 0.218, isLite() ? 72 : 120);
  coinRig.add(tickRing);

  const lens = new THREE.Mesh(
    new THREE.CircleGeometry(1.34, segments),
    new THREE.MeshBasicMaterial({
      map: sweepTexture,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  lens.position.z = 0.226;
  coinRig.add(lens);

  const coinGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x8dffca,
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  coinGlow.position.z = -0.44;
  coinGlow.scale.set(4.4, 4.4, 1);
  coinRig.add(coinGlow);

  const orbitSpecs = [
    { radius: 2.08, y: 0.58, depth: 0.38, color: 0xbfffe0, opacity: 0.34, tilt: 0.2 },
    { radius: 2.48, y: 0.42, depth: 0.5, color: 0x6fffc0, opacity: 0.22, tilt: -0.34 },
    { radius: 2.9, y: 0.32, depth: 0.44, color: 0x8b92ff, opacity: 0.15, tilt: 0.48 },
  ];

  const orbitLines = orbitSpecs.map((spec) => {
    const line = createOrbitLine(spec);
    orbitRig.add(line);
    return line;
  });

  const gyroA = new THREE.Mesh(
    new THREE.TorusGeometry(1.82, 0.022, 10, isLite() ? 100 : 170),
    new THREE.MeshBasicMaterial({
      color: 0xbfffe0,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  gyroA.rotation.x = 1.13;
  gyroA.rotation.y = 0.18;
  orbitRig.add(gyroA);

  const gyroB = gyroA.clone();
  gyroB.geometry = new THREE.TorusGeometry(2.18, 0.015, 10, isLite() ? 100 : 170);
  gyroB.material = gyroA.material.clone();
  gyroB.material.color.setHex(0x7d86ff);
  gyroB.material.opacity = 0.18;
  gyroB.rotation.x = 0.66;
  gyroB.rotation.y = -0.34;
  orbitRig.add(gyroB);

  const scannerArc = createArcLine(2.55, -0.76, 0.62, 0xe9fff4, 0.52);
  scannerArc.rotation.z = 0.18;
  orbitRig.add(scannerArc);

  const secondArc = createArcLine(2.94, 2.28, 3.68, 0x8b92ff, 0.28);
  secondArc.rotation.z = -0.32;
  orbitRig.add(secondArc);

  const satelliteSpecs = [
    { radius: 2.08, speed: 0.34, offset: 0.3, y: 0.58, depth: 0.38, color: 0x67ffc0, size: 0.105 },
    { radius: 2.48, speed: -0.24, offset: 2.45, y: 0.42, depth: 0.5, color: 0x8b92ff, size: 0.13 },
    { radius: 2.9, speed: 0.18, offset: 4.2, y: 0.32, depth: 0.44, color: 0xffd46e, size: 0.11 },
  ];

  const satellites = satelliteSpecs.map((spec) => {
    const satellite = createSatellite(spec, glowTexture);
    orbitRig.add(satellite.group);
    return { ...spec, ...satellite };
  });

  const orbitSparks = Array.from({ length: isLite() ? 8 : 16 }, (_, index) => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: sparkleTexture,
        color: index % 3 === 0 ? 0xffffff : index % 3 === 1 ? 0x62ffc0 : 0x9299ff,
        transparent: true,
        opacity: 0.54,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      })
    );
    sprite.userData = {
      radius: 1.85 + Math.random() * 1.48,
      speed: 0.12 + Math.random() * 0.22,
      offset: Math.random() * Math.PI * 2,
      y: 0.26 + Math.random() * 0.34,
      depth: 0.26 + Math.random() * 0.24,
      size: index % 5 === 0 ? 0.2 : 0.1,
    };
    sprite.scale.setScalar(sprite.userData.size);
    orbitRig.add(sprite);
    return sprite;
  });

  const nearStars = createStarField(isLite() ? 90 : 190, 7.8, 5.4, 0xdffff0, 0.042, sparkleTexture);
  const farStars = createStarField(isLite() ? 120 : 280, 11.5, 7.2, 0x8ee7bd, 0.022, sparkleTexture);
  nearStars.position.z = -2.6;
  farStars.position.z = -5.4;
  stage.add(nearStars, farStars);

  const constellation = createConstellation(isLite() ? 22 : 42);
  constellation.position.z = -3.4;
  stage.add(constellation);

  let baseScale = 1;
  let baseX = 0;
  let baseY = 0;
  let sceneVisible = true;
  let lastFrame = 0;

  function resize() {
    const viewport = canvas.parentElement || hero;
    const width = Math.max(viewport.clientWidth, 1);
    const height = Math.max(viewport.clientHeight, 1);

    renderer.setPixelRatio(pixelRatio());
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (mobileQuery.matches) {
      baseScale = 0.82;
      baseX = 0;
      baseY = -0.08;
      stage.position.set(baseX, baseY, 0);
      cameraHome.z = 10.7;
    } else if (compactQuery.matches) {
      baseScale = 0.76;
      baseX = 0.72;
      baseY = -0.06;
      stage.position.set(baseX, baseY, 0);
      cameraHome.z = 10.8;
    } else {
      baseScale = 0.92;
      baseX = 1.18;
      baseY = -0.02;
      stage.position.set(baseX, baseY, 0);
      cameraHome.z = 10.65;
    }

    stage.scale.setScalar(baseScale);
    stage.userData.renderX = baseX;
    camera.position.z = cameraHome.z;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        sceneVisible = entry.isIntersecting;
      },
      { rootMargin: "420px 0px" }
    );
    observer.observe(hero);
  }

  function render(timestamp = 0) {
    if (document.hidden || !sceneVisible) {
      if (!reducedMotion) {
        window.setTimeout(() => requestAnimationFrame(render), document.hidden ? 320 : 140);
      }
      return;
    }

    const frameGap = mobileQuery.matches ? 30 : lowPower ? 28 : 16;
    if (lastFrame > 0 && timestamp - lastFrame < frameGap) {
      if (!reducedMotion) requestAnimationFrame(render);
      return;
    }
    lastFrame = timestamp;

    const time = clock.getElapsedTime();
    const pulse = 0.5 + Math.sin(time * 0.72) * 0.5;
    smoothPointer.lerp(pointer, 0.065);

    const targetStageX = baseX + smoothPointer.x * (mobileQuery.matches ? 0.025 : 0.08);
    stage.position.y = baseY + Math.sin(time * 0.56) * 0.045;
    stage.rotation.x += (smoothPointer.y * 0.022 - stage.rotation.x) * 0.05;
    stage.rotation.y += (smoothPointer.x * 0.028 - stage.rotation.y) * 0.05;
    stage.scale.setScalar(baseScale * (1 + Math.sin(time * 0.66) * 0.006));
    stage.userData.renderX = stage.userData.renderX ?? stage.position.x;
    stage.userData.renderX += (targetStageX - stage.userData.renderX) * 0.045;
    stage.position.x = stage.userData.renderX;

    coinRig.rotation.x = 0.045 + Math.sin(time * 0.28) * 0.025 + smoothPointer.y * 0.035;
    coinRig.rotation.y = Math.sin(time * 0.32) * 0.105 + smoothPointer.x * 0.065;
    coinRig.rotation.z = time * 0.055;
    lens.rotation.z = -0.72 + Math.sin(time * 0.44) * 0.46;
    lens.material.opacity = 0.15 + pulse * 0.16;
    tickRing.rotation.z = -time * 0.11;
    innerBezel.rotation.z = time * 0.085;
    coinGlow.material.opacity = 0.2 + pulse * 0.16;
    coinGlow.scale.setScalar(4.1 + pulse * 0.48);

    orbitRig.rotation.x = Math.sin(time * 0.18) * 0.04 + smoothPointer.y * 0.04;
    orbitRig.rotation.y = Math.sin(time * 0.15) * 0.035 + smoothPointer.x * 0.045;
    orbitLines.forEach((line, index) => {
      line.rotation.z = time * (index % 2 === 0 ? 0.035 : -0.028) + orbitSpecs[index].tilt;
      line.material.opacity = orbitSpecs[index].opacity + pulse * (index === 0 ? 0.08 : 0.035);
    });
    gyroA.rotation.z = time * 0.12;
    gyroB.rotation.z = -time * 0.09;
    scannerArc.rotation.z = time * 0.17;
    secondArc.rotation.z = -time * 0.11;

    satellites.forEach((satellite, index) => {
      const angle = time * satellite.speed + satellite.offset;
      satellite.group.position.set(
        Math.cos(angle) * satellite.radius,
        Math.sin(angle) * satellite.radius * satellite.y,
        Math.sin(angle) * satellite.radius * satellite.depth
      );
      satellite.mesh.rotation.x = time * (0.35 + index * 0.08);
      satellite.mesh.rotation.y = -time * (0.28 + index * 0.06);
      satellite.glow.material.opacity = 0.32 + pulse * 0.28;
    });

    orbitSparks.forEach((spark, index) => {
      const data = spark.userData;
      const angle = time * data.speed + data.offset;
      spark.position.set(
        Math.cos(angle) * data.radius,
        Math.sin(angle) * data.radius * data.y,
        Math.sin(angle) * data.radius * data.depth
      );
      const flicker = 0.5 + Math.sin(time * 1.15 + index * 0.83) * 0.5;
      spark.material.opacity = 0.26 + flicker * 0.52;
      spark.scale.setScalar(data.size * (0.9 + flicker * 0.32));
    });

    radar.rotation.z = -0.08 + time * 0.018;
    radar.material.opacity = 0.14 + pulse * 0.09;
    vaultShell.rotation.y = time * 0.036;
    vaultShell.rotation.z = -time * 0.024;
    vaultShell.material.opacity = 0.038 + pulse * 0.038;
    mintHalo.material.opacity = 0.24 + pulse * 0.16;
    violetHalo.material.opacity = 0.07 + (1 - pulse) * 0.1;
    nearStars.rotation.z = time * 0.006;
    farStars.rotation.z = -time * 0.003;
    constellation.rotation.z = -time * 0.004;
    constellation.material.opacity = 0.035 + pulse * 0.025;

    mintLight.intensity = 4.7 + pulse * 0.9;
    violetLight.intensity = 2.8 + (1 - pulse) * 1.1;
    violetLight.position.x = 3.2 + Math.sin(time * 0.26) * 0.55;
    goldLight.position.y = -3.1 + Math.sin(time * 0.31) * 0.4;

    const parallaxX = mobileQuery.matches ? 0.06 : 0.14;
    const parallaxY = mobileQuery.matches ? 0.04 : 0.1;
    const targetCameraX = smoothPointer.x * parallaxX;
    const targetCameraY = -smoothPointer.y * parallaxY;
    camera.position.x += (targetCameraX - camera.position.x) * 0.06;
    camera.position.y += (targetCameraY - camera.position.y) * 0.06;
    camera.position.z += (cameraHome.z - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    document.body.classList.add("three-ready");
    window.__crypto3dReady = true;
    window.__crypto3dFrames = (window.__crypto3dFrames || 0) + 1;

    if (!reducedMotion) requestAnimationFrame(render);
  }

  hero.addEventListener(
    "pointermove",
    (event) => {
      const rect = hero.getBoundingClientRect();
      pointer.x = clamp(((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2, -0.82, 0.82);
      pointer.y = clamp(((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2, -0.72, 0.72);
    },
    { passive: true }
  );

  hero.addEventListener(
    "pointerleave",
    () => pointer.set(0, 0),
    { passive: true }
  );

  canvas.addEventListener("webglcontextlost", () => document.body.classList.add("three-fallback"), {
    passive: true,
  });
  window.addEventListener("resize", resize, { passive: true });
  resize();
  render();
}

function createOrbitLine({ radius, y, depth, color, opacity }) {
  const points = [];
  const segments = 180;
  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * y,
        Math.sin(angle) * radius * depth
      )
    );
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.LineLoop(
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

function createArcLine(radius, startAngle, endAngle, color, opacity) {
  const points = [];
  const segments = 72;
  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments;
    const angle = startAngle + (endAngle - startAngle) * progress;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.48, 0.28));
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
}

function createTickRing(radius, z, count) {
  const positions = [];
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2;
    const inner = radius - (index % 6 === 0 ? 0.075 : 0.04);
    const outer = radius + (index % 6 === 0 ? 0.055 : 0.025);
    positions.push(Math.cos(angle) * inner, Math.sin(angle) * inner, z);
    positions.push(Math.cos(angle) * outer, Math.sin(angle) * outer, z);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      color: 0xeafff3,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
}

function createSatellite(spec, glowTexture) {
  const group = new THREE.Group();
  const mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(spec.size, 1),
    new THREE.MeshStandardMaterial({
      color: spec.color,
      emissive: spec.color,
      emissiveIntensity: 0.75,
      metalness: 0.54,
      roughness: 0.28,
    })
  );
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: spec.color,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  glow.scale.setScalar(spec.size * 5.6);
  group.add(glow, mesh);
  return { group, mesh, glow };
}

function createStarField(count, width, height, color, size, texture) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const baseColor = new THREE.Color(color);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * width;
    positions[index * 3 + 1] = (Math.random() - 0.5) * height;
    positions[index * 3 + 2] = (Math.random() - 0.5) * 1.2;
    const brightness = 0.42 + Math.random() * 0.58;
    colors[index * 3] = baseColor.r * brightness;
    colors[index * 3 + 1] = baseColor.g * brightness;
    colors[index * 3 + 2] = baseColor.b * brightness;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      map: texture,
      vertexColors: true,
      size,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      alphaTest: 0.02,
    })
  );
}

function createConstellation(count) {
  const nodes = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 7.2,
    y: (Math.random() - 0.5) * 4.6,
    z: (Math.random() - 0.5) * 0.9,
  }));
  const positions = [];
  nodes.forEach((node, index) => {
    const next = nodes[(index + 5) % count];
    positions.push(node.x, node.y, node.z, next.x, next.y, next.z);
    if (index % 4 === 0) {
      const cross = nodes[(index + 13) % count];
      positions.push(node.x, node.y, node.z, cross.x, cross.y, cross.z);
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      color: 0x68dca4,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
}

function createTokenTexture() {
  const textureCanvas = document.createElement("canvas");
  const size = 768;
  const context = textureCanvas.getContext("2d");
  textureCanvas.width = size;
  textureCanvas.height = size;

  const center = size / 2;
  const gradient = context.createRadialGradient(275, 205, 18, center, center, 356);
  gradient.addColorStop(0, "#dffff0");
  gradient.addColorStop(0.16, "#7dffc4");
  gradient.addColorStop(0.46, "#20c98a");
  gradient.addColorStop(0.76, "#087d55");
  gradient.addColorStop(1, "#023d2b");

  context.fillStyle = "#031d15";
  context.beginPath();
  context.arc(center, center, 376, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = gradient;
  context.beginPath();
  context.arc(center, center, 360, 0, Math.PI * 2);
  context.fill();

  context.lineWidth = 22;
  context.strokeStyle = "rgba(232, 255, 244, 0.28)";
  context.stroke();
  context.lineWidth = 7;
  context.strokeStyle = "rgba(1, 26, 18, 0.4)";
  context.stroke();

  context.save();
  context.translate(center, center);
  for (let index = 0; index < 120; index += 1) {
    context.rotate((Math.PI * 2) / 120);
    context.beginPath();
    context.moveTo(0, -350);
    context.lineTo(0, index % 5 === 0 ? -326 : -336);
    context.strokeStyle = index % 2 ? "rgba(1, 30, 20, 0.25)" : "rgba(242, 255, 248, 0.22)";
    context.lineWidth = index % 5 === 0 ? 3 : 1.5;
    context.stroke();
  }
  context.restore();

  context.save();
  context.shadowColor = "rgba(0, 0, 0, 0.3)";
  context.shadowBlur = 18;
  context.shadowOffsetY = 8;
  context.fillStyle = "#f8fff9";
  roundRect(context, 212, 215, 344, 62, 31);
  context.fill();
  roundRect(context, 348, 254, 72, 230, 34);
  context.fill();
  context.lineWidth = 32;
  context.strokeStyle = "#f8fff9";
  context.beginPath();
  context.ellipse(center, 352, 210, 52, 0, 0, Math.PI * 2);
  context.stroke();
  context.restore();

  context.save();
  context.globalCompositeOperation = "screen";
  const sheen = context.createLinearGradient(100, 70, 560, 590);
  sheen.addColorStop(0, "rgba(255,255,255,0.68)");
  sheen.addColorStop(0.24, "rgba(255,255,255,0.16)");
  sheen.addColorStop(0.5, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(135,255,204,0.05)");
  context.fillStyle = sheen;
  context.beginPath();
  context.arc(center, center, 350, 0, Math.PI * 2);
  context.fill();
  context.restore();

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function createRadarTexture() {
  const canvas = document.createElement("canvas");
  const size = 768;
  const context = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  const center = size / 2;

  context.clearRect(0, 0, size, size);
  context.strokeStyle = "rgba(126, 255, 196, 0.22)";
  for (let ring = 1; ring <= 7; ring += 1) {
    context.lineWidth = ring % 2 === 0 ? 1.5 : 0.8;
    context.beginPath();
    context.arc(center, center, ring * 46, 0, Math.PI * 2);
    context.stroke();
  }
  context.strokeStyle = "rgba(126, 255, 196, 0.12)";
  for (let index = 0; index < 24; index += 1) {
    const angle = (index / 24) * Math.PI * 2;
    context.beginPath();
    context.moveTo(center + Math.cos(angle) * 66, center + Math.sin(angle) * 66);
    context.lineTo(center + Math.cos(angle) * 340, center + Math.sin(angle) * 340);
    context.stroke();
  }
  const fade = context.createRadialGradient(center, center, 72, center, center, 360);
  fade.addColorStop(0, "rgba(255,255,255,0)");
  fade.addColorStop(0.62, "rgba(255,255,255,0.9)");
  fade.addColorStop(1, "rgba(255,255,255,0)");
  context.globalCompositeOperation = "destination-in";
  context.fillStyle = fade;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createSweepTexture() {
  const canvas = document.createElement("canvas");
  const size = 512;
  const context = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  const mask = context.createRadialGradient(256, 256, 40, 256, 256, 246);
  mask.addColorStop(0, "rgba(255,255,255,1)");
  mask.addColorStop(0.86, "rgba(255,255,255,0.78)");
  mask.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = mask;
  context.fillRect(0, 0, size, size);
  context.globalCompositeOperation = "source-in";
  const sweep = context.createLinearGradient(70, 70, 440, 440);
  sweep.addColorStop(0, "rgba(255,255,255,0)");
  sweep.addColorStop(0.4, "rgba(255,255,255,0)");
  sweep.addColorStop(0.5, "rgba(255,255,255,0.72)");
  sweep.addColorStop(0.57, "rgba(138,255,203,0.22)");
  sweep.addColorStop(0.68, "rgba(255,255,255,0)");
  sweep.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = sweep;
  context.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  const size = 384;
  const context = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  const gradient = context.createRadialGradient(192, 192, 0, 192, 192, 192);
  gradient.addColorStop(0, "rgba(255,255,255,0.96)");
  gradient.addColorStop(0.12, "rgba(202,255,229,0.56)");
  gradient.addColorStop(0.36, "rgba(92,244,173,0.22)");
  gradient.addColorStop(0.68, "rgba(92,244,173,0.06)");
  gradient.addColorStop(1, "rgba(92,244,173,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createSparkleTexture() {
  const canvas = document.createElement("canvas");
  const size = 96;
  const context = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  const gradient = context.createRadialGradient(48, 48, 0, 48, 48, 48);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.12, "rgba(255,255,255,0.96)");
  gradient.addColorStop(0.38, "rgba(183,255,221,0.34)");
  gradient.addColorStop(1, "rgba(183,255,221,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
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
