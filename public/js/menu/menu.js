// public/js/menu/menu.js
// Animation du logo
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('logo-text');
  const logo = document.querySelector('.logo');
  const base = 'Nerd Corner';
  const alt  = 'Cornerd';
  let fromArr = [], toArr = [], i = 0, animating = false;
  const randomDelay = () => 80 + Math.random() * 70;

  function erase() {
    if (i < fromArr.length) {
      el.textContent = fromArr.slice(0, fromArr.length - i - 1).join('');
      i++; setTimeout(erase, randomDelay());
    } else { i = 0; setTimeout(type, randomDelay() + 100); }
  }
  function type() {
    if (i < toArr.length) {
      el.textContent += toArr[i++];
      setTimeout(type, randomDelay());
    } else {
      animating = false;
      setTimeout(() => el.classList.add('finish'), 200);
      setTimeout(() => el.classList.remove('typing','finish'), 200 + 3600 + 1000);
    }
  }
  function startAnimation() {
    if (animating) return;
    animating = true; el.classList.add('typing');
    const current = el.textContent;
    if (current === base) { fromArr = base.split(''); toArr = alt.split(''); }
    else { fromArr = alt.split(''); toArr = base.split(''); }
    i = 0; erase();
  }
  logo.addEventListener('click', startAnimation);
});

// Chargement des infos utilisateur et gestion des cartes
document.addEventListener('DOMContentLoaded', async () => {
  const loginEl    = document.getElementById('login-link');
  const signupEl   = document.getElementById('signup-link');
  const dashEl     = document.getElementById('dashboard-link');
  const logoutEl   = document.getElementById('logout-link');
  let logged = false;

  try {
    const infoRes = await csrfFetch('/api/user/info');
    if (infoRes.headers.get('Content-Type')?.includes('application/json')) {
      const info = await infoRes.json();
      document.getElementById('player-name').textContent = info.username;
      document.getElementById('player-balance').textContent = info.balance;

      const rankRes  = await csrfFetch('/api/user/rank');
      const { rank } = await rankRes.json();

      const badgeRes = await csrfFetch('/api/badges');
      const badges   = await badgeRes.json();
      const owned = [];
      if (Number(badges.trader) === info.id) owned.push('Top Trader');
      if (Number(badges.snake)  === info.id) owned.push('Top Snake');
      if (Number(badges.pong)   === info.id) owned.push('Top Pong');

      const infoEl = document.getElementById('player-info');
      infoEl.innerHTML = `${owned.join(' ')}<br>Rank ${rank}`;
      logged = true;
    }
  } catch (err) {
    console.error('Menu init error:', err);
  }

  // Mise à jour des boutons de nav
  if (logged) {
    loginEl.style.display = 'none';
    signupEl.style.display = 'none';
    dashEl.style.display = 'inline-block';
    logoutEl.style.display = 'inline-block';
    logoutEl.addEventListener('click', e => {
      e.preventDefault();
      csrfFetch('/logout', { method: 'POST' })
        .then(() => window.location.href = '/index.html');
    });
  } else {
    loginEl.style.display = '';
    signupEl.style.display = '';
    dashEl.style.display = 'none';
    logoutEl.style.display = 'none';
  }

  // Retrait des squelettes
  document.querySelectorAll('.skeleton').forEach(el => el.classList.remove('skeleton'));

  document.querySelectorAll('.card').forEach(card => {
    const link = card.getAttribute('data-link');
    if (link) {
      card.addEventListener('click', () => {
        window.location.href = link;
      });
    }
  });
});

