"use strict";

/* ==========================================================
   Конфігурація
   ========================================================== */
const VARIANT = 18;
const COMMENTS_URL = `https://jsonplaceholder.typicode.com/posts/${VARIANT}/comments`;
const MODAL_DELAY_MS = 60 * 1000;
const DAY_START_HOUR = 7;
const DAY_END_HOUR = 21;
const STORAGE_PREFIX = "sysinfo.";

/* ==========================================================
   1. Системна інформація (localStorage → футер)
   ========================================================== */
function detectOS(ua, platform) {
  const rules = [
    [/Windows NT 10/i, "Windows 10/11"],
    [/Windows/i, "Windows"],
    [/Android/i, "Android"],
    [/iPhone|iPad|iPod/i, "iOS"],
    [/Mac OS X|Macintosh/i, "macOS"],
    [/CrOS/i, "ChromeOS"],
    [/Linux|X11/i, "Linux"],
  ];
  const match = rules.find(([re]) => re.test(ua));
  return match ? match[1] : platform || "Невідомо";
}

function detectBrowser(ua) {
  // Порядок важливий: Edge/Opera/Chrome містять "Chrome"/"Safari" в userAgent
  const rules = [
    [/Edg\/([\d.]+)/, "Microsoft Edge"],
    [/OPR\/([\d.]+)/, "Opera"],
    [/Firefox\/([\d.]+)/, "Firefox"],
    [/Chrome\/([\d.]+)/, "Chrome"],
    [/Version\/([\d.]+).*Safari/, "Safari"],
  ];
  for (const [re, name] of rules) {
    const m = ua.match(re);
    if (m) return `${name} ${m[1]}`;
  }
  return "Невідомо";
}

function collectSystemInfo() {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  return {
    userAgent: ua,
    platform,
    os: detectOS(ua, platform),
    browser: detectBrowser(ua),
    vendor: navigator.vendor,
    language: navigator.language,
    languages: (navigator.languages || []).join(", "),
    cookieEnabled: String(navigator.cookieEnabled),
    online: String(navigator.onLine),
    cpuCores: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory,
    screen: `${screen.width}×${screen.height}`,
    viewport: `${window.innerWidth}×${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

const SYSTEM_INFO_LABELS = {
  os: "Операційна система",
  browser: "Браузер",
  platform: "navigator.platform",
  userAgent: "navigator.userAgent",
  vendor: "Виробник браузера",
  language: "Мова",
  languages: "Список мов",
  cookieEnabled: "Cookie увімкнено",
  online: "Онлайн",
  cpuCores: "Ядра процесора",
  deviceMemory: "Пам’ять пристрою (ГБ)",
  screen: "Екран",
  viewport: "Вікно браузера",
  pixelRatio: "Pixel ratio",
  timezone: "Часовий пояс",
};

function saveSystemInfo() {
  try {
    for (const [key, value] of Object.entries(collectSystemInfo())) {
      if (value !== undefined && value !== "") {
        localStorage.setItem(STORAGE_PREFIX + key, String(value));
      }
    }
  } catch (err) {
    console.error("localStorage недоступний:", err);
  }
}

function renderSystemInfo() {
  const list = document.getElementById("system-info");
  list.replaceChildren();

  for (const [key, label] of Object.entries(SYSTEM_INFO_LABELS)) {
    let value = null;
    try {
      value = localStorage.getItem(STORAGE_PREFIX + key);
    } catch (err) {
      console.error("localStorage недоступний:", err);
    }
    if (value === null) continue;

    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    list.append(dt, dd);
  }

  if (!list.children.length) {
    const dd = document.createElement("dd");
    dd.textContent = "Дані недоступні (localStorage заблоковано).";
    list.append(dd);
  }
}

/* ==========================================================
   2. Відгуки (Fetch API)
   ========================================================== */
function createReviewCard(comment) {
  const card = document.createElement("article");
  card.className = "review-card";

  const name = document.createElement("h3");
  name.textContent = comment.name;

  const email = document.createElement("a");
  email.className = "review-email";
  email.href = `mailto:${comment.email}`;
  email.textContent = comment.email;

  const body = document.createElement("p");
  body.textContent = comment.body;

  card.append(name, email, body);
  return card;
}

async function loadReviews() {
  const status = document.getElementById("reviews-status");
  const list = document.getElementById("reviews-list");

  try {
    const response = await fetch(COMMENTS_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const comments = await response.json();

    // Порядок відображення збігається з порядком отримання
    list.replaceChildren(...comments.map(createReviewCard));
    status.hidden = true;
  } catch (err) {
    console.error("Не вдалося завантажити відгуки:", err);
    status.textContent = "Не вдалося завантажити відгуки. Спробуйте пізніше.";
    status.classList.add("is-error");
  }
}

/* ==========================================================
   3. Модальне вікно із формою (Formspree)
   ========================================================== */
function setupContactModal() {
  const modal = document.getElementById("contact-modal");
  const closeButtons = [
    document.getElementById("contact-modal-close"),
    document.getElementById("contact-modal-cancel"),
  ];

  closeButtons.forEach((btn) => btn.addEventListener("click", () => modal.close()));

  // Клік по затемненому фону (поза вмістом) також закриває вікно
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });

  setTimeout(() => {
    if (!modal.open) modal.showModal();
  }, MODAL_DELAY_MS);
}

/* ==========================================================
   4. Тема День / Ніч
   ========================================================== */
function themeByTime(date = new Date()) {
  const hours = date.getHours();
  return hours >= DAY_START_HOUR && hours < DAY_END_HOUR ? "light" : "dark";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);

  const toggle = document.getElementById("theme-toggle");
  toggle.setAttribute("aria-pressed", String(isDark));
  document.getElementById("theme-toggle-icon").textContent = isDark ? "🌙" : "☀️";
  document.getElementById("theme-toggle-label").textContent = isDark ? "Нічна тема" : "Денна тема";
}

function setupThemeToggle() {
  applyTheme(themeByTime());

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");
    applyTheme(isDark ? "light" : "dark");
  });
}

/* ==========================================================
   Ініціалізація
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  saveSystemInfo();
  renderSystemInfo();
  loadReviews();
  setupContactModal();
});
