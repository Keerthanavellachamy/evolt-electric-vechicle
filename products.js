// ===== EVOLT MOTORS — Product Rendering, Filters, Search, Details, 360°, Start =====

let currentFilters = { type: 'All', price: 'All', range: 'All' };
let current360 = { vehicle: null, angle: 0, autoTimer: null };
let currentDetailVehicle = null;

function formatPrice(n) { return '₹' + n.toLocaleString('en-IN'); }

function vehicleMatchesFilters(v) {
  if (currentFilters.type !== 'All' && v.type !== currentFilters.type) return false;
  if (currentFilters.price !== 'All') {
    if (currentFilters.price === 'u1' && v.price >= 100000) return false;
    if (currentFilters.price === '1-3' && !(v.price >= 100000 && v.price <= 300000)) return false;
    if (currentFilters.price === '3-5' && !(v.price > 300000 && v.price <= 500000)) return false;
    if (currentFilters.price === 'a5' && v.price <= 500000) return false;
  }
  if (currentFilters.range !== 'All') {
    const km = parseInt(v.range, 10);
    if (currentFilters.range === 'u150' && km >= 150) return false;
    if (currentFilters.range === '150-250' && !(km >= 150 && km <= 250)) return false;
    if (currentFilters.range === 'a250' && km <= 250) return false;
  }
  return true;
}

function vehicleCardHTML(v) {
  return `
  <article class="vcard reveal" data-id="${v.id}" data-type="${v.type}">
    <div class="vcard-media">
      <span class="headlight-beam"></span>
      <img src="${v.image}" alt="${v.name} — ${v.type} studio render" loading="lazy">
      <div class="vcard-badges">${v.badges.map(b => `<span class="badge">${b}</span>`).join('')}</div>
      <div class="vcard-explore" data-action="details" data-id="${v.id}">VIEW DETAILS</div>
    </div>
    <div class="vcard-body">
      <p class="vcard-type">${v.type}</p>
      <h3>${v.name}</h3>
      <div class="vcard-price">${formatPrice(v.price)}</div>
      <div class="spec-mini">
        <div>Battery: <b>${v.battery}</b></div>
        <div>Range: <b>${v.range}</b></div>
        <div>Top Speed: <b>${v.speed}</b></div>
        <div>Charging: <b>${v.chargingTime}</b></div>
      </div>
      <div class="vcard-actions">
        <button class="btn btn-ghost" data-action="details" data-id="${v.id}">View Details</button>
        <button class="btn btn-ghost" data-action="view360" data-id="${v.id}">360° View</button>
        <button class="btn btn-outline" data-action="start" data-id="${v.id}">Start Vehicle</button>
        <button class="btn btn-primary" data-action="addcart" data-id="${v.id}">Add to Cart</button>
      </div>
    </div>
  </article>`;
}

function renderVehicleGrid(targetId, list) {
  const grid = document.getElementById(targetId);
  if (!grid) return;
  if (!list.length) { grid.innerHTML = `<p class="no-vehicles">No vehicles found</p>`; return; }
  grid.innerHTML = list.map(vehicleCardHTML).join('');
  bindVehicleGridEvents(grid);
  initScrollReveal();
}

function renderAllVehicles() {
  const filtered = VEHICLES.filter(vehicleMatchesFilters);
  renderVehicleGrid('vehicleGrid', filtered);
}

function bindVehicleGridEvents(scope) {
  scope.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      if (action === 'details') openDetails(id);
      else if (action === 'view360') open360(id);
      else if (action === 'start') startVehicleEffect(btn.closest('.vcard') || document.getElementById('detailContent'), id, btn);
      else if (action === 'addcart') { Cart.add(id, 1); const v = getVehicleById(id); showToast(`✓ ${v.name} added to cart!`); }
    });
  });
}

function setupFilters() {
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    group.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilters[group.dataset.filterGroup] = chip.dataset.value;
        renderAllVehicles();
      });
    });
  });
  const clearBtn = document.getElementById('clearFilters');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    currentFilters = { type: 'All', price: 'All', range: 'All' };
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c.dataset.value === 'All'));
    renderAllVehicles();
  });
}

