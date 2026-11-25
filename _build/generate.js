// Generates the static site from manifest.json + projects.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json')));
const meta = require('./projects.js');

const STUDIO = 'QUBE WORKS';
const EMAIL = 'hello@qubeworks.com'; // TODO: replace with the real address
const CITY = 'Limassol, Cyprus';

const projects = manifest.map(p => {
  const key = `${p.cat}/${p.slug}`, m = meta[key] || {};
  return { ...p, ...m, key, name: m.name || p.name, page: `project/${p.cat}-${p.slug}.html`,
    img: n => `img/${p.cat}/${p.slug}/${n}` };
});
const ext = projects.filter(p => p.cat === 'exterior'), int = projects.filter(p => p.cat === 'interior');
const catLabel = c => c === 'exterior' ? 'Architecture' : 'Interior';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const logo = `<svg class="logo-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 21 7v10l-9 5-9-5V7z M3 7l9 5 9-5 M12 12v10" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`;
const arrow = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

function layout({ title, desc, body, base = '', active = '', dark = false }) {
  const nav = [['projects.html', 'Projects', 'projects'], ['index.html#services', 'Services', 'services'], ['index.html#studio', 'Studio', 'studio'], ['index.html#contact', 'Contact', 'contact']];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2 21 7v10l-9 5-9-5V7z M3 7l9 5 9-5 M12 12v10" fill="none" stroke="#1b1a18" stroke-width="1.6" stroke-linejoin="round"/></svg>')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}assets/style.css">
</head>
<body class="${dark ? 'has-hero' : ''}">
<header class="site-header">
  <a class="logo" href="${base}index.html">${logo}<span>${STUDIO}</span></a>
  <nav class="nav" id="nav">
    ${nav.map(([h, l, k]) => `<a href="${base}${h}"${active === k ? ' class="is-active"' : ''}>${l}</a>`).join('\n    ')}
  </nav>
  <a class="btn btn-line header-cta" href="${base}index.html#contact">Get in touch</a>
  <button class="burger" aria-label="Menu" aria-controls="nav" aria-expanded="false"><span></span><span></span></button>
</header>
<main>
${body}
</main>
<footer class="site-footer">
  <div class="footer-top">
    <a class="logo" href="${base}index.html">${logo}<span>${STUDIO}</span></a>
    <p>Architecture &amp; interior design<br>${CITY}</p>
    <p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
  </div>
  <div class="footer-bottom">
    <span>© ${new Date().getFullYear()} ${STUDIO}</span>
    <span><a href="${base}projects.html">Projects</a> · <a href="${base}index.html#contact">Contact</a></span>
  </div>
</footer>
<script src="${base}assets/main.js"></script>
</body>
</html>
`;
}

function card(p, base = '', size = '') {
  return `<a class="card ${size}" href="${base}${p.page}" data-cat="${p.cat}">
    <div class="card-img"><img src="${base}${p.img(p.cover + '-s.webp')}" alt="${esc(p.name)}" loading="lazy"></div>
    <div class="card-meta"><h3>${esc(p.name)}</h3><span>${catLabel(p.cat)} · ${esc(p.location || '')}</span></div>
  </a>`;
}

// ---------- Home ----------
const heroSlides = [
  ['exterior/solos-villas', '05'], ['exterior/xenofontos-nova', '02'], ['interior/xenofontos-duo', '09'], ['exterior/xenofontos-duo', '06']
].map(([k, n]) => projects.find(p => p.key === k)).map((p, i) => ({ p, n: [ '05', '02', '09', '06'][i] }));

const featured = ['exterior/solos-villas', 'interior/kallithea-apart', 'exterior/olo', 'interior/triangle-apart', 'exterior/xenofontos-nova', 'interior/xenofontos-duo']
  .map(k => projects.find(p => p.key === k));
const totalImages = projects.reduce((a, p) => a + p.images.length, 0);

const home = layout({
  title: `${STUDIO} — Architecture & Interior Design, ${CITY}`,
  desc: `${STUDIO} is an architecture and interior design studio in ${CITY}. Residential buildings, villas and apartment interiors.`,
  dark: true,
  body: `
<section class="hero">
  <div class="hero-slides">
    ${heroSlides.map(({ p, n }, i) => `<div class="hero-slide${i === 0 ? ' is-on' : ''}" style="background-image:url('${p.img(n + '.webp')}')" data-name="${esc(p.name)}" data-href="${p.page}"></div>`).join('\n    ')}
  </div>
  <div class="hero-shade"></div>
  <div class="hero-content">
    <h1>Spaces designed<br>for the way you live</h1>
    <div class="hero-foot">
      <a class="hero-caption" href="${heroSlides[0].p.page}"><span class="hero-caption-name">${esc(heroSlides[0].p.name)}</span>${arrow}</a>
      <div class="hero-dots">${heroSlides.map((_, i) => `<button aria-label="Slide ${i + 1}"${i === 0 ? ' class="is-on"' : ''}></button>`).join('')}</div>
    </div>
  </div>
</section>

<section class="intro wrap reveal">
  <h2 class="display">Architecture<br>&amp; interiors</h2>
  <div class="intro-text">
    <p class="lead">${STUDIO} designs residential buildings, private villas and interiors across Cyprus and beyond.</p>
    <p>We work from the first massing sketch to the last lamp: facades that sit calmly in the Mediterranean light, and interiors built from natural textures, warm neutrals and carefully placed light. Every project starts with how people will actually live in it.</p>
    <a class="link-arrow" href="projects.html">View all projects ${arrow}</a>
  </div>
</section>

<section class="stats wrap reveal">
  <div><strong>${projects.length}</strong><span>projects in portfolio</span></div>
  <div><strong>${ext.length}</strong><span>residential buildings &amp; villas</span></div>
  <div><strong>${int.length}</strong><span>interior projects</span></div>
  <div><strong>${totalImages}+</strong><span>visualisations</span></div>
</section>

<section class="services wrap" id="services">
  <a class="service reveal" href="projects.html#exterior" style="background-image:url('${projects.find(p => p.key === 'exterior/xenofontos-duo').img('03-s.webp')}')">
    <div><span class="eyebrow">01</span><h3>Architectural<br>design</h3><p>Concept, facades and 3D visualisation for residential buildings and villas.</p></div>
    <span class="round">${arrow}</span>
  </a>
  <a class="service reveal" href="projects.html#interior" style="background-image:url('${projects.find(p => p.key === 'interior/triangle-apart').img('14-s.webp')}')">
    <div><span class="eyebrow">02</span><h3>Interior<br>design</h3><p>Layouts, materials, lighting and furniture for apartments and private homes.</p></div>
    <span class="round">${arrow}</span>
  </a>
</section>

<section class="selected wrap">
  <div class="section-head reveal">
    <h2 class="display">Selected<br>projects</h2>
    <a class="link-arrow" href="projects.html">All projects ${arrow}</a>
  </div>
  <div class="grid grid-featured">
    ${featured.map((p, i) => card(p, '', i % 3 === 0 ? 'card-wide' : '')).join('\n    ')}
  </div>
</section>

<section class="approach wrap" id="studio">
  <div class="section-head reveal"><h2 class="display">How we<br>work</h2>
  <p class="approach-lead">A beautiful home is the result of many small, deliberate decisions. We keep the process clear and collaborative, so you always know what comes next.</p></div>
  <ol class="steps">
    <li class="reveal"><span>01</span><h4>Brief</h4><p>We listen first: how you live, what you need, the site, the budget and the timeline.</p></li>
    <li class="reveal"><span>02</span><h4>Concept</h4><p>Massing, layouts and a mood for materials and light, presented as clear sketches and references.</p></li>
    <li class="reveal"><span>03</span><h4>Visualisation</h4><p>Photorealistic renders of every key space, so decisions are made before anything is built.</p></li>
    <li class="reveal"><span>04</span><h4>Documentation</h4><p>Drawings, specifications and selections handed over ready for the builder and suppliers.</p></li>
  </ol>
</section>

<section class="contact wrap" id="contact">
  <div class="contact-inner reveal">
    <h2 class="display">Let’s talk<br>about your project</h2>
    <div class="contact-side">
      <p>Tell us about your home, building or space. We will get back to you within one working day.</p>
      <a class="btn btn-solid" href="mailto:${EMAIL}">${EMAIL}</a>
      <p class="muted">${CITY}</p>
    </div>
  </div>
</section>
`});
fs.writeFileSync(path.join(ROOT, 'index.html'), home);

// ---------- Projects index ----------
const projectsPage = layout({
  title: `Projects — ${STUDIO}`, desc: `Architecture and interior design projects by ${STUDIO}.`, active: 'projects',
  body: `
<section class="page-head wrap">
  <h1 class="display">Projects</h1>
  <div class="filters" role="tablist">
    <button class="is-on" data-filter="all">All <sup>${projects.length}</sup></button>
    <button data-filter="exterior">Architecture <sup>${ext.length}</sup></button>
    <button data-filter="interior">Interior <sup>${int.length}</sup></button>
  </div>
</section>
<section class="wrap">
  <div class="grid grid-all">
    ${[...ext, ...int].map(p => card(p)).join('\n    ')}
  </div>
</section>
`});
fs.writeFileSync(path.join(ROOT, 'projects.html'), projectsPage);

// ---------- Project pages ----------
fs.mkdirSync(path.join(ROOT, 'project'), { recursive: true });
const ordered = [...ext, ...int];
ordered.forEach((p, idx) => {
  const next = ordered[(idx + 1) % ordered.length];
  const b = '../';
  const imgs = p.images.filter(im => im.n !== p.cover);
  const sibling = projects.find(q => q !== p && q.name === p.name);
  const body = `
<section class="project-hero" style="background-image:url('${b}${p.img(p.cover + '.webp')}')">
  <div class="hero-shade"></div>
  <div class="project-hero-content wrap">
    <a class="back" href="${b}projects.html#${p.cat}">← ${catLabel(p.cat)}</a>
    <h1>${esc(p.name)}</h1>
  </div>
</section>
<section class="project-info wrap reveal">
  <dl>
    <div><dt>Type</dt><dd>${esc(p.type || '')}</dd></div>
    <div><dt>Location</dt><dd>${esc(p.location || '')}</dd></div>
    <div><dt>Scope</dt><dd>${p.cat === 'exterior' ? 'Architecture, 3D visualisation' : 'Interior design, 3D visualisation'}</dd></div>
    <div><dt>Images</dt><dd>${p.images.length}</dd></div>
  </dl>
  <div class="project-text">
    <p class="lead">${esc(p.text || '')}</p>
    ${p.pdf ? `<p><a class="link-arrow" href="${b}${p.pdf}" target="_blank" rel="noopener">Download brochure (PDF) ${arrow}</a></p>` : ''}
    ${sibling ? `<p><a class="link-arrow" href="${b}${sibling.page}">See the ${catLabel(sibling.cat).toLowerCase()} of this project ${arrow}</a></p>` : ''}
  </div>
</section>
${p.video ? `<section class="wrap project-video reveal"><video src="${b}${p.video}" controls playsinline muted preload="metadata" poster="${b}${p.img(p.cover + '.webp')}"></video></section>` : ''}
<section class="wrap">
  <div class="gallery">
    ${imgs.map(im => `<a class="g-item${im.w > im.h * 1.2 ? '' : ' g-tall'}" href="${b}${p.img(im.n + '.webp')}" data-lightbox><img src="${b}${p.img(im.n + '-s.webp')}" width="${im.w}" height="${im.h}" alt="${esc(p.name)} — image ${+im.n}" loading="lazy"></a>`).join('\n    ')}
  </div>
</section>
<section class="next-project wrap">
  <a href="${b}${next.page}">
    <span class="eyebrow">Next project</span>
    <span class="next-name">${esc(next.name)} ${arrow}</span>
    <img src="${b}${next.img(next.cover + '-s.webp')}" alt="" loading="lazy">
  </a>
</section>
<div class="lightbox" hidden>
  <button class="lb-close" aria-label="Close">×</button>
  <button class="lb-prev" aria-label="Previous">‹</button>
  <img alt="">
  <button class="lb-next" aria-label="Next">›</button>
  <span class="lb-count"></span>
</div>
`;
  fs.writeFileSync(path.join(ROOT, p.page), layout({
    title: `${p.name} — ${catLabel(p.cat)} — ${STUDIO}`, desc: p.text || p.name, base: b, body, dark: true, active: 'projects'
  }));
});
console.log('Generated', ordered.length, 'project pages');
