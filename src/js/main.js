const API_URL = "https://nutriplan-api.vercel.app/api";
const NUTRITION_KEY = "xRGnhxcXrKuX8hJpeeQE5Rac9b7dyQDpaMs5fWFL";

const DAILY_GOALS = { calories: 2000, protein: 50, carbs: 250, fat: 65 };

const loader = document.getElementById("app-loading-overlay");
const menuBtn = document.getElementById("header-menu-btn");
const sidePanel = document.getElementById("sidebar");
const sideMask = document.getElementById("sidebar-overlay");

const pageLinks = document.querySelectorAll(".nav-link");
let activeLink = document.getElementById("Meals-Recipes");
let visiblePage = document.getElementById("Meals");
const homePage = document.getElementById("Meals");

const recipeBox = document.getElementById("recipes-grid");
const recipeSearch = document.getElementById("search-input");
const recipeCountLabel = document.getElementById("recipes-count");

let pickedRegionBtn = document.getElementById("allRecipesBtn");
let pickedTypeCard = null;
let activeRegion = "";
let activeType = "All";

const viewButtons = [...document.getElementById("view-toggle").children];
let activeViewBtn = document.getElementById("grid-view-btn");
let cardLayout = "grid";

const detailPage = document.getElementById("meal-details");
const mealLogPopup = document.getElementById("log-Modal");
const servingUp = document.getElementById("increment-modal");
const servingDown = document.getElementById("decrement-modal");
const confirmMealLog = document.getElementById("log-meal-btn");
const servingCount = document.getElementById("current-serving");

const productPopup = document.getElementById("product-modal");
const addProductBtn = document.getElementById("add-product-log");
const closeProductBtn = document.getElementById("cancel-product-log");

const productSearchBox = document.getElementById("product-search-input");
const runProductSearch = document.getElementById("search-product-btn");
const barcodeBox = document.getElementById("barcode-input");
const runBarcodeLookup = document.getElementById("lookup-barcode-btn");
const productBox = document.getElementById("products-grid");
const productTypeRow = document.getElementById("product-categories");
const gradeFilters = document.querySelectorAll(".nutri-score-filter");

const calText = document.getElementById("progress-calories-text");
const proteinText = document.getElementById("progress-protein-text");
const carbsText = document.getElementById("progress-carbs-text");
const fatText = document.getElementById("progress-fat-text");
const calPct = document.getElementById("progress-calories-pct");
const proteinPct = document.getElementById("progress-protein-pct");
const carbsPct = document.getElementById("progress-carbs-pct");
const fatPct = document.getElementById("progress-fat-pct");
const calBar = document.getElementById("progress-calories-bar");
const proteinBar = document.getElementById("progress-protein-bar");
const carbsBar = document.getElementById("progress-carbs-bar");
const fatBar = document.getElementById("progress-fat-bar");

const entryCountLabel = document.getElementById("loggedItemsCount");
const wipeLogBtn = document.getElementById("clear-foodlog");
const entryList = document.getElementById("logged-items-list");
const weekChartBox = document.getElementById("weekly-chart");
const todayLabel = document.getElementById("foodlog-date");
const weeklyAvgEl = document.getElementById("weekly-avg");
const weeklyItemsEl = document.getElementById("weekly-items");
const daysOnGoalEl = document.getElementById("days-on-goal");

let recipeList = [];
let productList = [];
let allAreas = [];
let lastSearchWord = "";
let itemWaitingToLog = null;

let tracker;
try {
  const raw = JSON.parse(localStorage.getItem("nutriplan_tracker"));
  if (Array.isArray(raw)) {
    tracker = { entries: raw };
  } else if (raw && Array.isArray(raw.entries)) {
    tracker = raw;
  } else {
    tracker = { entries: [] };
  }
} catch {
  tracker = { entries: [] };
}

const typeThemes = {
  All: {
    idle: "from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-400",
    active:
      "from-emerald-500 to-green-500 text-white border-emerald-500 hover:border-emerald-600",
    icon: "fa-solid fa-border-all",
    iconBg: "from-emerald-400 to-green-500",
  },
  Beef: {
    idle: "from-red-50 to-rose-50 border-red-200 hover:border-red-400",
    active:
      "from-red-500 to-rose-500 text-white border-red-500 hover:border-red-600",
    icon: "fa-solid fa-drumstick-bite",
    iconBg: "from-red-400 to-rose-500",
  },
  Chicken: {
    idle: "from-amber-50 to-orange-50 border-amber-200 hover:border-amber-400",
    active:
      "from-amber-500 to-orange-500 text-white border-amber-500 hover:border-amber-600",
    icon: "fa-solid fa-drumstick-bite",
    iconBg: "from-amber-400 to-orange-500",
  },
  Dessert: {
    idle: "from-pink-50 to-rose-50 border-pink-200 hover:border-pink-400",
    active:
      "from-pink-500 to-rose-500 text-white border-pink-500 hover:border-rose-600",
    icon: "fa-solid fa-cake-candles",
    iconBg: "from-pink-400 to-rose-500",
  },
  Lamb: {
    idle: "from-orange-50 to-amber-50 border-orange-200 hover:border-orange-400",
    active:
      "from-orange-500 to-amber-500 text-white border-orange-500 hover:border-amber-600",
    icon: "fa-solid fa-drumstick-bite",
    iconBg: "from-orange-400 to-amber-500",
  },
  Miscellaneous: {
    idle: "from-slate-50 to-gray-50 border-slate-200 hover:border-slate-400",
    active:
      "from-slate-500 to-gray-500 text-white border-slate-500 hover:border-slate-600",
    icon: "fa-solid fa-bowl-rice",
    iconBg: "from-slate-400 to-gray-500",
  },
  Pasta: {
    idle: "from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-400",
    active:
      "from-yellow-500 to-amber-500 text-white border-yellow-500 hover:border-amber-600",
    icon: "fa-solid fa-bowl-food",
    iconBg: "from-yellow-400 to-amber-500",
  },
  Pork: {
    idle: "from-rose-50 to-red-50 border-rose-200 hover:border-rose-400",
    active:
      "from-rose-500 to-red-500 text-white border-rose-500 hover:border-red-600",
    icon: "fa-solid fa-bacon",
    iconBg: "from-rose-400 to-red-500",
  },
  Seafood: {
    idle: "from-cyan-50 to-blue-50 border-cyan-200 hover:border-cyan-400",
    active:
      "from-cyan-500 to-blue-500 text-white border-cyan-500 hover:border-cyan-600",
    icon: "fa-solid fa-fish",
    iconBg: "from-cyan-400 to-blue-500",
  },
  Side: {
    idle: "from-green-50 to-emerald-50 border-green-200 hover:border-green-400",
    active:
      "from-green-500 to-emerald-500 text-white border-green-500 hover:border-emerald-600",
    icon: "fa-solid fa-plate-wheat",
    iconBg: "from-green-400 to-emerald-500",
  },
  Starter: {
    idle: "from-teal-50 to-cyan-50 border-teal-200 hover:border-teal-400",
    active:
      "from-teal-500 to-cyan-500 text-white border-teal-500 hover:border-teal-600",
    icon: "fa-solid fa-utensils",
    iconBg: "from-teal-400 to-cyan-500",
  },
  Vegan: {
    idle: "from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-400",
    active:
      "from-emerald-500 to-green-500 text-white border-emerald-500 hover:border-emerald-600",
    icon: "fa-solid fa-leaf",
    iconBg: "from-emerald-400 to-green-500",
  },
};

