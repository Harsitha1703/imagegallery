// 1. Images list (own photos vennumna src ah "images/photo1.jpg" nu maathunga)
const images = [
  { src: "https://picsum.photos/id/10/800/600",  title: "Forest Path",   category: "nature" },
  { src: "https://picsum.photos/id/11/800/600",  title: "Misty Lake",    category: "nature" },
  { src: "https://picsum.photos/id/15/800/600",  title: "Waterfall",     category: "nature" },
  { src: "https://picsum.photos/id/42/800/600",  title: "Coffee Break",  category: "food" },
  { src: "https://picsum.photos/id/292/800/600", title: "Fresh Meal",    category: "food" },
  { src: "https://picsum.photos/id/122/800/600", title: "City Skyline",  category: "city" },
  { src: "https://picsum.photos/id/164/800/600", title: "Night Streets", category: "city" },
  { src: "https://picsum.photos/id/237/800/600", title: "Puppy",         category: "animals" },
  { src: "https://picsum.photos/id/659/800/600", title: "Wild Friend",   category: "animals" },
];

// 2. HTML elements
const gallery = document.getElementById("gallery");
const filters = document.getElementById("filters");
const searchBox = document.getElementById("search");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCaption = document.getElementById("lbCaption");
const themeBtn = document.getElementById("themeBtn");

let currentList = images;
let currentIndex = 0;
let activeCategory = "all";

// 3. Category + search serthu filter panrom
function applyFilters() {
  const text = searchBox.value.toLowerCase().trim();

  currentList = images.filter((item) => {
    const categoryOk = activeCategory === "all" || item.category === activeCategory;
    const searchOk = item.title.toLowerCase().includes(text);
    return categoryOk && searchOk;
  });

  showGallery();
}

// 4. Gallery kaattrom
function showGallery() {
  gallery.innerHTML = "";

  if (currentList.length === 0) {
    gallery.innerHTML = '<p class="empty">No images found 😕</p>';
    return;
  }

  currentList.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "item";
    card.innerHTML = `
      <img src="${item.src}" alt="${item.title}" loading="lazy" />
      <div class="title">${item.title}</div>
    `;
    card.addEventListener("click", () => openLightbox(index));
    gallery.appendChild(card);
  });
}

// 5. Filter buttons (category peyar + count kooda)
function makeFilters() {
  const categories = ["all", ...new Set(images.map((i) => i.category))];

  categories.forEach((cat) => {
    // count: all na ellam, illana antha category images mattum
    const count = cat === "all"
      ? images.length
      : images.filter((i) => i.category === cat).length;

    const btn = document.createElement("button");
    btn.textContent = `${cat} (${count})`;
    if (cat === "all") btn.classList.add("active");

    btn.addEventListener("click", () => {
      document.querySelectorAll("#filters button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      activeCategory = cat;
      applyFilters();
    });

    filters.appendChild(btn);
  });
}

searchBox.addEventListener("input", applyFilters);

// 6. Lightbox
// Image maarumbothu konjam fade aagi apram pudhu image kaattum
function showLightboxImage() {
  const item = currentList[currentIndex];

  lbImg.classList.add("fade");                 // fade out
  setTimeout(() => {
    lbImg.src = item.src;                      // image maathu
    lbCaption.textContent = `${item.title} (${currentIndex + 1} / ${currentList.length})`;
    lbImg.classList.remove("fade");            // fade in
  }, 150);
}

function openLightbox(index) {
  currentIndex = index;
  const item = currentList[currentIndex];
  lbImg.src = item.src;                        // first time fade illama direct ah
  lbCaption.textContent = `${item.title} (${currentIndex + 1} / ${currentList.length})`;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";     // back page scroll aagama
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function nextImage() {
  currentIndex = (currentIndex + 1) % currentList.length;
  showLightboxImage();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
  showLightboxImage();
}

document.getElementById("close").addEventListener("click", closeLightbox);
document.getElementById("next").addEventListener("click", nextImage);
document.getElementById("prev").addEventListener("click", prevImage);

// Black background click panna close
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard: Esc, left, right
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
});

// Mobile swipe: left ku swipe na next, right ku swipe na prev
let startX = 0;
lightbox.addEventListener("touchstart", (e) => {
  startX = e.changedTouches[0].clientX;
});
lightbox.addEventListener("touchend", (e) => {
  const diff = e.changedTouches[0].clientX - startX;
  if (Math.abs(diff) > 50) {
    diff < 0 ? nextImage() : prevImage();
  }
});

// 7. Dark / Light mode (refresh pannalum save aagum)
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const mode = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("theme", mode);
});

// 8. Start
makeFilters();
showGallery();