// script.js
const accList = document.getElementById("accList");
const filterType = document.getElementById("filterType");

async function fetchAccounts() {
  const res = await fetch(
    "https://api.github.com/repos/Bunnyneee/Shop_Acc_Bexiu/contents/data.json"
  );
  const data = await res.json();
  const content = atob(data.content);
  return JSON.parse(content);
}

function createAccCard(acc) {
  const card = document.createElement("div");
  card.className = "acc-card";

  const img = document.createElement("img");
  img.src = acc.images?.[0] || "https://via.placeholder.com/300x400?text=No+Image";
  img.alt = "Acc Image";
  img.onclick = () => showPopupImage(acc.images?.[0]);

  const content = document.createElement("div");
  content.className = "acc-content";

  const title = document.createElement("h3");
  title.textContent = `Acc #${acc.id}`;

  const level = document.createElement("p");
  level.textContent = `Cấp: ${acc.level}`;

  const rank = document.createElement("p");
  rank.textContent = `Rank: ${acc.rank}`;

  const tags = document.createElement("div");
  acc.links.forEach((l) => {
    const tag = document.createElement("span");
    tag.className = "badge";
    tag.textContent = l;
    tags.appendChild(tag);
  });

  content.appendChild(title);
  content.appendChild(level);
  content.appendChild(rank);
  content.appendChild(tags);
  card.appendChild(img);
  card.appendChild(content);

  return card;
}

function showPopupImage(src) {
  const popup = document.getElementById("imagePopup");
  const popupImg = document.getElementById("popupImg");
  popupImg.src = src;
  popup.style.display = "flex";
}

function displayAccounts(accs) {
  accList.innerHTML = "";
  accs.forEach((acc) => {
    accList.appendChild(createAccCard(acc));
  });
}

async function init() {
  const data = await fetchAccounts();
  let accs = data.accounts.filter((a) => !a.sold);

  displayAccounts(accs);

  filterType.addEventListener("change", () => {
    const val = filterType.value;
    const filtered =
      val === "all" ? accs : accs.filter((a) => a.links.includes(val));
    displayAccounts(filtered);
  });
}

init();