const storeThemes = {
  "breakfast-cereals": {
    idle: "from-emerald-50 to-teal-50 border-emerald-200",
    icon: "fa-wheat-awn",
  },
  beverages: {
    idle: "from-blue-50 to-cyan-50 border-blue-200",
    icon: "fa-bottle-water",
  },
  snacks: {
    idle: "from-amber-50 to-orange-50 border-amber-200",
    icon: "fa-cookie",
  },
  dairies: {
    idle: "from-rose-50 to-red-50 border-rose-200",
    icon: "fa-cheese",
  },
  cheeses: {
    idle: "from-emerald-50 to-green-50 border-emerald-200",
    icon: "fa-cheese",
  },
  yogurts: { idle: "from-teal-50 to-cyan-50 border-teal-200", icon: "fa-jar" },
  chocolates: {
    idle: "from-green-50 to-emerald-50 border-green-200",
    icon: "fa-mug-hot",
  },
  biscuits: {
    idle: "from-cyan-50 to-blue-50 border-cyan-200",
    icon: "fa-cookie-bite",
  },
  "ice-creams": {
    idle: "from-rose-50 to-red-50 border-rose-200",
    icon: "fa-ice-cream",
  },
  breads: {
    idle: "from-yellow-50 to-amber-50 border-yellow-200",
    icon: "fa-bread-slice",
  },
  fruits: {
    idle: "from-slate-50 to-gray-50 border-slate-200",
    icon: "fa-apple-whole",
  },
  vegetables: {
    idle: "from-green-50 to-emerald-50 border-green-200",
    icon: "fa-carrot",
  },
};

const gradeColors = {
  a: "bg-green-500",
  b: "bg-lime-500",
  c: "bg-yellow-500",
  d: "bg-orange-500",
  e: "bg-red-500",
};
const novaBg = { 1: "#22c55e", 2: "#84cc16", 3: "#fb923c", 4: "#ef4444" };

