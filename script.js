const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const menuLinks = document.querySelectorAll(".nav-menu a, .mobile-dock a");
const packagesSection = document.querySelector("#packages");
const packagesTitle = document.querySelector("#packages-title");
const packagesDescription = document.querySelector("#packages-description");
const packageGrid = document.querySelector("#package-grid");
const networkButtons = document.querySelectorAll(".network-button[data-network]");
const networkCards = document.querySelectorAll(".network-card[data-network]");
const networkTabs = document.querySelectorAll(".network-tab[data-network-tab]");
const checkoutSection = document.querySelector("#checkout");
const checkoutProduct = document.querySelector("#checkout-product");
const checkoutPackage = document.querySelector("#checkout-package");
const checkoutNetwork = document.querySelector("#checkout-network");
const checkoutNetworkLabel = document.querySelector("#checkout-network-label");
const checkoutPrice = document.querySelector("#checkout-price");
const checkoutIcon = document.querySelector("#checkout-icon");
const walletHelper = document.querySelector("#wallet-helper");
const customerWallet = document.querySelector("#customer-wallet");
const continuePayment = document.querySelector("#continue-payment");
const checkoutMessage = document.querySelector("#checkout-message");
const paymentPanel = document.querySelector("#payment-panel");
const paymentNetwork = document.querySelector("#payment-network");
const paymentWallet = document.querySelector("#payment-wallet");
const paymentAmount = document.querySelector("#payment-amount");
const copyWallet = document.querySelector("#copy-wallet");
const checkoutProductsLink = document.querySelector("#checkout-products-link");
const checkoutBackLink = document.querySelector("#checkout-back-link");
const orderId = document.querySelector("#order-id");
const orderStatus = document.querySelector("#order-status");
const orderProgressSteps = document.querySelectorAll(".order-progress span");
const transactionId = document.querySelector("#transaction-id");
const paymentReceipt = document.querySelector("#payment-receipt");
const receiptFile = document.querySelector("#receipt-file");
const submitProof = document.querySelector("#submit-proof");
const proofMessage = document.querySelector("#proof-message");
const siteIntro = document.querySelector(".site-intro");
const scrollProgress = document.querySelector(".scroll-progress");
const networkAdvisor = document.querySelector(".network-advisor");
const networkAdvisorTabs = document.querySelectorAll(".network-advisor-tab[data-advisor-network]");
const advisorSymbol = document.querySelector("#advisor-symbol");
const advisorChain = document.querySelector("#advisor-chain");
const advisorTitle = document.querySelector("#advisor-title");
const advisorDescription = document.querySelector("#advisor-description");
const advisorSpeed = document.querySelector("#advisor-speed");
const advisorFee = document.querySelector("#advisor-fee");
const advisorAddress = document.querySelector("#advisor-address");
const advisorAction = document.querySelector("#advisor-action");
const advisorNote = document.querySelector("#advisor-note");
let journeyStatus = null;
let journeyStep = null;
let networkPassport = null;
let passportNetwork = null;
let passportChain = null;
let passportSymbol = null;
let passportPhase = null;
let passportAction = null;
let scrollBeacon = null;
let scrollBeaconPercent = null;
let scrollBeaconSymbol = null;
let beaconScrollTimer = null;
let beaconLastScrollY = window.scrollY;
let scrollUiFrame = 0;
const trackedSections = Array.from(
  document.querySelectorAll("#top, #networks, #packages, #checkout, #wallets")
);
const pageParams = new URLSearchParams(window.location.search);
const compactViewport = window.matchMedia("(max-width: 760px)");
const lowCoreDevice =
  (Number(navigator.hardwareConcurrency) > 0 && Number(navigator.hardwareConcurrency) <= 4) ||
  (Number(navigator.deviceMemory) > 0 && Number(navigator.deviceMemory) <= 4);

function syncPerformanceMode() {
  document.documentElement.classList.toggle(
    "performance-lite",
    compactViewport.matches || lowCoreDevice
  );
}

syncPerformanceMode();
if (compactViewport.addEventListener) {
  compactViewport.addEventListener("change", syncPerformanceMode);
}

const networkAdvisorData = {
  TRC20: {
    symbol: "₮",
    chain: "TRON",
    title: "USDT в сети TRC20",
    description: "Практичный маршрут для регулярных переводов USDT через совместимые TRON-кошельки.",
    speed: "Высокая",
    fee: "Обычно ниже",
    address: "Начинается с T",
    note: "Перед переводом убедитесь, что отправитель и получатель используют одну сеть.",
  },
  ERC20: {
    symbol: "◆",
    chain: "ETHEREUM",
    title: "USDT в сети ERC20",
    description: "Маршрут для Ethereum-кошельков и сервисов, где важна совместимость со стандартом ERC20.",
    speed: "Средняя",
    fee: "Зависит от нагрузки",
    address: "Формат 0x…",
    note: "Проверьте комиссию Ethereum непосредственно перед отправкой транзакции.",
  },
  BEP20: {
    symbol: "⬡",
    chain: "BNB CHAIN",
    title: "USDT в сети BEP20",
    description: "Удобный маршрут для кошельков и платформ, поддерживающих BNB Smart Chain.",
    speed: "Высокая",
    fee: "Обычно ниже",
    address: "Формат 0x…",
    note: "Адрес может выглядеть как ERC20, поэтому обязательно сверяйте именно выбранную сеть.",
  },
  BTC: {
    symbol: "₿",
    chain: "BITCOIN",
    title: "Отдельная оплата в BTC",
    description: "Маршрут для расчетов в Bitcoin. BTC здесь является отдельным активом, а не сетью USDT.",
    speed: "По подтверждениям",
    fee: "Зависит от сети",
    address: "bc1 / 1 / 3",
    note: "Не отправляйте USDT на Bitcoin-адрес: актив и сеть должны совпадать.",
  },
};

const packageFeatures = [
  "проверка сети и адреса",
  "поддержка 24/7",
  "сопровождение операции",
  "совместимость с кошельками",
];

const networkPackages = {
  TRC20: {
    title: "TRC20 — пакеты сети",
    description:
      "Выберите пакет сопровождения для операций в сети TRON. Цены настроены под быстрые переводы USDT и проверку реквизитов перед отправкой.",
    cards: [
      {
        name: "100K FLASH",
        price: "$365.00",
        copy: "Пакет FLASH для сопровождения операций в сети TRC20.",
        popular: true,
      },
      {
        name: "150K FLASH",
        price: "$525.00",
        copy: "Расширенный пакет FLASH с проверкой сети и реквизитов.",
      },
      {
        name: "200K FLASH",
        price: "$675.00",
        copy: "Пакет FLASH для аккуратной подготовки маршрута операции.",
      },
      {
        name: "400K FLASH",
        price: "$1,240.00",
        copy: "Премиальный пакет FLASH для работы с крупным сценарием.",
      },
      {
        name: "600K FLASH",
        price: "$1,790.00",
        copy: "Пакет FLASH с расширенной проверкой биржи, кошелька и сети.",
      },
      {
        name: "800K FLASH",
        price: "$2,340.00",
        copy: "Пакет FLASH для полного сопровождения операции в TRC20.",
      },
      {
        name: "1M FLASH",
        price: "$2,890.00",
        copy: "Максимальный пакет FLASH с полной проверкой маршрута.",
      },
    ],
  },
  ERC20: {
    title: "ERC20 — пакеты сети",
    description:
      "Пакеты для Ethereum-сети с акцентом на совместимость кошельков, комиссии газа и аккуратную проверку реквизитов.",
    cards: [
      {
        name: "1K FLASH",
        price: "$360.00",
        copy: "Пакет FLASH для сопровождения операций в сети ERC20.",
        popular: true,
      },
      {
        name: "10K FLASH",
        price: "$590.00",
        copy: "Расширенный пакет FLASH с проверкой газа, сети и адреса.",
      },
      {
        name: "20K FLASH",
        price: "$860.00",
        copy: "Пакет FLASH для подготовки перевода через ERC20.",
      },
      {
        name: "50K FLASH",
        price: "$3,430.00",
        copy: "Премиальный пакет FLASH для крупного сценария ERC20.",
      },
      {
        name: "100K FLASH",
        price: "$4,590.00",
        copy: "Пакет FLASH с расширенной проверкой лимитов и подтверждений.",
      },
      {
        name: "500K FLASH",
        price: "$14,590.00",
        copy: "Пакет FLASH для полного сопровождения операции в ERC20.",
      },
      {
        name: "1M FLASH",
        price: "$22,590.00",
        copy: "Максимальный пакет FLASH с полной проверкой маршрута.",
      },
    ],
  },
  BEP20: {
    title: "BEP20 — пакеты сети",
    description:
      "Пакеты для BNB Smart Chain: подбор маршрута, проверка BEP20-адреса и контроль сетевой совместимости.",
    cards: [
      {
        name: "1K FLASH",
        price: "$360.00",
        copy: "Пакет FLASH для сопровождения операций в сети BEP20.",
        popular: true,
      },
      {
        name: "10K FLASH",
        price: "$590.00",
        copy: "Расширенный пакет FLASH с проверкой сети и реквизитов.",
      },
      {
        name: "20K FLASH",
        price: "$860.00",
        copy: "Пакет FLASH для подготовки перевода через BEP20.",
      },
      {
        name: "50K FLASH",
        price: "$3,430.00",
        copy: "Премиальный пакет FLASH для крупного сценария BEP20.",
      },
      {
        name: "100K FLASH",
        price: "$4,590.00",
        copy: "Пакет FLASH с расширенной проверкой лимитов и подтверждений.",
      },
      {
        name: "500K FLASH",
        price: "$14,590.00",
        copy: "Пакет FLASH для полного сопровождения операции в BEP20.",
      },
      {
        name: "1M FLASH",
        price: "$22,590.00",
        copy: "Максимальный пакет FLASH с полной проверкой маршрута.",
      },
    ],
  },
  BTC: {
    title: "BTC — пакеты сети",
    description:
      "Пакеты для операций в сети Bitcoin: проверка адресов, комиссий, подтверждений и понятного маршрута покупки.",
    cards: [
      {
        name: "1K FLASH",
        price: "$555.00",
        copy: "Пакет FLASH для сопровождения операций в сети BTC.",
        popular: true,
      },
      {
        name: "2K FLASH",
        price: "$980.00",
        copy: "Расширенный пакет FLASH с проверкой сети и комиссии.",
      },
      {
        name: "5K FLASH",
        price: "$2,090.00",
        copy: "Премиальный пакет FLASH для крупного сценария BTC.",
      },
      {
        name: "10K FLASH",
        price: "$3,790.00",
        copy: "Максимальный пакет FLASH с полной проверкой маршрута.",
      },
    ],
  },
};

