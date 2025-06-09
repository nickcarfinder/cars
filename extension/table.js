(async function() {
  const res = await chrome.storage.local.get('cars');
  const cars = res.cars;
  if (!cars || !cars.length) {
    return;
  }

  async function injectCars() {
    if (typeof window.addCarFromExtension === 'function') {
      cars.forEach(car => window.addCarFromExtension(car));
      await chrome.storage.local.remove('cars');
    } else {
      // Page scripts might not be loaded yet; retry shortly.
      setTimeout(injectCars, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCars);
  } else {
    injectCars();
  }
})();