if (todayLabel) {
  todayLabel.innerText = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function wipeTracker() {
  Swal.fire({
    title: "Clear Today's Log?",
    text: "This will remove all logged food items for today.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#EF4444",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Yes, clear it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      doClearTracker();
      Swal.fire({
        title: "Cleared!",
        text: "Your food log has been cleared.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

function clearFoodLog(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  wipeTracker();
}
window.clearFoodLog = clearFoodLog;

function startLoader() {
  loader.classList.remove("loading");
}

function stopLoader() {
  loader.classList.add("loading");
}

function saveTracker() {
  localStorage.setItem("nutriplan_tracker", JSON.stringify(tracker));
}

function getTodayKey() {
  return new Date().toDateString();
}

function getEntriesForDay(dayKey) {
  const list = [];
  for (let i = 0; i < tracker.entries.length; i++) {
    if (new Date(tracker.entries[i].time).toDateString() === dayKey) {
      list.push(tracker.entries[i]);
    }
  }
  return list;
}

function sumNutrition(entries) {
  const total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  for (let i = 0; i < entries.length; i++) {
    const n = entries[i].nutrition || {};
    total.calories += n.calories || 0;
    total.protein += n.protein || 0;
    total.carbs += n.carbs || 0;
    total.fat += n.fat || 0;
  }
  return total;
}

function pctOf(value, goal) {
  return Math.round(Math.min((value / goal) * 100, 100));
}

function formatMacro(value) {
  const n = Number(value) || 0;
  return Number.isInteger(n) || Math.abs(n - Math.round(n)) < 0.05
    ? String(Math.round(n))
    : n.toFixed(1);
}

function scaleProductNutrition(per100g, grams) {
  const factor = grams / 100;
  return {
    calories: (per100g.calories || 0) * factor,
    protein: (per100g.protein || 0) * factor,
    carbs: (per100g.carbs || 0) * factor,
    fat: (per100g.fat || 0) * factor,
  };
}

function getVideoId(url) {
  return url.split("v=")[1];
}

function switchClasses(el, removeList, addList) {
  el.classList.remove(...removeList);
  el.classList.add(...addList);
}

function goToTab(linkEl) {
  activeLink.classList.remove("bg-emerald-50", "text-emerald-700");
  activeLink.classList.add("text-gray-600", "hover:bg-gray-50");
  activeLink
    .querySelector("span")
    .classList.replace("font-semibold", "font-medium");

  visiblePage.classList.add("hidden");
  detailPage.classList.add("hidden");

  activeLink = linkEl;
  visiblePage = document.getElementById(linkEl.getAttribute("page-target"));

  activeLink.classList.add("bg-emerald-50", "text-emerald-700");
  activeLink.classList.remove("text-gray-600", "hover:bg-gray-50");
  activeLink
    .querySelector("span")
    .classList.replace("font-medium", "font-semibold");
  visiblePage.classList.remove("hidden");

  sideMask.classList.remove("active");
  sidePanel.classList.remove("open");

  const target = linkEl.getAttribute("page-target");
  if (target === "foodlog-section") {
    paintTrackerPage();
  } else if (target === "Meals") {
    homePage.classList.remove("hidden");
    clearAllFilters();
    loadRecipeList();
  }
}

function resetTypeOnly() {
  if (!pickedTypeCard) return;
  const oldType = pickedTypeCard.getAttribute("data-category");
  switchClasses(
    pickedTypeCard,
    typeThemes[oldType].active.split(" "),
    typeThemes[oldType].idle.split(" "),
  );
  pickedTypeCard = document.getElementById("type-all-card");
  activeType = "All";
  switchClasses(
    pickedTypeCard,
    typeThemes.All.idle.split(" "),
    typeThemes.All.active.split(" "),
  );
}

function resetRegionOnly() {
  switchClasses(
    pickedRegionBtn,
    ["bg-emerald-600", "text-white", "hover:bg-emerald-700"],
    ["bg-gray-100", "text-gray-700", "hover:bg-gray-200"],
  );
  pickedRegionBtn = document.getElementById("allRecipesBtn");
  switchClasses(
    pickedRegionBtn,
    ["bg-gray-100", "text-gray-700", "hover:bg-gray-200"],
    ["bg-emerald-600", "text-white", "hover:bg-emerald-700"],
  );
  activeRegion = "";
}

function clearAllFilters() {
  resetTypeOnly();
  resetRegionOnly();
}

function pushToTracker(entry) {
  tracker.entries.push(entry);
  saveTracker();
  if (
    !document.getElementById("foodlog-section").classList.contains("hidden")
  ) {
    paintTrackerPage();
  }
}

function removeTrackerEntry(entryTime) {
  let index = -1;
  for (let i = 0; i < tracker.entries.length; i++) {
    if (tracker.entries[i].time === entryTime) {
      index = i;
      break;
    }
  }
  if (index === -1) return;
  tracker.entries.splice(index, 1);
  saveTracker();
  paintTrackerPage();
}

function doClearTracker() {
  const todayKey = getTodayKey();
  tracker.entries = tracker.entries.filter((entry) => {
    if (!entry || !entry.time) return false;
    return new Date(entry.time).toDateString() !== todayKey;
  });
  saveTracker();
  paintTrackerPage();
}

function hookFoodLogEvents() {
  if (entryList) {
    entryList.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".remove-entry");
      if (removeBtn) removeTrackerEntry(removeBtn.getAttribute("data-time"));
    });
  }
}
function hookEvents() {
  menuBtn.addEventListener("click", () => {
    sideMask.classList.add("active");
    sidePanel.classList.add("open");
  });

  document.addEventListener("click", (e) => {
    if (
      e.target.closest("#sidebar-close-btn") ||
      (sideMask.classList.contains("active") &&
        !sidePanel.contains(e.target) &&
        !e.target.closest("#header-menu-btn"))
    ) {
      sideMask.classList.remove("active");
      sidePanel.classList.remove("open");
    }
  });

  pageLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      goToTab(e.target.closest(".nav-link"));
    });
  });

  pickedRegionBtn.addEventListener("click", onAllRecipesClick);
  document
    .querySelectorAll(".region-btn")
    .forEach((btn) => btn.addEventListener("click", onRegionClick));
  document
    .querySelectorAll(".type-card")
    .forEach((card) => card.addEventListener("click", onTypeClick));

  let searchTimer;
  recipeSearch.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(async () => {
      const word = recipeSearch.value.trim();
      startLoader();
      if (word) await findRecipesByName(word);
      else {
        clearAllFilters();
        await loadRecipeList();
      }
      stopLoader();
    }, 350);
  });

  recipeBox.addEventListener("click", async (e) => {
    const card = e.target.closest(".recipe-card");
    if (card) await openRecipePage(card);
  });

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      activeViewBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");
      activeViewBtn = this;
      activeViewBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
      cardLayout = this.getAttribute("title") === "Grid View" ? "grid" : "list";
      showRecipes();
    });
  });

  servingUp.addEventListener("click", () => {
    if (+servingCount.innerText < 10)
      servingCount.innerText = +servingCount.innerText + 1;
  });
  servingDown.addEventListener("click", () => {
    if (+servingCount.innerText > 1)
      servingCount.innerText = +servingCount.innerText - 1;
  });

  confirmMealLog.addEventListener("click", () => {
    const qty = +servingCount.innerText;
    pushToTracker({
      name: itemWaitingToLog.name,
      image: itemWaitingToLog.image,
      qty,
      source: "Recipe",
      time: new Date().toISOString(),
      nutrition: {
        calories: itemWaitingToLog.nutrition.calories * qty,
        protein: itemWaitingToLog.nutrition.protein * qty,
        carbs: itemWaitingToLog.nutrition.carbs * qty,
        fat: itemWaitingToLog.nutrition.fat * qty,
      },
    });
    mealLogPopup.classList.add("hidden");
    servingCount.innerText = "1";
    itemWaitingToLog = null;
    Swal.fire({
      title: "Meal Logged!",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  });

  addProductBtn.addEventListener("click", () => {
    const grams = Math.max(
      1,
      +document.getElementById("product-grams").value || 100,
    );
    const nutrition = scaleProductNutrition(itemWaitingToLog.per100g, grams);
    pushToTracker({
      name: itemWaitingToLog.name,
      image: itemWaitingToLog.image,
      brand: itemWaitingToLog.brand,
      grams,
      qty: 1,
      source: "Product",
      time: new Date().toISOString(),
      nutrition,
    });
    productPopup.classList.add("hidden");
    itemWaitingToLog = null;
    Swal.fire({
      title: "Product Logged!",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  });

  document
    .getElementById("cancel-log-btn")
    .addEventListener("click", () => mealLogPopup.classList.add("hidden"));
  closeProductBtn.addEventListener("click", () =>
    productPopup.classList.add("hidden"),
  );

  document.addEventListener("click", (e) => {
    if (
      (!mealLogPopup.contains(e.target) && !e.target.closest("#modal-btn")) ||
      e.target.closest("#cancel-log-btn")
    ) {
      mealLogPopup.classList.add("hidden");
    }
    if (
      (!productPopup.contains(e.target) && !e.target.closest(".store-card")) ||
      e.target.closest("#cancel-product-log")
    ) {
      productPopup.classList.add("hidden");
    }
  });

  runProductSearch.addEventListener("click", async () => {
    showProductSpinner();
    const list = await findProductsByName(productSearchBox.value);
    showProducts(list);
    productSearchBox.value = "";
  });

  runBarcodeLookup.addEventListener("click", async () => {
    showProductSpinner();
    const product = await findProductByBarcode(barcodeBox.value);
    showProducts([product]);
    barcodeBox.value = "";
  });

  productBox.addEventListener("click", async (e) => {
    const card = e.target.closest(".store-card");
    if (!card) return;
    const product = await findProductByBarcode(
      card.getAttribute("data-barcode"),
    );
    openProductPopup(product);
  });

  document.querySelectorAll(".store-type-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      showProductSpinner();
      const list = await findProductsByType(
        e.target.closest(".store-type-btn").getAttribute("data-store-type"),
      );
      showProducts(list);
    });
  });

  gradeFilters.forEach((btn) => {
    btn.addEventListener("click", () => {
      gradeFilters.forEach((b) => {
        b.classList.remove("bg-emerald-600", "text-white");
        b.classList.add("opacity-80");
      });
      btn.classList.add("bg-emerald-600", "text-white");
      btn.classList.remove("opacity-80");
      filterByGrade(btn.getAttribute("data-grade"));
    });
  });

  document.querySelectorAll(".quick-log-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      if (index === 0) goToTab(document.getElementById("Meals-Recipes"));
      else if (index === 1) goToTab(document.getElementById("Product-Scanner"));
      else {
        Swal.fire({
          title: "Custom Food Entry",
          html: `<input id="custom-name" class="swal2-input" placeholder="Food name">
            <input id="custom-cal" class="swal2-input" type="number" placeholder="Calories">
            <input id="custom-pro" class="swal2-input" type="number" placeholder="Protein (g)">
            <input id="custom-carb" class="swal2-input" type="number" placeholder="Carbs (g)">
            <input id="custom-fat" class="swal2-input" type="number" placeholder="Fat (g)">`,
          showCancelButton: true,
          confirmButtonColor: "#059669",
          preConfirm: () => ({
            name: document.getElementById("custom-name").value,
            calories: +document.getElementById("custom-cal").value || 0,
            protein: +document.getElementById("custom-pro").value || 0,
            carbs: +document.getElementById("custom-carb").value || 0,
            fat: +document.getElementById("custom-fat").value || 0,
          }),
        }).then((r) => {
          if (r.isConfirmed && r.value.name) {
            pushToTracker({
              name: r.value.name,
              image: "",
              qty: 1,
              source: "Custom",
              time: new Date().toISOString(),
              nutrition: {
                calories: r.value.calories,
                protein: r.value.protein,
                carbs: r.value.carbs,
                fat: r.value.fat,
              },
            });
            paintTrackerPage();
            Swal.fire({
              title: "Added!",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
      }
    });
  });
}
function buildLoggedItemMeta(row) {
  const time = new Date(row.time).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (row.source === "Recipe") {
    const servings = row.qty || 1;
    return `
      <p class="text-xs text-gray-500 mt-0.5">${servings} serving${servings > 1 ? "s" : ""}</p>
      <div class="flex items-center gap-2 mt-1">
        <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Recipe</span>
        <span class="text-xs text-gray-400">${time}</span>
      </div>`;
  }

  if (row.source === "Product") {
    const amount = row.grams ? `${row.grams}g` : "100g";
    return `
      <p class="text-xs text-gray-500 mt-0.5">${row.brand || "Unknown brand"} • ${amount}</p>
      <div class="flex items-center gap-2 mt-1">
        <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Product</span>
        <span class="text-xs text-gray-400">${time}</span>
      </div>`;
  }

  return `
    <div class="flex items-center gap-2 mt-1">
      <span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Custom</span>
      <span class="text-xs text-gray-400">${time}</span>
    </div>`;
}

function paintTrackerPage() {
  const todayKey = getTodayKey();
  const todayEntries = getEntriesForDay(todayKey);
  const todayTotals = sumNutrition(todayEntries);

  calBar.style.width = pctOf(todayTotals.calories, DAILY_GOALS.calories) + "%";
  proteinBar.style.width =
    pctOf(todayTotals.protein, DAILY_GOALS.protein) + "%";
  carbsBar.style.width = pctOf(todayTotals.carbs, DAILY_GOALS.carbs) + "%";
  fatBar.style.width = pctOf(todayTotals.fat, DAILY_GOALS.fat) + "%";

  calText.innerText = `${Math.round(todayTotals.calories)} kcal / ${DAILY_GOALS.calories} kcal`;
  proteinText.innerText = `${Math.round(todayTotals.protein)} g / ${DAILY_GOALS.protein} g`;
  carbsText.innerText = `${Math.round(todayTotals.carbs)} g / ${DAILY_GOALS.carbs} g`;
  fatText.innerText = `${Math.round(todayTotals.fat)} g / ${DAILY_GOALS.fat} g`;
  calPct.innerText = `${pctOf(todayTotals.calories, DAILY_GOALS.calories)}%`;
  proteinPct.innerText = `${pctOf(todayTotals.protein, DAILY_GOALS.protein)}%`;
  carbsPct.innerText = `${pctOf(todayTotals.carbs, DAILY_GOALS.carbs)}%`;
  fatPct.innerText = `${pctOf(todayTotals.fat, DAILY_GOALS.fat)}%`;

  entryCountLabel.innerText = `Logged Items (${todayEntries.length})`;
  entryList.innerHTML = "";

  if (todayEntries.length === 0) {
    if (wipeLogBtn) wipeLogBtn.style.display = "none";
    entryList.innerHTML = `
      <div class="flex flex-col items-center justify-center py-10 gap-3">
        <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <i class="fa-solid fa-utensils text-gray-300 text-2xl"></i>
        </div>
        <p class="font-semibold text-gray-700">No food logged today</p>
        <p class="text-sm text-gray-400">Log meals from recipes or scan products</p>
        <div class="flex gap-3 mt-2">
          <button id="empty-go-meals" class="bg-emerald-500 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
            <i class="fa-solid fa-plus mr-1"></i>Browse Recipes
          </button>
          <button id="empty-go-products" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
            <i class="fa-solid fa-barcode mr-1"></i>Scan Product
          </button>
        </div>
      </div>`;
    document.getElementById("empty-go-meals").onclick = () =>
      goToTab(document.getElementById("Meals-Recipes"));
    document.getElementById("empty-go-products").onclick = () =>
      goToTab(document.getElementById("Product-Scanner"));
    paintWeekGrid();
    paintWeeklyStats();
    return;
  }

  if (wipeLogBtn) wipeLogBtn.style.display = "inline-flex";

  for (let i = 0; i < todayEntries.length; i++) {
    const row = todayEntries[i];
    const rowEl = document.createElement("div");
    rowEl.className =
      "flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100";

    let thumbHtml = "";
    if (row.image) {
      thumbHtml = `<img src="${row.image}" alt="${row.name}" class="w-14 h-14 rounded-lg object-cover shrink-0" />`;
    } else if (row.source === "Product") {
      thumbHtml = `<div class="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center shrink-0"><i class="fa-solid fa-bag-shopping text-blue-500 text-xl"></i></div>`;
    } else {
      thumbHtml = `<div class="w-14 h-14 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0"><i class="fa-solid fa-utensils text-emerald-500 text-xl"></i></div>`;
    }

    rowEl.innerHTML = `
      ${thumbHtml}
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-gray-900 text-sm truncate">${row.name}</h3>
        ${buildLoggedItemMeta(row)}
      </div>
      <div class="flex items-center gap-5 shrink-0">
        <div class="text-right">
          <p class="text-2xl font-bold text-emerald-500 leading-none">${formatMacro(row.nutrition.calories)}</p>
          <p class="text-xs text-gray-400 mt-0.5">kcal</p>
        </div>
        <div class="flex gap-3 text-xs text-gray-500">
          <span><b class="text-gray-700">${formatMacro(row.nutrition.protein)}g</b> P</span>
          <span><b class="text-gray-700">${formatMacro(row.nutrition.carbs)}g</b> C</span>
          <span><b class="text-gray-700">${formatMacro(row.nutrition.fat)}g</b> F</span>
        </div>
        <button type="button" class="remove-entry text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors" data-time="${row.time}" aria-label="Remove item">
          <i class="fa-solid fa-trash text-sm"></i>
        </button>
      </div>`;
    entryList.append(rowEl);
  }

  paintWeekGrid();
  paintWeeklyStats();
}

function paintWeekGrid() {
  const today = new Date();
  const todayKey = today.toDateString();
  weekChartBox.innerHTML = "";

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayKey = day.toDateString();
    const dayEntries = getEntriesForDay(dayKey);
    const dayTotals = sumNutrition(dayEntries);
    const isToday = dayKey === todayKey;

    const col = document.createElement("div");
    col.className = `${isToday ? "bg-indigo-100 rounded-xl p-3" : "p-3"} text-center`;
    col.innerHTML = `
      <p class="text-xs text-gray-500">${day.toLocaleDateString("en-US", { weekday: "short" })}</p>
      <p class="text-lg font-bold text-gray-900">${day.getDate()}</p>
      <p class="text-xl font-bold ${dayTotals.calories > 0 ? "text-emerald-600" : "text-gray-300"}">${Math.round(dayTotals.calories)}</p>
      <p class="text-xs ${dayTotals.calories > 0 ? "text-emerald-600" : "text-gray-300"}">kcal</p>
      <p class="text-xs text-gray-400 mt-1">${dayEntries.length} item${dayEntries.length === 1 ? "" : "s"}</p>`;
    weekChartBox.append(col);
  }
}

function paintWeeklyStats() {
  const today = new Date();
  let weekCalories = 0;
  let weekItems = 0;
  let daysOnGoal = 0;

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayEntries = getEntriesForDay(day.toDateString());
    const dayTotals = sumNutrition(dayEntries);
    weekCalories += dayTotals.calories;
    weekItems += dayEntries.length;
    if (dayTotals.calories > 0 && dayTotals.calories <= DAILY_GOALS.calories) {
      daysOnGoal++;
    }
  }

  weeklyAvgEl.innerText = `${Math.round(weekCalories / 7)} kcal`;
  weeklyItemsEl.innerText = `${weekItems} items`;
  daysOnGoalEl.innerText = `${daysOnGoal} / 7`;
}

