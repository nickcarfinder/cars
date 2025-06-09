(function() {
  function extractData() {
    const data = {};
    data.brand = document.querySelector('h1')?.textContent?.trim() || '';
    data.price = document.querySelector('[data-testid="prime-price"]')?.textContent?.trim() || '';
    data.mileage = Array.from(document.querySelectorAll('.u-block')).find(el => el.textContent.includes('km'))?.textContent?.trim() || '';
    const features = [];
    document.querySelectorAll('[data-testid="basic-details-item"]').forEach(el => {
      const t = el.textContent.trim();
      if (t && !t.includes('km') && !t.includes('€')) features.push(t);
    });
    data.features = features.slice(0, 3).join(', ');
    data.url = window.location.href;
    return data;
  }

  function addButton() {
    if (document.getElementById('copy-to-table-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'copy-to-table-btn';
    btn.textContent = '📋 Копіювати до таблиці';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      padding: '8px 12px',
      background: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    });
    btn.addEventListener('click', async () => {
      const data = extractData();
      const res = await chrome.storage.local.get('cars');
      const list = res.cars || [];
      list.push(data);
      await chrome.storage.local.set({ cars: list });
      btn.textContent = '✅ Скопійовано!';
      setTimeout(() => { btn.textContent = '📋 Копіювати до таблиці'; }, 2000);
    });
    document.body.appendChild(btn);
  }

  addButton();
})();