const networkIcons = {
  TRC20: "₮",
  ERC20: "◆",
  BEP20: "⬡",
  BTC: "₿",
};

const paymentWallets = {
  TRC20: "TPfsEVFB6z3hDqssdD6mjN46Ko6JXTXgiz",
  ERC20: "",
  BEP20: "",
  BTC: "",
};

function normalizeNetwork(networkName) {
  const normalized = String(networkName || "TRC20").toUpperCase();
  return networkPackages[normalized] ? normalized : "TRC20";
}

function getInitialNetwork() {
  return normalizeNetwork(pageParams.get("network"));
}

function getInitialPackageIndex(networkName) {
  const selected = networkPackages[networkName] || networkPackages.TRC20;
  const rawIndex = Number(pageParams.get("package") || 0);

  if (!Number.isInteger(rawIndex) || rawIndex < 0 || rawIndex >= selected.cards.length) {
    return 0;
  }

  return rawIndex;
}

function getCheckoutUrl(networkName, packageIndex) {
  return `checkout.html?network=${encodeURIComponent(networkName)}&package=${encodeURIComponent(
    packageIndex
  )}`;
}

const initialNetwork = getInitialNetwork();
const initialPackageIndex = getInitialPackageIndex(initialNetwork);

let selectedOrder = {
  network: initialNetwork,
  package: networkPackages[initialNetwork].cards[initialPackageIndex],
};
let activeOrderKey = "";
let revealObserver = null;
let revealRefreshFrame = 0;

