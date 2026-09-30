// ===== EVOLT MOTORS — App Shell =====

/* ---------- Toasts ---------- */
function showToast(msg) {
  const host = document.getElementById('toastHost');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  host.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 3200);
}

/* ---------- Simple Router (SPA sections) ---------- */
const PAGES = ['home', 'bikes', 'autos', 'cars', 'detail', 'compare', 'cart', 'checkout', 'success', 'testride', 'contact'];

function navigateTo(page) {
  PAGES.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.toggle('hidden', p !== page);
  });
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
  window.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });
  closeMobileNav();

  if (page === 'compare') { Compare.renderPicker(); Compare.renderTable(); }
  if (page === 'cart') renderCartPage();
  if (page === 'checkout') renderCartSummaryInCheckout();
  if (page === 'bikes' || page === 'autos' || page === 'cars') {
    // filtered single-category grids are rendered once on init; just reveal
    initScrollReveal();
  }
}

function setupNav() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(el.dataset.page);
    });
  });
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
  });
}

function closeMobileNav() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

function setupMobileNav() {
  const burger = document.getElementById('hamburger');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    document.getElementById('navLinks').classList.toggle('open');
  });
}

/* ---------- Search overlay ---------- */
function openSearch() {
  document.getElementById('searchBar').classList.add('open');
  document.getElementById('searchInput').focus();
}
function closeSearch() {
  document.getElementById('searchBar').classList.remove('open');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
}
function setupSearchToggle() {
  document.getElementById('searchToggle').addEventListener('click', openSearch);
  document.getElementById('closeSearch').addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeSearch(); close360(); } });
}

/* ---------- Cart Page ---------- */
function renderCartPage() {
  const wrap = document.getElementById('cartPageContent');
  const items = Cart.getAll();
  if (!items.length) {
    wrap.innerHTML = `<div class="empty-cart"><h3>Your cart is empty</h3><p>Explore our EV lineup and add a vehicle to get started.</p>
      <button class="btn btn-primary" data-page="home">Explore Vehicles</button></div>`;
    setupNav();
    return;
  }
  const totals = Cart.totals();
  wrap.innerHTML = `
    <div class="cart-layout">
      <div>
        ${items.map(i => {
          const v = getVehicleById(i.id);
          if (!v) return '';
          return `<div class="cart-item" data-id="${v.id}">
            <img src="${v.image}" alt="${v.name}">
            <div>
              <h4>${v.name}</h4>
              <div class="price">${formatPrice(v.price)}</div>
              <div class="qty-control">
                <button data-qty="-1" aria-label="Decrease quantity">−</button>
                <span>${i.qty}</span>
                <button data-qty="1" aria-label="Increase quantity">+</button>
              </div>
              <button class="remove-btn" data-remove="1">Remove</button>
            </div>
            <div style="text-align:right;font-weight:800;color:var(--green);">${formatPrice(v.price * i.qty)}</div>
          </div>`;
        }).join('')}
      </div>
      <div class="summary-card">
        <h3 style="margin-top:0;">Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>${formatPrice(totals.subtotal)}</span></div>
        <div class="summary-row"><span>Discount</span><span>${totals.discount ? '−' + formatPrice(totals.discount) : '—'}</span></div>
        <div class="summary-row"><span>Delivery</span><span>${totals.delivery ? formatPrice(totals.delivery) : 'FREE'}</span></div>
        <div class="summary-row total"><span>Total</span><span>${formatPrice(totals.total)}</span></div>
        <button class="btn btn-primary btn-block" id="proceedCheckout" style="margin-top:16px;">Proceed to Checkout</button>
      </div>
    </div>`;

  wrap.querySelectorAll('.cart-item').forEach(item => {
    const id = Number(item.dataset.id);
    item.querySelectorAll('[data-qty]').forEach(b => b.addEventListener('click', () => {
      const it = Cart.getAll().find(i => i.id === id);
      const newQty = (it ? it.qty : 0) + Number(b.dataset.qty);
      Cart.updateQty(id, newQty);
      renderCartPage();
    }));
    item.querySelector('[data-remove]').addEventListener('click', () => { Cart.remove(id); renderCartPage(); });
  });
  const proceedBtn = document.getElementById('proceedCheckout');
  if (proceedBtn) proceedBtn.addEventListener('click', () => navigateTo('checkout'));
}

