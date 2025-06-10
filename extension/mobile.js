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

  function showPopup(car) {
    const box = document.createElement('div');
    box.textContent =
      `\u0421\u043A\u043E\u043F\u0438\u0439\u043E\u0432\u0430\u043D\u043E: ${
        [car.brand, car.price, car.mileage].filter(Boolean).join(' | ')}`;
    Object.assign(box.style, {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#f0f0f0',
      color: '#000',
      padding: '8px 12px',
      borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      zIndex: 10000
    });
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 4000);
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
      showPopup(data);
      btn.textContent = '✅ Скопійовано!';
      setTimeout(() => { btn.textContent = '📋 Копіювати до таблиці'; }, 2000);
    });
    document.body.appendChild(btn);
  }

  addButton();
})();