/* ===== Search ===== */
function setupSearch() {
  const input = document.getElementById('searchInput');
  const resultsBox = document.getElementById('searchResults');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { resultsBox.innerHTML = ''; return; }
    const results = VEHICLES.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.type.toLowerCase().includes(q) ||
      v.features.some(f => f.toLowerCase().includes(q)) ||
      v.badges.some(b => b.toLowerCase().includes(q))
    );
    if (!results.length) { resultsBox.innerHTML = `<p class="no-results">No vehicles found</p>`; return; }
    resultsBox.innerHTML = results.map(v => `
      <div class="search-result-item" data-id="${v.id}">
        <img src="${v.image}" alt="${v.name}">
        <div>
          <div style="font-weight:700;font-size:14px;">${v.name}</div>
          <div style="color:var(--muted);font-size:12px;">${v.type} · ${formatPrice(v.price)}</div>
        </div>
      </div>
    `).join('');
    resultsBox.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => { closeSearch(); openDetails(Number(item.dataset.id)); });
    });
  });
}

/* ===== Vehicle Details ===== */
function openDetails(id) {
  const v = getVehicleById(id);
  if (!v) return;
  currentDetailVehicle = v;
  navigateTo('detail');
  const wrap = document.getElementById('detailContent');
  const colors = ['#00e5ff', '#39ff9d', '#f4f8fb'];
  wrap.innerHTML = `
    <div class="detail-layout">
      <div class="reveal reveal-left in">
        <div class="detail-gallery-main" id="detailMainMedia">
          <span class="headlight-beam"></span>
          <img id="detailMainImg" src="${v.image}" alt="${v.name} main view">
        </div>
        <div class="thumb-row" id="detailThumbs">
          <img src="${v.image}" class="active" alt="${v.name} angle 1">
          <img src="${v.image}" alt="${v.name} angle 2" style="filter:hue-rotate(20deg)">
          <img src="${v.image}" alt="${v.name} angle 3" style="filter:hue-rotate(-20deg)">
        </div>
      </div>
      <div class="reveal reveal-right in">
        <p class="section-tag">${v.type.toUpperCase()}</p>
        <h1 style="margin:0 0 6px;font-size:32px;">${v.name}</h1>
        <div class="rating">★★★★★ <span style="color:var(--muted);font-size:12px;">(128 reviews) · In Stock</span></div>
        <div class="detail-price">${formatPrice(v.price)}</div>
        <p style="color:var(--muted);">${v.tagline}</p>
        <p style="font-size:13px;color:var(--muted);margin-bottom:4px;">Color</p>
        <div class="color-dots" id="colorDots">
          ${colors.map((c, i) => `<span class="color-dot ${i === 0 ? 'active' : ''}" style="background:${c}" data-color="${i}"></span>`).join('')}
        </div>
        <div class="detail-actions">
          <button class="btn btn-outline" data-action="start" data-id="${v.id}">Start Vehicle</button>
          <button class="btn btn-outline" data-action="view360" data-id="${v.id}">360° View</button>
          <button class="btn btn-primary" data-action="addcart" data-id="${v.id}">Add to Cart</button>
          <button class="btn btn-primary" id="buyNowBtn">Buy Now</button>
          <button class="btn btn-ghost" id="bookTestRideBtn">Book Test Ride</button>
        </div>
        <table class="spec-table">
          <tr><td>Battery</td><td>${v.battery}</td></tr>
          <tr><td>Range</td><td>${v.range}</td></tr>
          <tr><td>Top Speed</td><td>${v.speed}</td></tr>
          <tr><td>Charging Time</td><td>${v.chargingTime}</td></tr>
          <tr><td>Motor Power</td><td>${v.motorPower}</td></tr>
          <tr><td>Seating</td><td>${v.seating}</td></tr>
          <tr><td>Warranty</td><td>${v.warranty}</td></tr>
        </table>
        <p style="font-size:13px;color:var(--muted);margin-bottom:6px;">Features</p>
        <div class="feature-pills">${v.features.map(f => `<span class="feature-pill">${f}</span>`).join('')}</div>
      </div>
    </div>`;

  bindVehicleGridEvents(wrap);
  wrap.querySelectorAll('#detailThumbs img').forEach(thumb => {
    thumb.addEventListener('click', () => {
      wrap.querySelectorAll('#detailThumbs img').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      document.getElementById('detailMainImg').src = thumb.src;
    });
  });
  wrap.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      wrap.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const img = document.getElementById('detailMainImg');
      img.style.filter = dot.dataset.color === '1' ? 'hue-rotate(90deg)' : dot.dataset.color === '2' ? 'grayscale(0.4) brightness(1.1)' : 'none';
    });
  });
  document.getElementById('buyNowBtn').addEventListener('click', () => {
    Cart.add(v.id, 1);
    showToast(`✓ ${v.name} added — proceeding to checkout`);
    navigateTo('checkout');
    renderCartSummaryInCheckout();
  });
  document.getElementById('bookTestRideBtn').addEventListener('click', () => {
    navigateTo('testride');
    const sel = document.getElementById('trVehicle');
    if (sel) sel.value = String(v.id);
  });
}