function initSiteIntro() {
  if (!siteIntro) {
    return;
  }

  siteIntro.classList.remove("intro-cosmos-v4");
  siteIntro.classList.add("intro-cosmos-v8");
  siteIntro.innerHTML = `
    <canvas class="intro-v8-stars" aria-hidden="true"></canvas>
    <div class="intro-v8-nebula" aria-hidden="true"></div>
    <div class="intro-v8-horizon" aria-hidden="true"></div>
    <div class="intro-v8-stage">
      <div class="intro-v8-orbit-system" aria-hidden="true">
        <span class="intro-v8-ring ring-outer"></span>
        <span class="intro-v8-ring ring-mid"></span>
        <span class="intro-v8-ring ring-inner"></span>
        <i class="intro-v8-satellite satellite-trc">TRC20</i>
        <i class="intro-v8-satellite satellite-erc">ERC20</i>
        <i class="intro-v8-satellite satellite-bep">BEP20</i>
        <i class="intro-v8-satellite satellite-btc">BTC</i>
      </div>
      <div class="intro-v8-coin" aria-hidden="true">
        <span class="intro-v8-coin-shadow"></span>
        <span class="intro-v8-coin-edge"></span>
        <span class="intro-v8-coin-face">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <path d="M60 112c28.72 0 52-23.28 52-52S88.72 8 60 8 8 31.28 8 60s23.28 52 52 52Z" />
            <path d="M30 29h60c4.24 0 7.68 3.44 7.68 7.68S94.24 44.36 90 44.36H67.72v10.78c20.78 1.38 35.74 7.16 35.74 14.02 0 7.96-19.46 14.42-43.46 14.42S16.54 77.12 16.54 69.16c0-6.86 14.96-12.64 35.74-14.02V44.36H30c-4.24 0-7.68-3.44-7.68-7.68S25.76 29 30 29Zm30 33.18c-18.64 0-31.7 3.82-31.7 6.62 0 2.78 13.06 6.6 31.7 6.6s31.7-3.82 31.7-6.6c0-2.8-13.06-6.62-31.7-6.62Zm0 8.74c5.26 0 10.16-.34 14.52-.94V62.7c-4.4-.52-9.3-.8-14.52-.8s-10.12.28-14.52.8v7.28c4.36.6 9.26.94 14.52.94Z" />
          </svg>
        </span>
        <span class="intro-v8-coin-glass"></span>
        <span class="intro-v8-coin-flare"></span>
      </div>
      <div class="intro-v8-lockup">
        <small>SECURE USDT ROUTE</small>
        <p><span>CryptoFlash</span><b>USDT</b></p>
        <em><i></i>NETWORKS SYNCHRONIZED</em>
      </div>
    </div>
    <div class="intro-v8-progress" aria-hidden="true">
      <span>ИНИЦИАЛИЗАЦИЯ ЗАЩИЩЕННОГО МАРШРУТА</span>
      <i><b></b></i>
    </div>
    <div class="intro-v8-meta" aria-hidden="true">
      <span>TRON · ETHEREUM · BNB CHAIN · BITCOIN</span><span>CRYPTOFLASHUSDT / 2026</span>
    </div>`;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    siteIntro.replaceChildren();
    siteIntro.classList.add("is-skip");
    document.body.classList.add("intro-skip");
    return;
  }

  document.body.classList.add("intro-playing");
  let isFinished = false;
  let introStarsBursting = false;
  const introStarsCanvas = siteIntro.querySelector(".intro-v8-stars");
  const introStarsContext = introStarsCanvas?.getContext("2d", { alpha: true });
  const compactIntro = window.matchMedia("(max-width: 760px)").matches;
  let introStars = [];
  let introStarsWidth = 0;
  let introStarsHeight = 0;
  let introStarsLastFrame = 0;

  const resizeIntroStars = () => {
    if (!introStarsCanvas || !introStarsContext) {
      return;
    }

    introStarsWidth = window.innerWidth;
    introStarsHeight = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, compactIntro ? 1 : 1.5);
    introStarsCanvas.width = Math.max(1, Math.floor(introStarsWidth * ratio));
    introStarsCanvas.height = Math.max(1, Math.floor(introStarsHeight * ratio));
    introStarsCanvas.style.width = `${introStarsWidth}px`;
    introStarsCanvas.style.height = `${introStarsHeight}px`;
    introStarsContext.setTransform(ratio, 0, 0, ratio, 0, 0);

    const starCount = compactIntro ? (lowCoreDevice ? 150 : 210) : 540;
    introStars = Array.from({ length: starCount }, (_, index) => ({
      x: Math.random() * introStarsWidth,
      y: Math.random() * introStarsHeight,
      size: index % 41 === 0 ? 1.55 + Math.random() * 0.9 : 0.28 + Math.random() * 0.92,
      alpha: 0.2 + Math.random() * 0.78,
      phase: Math.random() * Math.PI * 2,
      speed: 0.55 + Math.random() * 1.9,
      drift: 0.004 + Math.random() * 0.018,
      tint: index % 17 === 0 ? "mint" : index % 23 === 0 ? "blue" : "white",
      velocityX: 0,
      velocityY: 0,
    }));
  };

  const drawIntroStars = (timestamp = 0) => {
    if (!introStarsContext || !introStarsCanvas?.isConnected) {
      return;
    }

    if (timestamp - introStarsLastFrame < (compactIntro ? 34 : 24)) {
      requestAnimationFrame(drawIntroStars);
      return;
    }

    const deltaTime = Math.min(42, Math.max(1, timestamp - introStarsLastFrame));
    introStarsLastFrame = timestamp;
    introStarsContext.clearRect(0, 0, introStarsWidth, introStarsHeight);
    introStarsContext.save();
    introStarsContext.globalCompositeOperation = compactIntro ? "source-over" : "lighter";

    introStars.forEach((star, index) => {
      if (introStarsBursting) {
        star.x += star.velocityX * deltaTime;
        star.y += star.velocityY * deltaTime;
        star.alpha *= 0.972;
      } else {
        star.x += Math.cos(star.phase + timestamp * 0.00018) * star.drift * deltaTime;
        star.y += Math.sin(star.phase + timestamp * 0.00016) * star.drift * deltaTime;

        if (
          star.x < -12 ||
          star.x > introStarsWidth + 12 ||
          star.y < -12 ||
          star.y > introStarsHeight + 12
        ) {
          star.x = Math.random() * introStarsWidth;
          star.y = Math.random() * introStarsHeight;
        }
      }

      const twinkle = 0.68 + Math.sin(timestamp * 0.001 * star.speed + star.phase) * 0.32;
      const alpha = Math.max(0, star.alpha * twinkle);
      introStarsContext.beginPath();
      introStarsContext.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      introStarsContext.fillStyle = star.tint === "mint"
        ? `rgba(201, 255, 226, ${alpha.toFixed(3)})`
        : star.tint === "blue"
          ? `rgba(208, 224, 255, ${alpha.toFixed(3)})`
          : `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      introStarsContext.fill();

      if (index % (compactIntro ? 58 : 41) === 0) {
        introStarsContext.beginPath();
        introStarsContext.moveTo(star.x - 5, star.y);
        introStarsContext.lineTo(star.x + 5, star.y);
        introStarsContext.moveTo(star.x, star.y - 5);
        introStarsContext.lineTo(star.x, star.y + 5);
        introStarsContext.strokeStyle = `rgba(255, 255, 255, ${(alpha * 0.36).toFixed(3)})`;
        introStarsContext.lineWidth = 0.5;
        introStarsContext.stroke();
      }
    });

    introStarsContext.restore();
    requestAnimationFrame(drawIntroStars);
  };

  resizeIntroStars();
  drawIntroStars();
  window.addEventListener("resize", resizeIntroStars, { passive: true });

  const finishIntro = () => {
    if (isFinished) {
      return;
    }

    isFinished = true;
    introStarsBursting = true;
    introStars.forEach((star, index) => {
      const dx = star.x - introStarsWidth / 2;
      const dy = star.y - introStarsHeight / 2;
      const distance = Math.hypot(dx, dy) || 1;
      const speed = 0.16 + ((index * 29) % 100) / 340;
      star.velocityX = (dx / distance) * speed;
      star.velocityY = (dy / distance) * speed;
    });

    if (introStarsCanvas) {
      introStarsCanvas.classList.add("intro-stars-handoff", "intro-v8-stars-handoff");
      document.body.insertBefore(introStarsCanvas, siteIntro);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => introStarsCanvas.classList.add("is-fading"));
      });
    }

    if (typeof window.__triggerIntroStarBurst === "function") {
      window.__triggerIntroStarBurst();
    }
    document.body.classList.add("intro-exiting");
    document.body.classList.remove("intro-playing");
    requestAnimationFrame(() => siteIntro.classList.add("is-complete"));

    window.setTimeout(() => {
      window.removeEventListener("resize", resizeIntroStars);
      introStarsCanvas?.remove();
      siteIntro.remove();
      document.body.classList.remove("intro-exiting");
      document.body.classList.add("intro-finished");
    }, 1100);
  };

  if (document.readyState === "complete") {
    window.setTimeout(finishIntro, 3350);
  } else {
    window.addEventListener("load", () => window.setTimeout(finishIntro, 3350), { once: true });
  }

  window.setTimeout(finishIntro, 5600);
}

function getOrderStorageKey(networkName, card) {
  const packageKey = card.name.replace(/[^a-z0-9]/gi, "").toUpperCase();
  return `cryptoflashusdt-order-${networkName}-${packageKey}`;
}

function makeOrderId(networkName) {
  const stamp = Date.now().toString(36).toUpperCase();
  return `CFU-${networkName}-${stamp}`;
}

function readOrderRecord(key) {
  try {
    const record = localStorage.getItem(key);
    return record ? JSON.parse(record) : null;
  } catch (error) {
    return null;
  }
}

function saveOrderRecord(key, record) {
  try {
    localStorage.setItem(key, JSON.stringify(record));
  } catch (error) {
    return false;
  }

  return true;
}

function getOrCreateOrderRecord(networkName, card) {
  const key = getOrderStorageKey(networkName, card);
  const existingRecord = readOrderRecord(key);

  if (existingRecord) {
    activeOrderKey = key;
    return existingRecord;
  }

  const record = {
    id: makeOrderId(networkName),
    network: networkName,
    package: card.name,
    price: card.price,
    status: "Ожидает оплату",
    txid: "",
    receiptName: "",
  };

  activeOrderKey = key;
  saveOrderRecord(key, record);
  return record;
}

function updateOrderStatus(record) {
  if (orderId) {
    orderId.textContent = record.id;
  }

  if (orderStatus) {
    orderStatus.textContent = record.status;
    orderStatus.classList.toggle("is-review", record.status === "На проверке");
  }

  orderProgressSteps.forEach((step, index) => {
    const activeSteps = record.status === "На проверке" ? 4 : 2;
    step.classList.toggle("is-active", index < activeSteps);
  });

  if (transactionId) {
    transactionId.value = record.txid || "";
  }

  if (receiptFile) {
    receiptFile.textContent = record.receiptName || "Прикрепить чек или скрин оплаты";
  }

  if (proofMessage) {
    proofMessage.textContent =
      record.status === "На проверке"
        ? "Подтверждение добавлено. Заказ ожидает ручной проверки."
        : "";
  }

  if (paymentPanel && record.status === "На проверке") {
    paymentPanel.hidden = false;
    queueRevealRefresh();
  }
}

function renderPackages(networkName) {
  const currentNetwork = normalizeNetwork(networkName);
  const selected = networkPackages[currentNetwork];

  updateNetworkPassport(currentNetwork);

  if (!packagesSection || !packagesTitle || !packagesDescription || !packageGrid) {
    return;
  }

  packagesSection.dataset.network = currentNetwork;
  packagesTitle.textContent = selected.title;
  packagesDescription.textContent = selected.description;

  packageGrid.innerHTML = selected.cards
    .map(
      (card, index) => `
        <article class="package-card" data-network="${currentNetwork}" data-index="${index}">
          <div class="package-topline">
            <span class="package-network">${currentNetwork}</span>
            ${card.popular ? '<span class="popular-pill">★ Популярно</span>' : ""}
          </div>
          <div class="package-orbital" aria-hidden="true"><span></span><i></i></div>
          <h3>${card.name}</h3>
          <p class="package-value">${card.price}</p>
          <p class="package-copy">${card.copy}</p>
          <div class="package-meta" aria-label="Особенности пакета">
            <span>Проверка сети</span>
            <span>TXID</span>
          </div>
          <ul>
            ${packageFeatures.map((feature) => `<li>${feature}</li>`).join("")}
          </ul>
          <button class="package-button" type="button" data-network="${currentNetwork}" data-index="${index}">
            Выбрать пакет
          </button>
        </article>
      `
    )
    .join("");

  networkCards.forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.network === currentNetwork);
  });

  networkTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.networkTab === currentNetwork);
  });

  initCardTilt();
  initLuxurySpotlight();
  window.__refreshKineticItems?.();
  queueRevealRefresh();
}

function setCheckoutOrder(networkName, card, options = {}) {
  const currentNetwork = normalizeNetwork(networkName);
  const selectedCard = card || networkPackages[currentNetwork].cards[0];
  const { shouldScroll = true, shouldUpdateHash = true } = options;

  selectedOrder = { network: currentNetwork, package: selectedCard };
  updateNetworkPassport(currentNetwork);

  if (!checkoutSection || !checkoutProduct || !checkoutPackage || !checkoutNetwork || !checkoutPrice) {
    return;
  }

  checkoutSection.hidden = false;
  checkoutSection.dataset.network = currentNetwork;
  checkoutProduct.textContent = selectedCard.name;
  checkoutPackage.textContent = selectedCard.name;
  checkoutNetwork.textContent = currentNetwork;
  checkoutPrice.textContent = selectedCard.price;

  if (checkoutNetworkLabel) {
    checkoutNetworkLabel.textContent = `${currentNetwork} сеть`;
  }

  if (checkoutIcon) {
    checkoutIcon.textContent = networkIcons[currentNetwork] || "₮";
  }

  if (walletHelper) {
    walletHelper.textContent = `Укажите адрес кошелька ${currentNetwork}, который будет связан с вашим заказом.`;
  }

  if (customerWallet) {
    customerWallet.placeholder = `Введите адрес ${currentNetwork} кошелька`;
  }

  if (paymentPanel) {
    paymentPanel.hidden = true;
    paymentPanel.classList.remove("is-open");
  }

  if (checkoutSection) {
    checkoutSection.classList.remove("payment-active");
  }

  if (checkoutMessage) {
    checkoutMessage.textContent = "";
  }

  if (paymentNetwork) {
    paymentNetwork.textContent = currentNetwork;
  }

  if (paymentWallet) {
    const walletAddress = paymentWallets[currentNetwork];
    paymentWallet.textContent = walletAddress || "Адрес оплаты для этой сети будет добавлен отдельно.";
  }

  if (copyWallet) {
    copyWallet.disabled = !paymentWallets[currentNetwork];
    copyWallet.textContent = paymentWallets[currentNetwork] ? "Скопировать" : "Ожидает адрес";
  }

  if (paymentAmount) {
    paymentAmount.textContent = selectedCard.price;
  }

  if (checkoutProductsLink) {
    checkoutProductsLink.href = `products.html?network=${currentNetwork}`;
  }

  if (checkoutBackLink) {
    checkoutBackLink.href = `products.html?network=${currentNetwork}`;
  }

  updateOrderStatus(getOrCreateOrderRecord(currentNetwork, selectedCard));

  if (shouldScroll) {
    checkoutSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (shouldUpdateHash) {
    history.replaceState(null, "", "#checkout");
  }

  updateActiveNav();
  queueRevealRefresh();
}

function showPaymentStep() {
  const walletValue = customerWallet ? customerWallet.value.trim() : "";

  if (!walletValue) {
    if (checkoutMessage) {
      checkoutMessage.textContent = "Введите адрес кошелька перед продолжением.";
    }
    return;
  }

  if (paymentPanel) {
    paymentPanel.hidden = false;
    paymentPanel.classList.remove("is-open");
    requestAnimationFrame(() => {
      paymentPanel.classList.add("is-open");
      queueRevealRefresh();
    });
  }

  if (checkoutSection) {
    checkoutSection.classList.add("payment-active");
  }

  if (checkoutMessage) {
    checkoutMessage.textContent = "Адрес добавлен. Проверьте данные оплаты ниже.";
  }
}

function updateNetworkAdvisor(networkName) {
  const currentNetwork = normalizeNetwork(networkName);
  const data = networkAdvisorData[currentNetwork];

  if (!networkAdvisor || !data) {
    return;
  }

  networkAdvisor.dataset.activeNetwork = currentNetwork;

  if (advisorSymbol) advisorSymbol.textContent = data.symbol;
  if (advisorChain) advisorChain.textContent = data.chain;
  if (advisorTitle) advisorTitle.textContent = data.title;
  if (advisorDescription) advisorDescription.textContent = data.description;
  if (advisorSpeed) advisorSpeed.textContent = data.speed;
  if (advisorFee) advisorFee.textContent = data.fee;
  if (advisorAddress) advisorAddress.textContent = data.address;
  if (advisorNote) advisorNote.textContent = data.note;

  if (advisorAction) {
    advisorAction.href = `products.html?network=${currentNetwork}`;
    advisorAction.setAttribute("aria-label", `Открыть пакеты ${currentNetwork}`);
  }

  networkAdvisorTabs.forEach((tab) => {
    const isActive = tab.dataset.advisorNetwork === currentNetwork;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  updateNetworkPassport(currentNetwork);

  networkAdvisor.classList.remove("is-updating");
  requestAnimationFrame(() => networkAdvisor.classList.add("is-updating"));
}

function initNetworkAdvisor() {
  if (!networkAdvisor || !networkAdvisorTabs.length) {
    return;
  }

  networkAdvisorTabs.forEach((tab) => {
    tab.addEventListener("click", () => updateNetworkAdvisor(tab.dataset.advisorNetwork));
  });

  updateNetworkAdvisor(networkAdvisor.dataset.activeNetwork || "TRC20");
}

function initNetworkPassport() {
  if (document.body.dataset.page !== "home" || document.querySelector(".network-passport")) {
    return;
  }

  networkPassport = document.createElement("aside");
  networkPassport.className = "network-passport";
  networkPassport.dataset.network = "TRC20";
  networkPassport.setAttribute("aria-live", "polite");
  networkPassport.innerHTML = `
    <span class="passport-token" aria-hidden="true">₮</span>
    <span class="passport-copy">
      <small>Network Passport</small>
      <strong><span>TRC20</span><i>TRON</i></strong>
      <span class="passport-phase">Этап 01 · Инициализация</span>
    </span>
    <a class="passport-action" href="products.html?network=TRC20" aria-label="Открыть пакеты TRC20">↗</a>
    <span class="passport-progress" aria-hidden="true"><span></span></span>
  `;

  document.body.append(networkPassport);
  passportNetwork = networkPassport.querySelector(".passport-copy strong span");
  passportChain = networkPassport.querySelector(".passport-copy strong i");
  passportSymbol = networkPassport.querySelector(".passport-token");
  passportPhase = networkPassport.querySelector(".passport-phase");
  passportAction = networkPassport.querySelector(".passport-action");
  updateNetworkPassport(networkAdvisor?.dataset.activeNetwork || "TRC20");
}

function updateNetworkPassport(networkName) {
  const normalizedNetwork = networkAdvisorData[networkName] ? networkName : "TRC20";
  const data = networkAdvisorData[normalizedNetwork];

  if (networkPassport) {
    networkPassport.dataset.network = normalizedNetwork;
    if (passportNetwork) passportNetwork.textContent = normalizedNetwork;
    if (passportChain) passportChain.textContent = data.chain;
    if (passportSymbol) passportSymbol.textContent = data.symbol;
    if (passportAction) {
      passportAction.href = `products.html?network=${normalizedNetwork}`;
      passportAction.setAttribute("aria-label", `Открыть пакеты ${normalizedNetwork}`);
    }
  }

  if (scrollBeacon) {
    scrollBeacon.dataset.network = normalizedNetwork;
    if (scrollBeaconSymbol) scrollBeaconSymbol.textContent = data.symbol;
  }
}

function initScrollBeacon() {
  if (document.querySelector(".scroll-beacon")) {
    return;
  }

  const initialNetwork = normalizeNetwork(
    pageParams.get("network") || networkAdvisor?.dataset.activeNetwork || "TRC20"
  );
  const initialData = networkAdvisorData[initialNetwork];

  scrollBeacon = document.createElement("div");
  scrollBeacon.className = "scroll-beacon";
  scrollBeacon.dataset.network = initialNetwork;
  scrollBeacon.setAttribute("aria-hidden", "true");
  scrollBeacon.innerHTML = `
    <span class="beacon-aura"></span>
    <span class="beacon-shell">
      <span class="beacon-orbit orbit-a"></span>
      <span class="beacon-orbit orbit-b"></span>
      <span class="beacon-orbit orbit-c"></span>
      <i class="beacon-particle particle-a"></i>
      <i class="beacon-particle particle-b"></i>
      <i class="beacon-particle particle-c"></i>
      <span class="beacon-core"><b>${initialData.symbol}</b><i></i></span>
    </span>
    <span class="beacon-readout"><small>SCROLL</small><strong>00</strong><i>%</i></span>
  `;

  document.body.append(scrollBeacon);
  scrollBeaconPercent = scrollBeacon.querySelector(".beacon-readout strong");
  scrollBeaconSymbol = scrollBeacon.querySelector(".beacon-core b");
}

function initRevealEffects() {
  const revealSelectors = [
    ".hero .eyebrow",
    ".hero-signal",
    ".hero h1",
    ".hero-lead",
    ".hero-actions",
    ".mobile-quick-pass",
    ".hero-ledger",
    ".hero-scroll-cue",
    ".hero-premium-panel",
    ".luxury-ribbon",
    ".trust-strip",
    ".section-heading",
    ".network-advisor",
    ".network-card",
    ".feature-band",
    ".step",
    ".wallet-compat-card",
    ".faq-list details",
    ".faq-more",
    ".faq-cta",
    ".page-hero-inner",
    ".breadcrumbs",
    ".back-link",
    ".packages-heading",
    ".package-card",
    ".checkout-card",
    ".payment-panel",
    ".guide-hero-inner",
    ".guide-video-shell",
    ".guide-visual-card",
    ".guide-card",
    ".guide-step",
    ".guide-warning",
    ".guide-checklist",
    ".footer-inner",
  ];
  const revealItems = Array.from(document.querySelectorAll(revealSelectors.join(",")));

  if (!revealItems.length) {
    return;
  }

  const pendingRevealItems = [];

  const revealDelayStep = compactViewport.matches ? 34 : 74;
  const networkDelayStep = compactViewport.matches ? 52 : 118;
  const processDelayStep = compactViewport.matches ? 68 : 155;
  const walletDelayStep = compactViewport.matches ? 42 : 92;
  const faqDelayStep = compactViewport.matches ? 54 : 118;

  revealItems.forEach((item, index) => {
    if (!item.classList.contains("reveal")) {
      item.classList.add("reveal");
      item.style.setProperty("--reveal-delay", `${Math.min(index % 10, 9) * revealDelayStep}ms`);
    }

    if (!item.classList.contains("is-visible")) {
      pendingRevealItems.push(item);
    }
  });

  document.querySelectorAll(".network-grid .network-card").forEach((item, index) => {
    item.style.setProperty("--network-reveal-delay", `${index * networkDelayStep}ms`);
  });

  document.querySelectorAll("#process .step").forEach((item, index) => {
    item.style.setProperty("--section-reveal-delay", `${index * processDelayStep}ms`);
  });

  document.querySelectorAll("#wallets .wallet-compat-card").forEach((item, index) => {
    item.style.setProperty("--section-reveal-delay", `${index * walletDelayStep}ms`);
  });

  const faqRows = document.querySelectorAll("#faq .faq-list details");

  document.querySelectorAll("#process .section-heading, #wallets .section-heading, #faq .section-heading").forEach(
    (item) => {
      item.style.setProperty("--section-reveal-delay", "0ms");
    }
  );

  faqRows.forEach((item, index) => {
    item.style.setProperty("--section-reveal-delay", `${index * faqDelayStep}ms`);
  });

  const faqMore = document.querySelector("#faq .faq-more");
  if (faqMore) {
    faqMore.style.setProperty("--section-reveal-delay", `${faqRows.length * faqDelayStep + 64}ms`);
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -18px 0px",
        threshold: 0.04,
      }
    );
  }

  requestAnimationFrame(() => {
    pendingRevealItems.forEach((item) => revealObserver.observe(item));
  });
}

function queueRevealRefresh() {
  if (revealRefreshFrame) {
    cancelAnimationFrame(revealRefreshFrame);
  }

  revealRefreshFrame = requestAnimationFrame(() => {
    revealRefreshFrame = 0;
    initRevealEffects();
  });
}

function initRevealMutationObserver() {
  if (!("MutationObserver" in window) || document.body.dataset.revealObserverReady === "true") {
    return;
  }

  document.body.dataset.revealObserverReady = "true";

  const dynamicRevealObserver = new MutationObserver((mutations) => {
    const hasNewElements = mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some((node) => node.nodeType === Node.ELEMENT_NODE)
    );

    if (hasNewElements) {
      queueRevealRefresh();
    }
  });

  dynamicRevealObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function initCardTilt() {
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!hasFinePointer || prefersReducedMotion) {
    return;
  }

  const tiltCards = document.querySelectorAll(
    ".network-advisor, .network-card, .package-card, .checkout-card, .order-ticket, .payment-address-box, .guide-video-shell, .guide-card, .guide-step, .guide-visual-card"
  );

  tiltCards.forEach((card) => {
    if (card.dataset.tiltReady === "true") {
      return;
    }

    card.dataset.tiltReady = "true";

    card.addEventListener(
      "pointermove",
      (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const rotateX = (-y * 5.5).toFixed(2);
        const rotateY = (x * 6.5).toFixed(2);

        card.style.setProperty("--tilt-x", `${rotateX}deg`);
        card.style.setProperty("--tilt-y", `${rotateY}deg`);
        card.style.setProperty("--tilt-rotate-x", `${rotateX}deg`);
        card.style.setProperty("--tilt-rotate-y", `${rotateY}deg`);
        card.style.setProperty("--tilt-glide-x", `${(x * 4).toFixed(2)}px`);
        card.style.setProperty("--tilt-glide-y", `${(y * 4).toFixed(2)}px`);
      },
      { passive: true }
    );

    card.addEventListener(
      "pointerleave",
      () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
        card.style.setProperty("--tilt-rotate-x", "0deg");
        card.style.setProperty("--tilt-rotate-y", "0deg");
        card.style.setProperty("--tilt-glide-x", "0px");
        card.style.setProperty("--tilt-glide-y", "0px");
      },
      { passive: true }
    );
  });
}

function initLuxurySpotlight() {
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (!hasFinePointer) {
    return;
  }

  const spotlightItems = document.querySelectorAll(
    ".hero-premium-panel, .network-advisor, .network-advisor-tab, .network-tab, .network-card, .package-card, .checkout-card, .order-ticket, .payment-address-box, .receipt-upload, .wallet-field, .guide-video-shell, .guide-card, .guide-step, .guide-visual-card, .guide-warning, .guide-checklist"
  );

  spotlightItems.forEach((item) => {
    if (item.dataset.spotlightReady === "true") {
      return;
    }

    item.dataset.spotlightReady = "true";

    item.addEventListener(
      "pointermove",
      (event) => {
        const rect = item.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        item.style.setProperty("--mouse-x", `${x.toFixed(1)}%`);
        item.style.setProperty("--mouse-y", `${y.toFixed(1)}%`);
      },
      { passive: true }
    );

    item.addEventListener(
      "pointerleave",
      () => {
        item.style.setProperty("--mouse-x", "50%");
        item.style.setProperty("--mouse-y", "50%");
      },
      { passive: true }
    );
  });
}

function initScrollCosmos() {
  if (document.querySelector(".scroll-cosmos")) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "scroll-cosmos";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const scrollFlare = document.createElement("div");
  scrollFlare.className = "scroll-flare";
  scrollFlare.setAttribute("aria-hidden", "true");
  document.body.prepend(scrollFlare);

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) {
    canvas.remove();
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compactScreen = window.matchMedia("(max-width: 760px)");
  const lowPowerCanvas = compactScreen.matches || lowCoreDevice;
  const colors = [
    [255, 255, 255],
    [232, 238, 235],
    [205, 214, 209],
    [255, 255, 255],
  ];
  const renderStarLines = false;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let nodes = [];
  let galaxyDust = [];
  let targetScroll = window.scrollY;
  let smoothScroll = targetScroll;
  let scrollVelocity = 0;
  let scrollEnergy = 0;
  let lastFrame = 0;
  let lastBurstFrame = -1000;
  let lastScatterFrame = -1000;
  let lastDomMotionFrame = 0;
  let lastEnergyStyleFrame = 0;
  let documentIsHidden = document.hidden;
  let resizeFrame = 0;
  let resizeTimer = 0;
  let lastResizeWidth = window.innerWidth;
  let firstScatter = true;
  let bursts = [];
  let shootingStars = [];
  const scrollLayers = Array.from(
    document.querySelectorAll(
      ".hero-copy, .hero-premium-panel, .section-heading, .packages-heading, .page-hero-inner, .guide-hero-copy, .guide-video-shell, .guide-visual-card, .feature-band, .faq-cta"
    )
  );
  let kineticItems = [];

  if (!compactScreen.matches) {
    scrollLayers.forEach((layer) => layer.classList.add("scroll-layer"));
  }

  function refreshKineticItems() {
    if (compactScreen.matches) {
      kineticItems = [];
      return;
    }

    const kineticSelector = ".network-card, .package-card, .wallet-compat-card, .step, .faq-list details, .guide-step, .guide-card, .checkout-card";

    kineticItems = Array.from(
      document.querySelectorAll(kineticSelector)
    );
    kineticItems.forEach((item, index) => {
      item.classList.add("kinetic-item");
      item.style.setProperty("--kinetic-direction", index % 2 === 0 ? "-1" : "1");
    });
  }

  refreshKineticItems();
  window.__refreshKineticItems = refreshKineticItems;

  function resetNode(node, placeFar = true) {
    node.worldX = (Math.random() - 0.5) * width * 1.45;
    node.worldY = (Math.random() - 0.5) * height * 1.45;
    node.z = placeFar ? 0.72 + Math.random() * 0.82 : 0.16 + Math.random() * 1.3;
    node.phase = Math.random() * Math.PI * 2;
    node.size = 0.32 + Math.random() * 0.72;
    node.twinkle = 0.38 + Math.random() * 0.92;
    node.velocityX = 0;
    node.velocityY = 0;
    node.drawX = width / 2;
    node.drawY = height / 2;
  }

  function buildNodes() {
    const nodeCount = compactScreen.matches ? (lowCoreDevice ? 72 : 96) : lowPowerCanvas ? 160 : 230;
    nodes = Array.from({ length: nodeCount }, (_, index) => {
      const node = {
        bright: index % 17 === 0,
        color: colors[index % colors.length],
      };
      resetNode(node, false);
      return node;
    });
  }

  function buildGalaxyDust() {
    const dustCount = compactScreen.matches ? (lowCoreDevice ? 18 : 28) : lowPowerCanvas ? 110 : 220;
    galaxyDust = Array.from({ length: dustCount }, (_, index) => {
      const x = Math.random();
      const scatter = (Math.random() + Math.random() + Math.random() - 1.5) * 0.22;
      return {
        x,
        y: 0.2 + x * 0.48 + Math.sin(x * Math.PI * 2.4) * 0.045 + scatter,
        size: 0.18 + Math.random() * 0.52,
        alpha: 0.04 + Math.random() * 0.14,
        phase: Math.random() * Math.PI * 2,
        speed: 0.18 + Math.random() * 0.42,
        bright: index % 31 === 0,
      };
    });
  }

  function resizeCosmos() {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, compactScreen.matches ? 1 : lowPowerCanvas ? 1.2 : 1.35);
    canvas.width = Math.max(1, Math.floor(width * pixelRatio));
    canvas.height = Math.max(1, Math.floor(height * pixelRatio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    buildNodes();
    buildGalaxyDust();
  }

  function drawSignalPaths(time) {
    for (let index = 0; index < 4; index += 1) {
      const baseY = ((time * (8 + index * 2) + smoothScroll * (0.035 + index * 0.012)) %
        (height + 180)) - 90;
      const gradient = context.createLinearGradient(0, baseY, width, baseY + 34);
      gradient.addColorStop(0, "rgba(101, 243, 173, 0)");
      gradient.addColorStop(
        0.48,
        `rgba(${index % 2 ? "169, 148, 255" : "101, 243, 173"}, ${(
          0.055 +
          scrollEnergy * 0.11
        ).toFixed(3)})`
      );
      gradient.addColorStop(1, "rgba(101, 243, 173, 0)");
      context.beginPath();
      context.moveTo(-40, baseY);
      context.bezierCurveTo(
        width * 0.28,
        baseY - 52 + index * 11,
        width * 0.72,
        baseY + 54 - index * 8,
        width + 40,
        baseY + 8
      );
      context.strokeStyle = gradient;
      context.lineWidth = 0.65 + scrollEnergy * 1.15;
      context.stroke();
    }
  }

  function updateScrollLayers() {
    if (compactScreen.matches) {
      return;
    }

    const strength = compactScreen.matches ? 8 : 15;

    scrollLayers.forEach((layer) => {
      const rect = layer.getBoundingClientRect();

      if (rect.bottom < -120 || rect.top > height + 120) {
        return;
      }

      const layerCenter = rect.top + rect.height / 2;
      const distanceFromCenter = (layerCenter - height / 2) / Math.max(height, 1);
      const shift = Math.max(-strength, Math.min(strength, distanceFromCenter * -strength));
      layer.style.setProperty("--scroll-layer-shift", `${shift.toFixed(2)}px`);
    });
  }

  function updateKineticItems() {
    if (reducedMotion || compactScreen.matches) {
      return;
    }

    const sideDistance = compactScreen.matches ? 18 : 58;
    const verticalDistance = compactScreen.matches ? 18 : 42;

    kineticItems.forEach((item) => {
      const rect = item.getBoundingClientRect();

      if (rect.bottom < -160 || rect.top > height + 160) {
        return;
      }

      const entering = Math.max(0, Math.min(1, (height - rect.top) / (height * 0.42)));
      const exiting = Math.max(0, Math.min(1, rect.bottom / (height * 0.34)));
      const settled = Math.min(entering, exiting);
      const scatter = 1 - settled;
      const direction = Number(item.style.getPropertyValue("--kinetic-direction")) || 1;
      const movingDown = rect.top > height / 2;
      const x = scatter * sideDistance * direction;
      const y = scatter * verticalDistance * (movingDown ? 1 : -1);
      const rotation = scatter * direction * (compactScreen.matches ? 0.7 : 1.8);
      const scale = 0.965 + settled * 0.035;

      item.style.setProperty("--kinetic-x", `${x.toFixed(2)}px`);
      item.style.setProperty("--kinetic-y", `${y.toFixed(2)}px`);
      item.style.setProperty("--kinetic-rotate", `${rotation.toFixed(2)}deg`);
      item.style.setProperty("--kinetic-scale", scale.toFixed(3));
    });
  }

  function spawnScrollBurst(delta) {
    const burstGap = compactScreen.matches ? 290 : lowPowerCanvas ? 240 : 190;

    if (reducedMotion || Math.abs(delta) < 14 || lastFrame - lastBurstFrame < burstGap) {
      return;
    }

    lastBurstFrame = lastFrame;
    bursts.push({
      born: lastFrame,
      x: width * (0.18 + Math.random() * 0.64),
      y: delta > 0 ? height * 0.72 : height * 0.28,
      direction: delta > 0 ? 1 : -1,
      hue: bursts.length % 2,
    });
    bursts = bursts.slice(-5);

    const direction = delta > 0 ? -1 : 1;
    const shootingCount = lowPowerCanvas ? 1 : 2;
    for (let index = 0; index < shootingCount; index += 1) {
      shootingStars.push({
        born: lastFrame,
        x: width * (0.1 + Math.random() * 0.8),
        y: direction < 0 ? height * (0.62 + Math.random() * 0.32) : height * (0.06 + Math.random() * 0.3),
        velocityX: (Math.random() - 0.5) * (compactScreen.matches ? 90 : 180),
        velocityY: direction * (170 + Math.random() * (compactScreen.matches ? 110 : 220)),
        color: Math.random() > 0.72 ? [169, 148, 255] : [201, 255, 226],
      });
    }
    shootingStars = shootingStars.slice(-8);
  }

  function scatterStars(delta, timestamp) {
    const scatterGap = compactScreen.matches ? 92 : lowPowerCanvas ? 58 : 42;

    if (reducedMotion || Math.abs(delta) < 2 || timestamp - lastScatterFrame < scatterGap) {
      return;
    }

    lastScatterFrame = timestamp;
    const centerX = width / 2;
    const centerY = height * 0.48;
    const inputStrength = Math.min(1, Math.abs(delta) / (compactScreen.matches ? 42 : 68));
    const burstStrength = (firstScatter ? 2.25 : 0.72) * (0.45 + inputStrength * 0.9);
    firstScatter = false;

    const nodeStep = compactScreen.matches ? 3 : 1;
    for (let index = 0; index < nodes.length; index += nodeStep) {
      const node = nodes[index];
      const dx = node.drawX - centerX;
      const dy = node.drawY - centerY;
      const baseAngle = Math.atan2(dy, dx);
      const angle = baseAngle + Math.sin(node.phase + index * 0.73) * 0.34;
      const depth = node.visualDepth || 0.3;
      const variation = 0.62 + ((index * 37) % 100) / 92;
      const speed = burstStrength * variation * (0.58 + depth * 1.42);

      node.velocityX += Math.cos(angle) * speed;
      node.velocityY += Math.sin(angle) * speed;
    }
  }

  window.__triggerIntroStarBurst = () => {
    firstScatter = true;
    lastScatterFrame = -1000;
    scrollEnergy = Math.max(scrollEnergy, 0.92);
    scrollVelocity += compactScreen.matches ? 11 : 15;
    scatterStars(compactScreen.matches ? 78 : 110, performance.now());
  };

  function drawScrollBursts(timestamp) {
    bursts = bursts.filter((burst) => {
      const age = Math.max(0, (timestamp - burst.born) / 920);

      if (age >= 1) {
        return false;
      }

      const accent = burst.hue ? [169, 148, 255] : [101, 243, 173];
      const alpha = (1 - age) * (0.16 + scrollEnergy * 0.2);
      const radius = 18 + age * (compactScreen.matches ? 86 : 170);
      context.beginPath();
      context.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
      context.strokeStyle = `rgba(${accent.join(", ")}, ${alpha.toFixed(3)})`;
      context.lineWidth = 0.8 + scrollEnergy * 1.4;
      context.stroke();

      const rayCount = compactScreen.matches ? 8 : 12;
      for (let ray = 0; ray < rayCount; ray += 1) {
        const angle = (Math.PI * 2 * ray) / rayCount + burst.direction * age * 0.42;
        const inner = radius * 0.44;
        const outer = radius * (0.72 + (ray % 3) * 0.08);
        context.beginPath();
        context.moveTo(burst.x + Math.cos(angle) * inner, burst.y + Math.sin(angle) * inner);
        context.lineTo(burst.x + Math.cos(angle) * outer, burst.y + Math.sin(angle) * outer);
        context.strokeStyle = `rgba(${accent.join(", ")}, ${(alpha * 0.72).toFixed(3)})`;
        context.lineWidth = 0.55;
        context.stroke();
      }

      return true;
    });
  }

  function drawShootingStars(timestamp) {
    shootingStars = shootingStars.filter((star) => {
      const age = Math.max(0, (timestamp - star.born) / 1150);

      if (age >= 1) {
        return false;
      }

      const ease = age * (2 - age);
      const x = star.x + star.velocityX * ease;
      const y = star.y + star.velocityY * ease;
      const tailScale = compactScreen.matches ? 0.17 : 0.23;
      const tailX = x - star.velocityX * tailScale;
      const tailY = y - star.velocityY * tailScale;
      const [red, green, blue] = star.color;
      const gradient = context.createLinearGradient(tailX, tailY, x, y);
      gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 0)`);
      gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, ${(1 - age) * 0.72})`);
      context.beginPath();
      context.moveTo(tailX, tailY);
      context.lineTo(x, y);
      context.strokeStyle = gradient;
      context.lineWidth = 0.8 + (1 - age) * 1.15;
      context.stroke();
      context.beginPath();
      context.arc(x, y, 1.2 + (1 - age) * 0.8, 0, Math.PI * 2);
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${(1 - age) * 0.9})`;
      context.fill();

      return true;
    });
  }

  function drawGalaxyDust(time) {
    galaxyDust.forEach((dust) => {
      const parallaxX = Math.sin(time * dust.speed + dust.phase) * 2.4;
      const parallaxY = Math.cos(time * dust.speed * 0.72 + dust.phase) * 1.4;
      const x = dust.x * width + parallaxX;
      const y = dust.y * height + parallaxY;

      if (y < -20 || y > height + 20) {
        return;
      }

      const twinkle = 0.76 + Math.sin(time * dust.speed * 2 + dust.phase) * 0.24;
      const alpha = dust.alpha * twinkle;
      context.beginPath();
      context.arc(x, y, dust.size, 0, Math.PI * 2);
      context.fillStyle = `rgba(232, 241, 236, ${alpha.toFixed(3)})`;
      context.fill();

      if (dust.bright) {
        context.beginPath();
        context.moveTo(x - 3, y);
        context.lineTo(x + 3, y);
        context.moveTo(x, y - 3);
        context.lineTo(x, y + 3);
        context.strokeStyle = `rgba(255, 255, 255, ${(alpha * 0.6).toFixed(3)})`;
        context.lineWidth = 0.45;
        context.stroke();
      }
    });
  }

  function drawCosmos(timestamp = 0) {
    if (document.body.classList.contains("intro-playing")) {
      lastFrame = timestamp;
      if (!reducedMotion) {
        window.setTimeout(() => requestAnimationFrame(drawCosmos), compactScreen.matches ? 80 : 48);
      }
      return;
    }

    if (documentIsHidden) {
      lastFrame = timestamp;
      if (!reducedMotion) {
        window.setTimeout(() => requestAnimationFrame(drawCosmos), 320);
      }
      return;
    }

    const mobileIsScrolling = compactScreen.matches && document.body.classList.contains("mobile-scrolling");
    const frameGap = mobileIsScrolling ? 44 : compactScreen.matches ? 34 : lowPowerCanvas ? 30 : 24;

    if (timestamp - lastFrame < frameGap) {
      requestAnimationFrame(drawCosmos);
      return;
    }

    lastFrame = timestamp;
    const time = timestamp * 0.001;
    const scrollDifference = targetScroll - smoothScroll;
    smoothScroll += scrollDifference * 0.085;
    scrollVelocity = scrollVelocity * 0.86 + scrollDifference * 0.035;
    const targetEnergy = Math.min(1, Math.abs(scrollVelocity) / 17);
    scrollEnergy += (targetEnergy - scrollEnergy) * (targetEnergy > scrollEnergy ? 0.24 : 0.08);
    const energyStyleGap = compactScreen.matches ? 96 : 48;
    if (timestamp - lastEnergyStyleFrame > energyStyleGap) {
      lastEnergyStyleFrame = timestamp;
      document.documentElement.style.setProperty("--scroll-energy", scrollEnergy.toFixed(3));
      document.documentElement.style.setProperty(
        "--scroll-energy-scale",
        (1 + scrollEnergy * 0.24).toFixed(3)
      );
    }
    context.clearRect(0, 0, width, height);
    context.save();
    context.globalCompositeOperation = compactScreen.matches ? "source-over" : "lighter";

    if (renderStarLines) {
      drawSignalPaths(time);
    }

    drawGalaxyDust(time);

    const centerX = width * (0.5 + Math.sin(time * 0.11) * 0.008);
    const centerY = height * (0.47 + Math.cos(time * 0.09) * 0.006);
    const directionalVelocity = Math.max(-18, Math.min(18, scrollVelocity));
    const idleFlight = reducedMotion ? 0 : 0.00008;
    const scrollFlight = directionalVelocity * (compactScreen.matches ? 0.00042 : 0.00058);

    nodes.forEach((node) => {
      node.z -= idleFlight + scrollFlight;
      node.worldX += node.velocityX;
      node.worldY += node.velocityY;
      node.velocityX *= compactScreen.matches ? 0.9 : 0.92;
      node.velocityY *= compactScreen.matches ? 0.9 : 0.92;

      const radialDistance = Math.hypot(node.worldX, node.worldY) || 1;
      const radialDrift = scrollEnergy * (0.08 + (node.visualDepth || 0.25) * 0.36);
      node.worldX += (node.worldX / radialDistance) * radialDrift;
      node.worldY += (node.worldY / radialDistance) * radialDrift;

      if (node.z < 0.13) {
        resetNode(node, true);
      } else if (node.z > 1.72) {
        resetNode(node, false);
        node.z = 0.18;
      }

      const perspective = 0.94 / Math.max(node.z, 0.12);
      node.drawX = centerX + node.worldX * perspective;
      node.drawY = centerY + node.worldY * perspective;
      node.visualDepth = Math.max(0, Math.min(1, (1.55 - node.z) / 1.42));

      if (
        node.drawX < -100 ||
        node.drawX > width + 100 ||
        node.drawY < -100 ||
        node.drawY > height + 100
      ) {
        resetNode(node, true);
      }
    });

    if (renderStarLines) {
      const linkDistance = (compactScreen.matches ? 112 : 154) * (1 + scrollEnergy * 0.18);
      const linkStep = compactScreen.matches ? 4 : lowPowerCanvas ? 3 : 2;
      const maxLinks = compactScreen.matches ? 20 : lowPowerCanvas ? 46 : 84;
      let linkCount = 0;

      for (let first = 0; first < nodes.length && linkCount < maxLinks; first += linkStep) {
        for (let second = first + linkStep; second < nodes.length && linkCount < maxLinks; second += linkStep) {
          const nodeA = nodes[first];
          const nodeB = nodes[second];
          const dx = nodeA.drawX - nodeB.drawX;
          const dy = nodeA.drawY - nodeB.drawY;
          const distance = Math.hypot(dx, dy);

          if (distance >= linkDistance) {
            continue;
          }

          const opacity = (1 - distance / linkDistance) * (0.045 + scrollEnergy * 0.16);
          context.beginPath();
          context.moveTo(nodeA.drawX, nodeA.drawY);
          context.lineTo(nodeB.drawX, nodeB.drawY);
          context.strokeStyle = `rgba(255, 255, 255, ${opacity.toFixed(3)})`;
          context.lineWidth = 0.55;
          context.stroke();
          linkCount += 1;
        }
      }
    }

    nodes.forEach((node) => {
      const [red, green, blue] = node.color;
      const depth = node.visualDepth || 0;
      const twinkle = 0.82 + Math.sin(time * node.twinkle + node.phase) * 0.18;
      const starAlpha = (0.18 + depth * 0.74) * twinkle;
      const starSize = node.size * (0.72 + depth * 1.75);
      context.beginPath();
      context.arc(node.drawX, node.drawY, starSize, 0, Math.PI * 2);
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${starAlpha.toFixed(3)})`;
      context.fill();

      if (node.bright && depth > 0.28) {
        const ray = 2.4 + depth * 5.2;
        context.beginPath();
        context.moveTo(node.drawX - ray, node.drawY);
        context.lineTo(node.drawX + ray, node.drawY);
        context.moveTo(node.drawX, node.drawY - ray);
        context.lineTo(node.drawX, node.drawY + ray);
        context.strokeStyle = `rgba(255, 255, 255, ${(starAlpha * 0.42).toFixed(3)})`;
        context.lineWidth = 0.5;
        context.stroke();
      }
    });

    if (renderStarLines) {
      drawScrollBursts(timestamp);
      drawShootingStars(timestamp);
    }

    context.restore();
    const domMotionGap = lowPowerCanvas ? 92 : 56;
    if (!compactScreen.matches && timestamp - lastDomMotionFrame > domMotionGap) {
      lastDomMotionFrame = timestamp;
      updateScrollLayers();
      updateKineticItems();
    }

    if (!reducedMotion) {
      requestAnimationFrame(drawCosmos);
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      const nextScroll = window.scrollY;
      const delta = nextScroll - targetScroll;
      scrollVelocity += delta * 0.22;
      targetScroll = nextScroll;
      if (!documentIsHidden) {
        scatterStars(delta, performance.now());
      }
      if (renderStarLines) {
        spawnScrollBurst(delta);
      }
    },
    { passive: true }
  );
  document.addEventListener("visibilitychange", () => {
    documentIsHidden = document.hidden;
    if (!documentIsHidden) {
      lastFrame = 0;
    }
  });
  window.addEventListener(
    "resize",
    () => {
      const nextWidth = window.innerWidth;
      const widthChanged = Math.abs(nextWidth - lastResizeWidth) > 2;

      if (compactScreen.matches && !widthChanged) {
        return;
      }

      lastResizeWidth = nextWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(resizeCosmos);
      }, compactScreen.matches ? 160 : 70);
    },
    { passive: true }
  );
  resizeCosmos();
  drawCosmos();
}

function initScrollJourney() {
  if (!document.querySelector("main") || document.querySelector(".scroll-journey")) {
    return;
  }

  const journey = document.createElement("div");
  journey.className = "scroll-journey";
  journey.setAttribute("aria-hidden", "true");
  journey.innerHTML = `
    <span class="journey-caption">ORBITAL ROUTE</span>
    <div class="journey-readout">
      <small>Этап <b>01</b></small>
      <strong>Инициализация</strong>
    </div>
    <div class="journey-rail">
      <span class="journey-fill"></span>
      <i style="--node: 0%"></i>
      <i style="--node: 25%"></i>
      <i style="--node: 50%"></i>
      <i style="--node: 75%"></i>
      <i style="--node: 100%"></i>
      <span class="journey-token"><b>₮</b></span>
    </div>
  `;

  document.body.append(journey);

  const orbitalField = document.createElement("div");
  orbitalField.className = "orbital-route-field";
  orbitalField.setAttribute("aria-hidden", "true");
  orbitalField.innerHTML = `
    <span class="orbital-route-ring"></span>
    <span class="orbital-route-ring ring-secondary"></span>
    <span class="orbital-route-comet"></span>
  `;
  document.body.prepend(orbitalField);
  journeyStatus = journey.querySelector(".journey-readout strong");
  journeyStep = journey.querySelector(".journey-readout b");
}

function updateJourneyStatus(progress) {
  if (!journeyStatus || !journeyStep) {
    return;
  }

  const phases = [
    { limit: 16, step: "01", label: "Инициализация" },
    { limit: 36, step: "02", label: "Выбор сети" },
    { limit: 58, step: "03", label: "Маршрут операции" },
    { limit: 80, step: "04", label: "Проверка данных" },
    { limit: 96, step: "05", label: "Подтверждение" },
    { limit: 101, step: "06", label: "Маршрут завершен" },
  ];
  const phase = phases.find((item) => progress < item.limit) || phases[phases.length - 1];

  if (journeyStatus.textContent !== phase.label) {
    journeyStatus.textContent = phase.label;
    journeyStatus.classList.remove("is-changing");
    requestAnimationFrame(() => journeyStatus.classList.add("is-changing"));
  }

  journeyStep.textContent = phase.step;
  if (passportPhase) {
    passportPhase.textContent = `Этап ${phase.step} · ${phase.label}`;
  }
}

function updateScrollProgress() {
  if (!scrollProgress && !journeyStatus && !networkPassport && !scrollBeacon) {
    return;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100)) : 0;
  if (scrollProgress) {
    scrollProgress.style.setProperty("--scroll-progress", `${progress.toFixed(2)}%`);
  }
  document.documentElement.style.setProperty("--journey-progress", `${progress.toFixed(2)}%`);
  document.documentElement.style.setProperty("--journey-rotation", `${(progress * 7.2).toFixed(1)}deg`);
  if (networkPassport) {
    networkPassport.classList.toggle("is-visible", progress > 7 && progress < 98.5);
  }
  if (scrollBeacon) {
    const roundedProgress = String(Math.round(progress)).padStart(2, "0");
    const scrollDelta = window.scrollY - beaconLastScrollY;
    const energy = Math.min(1, Math.abs(scrollDelta) / 48);

    if (scrollBeaconPercent && scrollBeaconPercent.textContent !== roundedProgress) {
      scrollBeaconPercent.textContent = roundedProgress;
    }

    document.documentElement.style.setProperty("--beacon-spin", `${(progress * 10.8).toFixed(1)}deg`);
    document.documentElement.style.setProperty("--beacon-counter-spin", `${(progress * -10.8).toFixed(1)}deg`);
    document.documentElement.style.setProperty("--beacon-energy", energy.toFixed(2));

    if (Math.abs(scrollDelta) > 0.5) {
      scrollBeacon.dataset.direction = scrollDelta > 0 ? "down" : "up";
      scrollBeacon.classList.add("is-scrolling");
      window.clearTimeout(beaconScrollTimer);
      beaconScrollTimer = window.setTimeout(() => {
        scrollBeacon?.classList.remove("is-scrolling");
        document.documentElement.style.setProperty("--beacon-energy", "0");
      }, 180);
    }

    beaconLastScrollY = window.scrollY;
  }
  updateJourneyStatus(progress);
}

function initMagneticControls() {
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!hasFinePointer || prefersReducedMotion) {
    return;
  }

  const controls = document.querySelectorAll(
    ".button, .back-link, .network-tab, .network-advisor-tab, .advisor-action"
  );

  controls.forEach((control) => {
    if (control.dataset.magneticReady === "true") {
      return;
    }

    control.dataset.magneticReady = "true";

    control.addEventListener(
      "pointermove",
      (event) => {
        const rect = control.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const magnetX = (x / rect.width - 0.5) * 8;
        const magnetY = (y / rect.height - 0.5) * 8;

        control.style.setProperty("--mouse-x", `${((x / rect.width) * 100).toFixed(1)}%`);
        control.style.setProperty("--mouse-y", `${((y / rect.height) * 100).toFixed(1)}%`);
        control.style.setProperty("--magnet-x", `${magnetX.toFixed(2)}px`);
        control.style.setProperty("--magnet-y", `${magnetY.toFixed(2)}px`);
      },
      { passive: true }
    );

    control.addEventListener(
      "pointerleave",
      () => {
        control.style.setProperty("--mouse-x", "50%");
        control.style.setProperty("--mouse-y", "50%");
        control.style.setProperty("--magnet-x", "0px");
        control.style.setProperty("--magnet-y", "0px");
      },
      { passive: true }
    );
  });
}

const clickAnimationSelector = [
  "button:not(:disabled)",
  "a[href]",
  "summary",
  ".network-advisor-tab",
  ".network-tab",
  ".network-card[data-network]",
  ".package-card[data-network]",
  ".order-ticket",
  ".payment-address-box",
  ".receipt-upload",
  ".advisor-action",
  ".mobile-dock a",
].join(", ");

function getClickAnimationTarget(event) {
  if (!(event.target instanceof Element)) {
    return null;
  }

  if (event.target.closest("input, textarea, select") && !event.target.closest(".receipt-upload")) {
    return null;
  }

  const target = event.target.closest(clickAnimationSelector);

  if (!target || !document.body.contains(target)) {
    return null;
  }

  if (target.matches(".network-button")) {
    return target.closest(".network-card") || target;
  }

  return target;
}

function animateClickSurface(target, clientX, clientY) {
  if (!target || target.matches("button:disabled, [aria-disabled='true']")) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const x = Number.isFinite(clientX) ? clientX - rect.left : rect.width / 2;
  const y = Number.isFinite(clientY) ? clientY - rect.top : rect.height / 2;
  const burst = document.createElement("i");

  target.classList.add("interactive-click");
  target.style.setProperty("--click-x", `${Math.max(0, Math.min(rect.width, x)).toFixed(1)}px`);
  target.style.setProperty("--click-y", `${Math.max(0, Math.min(rect.height, y)).toFixed(1)}px`);
  target.classList.remove("is-click-animating");

  // Restart the press animation even when the user clicks the same control quickly.
  void target.offsetWidth;

  burst.className = "click-burst";
  burst.setAttribute("aria-hidden", "true");
  target.append(burst);
  target.classList.add("is-click-animating");

  const cleanup = () => {
    burst.remove();
    if (!target.querySelector(".click-burst")) {
      target.classList.remove("is-click-animating");
    }
  };

  burst.addEventListener("animationend", cleanup, { once: true });
  window.setTimeout(cleanup, 900);
}

function initClickAnimations() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return;
  }

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.button !== 0) {
        return;
      }

      const target = getClickAnimationTarget(event);

      if (!target) {
        return;
      }

      animateClickSurface(target, event.clientX, event.clientY);
    },
    { passive: true }
  );

  document.addEventListener("keydown", (event) => {
    if (event.repeat || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    const target = getClickAnimationTarget(event);

    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    animateClickSurface(target, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
}

function initMobileMotion() {
  const mobileViewport = window.matchMedia("(max-width: 760px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!mobileViewport.matches || reducedMotion.matches) {
    return;
  }

  document.documentElement.classList.add("mobile-motion");

  let scrollTimer = 0;
  let mobileScrollActive = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!mobileScrollActive) {
        mobileScrollActive = true;
        document.body.classList.add("mobile-scrolling");
      }
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        mobileScrollActive = false;
        document.body.classList.remove("mobile-scrolling");
      }, 120);
    },
    { passive: true }
  );
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function updateActiveNav() {
  if (trackedSections.length < 2) {
    return;
  }

  const currentY = window.scrollY + 140;
  let activeId = "top";

  trackedSections.forEach((section) => {
    if (section.hidden) {
      return;
    }

    if (section.offsetTop <= currentY) {
      activeId = section.id;
    }
  });

  menuLinks.forEach((link) => {
    const linkTarget = link.getAttribute("href");
    if (!linkTarget || !linkTarget.startsWith("#")) {
      return;
    }

    link.classList.toggle("is-active", linkTarget === `#${activeId}`);
  });
}