async function loadRegions() {
  const row = document.getElementById("areas-container");
  const res = await fetch(`${API_URL}/meals/areas`);
  const json = await res.json();
  allAreas = json.results || [];

  for (let i = 0; i < Math.min(10, allAreas.length); i++) {
    const btn = document.createElement("button");
    btn.className =
      "region-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all";
    btn.textContent = allAreas[i].name;
    btn.setAttribute("data-region", allAreas[i].name);
    row.append(btn);
  }
}

async function loadTypes() {
  const grid = document.getElementById("categories-grid");
  const res = await fetch(`${API_URL}/meals/categories`);
  const json = await res.json();

  const allCard = document.createElement("div");
  allCard.id = "type-all-card";
  allCard.className = `type-card bg-gradient-to-br rounded-xl p-3 border cursor-pointer transition-all ${typeThemes.All.active.split(" ").join(" ")}`;
  allCard.setAttribute("data-category", "All");
  allCard.innerHTML = `<div class="flex items-center gap-2.5"><div class="text-white w-9 h-9 bg-gradient-to-br ${typeThemes.All.iconBg} rounded-lg flex items-center justify-center"><i class="${typeThemes.All.icon}"></i></div><h3 class="text-sm font-bold text-gray-900">All</h3></div>`;
  grid.append(allCard);
  pickedTypeCard = allCard;

  for (let i = 0; i < Math.min(11, json.results.length); i++) {
    const name = json.results[i].name;
    const theme = typeThemes[name] || typeThemes.Miscellaneous;
    const card = document.createElement("div");
    card.className = `type-card bg-gradient-to-br rounded-xl p-3 border ${theme.idle} hover:shadow-md cursor-pointer transition-all group`;
    card.setAttribute("data-category", name);
    card.innerHTML = `<div class="flex items-center gap-2.5"><div class="text-white w-9 h-9 bg-gradient-to-br ${theme.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><i class="${theme.icon}"></i></div><h3 class="text-sm font-bold text-gray-900">${name}</h3></div>`;
    grid.append(card);
  }
}

