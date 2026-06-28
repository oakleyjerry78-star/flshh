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
let journeyStatus = null;
let journeyStep = null;
const trackedSections = Array.from(
  document.querySelectorAll("#top, #networks, #packages, #checkout, #wallets")
);
const pageParams = new URLSearchParams(window.location.search);

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

function initSiteIntro() {
  if (!siteIntro) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let introWasShown = false;

  try {
    introWasShown = sessionStorage.getItem("cryptoflashusdt-intro") === "shown";
  } catch (error) {
    introWasShown = false;
  }

  if (introWasShown || reducedMotion) {
    siteIntro.classList.add("is-skip");
    document.body.classList.add("intro-skip");
    return;
  }

  document.body.classList.add("intro-playing");
  let isFinished = false;

  const finishIntro = () => {
    if (isFinished) {
      return;
    }

    isFinished = true;
    siteIntro.classList.add("is-complete");
    document.body.classList.add("intro-exiting");
    document.body.classList.remove("intro-playing");

    try {
      sessionStorage.setItem("cryptoflashusdt-intro", "shown");
    } catch (error) {
      // Local file previews may not expose session storage.
    }

    window.setTimeout(() => {
      siteIntro.remove();
      document.body.classList.remove("intro-exiting");
      document.body.classList.add("intro-finished");
    }, 900);
  };

  if (document.readyState === "complete") {
    window.setTimeout(finishIntro, 1450);
  } else {
    window.addEventListener("load", () => window.setTimeout(finishIntro, 1450), { once: true });
  }

  window.setTimeout(finishIntro, 3600);
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
  }
}

function renderPackages(networkName) {
  const currentNetwork = normalizeNetwork(networkName);
  const selected = networkPackages[currentNetwork];

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
          <h3>${card.name}</h3>
          <p class="package-value">${card.price}</p>
          <p class="package-copy">${card.copy}</p>
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
}

function setCheckoutOrder(networkName, card, options = {}) {
  const currentNetwork = normalizeNetwork(networkName);
  const selectedCard = card || networkPackages[currentNetwork].cards[0];
  const { shouldScroll = true, shouldUpdateHash = true } = options;

  selectedOrder = { network: currentNetwork, package: selectedCard };

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
    requestAnimationFrame(() => paymentPanel.classList.add("is-open"));
  }

  if (checkoutSection) {
    checkoutSection.classList.add("payment-active");
  }

  if (checkoutMessage) {
    checkoutMessage.textContent = "Адрес добавлен. Проверьте данные оплаты ниже.";
  }
}