/* ---------- Checkout Page ---------- */
function renderCartSummaryInCheckout() {
  const wrap = document.getElementById('checkoutSummary');
  if (!wrap) return;
  const items = Cart.getAll();
  const totals = Cart.totals();
  if (!items.length) {
    wrap.innerHTML = `<p class="no-vehicles">Your cart is empty. <a href="#" data-page="home" style="color:var(--cyan);">Browse vehicles</a></p>`;
    setupNav();
    document.getElementById('placeOrderBtn').disabled = true;
    return;
  }
  document.getElementById('placeOrderBtn').disabled = false;
  wrap.innerHTML = items.map(i => {
    const v = getVehicleById(i.id);
    return v ? `<div class="summary-row"><span>${v.name} × ${i.qty}</span><span>${formatPrice(v.price * i.qty)}</span></div>` : '';
  }).join('') + `
    <div class="summary-row"><span>Discount</span><span>${totals.discount ? '−' + formatPrice(totals.discount) : '—'}</span></div>
    <div class="summary-row"><span>Delivery</span><span>${totals.delivery ? formatPrice(totals.delivery) : 'FREE'}</span></div>
    <div class="summary-row total"><span>Total</span><span>${formatPrice(totals.total)}</span></div>`;
}

function setupCheckoutForm() {
  document.querySelectorAll('.pay-opt').forEach(opt => {
    opt.addEventListener('click', () => Checkout.selectPayment(opt.dataset.method));
  });
  const form = document.getElementById('checkoutForm');
  form.querySelectorAll('input[required]').forEach(input => {
    input.addEventListener('blur', () => Checkout.validateField(input));
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!Cart.getAll().length) { showToast('Your cart is empty.'); return; }
    if (!Checkout.validateForm(form)) { showToast('Please fix the highlighted fields.'); return; }
    const customer = {
      name: form.fullName.value.trim(),
      mobile: form.mobile.value.trim(),
      email: form.email.value.trim(),
      address: form.address.value.trim(),
      city: form.city.value.trim(),
      state: form.state.value.trim(),
      pincode: form.pincode.value.trim()
    };
    const order = Checkout.placeOrder(customer);
    renderSuccessPage(order);
    navigateTo('success');
    form.reset();
  });
}

/* ---------- Order Success ---------- */
function renderSuccessPage(order) {
  const wrap = document.getElementById('successContent');
  wrap.innerHTML = `
    <div class="success-card">
      <div class="check-circle">✓</div>
      <h2 style="margin:0;">ORDER SUCCESSFULLY PLACED!</h2>
      <div class="order-id">${order.id}</div>
      <div class="order-summary-line"><span>Customer</span><span>${order.customer.name}</span></div>
      ${order.items.map(i => `<div class="order-summary-line"><span>${i.vehicle ? i.vehicle.name : 'Vehicle'} × ${i.qty}</span><span>${formatPrice((i.vehicle ? i.vehicle.price : 0) * i.qty)}</span></div>`).join('')}
      <div class="order-summary-line" style="border-bottom:none;font-weight:800;color:var(--green);"><span>Total Paid</span><span>${formatPrice(order.totals.total)}</span></div>
      <button class="btn btn-primary" style="margin-top:24px;" data-page="home">Continue Shopping</button>
    </div>`;
  setupNav();
  launchConfetti();
}

function launchConfetti() {
  const host = document.getElementById('successContent');
  const colors = ['#00e5ff', '#39ff9d', '#ffffff'];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('span');
    c.style.position = 'fixed';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.top = '-10px';
    c.style.width = '8px'; c.style.height = '8px';
    c.style.background = colors[i % colors.length];
    c.style.opacity = '0.9';
    c.style.borderRadius = '2px';
    c.style.zIndex = 999;
    c.style.transition = `transform ${2 + Math.random() * 2}s ease-in, opacity 3s ease`;
    document.body.appendChild(c);
    requestAnimationFrame(() => {
      c.style.transform = `translateY(${60 + Math.random() * 30}vh) rotate(${Math.random() * 360}deg)`;
      c.style.opacity = '0';
    });
    setTimeout(() => c.remove(), 3200);
  }
}