async function loadRecipeList(
  ingredient = "",
  type = activeType,
  region = activeRegion,
) {
  let res;
  if (ingredient || region || (type && type !== "All")) {
    res = await fetch(
      `${API_URL}/meals/filter?ingredient=${ingredient}&category=${type !== "All" ? type : ""}&area=${region}&limit=25`,
    );
  } else {
    res = await fetch(`${API_URL}/meals/random?count=25`);
  }
  const json = await res.json();
  recipeList = json.results || [];
  showRecipes();
}

function getMatchingAreas(query) {
  const lower = query.toLowerCase();
  return allAreas
    .filter((area) => area.name.toLowerCase().includes(lower))
    .map((area) => area.name);
}

async function findRecipesByName(word) {
  const q = word.trim();
  if (!q) return;

  const urls = new Set([
    `${API_URL}/meals/search?q=${encodeURIComponent(q)}&page=1&limit=25`,
    `${API_URL}/meals/filter?ingredient=${encodeURIComponent(q)}&category=&area=&limit=25`,
    `${API_URL}/meals/filter?ingredient=&category=&area=${encodeURIComponent(q)}&limit=25`,
  ]);

  for (const area of getMatchingAreas(q)) {
    urls.add(
      `${API_URL}/meals/filter?ingredient=&category=&area=${encodeURIComponent(area)}&limit=25`,
    );
  }

  const jsons = await Promise.all(
    [...urls].map((url) => fetch(url).then((res) => res.json())),
  );

  const byId = new Map();
  for (let i = 0; i < jsons.length; i++) {
    const items = jsons[i].results || [];
    for (let j = 0; j < items.length; j++) {
      if (!byId.has(items[j].id)) byId.set(items[j].id, items[j]);
    }
  }

  recipeList = Array.from(byId.values());
  clearAllFilters();
  lastSearchWord = word;
  showRecipes();
  lastSearchWord = "";
}

