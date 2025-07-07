// script.js

const apiBase = 'https://api.github.com/repos/Bunnyneee/Shop_Acc_Bexiu/contents/data/accs.json';
const token = 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; // ⚠️ Nhớ thay bằng token thật có quyền ghi

// Load accs từ GitHub
async function loadAccs() {
  const res = await fetch(apiBase, {
    headers: { Authorization: `token ${token}` }
  });
  const data = await res.json();
  const contentRaw = atob(data.content);
  let contentParsed;

  try {
    contentParsed = JSON.parse(contentRaw);
  } catch (e) {
    contentParsed = { accounts: [] }; // fallback nếu sai định dạng
  }

  const accs = Array.isArray(contentParsed) ? contentParsed : contentParsed.accounts || [];
  return { accs, sha: data.sha };
}

// Lưu accs dạng chuẩn { accounts: [...] }
async function saveAccs(accs, sha) {
  const body = {
    message: 'Update accs.json',
    content: btoa(JSON.stringify({ accounts: accs }, null, 2)),
    sha: sha
  };
  const res = await fetch(apiBase, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return await res.json();
}

// Thêm acc
async function addAcc(newAcc) {
  const { accs, sha } = await loadAccs();
  const maxId = accs.reduce((max, acc) => Math.max(max, acc.id), 0);
  newAcc.id = maxId + 1;
  newAcc.sold = false;
  accs.push(newAcc);
  await saveAccs(accs, sha);
}

// Xoá acc theo ID
async function deleteAcc(id) {
  const { accs, sha } = await loadAccs();
  const updated = accs.filter(acc => acc.id !== id);
  await saveAccs(updated, sha);
}

// Đánh dấu đã bán
async function markSold(id) {
  const { accs, sha } = await loadAccs();
  const updated = accs.map(acc => acc.id === id ? { ...acc, sold: true } : acc);
  await saveAccs(updated, sha);
}