/* ===== 360 Viewer ===== */
function open360(id) {
  const v = getVehicleById(id);
  if (!v) return;
  current360.vehicle = v;
  current360.angle = 0;
  document.getElementById('modal360Title').textContent = `${v.name} — 360° EXPERIENCE`;
  document.getElementById('modal360Img').src = v.image;
  document.getElementById('modal360Img').style.transform = 'rotateY(0deg) scale(1)';
  document.getElementById('modal360').classList.add('open');
  document.getElementById('modal360').setAttribute('aria-hidden', 'false');
}

function close360() {
  stop360Auto();
  document.getElementById('modal360').classList.remove('open');
  document.getElementById('modal360').setAttribute('aria-hidden', 'true');
}

function rotate360(dir) {
  current360.angle += dir * 30;
  const img = document.getElementById('modal360Img');
  // Simulated 3D rotation using CSS transform since we use single-angle images
  img.style.transform = `perspective(600px) rotateY(${current360.angle}deg)`;
}

function toggleAuto360() {
  if (current360.autoTimer) { stop360Auto(); return; }
  current360.autoTimer = setInterval(() => rotate360(1), 90);
}

function stop360Auto() {
  if (current360.autoTimer) { clearInterval(current360.autoTimer); current360.autoTimer = null; }
}

/* ===== Start Vehicle Effect ===== */
function startVehicleEffect(cardEl, id, btn) {
  const v = getVehicleById(id);
  if (!v) return;
  const media = (cardEl && cardEl.querySelector && cardEl.querySelector('.vcard-media, .detail-gallery-main'))
    || document.getElementById('detailMainMedia');
  if (!media) { SoundFX.play(v.sound); showToast(`${v.name} Electric Motor Activated ⚡`); return; }

  if (btn) { btn.disabled = true; const original = btn.textContent; btn.textContent = 'POWERING ON...';
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1800); }

  media.classList.add('powering');
  const beam = media.querySelector('.headlight-beam');
  if (beam) { beam.classList.remove('on'); void beam.offsetWidth; beam.classList.add('on'); }

  // spark particles
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.style.left = (40 + Math.random() * 20) + '%';
    s.style.top = (50 + Math.random() * 20) + '%';
    s.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
    s.style.setProperty('--dy', (-(Math.random() * 50 + 10)) + 'px');
    media.appendChild(s);
    setTimeout(() => s.remove(), 850);
  }

  SoundFX.play(v.sound);
  setTimeout(() => media.classList.remove('powering'), 900);
  showToast(`${v.name} Electric Motor Activated ⚡`);
}

/* ===== Category quick views (bikes/autos/cars anchors) ===== */
function renderCategorySections() {
  ['Bike', 'Auto', 'Car'].forEach(type => {
    const id = 'grid' + type;
    const list = VEHICLES.filter(v => v.type === type);
    renderVehicleGrid(id, list);
  });
}