function showRecipes() {
  recipeBox.innerHTML = "";

  let text = `Showing ${recipeList.length} recipes`;
  if (activeRegion)
    text = `Showing ${recipeList.length} ${activeRegion} recipes`;
  else if (activeType !== "All")
    text = `Showing ${recipeList.length} ${activeType} recipes`;
  if (lastSearchWord) text += ` for "${lastSearchWord}"`;
  recipeCountLabel.textContent = text;

  if (recipeList.length === 0) {
    recipeBox.className = "grid grid-cols-1 gap-5";
    recipeBox.innerHTML = `<div class="col-span-full flex flex-col items-center py-12 text-center"><i class="fa-solid fa-search text-4xl text-gray-300 mb-3"></i><p class="text-gray-500 text-lg">No recipes found</p></div>`;
    return;
  }

  const isGrid = cardLayout === "grid";
  recipeBox.className = isGrid
    ? "grid grid-cols-4 gap-5"
    : "grid grid-cols-1 gap-5";

  for (let i = 0; i < recipeList.length; i++) {
    const item = recipeList[i];
    const card = document.createElement("div");
    card.className = isGrid
      ? "recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
      : "recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-row h-40";
    card.setAttribute("data-id", item.id);

    const imgWrap = document.createElement("div");
    imgWrap.className = isGrid
      ? "relative h-48 overflow-hidden"
      : "relative w-48 h-full shrink-0 overflow-hidden";
    imgWrap.innerHTML = `<img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${item.thumbnail}" alt="${item.name}" />
      <div class="absolute bottom-3 left-3 flex gap-2 ${isGrid ? "" : "hidden"}">
        <span class="px-2 py-1 bg-white/90 text-xs font-semibold rounded-full">${item.category}</span>
        <span class="px-2 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">${item.area || "International"}</span>
      </div>`;

    const body = document.createElement("div");
    body.className = "p-4";
    body.innerHTML = `
      <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 line-clamp-1">${item.name}</h3>
      <p class="text-xs text-gray-600 mb-3 line-clamp-2">${item.instructions ? item.instructions[0] : ""}</p>
      <div class="flex justify-between text-xs">
        <span class="font-semibold"><i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${item.category}</span>
        <span class="font-semibold text-gray-500"><i class="fa-solid fa-globe text-blue-500 mr-1"></i>${item.area || "International"}</span>
      </div>`;

    card.append(imgWrap, body);
    recipeBox.append(card);
  }
}

