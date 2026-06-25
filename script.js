const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const menuLinks = document.querySelectorAll(".nav-menu a");
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
  ERC20: "YOUR_ERC20_USDT_WALLET_ADDRESS",
  BEP20: "YOUR_BEP20_USDT_WALLET_ADDRESS",
  BTC: "YOUR_BTC_WALLET_ADDRESS",
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
    checkoutNetworkLabel.textContent = `${currentNetwork} Network`;
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
  }

  if (checkoutMessage) {
    checkoutMessage.textContent = "";
  }

  if (paymentNetwork) {
    paymentNetwork.textContent = currentNetwork;
  }

  if (paymentWallet) {
    paymentWallet.textContent = paymentWallets[currentNetwork] || paymentWallets.TRC20;
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
  }

  if (checkoutMessage) {
    checkoutMessage.textContent = "Адрес добавлен. Проверьте данные оплаты ниже.";
  }
}

function initRevealEffects() {
  const revealSelectors = [
    ".hero .eyebrow",
    ".hero h1",
    ".hero-lead",
    ".hero-actions",
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

window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("load", updateActiveNav);
updateActiveNav();

renderPackages(initialNetwork);

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