function scheduleScrollUiUpdate() {
  if (scrollUiFrame) {
    return;
  }

  scrollUiFrame = requestAnimationFrame(() => {
    scrollUiFrame = 0;
    updateActiveNav();
    updateScrollProgress();
  });
}

initSiteIntro();
initScrollCosmos();
initScrollJourney();
initScrollBeacon();
initNetworkPassport();
initNetworkAdvisor();
window.addEventListener("scroll", scheduleScrollUiUpdate, { passive: true });
window.addEventListener("load", scheduleScrollUiUpdate);
updateActiveNav();
updateScrollProgress();

renderPackages(initialNetwork);
initCardTilt();
initLuxurySpotlight();
initMagneticControls();
initClickAnimations();
initMobileMotion();

if (checkoutSection) {
  setCheckoutOrder(initialNetwork, selectedOrder.package, {
    shouldScroll: false,
    shouldUpdateHash: false,
  });
}

if (packageGrid) {
  packageGrid.addEventListener("click", (event) => {
    const packageCard = event.target.closest(".package-card[data-network]");

    if (!packageCard) {
      return;
    }

    const networkName = packageCard.dataset.network || "TRC20";
    const index = Number(packageCard.dataset.index || 0);
    const card = networkPackages[networkName]?.cards[index];

    if (card) {
      if (!checkoutSection) {
        window.location.href = getCheckoutUrl(networkName, index);
        return;
      }

      setCheckoutOrder(networkName, card);
    }
  });
}