async function analyzeRecipeNutrition(meal) {
  const lines = [];
  for (let i = 0; i < meal.ingredients.length; i++) {
    lines.push(
      meal.ingredients[i].measure + " " + meal.ingredients[i].ingredient,
    );
  }
  const res = await fetch(`${API_URL}/nutrition/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": NUTRITION_KEY },
    body: JSON.stringify({ recipeName: meal.name, ingredients: lines }),
  });
  const json = await res.json();
  return json.data;
}

function nutritionRow(label, grams, percent, barColor) {
  return `
    <div class="mb-3">
      <div class="flex justify-between text-sm"><span>${label}</span><span class="font-bold">${grams}g</span></div>
      <div class="w-full bg-gray-100 rounded-full h-2 mt-1"><div class="${barColor} h-2 rounded-full" style="width:${percent}%"></div></div>
    </div>`;
}

async function openRecipePage(card) {
  recipeSearch.value = "";
  startLoader();

  const id = card.getAttribute("data-id");
  const mealRes = await fetch(`${API_URL}/meals/${id}`);
  const mealJson = await mealRes.json();
  const meal = mealJson.result;
  const facts = await analyzeRecipeNutrition(meal);

  const per = facts.perServing;
  stopLoader();
  homePage.classList.add("hidden");
  detailPage.classList.remove("hidden");

  document.getElementById("meal-hero-img").src = meal.thumbnail;
  document.getElementById("meal-title").textContent = meal.name;
  document.getElementById("hero-calories").textContent =
    `${per.calories} cal/serving`;

  let badgeHtml = `<span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.category}</span>
    <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.area || "International"}</span>`;
  if (meal.tags) {
    for (let t = 0; t < meal.tags.length; t++) {
      badgeHtml += `<span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">${meal.tags[t]}</span>`;
    }
  }
  document.getElementById("meal-badges").innerHTML = badgeHtml;

  document.getElementById("ingredients-count").textContent =
    `${meal.ingredients.length} items`;
  document.getElementById("ingredients-list").innerHTML = meal.ingredients
    .map(
      (ing) =>
        `<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><input type="checkbox" class="w-5 h-5 text-emerald-600 rounded" /><span><strong>${ing.measure}</strong> ${ing.ingredient}</span></div>`,
    )
    .join("");

  document.getElementById("instructions-list").innerHTML = meal.instructions
    .map(
      (step, n) =>
        `<div class="flex gap-4 p-4 rounded-xl"><div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">${n + 1}</div><p class="pt-2 text-gray-700">${step}</p></div>`,
    )
    .join("");

  document.getElementById("meal-video").src = meal.youtube
    ? `https://www.youtube.com/embed/${getVideoId(meal.youtube)}`
    : "";

  const pCal = pctOf(per.calories, DAILY_GOALS.calories);
  const pPro = pctOf(per.protein, DAILY_GOALS.protein);
  const pCarb = pctOf(per.carbs, DAILY_GOALS.carbs);
  const pFat = pctOf(per.fat, DAILY_GOALS.fat);
  const pFiber = pctOf(per.fiber || 0, 25);
  const pSugar = pctOf(per.sugar || 0, 50);

  document.getElementById("nutrition-facts-container").innerHTML = `
    <p class="text-sm text-gray-500 mb-4">Per serving</p>
    <div class="text-center py-4 mb-4 bg-emerald-50 rounded-xl">
      <p class="text-sm text-gray-600">Calories per serving</p>
      <p class="text-4xl font-bold text-emerald-600">${per.calories}</p>
      <p class="text-xs text-gray-500 mt-1">Total: ${facts.totals.calories} cal</p>
    </div>
    ${nutritionRow("Protein", per.protein, pPro, "bg-emerald-500")}
    ${nutritionRow("Carbs", per.carbs, pCarb, "bg-blue-500")}
    ${nutritionRow("Fat", per.fat, pFat, "bg-purple-500")}
    ${nutritionRow("Fiber", per.fiber || 0, pFiber, "bg-orange-500")}
    ${nutritionRow("Sugar", per.sugar || 0, pSugar, "bg-pink-500")}
    <div class="mt-4 pt-4 border-t text-sm space-y-2">
      <div class="flex justify-between"><span class="text-gray-600">Cholesterol</span><span>${per.cholesterol || 0}mg</span></div>
      <div class="flex justify-between"><span class="text-gray-600">Sodium</span><span>${per.sodium || 0}mg</span></div>
      <div class="flex justify-between"><span class="text-gray-600">Saturated Fat</span><span>${per.saturatedFat || 0}g</span></div>
    </div>`;

  document.getElementById("back-to-meals-btn").onclick = async () => {
    detailPage.classList.add("hidden");
    homePage.classList.remove("hidden");
    clearAllFilters();
    startLoader();
    await loadRecipeList();
    stopLoader();
  };

  document.getElementById("modal-btn").onclick = () => {
    itemWaitingToLog = {
      name: meal.name,
      image: meal.thumbnail,
      nutrition: {
        calories: per.calories,
        protein: per.protein,
        carbs: per.carbs,
        fat: per.fat,
      },
    };
    document.getElementById("modal-img").src = meal.thumbnail;
    document.getElementById("modal-meal-name").innerText = meal.name;
    document.getElementById("modal-meal-calories").innerText = per.calories;
    document.getElementById("modal-meal-protien").innerText = per.protein;
    document.getElementById("modal-meal-carbs").innerText = per.carbs;
    document.getElementById("modal-meal-fat").innerText = per.fat;
    servingCount.innerText = "1";
    mealLogPopup.classList.remove("hidden");
  };
}

function onRegionClick(e) {
  recipeSearch.value = "";
  const btn = e.target.closest(".region-btn");
  if (!btn) return;

  switchClasses(
    pickedRegionBtn,
    ["bg-emerald-600", "text-white", "hover:bg-emerald-700"],
    ["bg-gray-100", "text-gray-700", "hover:bg-gray-200"],
  );
  pickedRegionBtn = btn;
  switchClasses(
    pickedRegionBtn,
    ["bg-gray-100", "text-gray-700", "hover:bg-gray-200"],
    ["bg-emerald-600", "text-white", "hover:bg-emerald-700"],
  );
  activeRegion = btn.getAttribute("data-region");

  resetTypeOnly();
  startLoader();
  loadRecipeList().then(stopLoader);
}

function onAllRecipesClick() {
  recipeSearch.value = "";
  clearAllFilters();
  startLoader();
  loadRecipeList().then(stopLoader);
}

function onTypeClick(e) {
  recipeSearch.value = "";
  const card = e.target.closest(".type-card");
  const oldType = pickedTypeCard.getAttribute("data-category");

  switchClasses(
    pickedTypeCard,
    typeThemes[oldType].active.split(" "),
    typeThemes[oldType].idle.split(" "),
  );
  pickedTypeCard = card;
  activeType = card.getAttribute("data-category");
  switchClasses(
    pickedTypeCard,
    typeThemes[activeType].idle.split(" "),
    typeThemes[activeType].active.split(" "),
  );

  resetRegionOnly();

  startLoader();
  loadRecipeList().then(stopLoader);
}

