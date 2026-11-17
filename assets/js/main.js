/* Geraldes Reformas · demo */
(() => {
  const WA = '34692150544';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const html = document.documentElement;
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const leer = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* --- idioma ES / EN --- */
  $$('[data-en]').forEach(el => { el.dataset.es = el.innerHTML; });
  let lang = 'es';
  const setLang = l => {
    lang = l; html.lang = l;
    $$('[data-en]').forEach(el => { el.innerHTML = l === 'en' ? el.dataset.en : el.dataset.es; });
    $$('[data-ph-es]').forEach(el => { el.placeholder = el.dataset['ph' + (l === 'en' ? 'En' : 'Es')]; });
    $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === l));
    guardar('ger-lang', l);
  };
  $$('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  // Siempre arranca en español (lo verá primero el dueño); el inglés solo si el visitante lo eligió antes.
  if (leer('ger-lang') === 'en') setLang('en');

  /* --- nav --- */
  const burger = $('.nav__burger'), menu = $('#menu');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); menu.classList.toggle('is-open', open);
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => {
    burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('is-open');
  }));

  /* --- revelado --- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
  } else $$('.reveal').forEach(el => el.classList.add('is-in'));

  /* --- filtros de trabajos --- */
  $$('.filtros button').forEach(b => b.addEventListener('click', () => {
    $$('.filtros button').forEach(x => x.classList.toggle('is-on', x === b));
    const f = b.dataset.f;
    $$('.obra').forEach(o => o.classList.toggle('is-hidden', f !== 'todo' && o.dataset.cat !== f));
  }));

  /* --- visor --- */
  const visor = $('.visor'), vImg = $('img', visor), vCap = $('.visor__cap', visor);
  const cerrar = () => { visor.hidden = true; document.body.style.overflow = ''; };
  $$('.obra').forEach(b => b.addEventListener('click', () => {
    vImg.src = b.dataset.src; vImg.alt = $('img', b).alt; vCap.textContent = $('span', b).textContent;
    visor.hidden = false; document.body.style.overflow = 'hidden';
  }));
  visor.addEventListener('click', e => { if (e.target !== vImg) cerrar(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !visor.hidden) cerrar(); });

  /* --- formulario → WhatsApp --- */
  const form = $('#form-presu'), err = $('.form__err', form);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    if (!nombre) { err.hidden = false; form.nombre.focus(); return; }
    err.hidden = true;
    const en = lang === 'en';
    const opt = form.tipo.selectedOptions[0];
    const tipo = en ? (opt.dataset.en || opt.value) : opt.value;
    const zonaOpt = form.zona.selectedOptions[0];
    const zona = en ? (zonaOpt.dataset.en || zonaOpt.value) : zonaOpt.value;
    const cuandoEl = $('input[name="cuando"]:checked', form);
    const cuando = en ? cuandoEl.dataset.enVal : cuandoEl.value;
    const desc = form.desc.value.trim();
    const l = en ? [
      `Hello! I'm ${nombre} and I'd like a quote.`, ``,
      `• Job: ${tipo}`, `• Area: ${zona}`, `• Start: ${cuando}`,
      ...(desc ? [`• Details: ${desc}`] : []),
      ...(form.fuera.checked ? [``, `I live abroad, so I'd prefer to arrange everything remotely.`] : []),
      ``, `I'll send you some photos now.`
    ] : [
      `¡Hola! Soy ${nombre} y quería pedir presupuesto.`, ``,
      `• Obra: ${tipo}`, `• Zona: ${zona}`, `• Para empezar: ${cuando}`,
      ...(desc ? [`• Detalles: ${desc}`] : []),
      ...(form.fuera.checked ? [``, `Vivo fuera, así que prefiero gestionarlo a distancia.`] : []),
      ``, `Ahora os mando unas fotos.`
    ];
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(l.join('\n'))}`, '_blank', 'noopener');
  });

  /* --- selector de color (solo demo) --- */
  const marcar = () => $$('[data-set-tema]').forEach(b => b.setAttribute('aria-pressed', b.dataset.setTema === html.dataset.tema));
  $$('[data-set-tema]').forEach(b => b.addEventListener('click', () => {
    html.dataset.tema = b.dataset.setTema; marcar(); guardar('ger-tema', b.dataset.setTema);
  }));
  marcar();

  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
