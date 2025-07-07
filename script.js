let acList = JSON.parse(localStorage.getItem('accs') || '[]');
if (acList.length === 0) {
  fetch('acc.json').then(r => r.json()).then(d => {
    acList = d;
    localStorage.setItem('accs', JSON.stringify(acList));
    renderAll();
  });
} else renderAll();

function renderAll() {
  renderClient();
  renderAdmin();
}

function renderClient() {
  const tab = localStorage.getItem('tab') || 'forSale';
  document.querySelectorAll('.tabs button').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
    b.onclick = () => {
      localStorage.setItem('tab', b.dataset.tab);
      renderClient();
    };
  });

  const cont = document.getElementById('acc-container');
  if (!cont) return;
  cont.innerHTML = '';
  const filters = [...document.querySelectorAll('.filters input:checked')].map(i => i.getAttribute('data-link'));

  acList.filter(a => (tab === 'forSale' ? !a.sold : a.sold))
        .filter(a => filters.length === 0 || a.links.some(l => filters.includes(l)))
        .forEach(acc => {
    const d = document.createElement('div');
    d.className = 'card';
    if (acc.sold) d.innerHTML += `<span class="sold-badge">ĐÃ BÁN</span>`;
    d.innerHTML += `<img src="${acc.images[0]}"><h3>#${acc.id} - Lv${acc.level}</h3><p>Rank: ${acc.rank}</p>`;
    acc.links.forEach(l => d.innerHTML += `<span>${l}</span> `);
    d.onclick = () => openPopup(acc);
    cont.appendChild(d);
  });
}

function openPopup(acc) {
  const p = document.getElementById('popup');
  if (!p) return;
  p.classList.remove('hidden');
  let idx = 0;
  const imgEl = p.querySelector('.carousel img');
  const det = p.querySelector('.details');

  function show() {
    imgEl.src = acc.images[idx];
    det.innerHTML = `
      <h2>#${acc.id} - Lv${acc.level}</h2>
      <p>Rank: ${acc.rank}</p>
      <p>Liên kết: ${acc.links.join(', ')}</p>
      ${acc.sold ? '<p><b style="color:red">ĐÃ BÁN</b></p>' : ''}
    `;
  }

  show();
  p.querySelector('.prev').onclick = () => { idx = (idx - 1 + acc.images.length) % acc.images.length; show(); };
  p.querySelector('.next').onclick = () => { idx = (idx + 1) % acc.images.length; show(); };
  p.querySelector('.close').onclick = () => p.classList.add('hidden');
}

function renderAdmin() {
  if (sessionStorage.getItem('admin') !== '1') return;

  document.getElementById('login-panel')?.classList.add('hidden');
  document.getElementById('admin-section')?.classList.remove('hidden');
  const al = document.getElementById('admin-acc-list');
  if (!al) return;
  al.innerHTML = '';
  acList.forEach(acc => {
    const d = document.createElement('div');
    d.className = 'card';
    d.innerHTML = `<h3>#${acc.id} Lv${acc.level} - ${acc.rank}</h3><p>${acc.links.join(', ')}</p>`;
    const btn = document.createElement('button');
    btn.textContent = acc.sold ? 'Khôi phục' : 'Đã bán';
    btn.onclick = () => {
      acc.sold = !acc.sold;
      save(); renderAll();
    };
    d.appendChild(btn);
    al.appendChild(d);
  });
}

document.getElementById('login')?.addEventListener('click', () => {
  if (document.getElementById('pw').value === 'admin123') {
    sessionStorage.setItem('admin', '1');
    renderAll();
  } else {
    document.getElementById('login-msg').textContent = 'Sai mật khẩu';
  }
});

document.getElementById('add-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const lvl = document.getElementById('level').value;
  const rk = document.getElementById('rank').value;
  const links = [...document.querySelectorAll('input[name="link"]:checked')].map(i => i.value);
  if (links.length !== 2) return alert('Chọn đúng 2 liên kết');
  const files = document.getElementById('images').files;
  if (files.length === 0) return alert('Cần upload ít nhất 1 ảnh');
  const newId = acList.reduce((m, a) => Math.max(m, a.id), 0) + 1;
  const imgs = [];
  Array.from(files).forEach(f => {
    const r = new FileReader();
    r.onload = () => {
      imgs.push(r.result);
      if (imgs.length === files.length) {
        acList.push({ id: newId, level: lvl, rank: rk, links, images: imgs, sold: false });
        save(); renderAll(); document.getElementById('add-form').reset();
      }
    };
    r.readAsDataURL(f);
  });
});

function save() {
  localStorage.setItem('accs', JSON.stringify(acList));
}
