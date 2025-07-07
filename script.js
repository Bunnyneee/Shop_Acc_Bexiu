let accs = [];

async function loadAccs() {
  try {
    const res = await fetch('data/accs.json');
    accs = await res.json();
    renderAccs();
  } catch (e) {
    console.error('Lỗi khi tải accs:', e);
  }
}

function renderAccs() {
  const filter = document.getElementById('filterType').value;
  const accList = document.getElementById('accList');
  accList.innerHTML = '';

  let filtered = accs.filter(acc => !acc.sold);
  if (filter !== 'all') {
    filtered = filtered.filter(acc => acc.lienket.includes(filter));
  }

  filtered.forEach(acc => {
    const card = document.createElement('div');
    card.className = 'acc-card';

    const img = document.createElement('img');
    img.src = acc.images[0] || 'images/default.jpg';
    card.appendChild(img);

    const content = document.createElement('div');
    content.className = 'acc-content';
    content.innerHTML = `
      <h3>Acc #${acc.id}</h3>
      <p>Cấp: ${acc.level}</p>
      <p>Rank: ${acc.rank}</p>
      <p>
        ${acc.lienket.map(lk => `<span class="badge">${lk}</span>`).join('')}
      </p>
    `;

    card.appendChild(content);
    accList.appendChild(card);
  });
}

document.getElementById('filterType').addEventListener('change', renderAccs);

loadAccs();