/* ---------- Test Ride Form ---------- */
function setupTestRideForm() {
  // populate vehicle select
  const sel = document.getElementById('trVehicle');
  sel.innerHTML = `<option value="">Select a vehicle</option>` + VEHICLES.map(v => `<option value="${v.id}">${v.name}</option>`).join('');
  const form = document.getElementById('testRideForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!Checkout.validateForm(form)) { showToast('Please fill all required fields.'); return; }
    const v = getVehicleById(Number(form.trVehicle.value));
    const booking = TestRide.book({
      name: form.trName.value.trim(),
      phone: form.trPhone.value.trim(),
      email: form.trEmail.value.trim(),
      vehicle: v ? v.name : '',
      date: form.trDate.value,
      time: form.trTime.value,
      location: form.trLocation.value.trim()
    });
    document.getElementById('trResult').innerHTML = `<p style="color:var(--green);font-weight:700;">✓ Test Ride Booked Successfully! Booking ID: ${booking.id}</p>`;
    form.reset();
  });
}

/* ---------- Contact Form ---------- */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!Checkout.validateForm(form)) { showToast('Please fill all required fields.'); return; }
    document.getElementById('contactResult').innerHTML = `<p style="color:var(--green);font-weight:700;">✓ Message Sent Successfully!</p>`;
    form.reset();
  });
}

/* ---------- Battery Charging Demo ---------- */
function setupChargingDemo() {
  const btn = document.getElementById('startChargingBtn');
  const fill = document.getElementById('batteryFill');
  const pct = document.getElementById('batteryPct');
  const status = document.getElementById('chargeStatus');
  const flash = document.getElementById('lightningFlash');
  let charging = false;

  btn.addEventListener('click', () => {
    if (charging) return;
    charging = true;
    btn.disabled = true;
    let level = 0;
    status.textContent = 'Charging...';
    fill.style.width = '0%'; pct.textContent = '0%';
    const timer = setInterval(() => {
      level += 10;
      fill.style.width = level + '%';
      pct.textContent = level + '%';
      flash.classList.remove('flash'); void flash.offsetWidth; flash.classList.add('flash');
      if (level >= 100) {
        clearInterval(timer);
        status.textContent = 'FULLY CHARGED ⚡';
        charging = false;
        btn.disabled = false;
      }
    }, 350);
  });
}

/* ---------- Sound toggle ---------- */
function setupSoundToggle() {
  const btn = document.getElementById('soundToggle');
  const setIcon = () => btn.textContent = SoundFX.isMuted() ? '🔇' : '🔊';
  setIcon();
  btn.addEventListener('click', () => { SoundFX.toggleMute(); setIcon(); });
}

/* ---------- Loader ---------- */
function hideLoader() {
  setTimeout(() => document.getElementById('loader').classList.add('hide'), 1200);
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateCartCount();
  setupNav();
  setupMobileNav();
  setupSearchToggle();
  setupSearch();
  setupFilters();
  setupCheckoutForm();
  setupTestRideForm();
  setupContactForm();
  setupChargingDemo();
  setupSoundToggle();

  renderAllVehicles();
  renderCategorySections();

  document.getElementById('modal360Close').addEventListener('click', close360);
  document.getElementById('rotateLeft').addEventListener('click', () => rotate360(-1));
  document.getElementById('rotateRight').addEventListener('click', () => rotate360(1));
  document.getElementById('autoRotate').addEventListener('click', toggleAuto360);
  document.getElementById('stopRotate').addEventListener('click', stop360Auto);

  document.getElementById('clearCompare').addEventListener('click', () => {
    Compare.clear(); Compare.renderPicker(); Compare.renderTable();
  });

  initScrollReveal();
  initCounters();
  initCustomCursor();
  initHeroParticles();
  initMouseLight();

  navigateTo('home');
  hideLoader();
});
