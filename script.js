// Dữ liệu mẫu
let accs = [
  {
    id: 1,
    rank: 'Cao',
    level: 45,
    lienket: ['Gmail', 'Facebook'],
    images: ['images/1a.jpg', 'images/1b.jpg'],
    sold: false,
  },
  {
    id: 2,
    rank: 'Thấp',
    level: 20,
    lienket: ['Facebook Die', 'Game Center'],
    images: ['images/2a.jpg'],
    sold: true,
  },
  {
    id: 3,
    rank: 'Trung bình',
    level: 35,
    lienket: ['Gmail'],
    images: ['images/3a.jpg', 'images/3b.jpg', 'images/3c.jpg'],
    sold: false,
  }
];

// Gán quyền admin
let IS_ADMIN = localStorage.getItem('isAdmin') === 'true';

// Lấy DOM
const accList = document.getElementById('accList');
const filterType = document.getElementById('filterType');
const tabs = document.querySelectorAll('.tab');
let currentTab = 'available';

// Giao diện đăng nhập admin đơn giản
if (!IS_ADMIN) {
  const pass = prompt("Nếu bạn là admin, hãy nhập mật khẩu:");
  if (pass === 'admin123') {
    IS_ADMIN = true;
    localStorage.setItem('isAdmin', 'true');
    alert('Chào admin!');
  }
}

// Render
function renderAccs() {
  accList.innerHTML = '';

  const filter = filterType.value;
  const showSold = currentTab === 'sold';

  accs.forEach((acc) => {
    if (acc.sold !== showSold) return;
    if (filter !== 'all' && !acc.lienket.includes(filter)) return;

    const card = document.createElement('div');
    card.className = 'acc-card';

    const img = document.createElement('img');
    img.src = acc.images[0];
    img.alt = 'Acc Image';
    img.addEventListener('click', () => showImageModal(acc.images));

    const content = document.createElement('div');
    content.className = 'acc-content';
    content.innerHTML = `
      <h3>Acc #${acc.id}</h3>
      <p>Cấp: ${acc.level}</p>
      <p>Rank: ${acc.rank}</p>
      <p>${acc.lienket.map(lk => `<span class="badge">${lk}</span>`).join(' ')}</p>
    `;

    if (IS_ADMIN) {
      const adminPanel = document.createElement('div');
      adminPanel.className = 'action-admin';

      const btnDelete = document.createElement('button');
      btnDelete.textContent = 'Xoá';
      btnDelete.onclick = () => {
        if (confirm(`Bạn có chắc muốn xoá acc #${acc.id}?`)) {
          accs = accs.filter(a => a.id !== acc.id);
          renderAccs();
        }
      };

      const btnSold = document.createElement('button');
      btnSold.textContent = acc.sold ? 'Khôi phục' : 'Đã bán';
      btnSold.onclick = () => {
        acc.sold = !acc.sold;
        renderAccs();
      };

      adminPanel.appendChild(btnSold);
      adminPanel.appendChild(btnDelete);
      card.appendChild(adminPanel);
    }

    card.appendChild(img);
    card.appendChild(content);
    accList.appendChild(card);
  });
}

// Modal xem ảnh
function showImageModal(images) {
  const modal = document.getElementById('imageModal');
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <span class="close-btn" onclick="document.getElementById('imageModal').classList.remove('active')">×</span>
    ${images.map(src => `<img src="${src}" />`).join('')}
  `;
  modal.classList.add('active');
}

// Sự kiện
filterType.addEventListener('change', renderAccs);
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.dataset.tab;
    renderAccs();
  });
});

// Khởi động
renderAccs();