if (continuePayment) {
  continuePayment.addEventListener("click", showPaymentStep);
}

if (paymentReceipt && receiptFile) {
  paymentReceipt.addEventListener("change", () => {
    const file = paymentReceipt.files?.[0];
    receiptFile.textContent = file ? file.name : "Прикрепить чек или скрин оплаты";
  });
}

if (submitProof) {
  submitProof.addEventListener("click", () => {
    const txid = transactionId ? transactionId.value.trim() : "";
    const file = paymentReceipt?.files?.[0];
    const existingRecord = readOrderRecord(activeOrderKey);

    if (!txid && !file) {
      if (proofMessage) {
        proofMessage.textContent = "Добавьте TXID или прикрепите чек оплаты.";
      }
      return;
    }

    const updatedRecord = {
      ...(existingRecord || {
        id: makeOrderId(selectedOrder.network),
        network: selectedOrder.network,
        package: selectedOrder.package.name,
        price: selectedOrder.package.price,
      }),
      status: "На проверке",
      txid,
      receiptName: file?.name || existingRecord?.receiptName || "",
    };

    if (activeOrderKey) {
      saveOrderRecord(activeOrderKey, updatedRecord);
    }

    updateOrderStatus(updatedRecord);

    if (proofMessage) {
      proofMessage.textContent = "Подтверждение добавлено. Заказ ожидает ручной проверки.";
    }
  });
}

if (copyWallet && paymentWallet) {
  copyWallet.addEventListener("click", async () => {
    const walletText = paymentWallet.textContent.trim();

    try {
      await navigator.clipboard.writeText(walletText);
      copyWallet.textContent = "Скопировано";
    } catch (error) {
      copyWallet.textContent = "Скопируйте вручную";
    }

    setTimeout(() => {
      copyWallet.textContent = "Скопировать";
    }, 1600);
  });
}

networkButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (button.getAttribute("href") !== "#packages") {
      return;
    }

    const networkName = button.dataset.network;

    if (!networkName) {
      return;
    }

    event.preventDefault();
    renderPackages(networkName);

    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#packages");
    }
  });
});

initRevealMutationObserver();
queueRevealRefresh();
