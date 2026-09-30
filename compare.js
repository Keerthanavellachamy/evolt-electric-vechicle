// ===== EVOLT MOTORS — Compare (up to 3 vehicles) =====

const Compare = (() => {
  const KEY = 'evolt_compare';

  function getSelected() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }

  function toggle(id) {
    let sel = getSelected();
    if (sel.includes(id)) {
      sel = sel.filter(x => x !== id);
    } else {
      if (sel.length >= 3) { return false; }
      sel.push(id);
    }
    localStorage.setItem(KEY, JSON.stringify(sel));
    return true;
  }

  function clear() { localStorage.setItem(KEY, JSON.stringify([])); }

  function renderPicker() {
    const wrap = document.getElementById('comparePicker');
    if (!wrap) return;
    const sel = getSelected();
    wrap.innerHTML = VEHICLES.map(v => `
      <div class="compare-pick-card ${sel.includes(v.id) ? 'selected' : ''}" data-id="${v.id}" tabindex="0" role="button" aria-pressed="${sel.includes(v.id)}">
        <img src="${v.image}" alt="${v.name} thumbnail">
        <h4 style="margin:0 0 4px;font-size:14px;">${v.name}</h4>
        <p style="margin:0;color:var(--muted);font-size:12px;">₹${v.price.toLocaleString('en-IN')}</p>
      </div>
    `).join('');
    wrap.querySelectorAll('.compare-pick-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = Number(card.dataset.id);
        const ok = toggle(id);
        if (!ok) { showToast('You can compare up to 3 vehicles only.'); return; }
        renderPicker();
        renderTable();
      });
    });
  }

  function renderTable() {
    const wrap = document.getElementById('compareTableWrap');
    if (!wrap) return;
    const sel = getSelected();
    if (sel.length === 0) {
      wrap.innerHTML = `<p class="no-vehicles">Select vehicles above to compare them side by side.</p>`;
      return;
    }
    const vs = sel.map(getVehicleById).filter(Boolean);
    const rows = [
      ['Image', v => `<img src="${v.image}" alt="${v.name}">`],
      ['Price', v => `₹${v.price.toLocaleString('en-IN')}`],
      ['Battery', v => v.battery],
      ['Range', v => v.range],
      ['Top Speed', v => v.speed],
      ['Charging Time', v => v.chargingTime],
      ['Motor Power', v => v.motorPower],
      ['Seating', v => v.seating],
      ['Warranty', v => v.warranty],
      ['Features', v => v.features.join(', ')],
    ];
    wrap.innerHTML = `<table class="compare-table">
      <thead><tr><th>Spec</th>${vs.map(v => `<th>${v.name}</th>`).join('')}</tr></thead>
      <tbody>
        ${rows.map(([label, fn]) => `<tr><td>${label}</td>${vs.map(v => `<td>${fn(v)}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>`;
  }

  return { getSelected, toggle, clear, renderPicker, renderTable };
})();
