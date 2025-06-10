    document.addEventListener('DOMContentLoaded', () => {
      const el = document.getElementById('logo-text');
      const logo = document.querySelector('.logo');
      const base = 'Nerd Corner';
      const alt = 'Cornerd';
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