async function loadStoreTypes() {
  const res = await fetch(`${API_URL}/products/categories`);
  const json = await res.json();
  productTypeRow.innerHTML = "";

  for (let i = 0; i < Math.min(10, json.results.length); i++) {
    const item = json.results[i];
    const theme = storeThemes[item.id] || {
      idle: "from-gray-50 to-slate-50 border-gray-200",
      icon: "fa-tag",
    };
    const btn = document.createElement("button");
    btn.className = `store-type-btn px-4 py-2 bg-gradient-to-br border ${theme.idle} text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap transition-all`;
    btn.setAttribute("data-store-type", item.id);
    btn.innerHTML = `<i class="fa-solid ${theme.icon} mr-1.5"></i>${item.name}`;
    productTypeRow.append(btn);
  }
}

async function findProductsByName(name) {
  const res = await fetch(
    `${API_URL}/products/search?q=${name}&page=1&limit=24`,
  );
  const json = await res.json();
  productList = json.results || [];
  return productList;
}

async function findProductByBarcode(code) {
  const res = await fetch(`${API_URL}/products/barcode/${code}`);
  const json = await res.json();
  productList = [json.result];
  return json.result;
}

async function findProductsByType(typeId) {
  const res = await fetch(`${API_URL}/products/category/${typeId}`);
  const json = await res.json();
  productList = json.results || [];
  return productList;
}

function showProducts(list) {
  const countEl = document.getElementById("products-count");
  productBox.innerHTML = "";

  if (!list.length) {
    productBox.className = "grid grid-cols-1";
    productBox.innerHTML = `<div class="flex flex-col items-center py-12 text-center"><i class="fa-solid fa-box-open text-4xl text-gray-300 mb-3"></i><p class="text-gray-500">No products found</p></div>`;
    if (countEl) countEl.textContent = "0 products found";
    return;
  }

  if (countEl) countEl.textContent = `${list.length} products found`;
  productBox.className =
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5";

  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    const n = p.nutrients || {};
    const grade = (p.nutritionGrade || "").toLowerCase();
    const card = document.createElement("div");
    card.className =
      "store-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg cursor-pointer group";
    card.setAttribute("data-barcode", p.barcode);
    card.innerHTML = `
      <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img class="w-full h-full object-contain group-hover:scale-110 transition-transform" src="${p.image}" alt="${p.name}" />
        <div class="absolute top-2 left-2 ${gradeColors[grade] || "bg-gray-400"} text-white text-xs font-bold px-2 py-1 rounded uppercase">Nutri-Score ${grade.toUpperCase()}</div>
        <div class="absolute top-2 right-2 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" style="background:${novaBg[p.novaGroup] || "#999"}">${p.novaGroup || "?"}</div>
      </div>
      <div class="p-4">
        <p class="text-xs text-emerald-600 font-semibold truncate">${p.brand}</p>
        <h3 class="font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-600">${p.name}</h3>
        <p class="text-xs text-gray-500 mt-2"><i class="fa-solid fa-fire mr-1"></i>${(n.calories || 0).toFixed(1)} kcal/100g</p>
        <div class="grid grid-cols-4 gap-1 text-center text-xs mt-2">
          <div class="bg-emerald-50 rounded p-1"><b>${(n.protein || 0).toFixed(1)}g</b><br>Protein</div>
          <div class="bg-blue-50 rounded p-1"><b>${(n.carbs || 0).toFixed(1)}g</b><br>Carbs</div>
          <div class="bg-purple-50 rounded p-1"><b>${(n.fat || 0).toFixed(1)}g</b><br>Fat</div>
          <div class="bg-orange-50 rounded p-1"><b>${(n.sugar || 0).toFixed(1)}g</b><br>Sugar</div>
        </div>
      </div>`;
    productBox.append(card);
  }
}

function filterByGrade(grade) {
  if (!grade) {
    showProducts(productList);
    return;
  }
  const filtered = [];
  for (let i = 0; i < productList.length; i++) {
    if ((productList[i].nutritionGrade || "").toLowerCase() === grade) {
      filtered.push(productList[i]);
    }
  }
  showProducts(filtered);
}

function openProductPopup(product) {
  const n = product.nutrients || {};
  document.getElementById("product-modal-img").src = product.image;
  document.getElementById("modal-brand").innerText = product.brand;
  document.getElementById("modal-name").innerText = product.name;

  const nutriEl = document.getElementById("modal-nutri");
  nutriEl.innerText = `Nutri-Score ${(product.nutritionGrade || "").toUpperCase()}`;
  nutriEl.className = `text-white text-xs font-bold px-2 py-1 rounded uppercase ${gradeColors[product.nutritionGrade] || "bg-gray-400"}`;

  const novaEl = document.getElementById("modal-nova");
  novaEl.innerText = product.novaGroup || "?";
  novaEl.style.backgroundColor = novaBg[product.novaGroup] || "#999";

  document.getElementById("modal-calories").innerText = (
    n.calories || 0
  ).toFixed(1);
  document.getElementById("modal-protein").innerText = (n.protein || 0).toFixed(
    1,
  );
  document.getElementById("modal-carbs").innerText = (n.carbs || 0).toFixed(1);
  document.getElementById("modal-fat").innerText = (n.fat || 0).toFixed(1);
  document.getElementById("modal-sugar").innerText = (n.sugar || 0).toFixed(1);
  document.getElementById("modal-fiber").innerText = (n.fiber || 0).toFixed(1);
  document.getElementById("product-grams").value = "100";

  itemWaitingToLog = {
    name: product.name,
    image: product.image || "",
    brand: product.brand || "",
    per100g: {
      calories: n.calories || 0,
      protein: n.protein || 0,
      carbs: n.carbs || 0,
      fat: n.fat || 0,
    },
  };
  productPopup.classList.remove("hidden");
}

function showProductSpinner() {
  productBox.className = "grid grid-cols-1";
  productBox.innerHTML = `<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>`;
}

async function startApp() {
  startLoader();
  try {
    await loadRegions();
    await loadTypes();
    await loadRecipeList();
    await loadStoreTypes();
  } catch (err) {
    console.error("Failed to load app data:", err);
  } finally {
    stopLoader();
    hookEvents();
  }
}

hookFoodLogEvents();
startApp();