function initRevealEffects() {
  const revealSelectors = [
    ".hero .eyebrow",
    ".hero-signal",
    ".hero h1",
    ".hero-lead",
    ".hero-actions",
    ".hero-ledger",
    ".hero-scroll-cue",
    ".hero-premium-panel",
    ".luxury-ribbon",
    ".trust-strip",
    ".section-heading",
    ".network-card",
    ".feature-band",
    ".step",
    ".wallet-grid span",
    ".wallet-compat-card",
    ".faq-list details",
    ".faq-more",
    ".faq-cta",
    ".page-hero-inner",
    ".packages-heading",
    ".package-card",
    ".checkout-card",
    ".guide-hero-inner",
    ".guide-visual-card",
    ".guide-card",
    ".guide-step",
    ".guide-warning",
    ".guide-checklist",
  ];
  const revealItems = Array.from(document.querySelectorAll(revealSelectors.join(",")));

  if (!revealItems.length) {
    return;
  }

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
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
      rootMargin: "0px 0px -56px 0px",
      threshold: 0.14,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function initCardTilt() {
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!hasFinePointer || prefersReducedMotion) {
    return;
  }

  const tiltCards = document.querySelectorAll(
    ".network-card, .package-card, .checkout-card, .guide-card, .guide-step, .guide-visual-card"
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

        card.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
      },
      { passive: true }
    );

    card.addEventListener(
      "pointerleave",
      () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
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
    ".hero-premium-panel, .network-card, .package-card, .checkout-card, .guide-card, .guide-step, .guide-visual-card, .guide-warning, .guide-checklist"
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
  let targetScroll = window.scrollY;
  let smoothScroll = targetScroll;
  let scrollVelocity = 0;
  let scrollEnergy = 0;
  let lastFrame = 0;
  let lastBurstFrame = -1000;
  let bursts = [];
  let shootingStars = [];
  const scrollLayers = Array.from(
    document.querySelectorAll(
      ".hero-copy, .hero-premium-panel, .section-heading, .packages-heading, .page-hero-inner, .guide-hero-copy, .guide-visual-card, .feature-band, .faq-cta"
    )
  );
  let kineticItems = [];

  scrollLayers.forEach((layer) => layer.classList.add("scroll-layer"));

  function refreshKineticItems() {
    kineticItems = Array.from(
      document.querySelectorAll(
        ".network-card, .package-card, .wallet-compat-card, .step, .faq-list details, .guide-step, .guide-card, .checkout-card"
      )
    );
    kineticItems.forEach((item, index) => {
      item.classList.add("kinetic-item");
      item.style.setProperty("--kinetic-direction", index % 2 === 0 ? "-1" : "1");
    });
  }

  refreshKineticItems();
  window.__refreshKineticItems = refreshKineticItems;

  function buildNodes() {
    const nodeCount = compactScreen.matches ? 90 : 180;
    nodes = Array.from({ length: nodeCount }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      depth: 0.28 + Math.random() * 0.95,
      drift: 0.24 + Math.random() * 0.68,
      speed: 4 + Math.random() * 13,
      phase: Math.random() * Math.PI * 2,
      size: 0.55 + Math.random() * 1.25,
      twinkle: 0.55 + Math.random() * 1.8,
      bright: index % 9 === 0,
      color: colors[index % colors.length],
      drawX: 0,
      drawY: 0,
    }));
  }

  function resizeCosmos() {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.floor(width * pixelRatio));
    canvas.height = Math.max(1, Math.floor(height * pixelRatio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    buildNodes();
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
    if (reducedMotion) {
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
    if (reducedMotion || Math.abs(delta) < 14 || lastFrame - lastBurstFrame < 190) {
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
    const shootingCount = compactScreen.matches ? 1 : 2;
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

      for (let ray = 0; ray < 14; ray += 1) {
        const angle = (Math.PI * 2 * ray) / 14 + burst.direction * age * 0.42;
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

  function drawCosmos(timestamp = 0) {
    if (
      document.body.classList.contains("intro-playing") ||
      document.body.classList.contains("intro-exiting")
    ) {
      lastFrame = timestamp;
      requestAnimationFrame(drawCosmos);
      return;
    }

    if (timestamp - lastFrame < (compactScreen.matches ? 34 : 24)) {
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
    document.documentElement.style.setProperty("--scroll-energy", scrollEnergy.toFixed(3));
    document.documentElement.style.setProperty(
      "--scroll-energy-scale",
      (1 + scrollEnergy * 0.24).toFixed(3)
    );
    context.clearRect(0, 0, width, height);
    context.save();
    context.globalCompositeOperation = "lighter";

    if (renderStarLines) {
      drawSignalPaths(time);
    }

    nodes.forEach((node) => {
      const scrollTravel = smoothScroll * (0.09 + node.depth * 0.16);
      const scatterDistance = scrollEnergy * node.depth * (compactScreen.matches ? 42 : 104);
      const warpDistance = scrollEnergy * node.depth * (compactScreen.matches ? 40 : 118);
      node.drawX =
        node.x * width +
        Math.sin(time * node.drift + node.phase + smoothScroll * 0.00022) * 34 * node.depth +
        Math.sin(node.phase + time * 2.2) * scatterDistance +
        (node.x - 0.5) * warpDistance;
      node.drawY =
        ((node.y * height + scrollTravel + time * node.speed) % (height + 120)) -
        60 +
        Math.cos(node.phase + time * 1.7) * scatterDistance * 0.32 +
        (node.y - 0.5) * warpDistance * 0.36;
    });

    if (renderStarLines) {
      const linkDistance = (compactScreen.matches ? 112 : 154) * (1 + scrollEnergy * 0.18);
      for (let first = 0; first < nodes.length; first += 1) {
        for (let second = first + 1; second < nodes.length; second += 1) {
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
        }
      }
    }

    nodes.forEach((node, index) => {
      const [red, green, blue] = node.color;
      const pulse = index % 11 === 0 ? 0.45 + Math.sin(time * 2.1 + node.phase) * 0.25 : 0;

      if (renderStarLines && scrollEnergy > 0.025) {
        const streakLength = scrollVelocity * node.depth * 4.2;
        context.beginPath();
        context.moveTo(node.drawX, node.drawY - streakLength);
        context.lineTo(node.drawX, node.drawY);
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${(scrollEnergy * 0.34).toFixed(3)})`;
        context.lineWidth = Math.max(0.45, node.size * 0.7);
        context.stroke();
      }

      const twinkle = 0.72 + Math.sin(time * node.twinkle + node.phase) * 0.28;
      const starAlpha = (0.28 + node.depth * 0.42) * twinkle;
      context.beginPath();
      context.arc(node.drawX, node.drawY, node.size + pulse, 0, Math.PI * 2);
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${starAlpha.toFixed(3)})`;
      context.fill();

      if (node.bright) {
        const glowRadius = node.size * 2.8 + scrollEnergy * 1.4;
        context.beginPath();
        context.arc(node.drawX, node.drawY, glowRadius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${(starAlpha * 0.1).toFixed(3)})`;
        context.fill();
      }

      if (index % 13 === 0) {
        const ring = 5 + ((time * 9 + index * 2.7 + smoothScroll * 0.012) % 18);
        context.beginPath();
        context.arc(node.drawX, node.drawY, ring, 0, Math.PI * 2);
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${Math.max(0, 0.12 - ring * 0.004)})`;
        context.lineWidth = 0.7;
        context.stroke();
      }
    });

    if (renderStarLines) {
      drawScrollBursts(timestamp);
      drawShootingStars(timestamp);
    }

    context.restore();
    updateScrollLayers();
    updateKineticItems();

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
      if (renderStarLines) {
        spawnScrollBurst(delta);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", resizeCosmos, { passive: true });
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
    <span class="journey-caption">Маршрут страницы</span>
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
}

function updateScrollProgress() {
  if (!scrollProgress) {
    return;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100)) : 0;
  scrollProgress.style.setProperty("--scroll-progress", `${progress.toFixed(2)}%`);
  document.documentElement.style.setProperty("--journey-progress", `${progress.toFixed(2)}%`);
  document.documentElement.style.setProperty("--journey-rotation", `${(progress * 7.2).toFixed(1)}deg`);
  updateJourneyStatus(progress);
}

function initMagneticControls() {
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!hasFinePointer || prefersReducedMotion) {
    return;
  }

  const controls = document.querySelectorAll(".button, .back-link, .network-tab");

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

initSiteIntro();
initScrollCosmos();
initScrollJourney();
window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("load", updateActiveNav);
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("load", updateScrollProgress);
updateActiveNav();
updateScrollProgress();

renderPackages(initialNetwork);
initCardTilt();
initLuxurySpotlight();
initMagneticControls();

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

requestAnimationFrame(initRevealEffects);
