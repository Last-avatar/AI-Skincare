document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links?.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const makeDial = el => {
    const value = Number(el.dataset.dial || 0);
    const size = Number(el.dataset.size || 58);
    el.style.width = size + 'px'; el.style.height = size + 'px';
    el.style.borderRadius = '50%';
    el.style.background = `conic-gradient(#1b3a2b ${value * 3.6}deg,#e8efe8 0)`;
    el.style.position = 'relative';
    el.innerHTML = `<span style="width:${size-10}px;height:${size-10}px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:${Math.max(10,size*.22)}px">${value}%</span>`;
  };
  document.querySelectorAll('[data-dial]').forEach(makeDial);

  let toast = document.querySelector('.toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; document.body.appendChild(toast); }
  document.addEventListener('click', e => {
    const target = e.target.closest('[data-toast]');
    if (!target) return;
    if (target.tagName === 'A' && target.getAttribute('href') === '#') e.preventDefault();
    toast.textContent = target.dataset.toast;
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  });

  const start = document.getElementById('startAnalysisBtn');
  start?.addEventListener('click', () => {
    const progress = document.querySelector('.bloom-progress');
    const fill = document.querySelector('.bloom-fill');
    const status = document.querySelector('.scan-status');
    progress.style.display = 'block';
    requestAnimationFrame(() => fill.style.width = '100%');
    start.disabled = true; start.textContent = 'Analyzing…';
    if (status) status.textContent = 'AI analysis in progress…';
    setTimeout(() => { window.location.href = 'results.html'; }, 3000);
  });

  const filterState = {skinType:'all', concern:'all', brand:'all'};
  const cards = [...document.querySelectorAll('[data-product]')];
  const price = document.getElementById('priceRange');
  const count = document.getElementById('resultCount');
  const priceLabel = document.getElementById('priceRangeLabel');
  const applyFilters = () => {
    let visible = 0;
    cards.forEach(card => {
      const skin = (card.dataset.skintype || '').split(',');
      const concern = (card.dataset.concern || '').split(',');
      const ok = (filterState.skinType==='all'||skin.includes(filterState.skinType)) &&
        (filterState.concern==='all'||concern.includes(filterState.concern)) &&
        (filterState.brand==='all'||card.dataset.brand===filterState.brand) &&
        (!price || Number(card.dataset.price)<=Number(price.value));
      card.style.display = ok ? '' : 'none'; if (ok) visible++;
    });
    if (count) count.textContent = visible;
    if (priceLabel && price) priceLabel.textContent = '$' + price.value;
  };
  document.querySelectorAll('.chip[data-group]').forEach(chip => chip.addEventListener('click', () => {
    document.querySelectorAll(`.chip[data-group="${chip.dataset.group}"]`).forEach(c => c.classList.remove('active'));
    chip.classList.add('active'); filterState[chip.dataset.group] = chip.dataset.value; applyFilters();
  }));
  price?.addEventListener('input', applyFilters);

  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active'); document.getElementById(btn.dataset.tab)?.classList.add('active');
  }));

  const chatForm = document.getElementById('chatForm');
  chatForm?.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('chatInput'); const area = document.getElementById('chatMessages');
    const text = input.value.trim(); if (!text) return;
    area.insertAdjacentHTML('beforeend', `<div class="msg user"></div>`);
    area.lastElementChild.textContent = text; input.value = ''; area.scrollTop = area.scrollHeight;
    setTimeout(() => { const msg = document.createElement('div'); msg.className='msg bot'; msg.textContent='Thanks for sharing. Based on your combination skin, I would start with a gentle cleanser, lightweight hydrating serum, and daily SPF. Which part of your routine would you like to improve first?'; area.appendChild(msg); area.scrollTop=area.scrollHeight; }, 500);
  });

  const dashLinks = document.querySelectorAll('.dash-nav a');
  dashLinks.forEach(a => a.addEventListener('click', () => { dashLinks.forEach(x=>x.classList.remove('active')); a.classList.add('active'); }));
});
