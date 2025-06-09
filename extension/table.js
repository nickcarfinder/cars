(async function() {
  const res = await chrome.storage.local.get('cars');
  const cars = res.cars;
  if (cars && cars.length && typeof window.addCarFromExtension === 'function') {
    cars.forEach(car => window.addCarFromExtension(car));
    await chrome.storage.local.remove('cars');
  }
})();
