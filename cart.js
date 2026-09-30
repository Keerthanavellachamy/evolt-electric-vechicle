// ===== EVOLT MOTORS — Cart (LocalStorage) =====

const Cart = (() => {
  const KEY = 'evolt_cart';

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }

  function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    updateCartCount();
  }

  function add(vehicleId, qty = 1) {
    const items = getAll();
    const existing = items.find(i => i.id === vehicleId);
    if (existing) existing.qty += qty;
    else items.push({ id: vehicleId, qty });
    save(items);
  }

  function updateQty(vehicleId, qty) {
    let items = getAll();
    if (qty <= 0) { items = items.filter(i => i.id !== vehicleId); }
    else { const it = items.find(i => i.id === vehicleId); if (it) it.qty = qty; }
    save(items);
  }

  function remove(vehicleId) {
    save(getAll().filter(i => i.id !== vehicleId));
  }

  function clear() { save([]); }

  function count() { return getAll().reduce((s, i) => s + i.qty, 0); }

  function totals() {
    const items = getAll();
    let subtotal = 0;
    items.forEach(i => {
      const v = getVehicleById(i.id);
      if (v) subtotal += v.price * i.qty;
    });
    const discount = subtotal > 300000 ? Math.round(subtotal * 0.03) : 0;
    const delivery = subtotal > 0 ? (subtotal > 200000 ? 0 : 1500) : 0;
    const total = subtotal - discount + delivery;
    return { subtotal, discount, delivery, total };
  }

  function updateCartCount() {
    const el = document.getElementById('cartCount');
    if (el) el.textContent = count();
  }

  return { getAll, add, updateQty, remove, clear, count, totals, updateCartCount };
})();
