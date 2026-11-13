// Base de todas as demos do Cânone. Ver FORMAT.md, seção Demo.
//
// A demo declara, antes de carregar este arquivo:
//   window.DEMO = { controls: ['replay', 'loop', 'slow', 'freeze'], period: 1500, hint: '' }
// - controls: botões da barra; [] para demos só interativas.
// - period: ms entre repetições no Loop, em velocidade normal.
// - hint: uma linha de instrução acima dos casos.
//
// Contrato com o CSS da demo:
// - animações só rodam sob `body.run` (cada Repetir tira e põe a classe);
// - durações usam `calc(<ms> * var(--slow))`, que vale 4 na câmera lenta;
// - `body.freeze` liga quando "Congelar no impacto" está ativo.
(() => {
  const cfg = Object.assign({ controls: ['replay', 'loop', 'slow'], period: 1500, hint: '' }, window.DEMO || {});
  const root = document.documentElement;
  const body = document.body;
  const state = { loop: false, slow: false, freeze: false };
  if (parent !== window) root.classList.add('embedded');

  // Tema: o site manda o dele; aberta sozinha, a demo lê a escolha salva.
  try { if (localStorage.getItem('canon-theme') === 'light') root.dataset.theme = 'light'; } catch {}
  addEventListener('message', (e) => {
    if (e.data && e.data.type === 'canon-theme') root.dataset.theme = e.data.theme;
  });
  if (parent !== window) parent.postMessage({ type: 'canon-demo-ready' }, '*');
  let timer = null;

  const replay = () => {
    body.classList.remove('run');
    void body.offsetWidth;
    body.classList.add('run');
    document.dispatchEvent(new Event('demo:replay'));
  };
  const schedule = () => {
    clearInterval(timer);
    if (state.loop) timer = setInterval(replay, cfg.period * (state.slow ? 4 : 1));
  };

  const labels = { replay: 'Repetir', loop: 'Loop', slow: 'Câmera lenta 4×', freeze: 'Congelar no impacto' };
  let anchor = null;
  if (cfg.controls.length) {
    const bar = document.createElement('div');
    bar.className = 'kit-bar';
    for (const c of cfg.controls) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = labels[c];
      if (c !== 'replay') b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => {
        if (c === 'replay') return replay();
        state[c] = !state[c];
        b.setAttribute('aria-pressed', String(state[c]));
        if (c === 'slow') root.style.setProperty('--slow', state.slow ? 4 : 1);
        if (c === 'freeze') body.classList.toggle('freeze', state.freeze);
        schedule();
        replay();
      });
      bar.appendChild(b);
    }
    body.prepend(bar);
    anchor = bar;
  }
  if (cfg.hint) {
    const p = document.createElement('p');
    p.className = 'kit-hint';
    p.textContent = cfg.hint;
    anchor ? anchor.after(p) : body.prepend(p);
  }

  // Altura para o site ajustar o iframe.
  const send = () => {
    if (parent !== window) parent.postMessage({ type: 'canon-demo-height', h: Math.ceil(body.getBoundingClientRect().height) }, '*');
  };
  new ResizeObserver(send).observe(body);
  addEventListener('load', send);

  // Toca uma vez quando a demo aparece na tela.
  // Com movimento reduzido, nada toca sozinho: Repetir e Loop continuam, porque partem do usuário.
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let seen = false;
  new IntersectionObserver((entries) => {
    if (!seen && !reduce && entries[0].isIntersecting) { seen = true; setTimeout(replay, 200); }
  }).observe(body);

  window.Demo = { replay, state };
})();
