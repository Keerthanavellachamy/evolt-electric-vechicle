// ===== EVOLT MOTORS — Checkout & Orders (LocalStorage demo) =====

const Checkout = (() => {
  let selectedPayment = 'UPI';

  function selectPayment(method) {
    selectedPayment = method;
    document.querySelectorAll('.pay-opt').forEach(el => {
      el.classList.toggle('selected', el.dataset.method === method);
    });
  }

  function validateField(input) {
    const val = input.value.trim();
    const field = input.closest('.field');
    let ok = true, msg = '';

    if (input.required && !val) { ok = false; msg = 'This field is required.'; }
    else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { ok = false; msg = 'Enter a valid email.'; }
    else if (input.name === 'mobile' && val && !/^[6-9]\d{9}$/.test(val)) { ok = false; msg = 'Enter a valid 10-digit mobile number.'; }
    else if (input.name === 'pincode' && val && !/^\d{6}$/.test(val)) { ok = false; msg = 'Enter a valid 6-digit pincode.'; }

    field.classList.toggle('error', !ok);
    const errEl = field.querySelector('.err-msg');
    if (errEl) errEl.textContent = ok ? '' : msg;
    return ok;
  }

  function validateForm(form) {
    let allOk = true;
    form.querySelectorAll('input[required], select[required]').forEach(input => {
      if (!validateField(input)) allOk = false;
    });
    return allOk;
  }

  function generateOrderId() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `EV2026${rand}`;
  }

  function placeOrder(customer) {
    const items = Cart.getAll();
    const totals = Cart.totals();
    const order = {
      id: generateOrderId(),
      customer,
      items: items.map(i => ({ ...i, vehicle: getVehicleById(i.id) })),
      totals,
      payment: selectedPayment,
      date: new Date().toISOString()
    };
    const orders = JSON.parse(localStorage.getItem('evolt_orders') || '[]');
    orders.push(order);
    localStorage.setItem('evolt_orders', JSON.stringify(orders));
    Cart.clear();
    return order;
  }

  return { selectPayment, validateField, validateForm, placeOrder, get selectedPayment() { return selectedPayment; } };
})();
