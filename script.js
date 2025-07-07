// script.js (📂 Thay toàn bộ file này)

const accListEl = document.getElementById("accList");
const filterEl = document.getElementById("filterType");
const tabEls = document.querySelectorAll(".tab");
const modal = document.getElementById("imageModal");
const modalContent = document.getElementById("modalContent");

const IS_ADMIN = false;
let accs = JSON.parse(localStorage.getItem("accs") || "[]");
let currentTab = "available";

function saveAccs() {
  localStorage.setItem("accs", JSON.stringify(accs));
}

function renderAccs() {
  accListEl.innerHTML = "";
  const filter = filterEl?.value || "all";

  const filtered = accs.filter(acc => {
    const matchTab = acc.status === currentTab;
    const matchLink = filter === "all" || acc.links.includes(filter);
    return matchTab && matchLink;
  });

  filtered.forEach(acc => {
    const card = document.createElement("div");
    card.className = "acc-card";
    card.innerHTML = `
      <img src="${acc.images[0]}" alt="Acc Image">
      <div class="acc-content">
        <h3>Acc #${acc.id}</h3>
        <p><strong>Cấp:</strong> ${acc.level}</p>
        <p><strong>Rank:</strong> ${acc.rank}</p>
        <div>${acc.links.map(link => `<span class="badge">${link}</span>`).join('')}</div>
      </div>
      ${IS_ADMIN ? `
        <button onclick="markSold(${acc.id})" class="delete-btn">Đã bán</button>
        <button onclick="removeAcc(${acc.id})" class="delete-btn">Xoá</button>
      ` : ""}
    `;
    card.addEventListener("click", () => showImages(acc.images));
    accListEl.appendChild(card);
  });
}

function showImages(images) {
  if (!images || images.length === 0) return;
  modalContent.innerHTML = `<span class="close-btn" onclick="document.getElementById('imageModal').classList.remove('active')">×</span>`;
  images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    modalContent.appendChild(img);
  });
  modal.classList.add("active");
}

function removeAcc(id) {
  if (!IS_ADMIN) return;
  if (!confirm("Bạn có chắc muốn xoá acc này?")) return;
  accs = accs.filter(acc => acc.id !== id);
  saveAccs();
  renderAccs();
}

function markSold(id) {
  if (!IS_ADMIN) return;
  const acc = accs.find(acc => acc.id === id);
  if (acc) acc.status = "sold";
  saveAccs();
  renderAccs();
}

filterEl?.addEventListener("change", renderAccs);

tabEls?.forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelector(".tab.active")?.classList.remove("active");
    tab.classList.add("active");
    currentTab = tab.dataset.tab;
    renderAccs();
  });
});

renderAccs();
