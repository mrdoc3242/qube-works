// Generates the static site (English at /, Greek at /el/) from manifest.json + projects.js + projects.el.js
// Run: node _build/generate.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json')));
const meta = require('./projects.js');
const metaEl = require('./projects.el.js');

// ===== SETTINGS =====
const STUDIO = 'QUBE WORKS';
const EMAIL = 'hello@qubeworks.com'; // public contact email shown on the site (TODO: replace)
const FORM_EMAIL = '';               // where contact-form requests are sent (TODO: set, e.g. 'name@gmail.com')
// =====================

const T = {
  en: {
    dir: '', city: 'Limassol, Cyprus', langName: 'EN',
    nav: { projects: 'Projects', services: 'Services', studio: 'Studio', contact: 'Contact' }, cta: 'Get in touch',
    arch: 'Architecture', interior: 'Interior', footerLine: 'Architecture &amp; interior design',
    homeTitle: 'Architecture & Interior Design', homeDesc: 'is an architecture and interior design studio in Limassol, Cyprus. Residential buildings, villas and apartment interiors.',
    hero: 'Spaces designed<br>for the way you live',
    introH: 'Architecture<br>&amp; interiors',
    introLead: 'designs residential buildings, private villas and interiors across Cyprus and beyond.',
    introText: 'We work from the first massing sketch to the last lamp: facades that sit calmly in the Mediterranean light, and interiors built from natural textures, warm neutrals and carefully placed light. Every project starts with how people will actually live in it.',
    viewAll: 'View all projects', allProjects: 'All projects',
    stats: ['projects in portfolio', 'residential buildings &amp; villas', 'interior projects', 'visualisations'],
    s1h: 'Architectural<br>design', s1p: 'Concept, facades and 3D visualisation for residential buildings and villas.',
    s2h: 'Interior<br>design', s2p: 'Layouts, materials, lighting and furniture for apartments and private homes.',
    selected: 'Selected<br>projects',
    howH: 'How we<br>work', howLead: 'A beautiful home is the result of many small, deliberate decisions. We keep the process clear and collaborative, so you always know what comes next.',
    steps: [['Brief', 'We listen first: how you live, what you need, the site, the budget and the timeline.'],
      ['Concept', 'Massing, layouts and a mood for materials and light, presented as clear sketches and references.'],
      ['Visualisation', 'Photorealistic renders of every key space, so decisions are made before anything is built.'],
      ['Documentation', 'Drawings, specifications and selections handed over ready for the builder and suppliers.']],
    contactH: 'Let’s talk<br>about your project', contactP: 'Tell us about your home, building or space. We will get back to you within one working day.',
    f: { name: 'Name', email: 'Email', phone: 'Phone (optional)', type: 'Project type', types: ['Architecture', 'Interior design', 'Architecture + interior', 'Other'],
      msg: 'Tell us about your project', send: 'Send request', sending: 'Sending…', ok: 'Thank you! Your request has been sent. We will get back to you shortly.',
      err: 'Something went wrong. Please try again or email us directly.', off: 'The form is being set up. For now, please email us at',
      subject: 'New request from the QUBE WORKS website', consent: 'By sending, you agree that we may contact you about your request.' },
    projectsTitle: 'Projects', projectsDesc: 'Architecture and interior design projects by', all: 'All',
    type: 'Type', location: 'Location', scope: 'Scope', images: 'Images',
    scopeArch: 'Architecture, 3D visualisation', scopeInt: 'Interior design, 3D visualisation',
    brochure: 'Download brochure (PDF)', seeOther: c => `See the ${c === 'exterior' ? 'architecture' : 'interior'} of this project`,
    next: 'Next project', image: 'image', close: 'Close', prev: 'Previous', nextImg: 'Next', menu: 'Menu'
  },
  el: {
    dir: 'el/', city: 'Λεμεσός, Κύπρος', langName: 'EL',
    nav: { projects: 'Έργα', services: 'Υπηρεσίες', studio: 'Στούντιο', contact: 'Επικοινωνία' }, cta: 'Επικοινωνήστε',
    arch: 'Αρχιτεκτονική', interior: 'Εσωτερικοί χώροι', footerLine: 'Αρχιτεκτονική &amp; εσωτερικός σχεδιασμός',
    homeTitle: 'Αρχιτεκτονική & Εσωτερικός Σχεδιασμός', homeDesc: 'είναι ένα στούντιο αρχιτεκτονικής και εσωτερικού σχεδιασμού στη Λεμεσό, Κύπρος. Κτίρια κατοικιών, βίλες και εσωτερικοί χώροι διαμερισμάτων.',
    hero: 'Χώροι σχεδιασμένοι<br>για τον τρόπο που ζείτε',
    introH: 'Αρχιτεκτονική<br>&amp; εσωτερικοί χώροι',
    introLead: 'σχεδιάζει κτίρια κατοικιών, ιδιωτικές βίλες και εσωτερικούς χώρους σε όλη την Κύπρο και όχι μόνο.',
    introText: 'Δουλεύουμε από το πρώτο σκίτσο όγκων μέχρι το τελευταίο φωτιστικό: όψεις που στέκονται ήρεμα στο μεσογειακό φως και εσωτερικοί χώροι από φυσικές υφές, ζεστούς ουδέτερους τόνους και προσεκτικά τοποθετημένο φως. Κάθε έργο ξεκινά από το πώς θα ζήσουν πραγματικά οι άνθρωποι σε αυτό.',
    viewAll: 'Δείτε όλα τα έργα', allProjects: 'Όλα τα έργα',
    stats: ['έργα στο χαρτοφυλάκιο', 'κτίρια κατοικιών &amp; βίλες', 'έργα εσωτερικών χώρων', 'απεικονίσεις'],
    s1h: 'Αρχιτεκτονικός<br>σχεδιασμός', s1p: 'Ιδέα, όψεις και τρισδιάστατη απεικόνιση για κτίρια κατοικιών και βίλες.',
    s2h: 'Εσωτερικός<br>σχεδιασμός', s2p: 'Κατόψεις, υλικά, φωτισμός και έπιπλα για διαμερίσματα και ιδιωτικές κατοικίες.',
    selected: 'Επιλεγμένα<br>έργα',
    howH: 'Πώς<br>δουλεύουμε', howLead: 'Ένα όμορφο σπίτι είναι το αποτέλεσμα πολλών μικρών, συνειδητών αποφάσεων. Κρατάμε τη διαδικασία ξεκάθαρη και συνεργατική, ώστε να ξέρετε πάντα το επόμενο βήμα.',
    steps: [['Ανάλυση', 'Πρώτα ακούμε: πώς ζείτε, τι χρειάζεστε, το οικόπεδο, τον προϋπολογισμό και το χρονοδιάγραμμα.'],
      ['Ιδέα', 'Όγκοι, κατόψεις και ατμόσφαιρα υλικών και φωτός, παρουσιασμένα με καθαρά σκίτσα και αναφορές.'],
      ['Απεικόνιση', 'Φωτορεαλιστικές απεικονίσεις κάθε βασικού χώρου, ώστε οι αποφάσεις να παίρνονται πριν χτιστεί οτιδήποτε.'],
      ['Τεκμηρίωση', 'Σχέδια, προδιαγραφές και επιλογές, έτοιμα για τον κατασκευαστή και τους προμηθευτές.']],
    contactH: 'Ας μιλήσουμε<br>για το έργο σας', contactP: 'Πείτε μας για το σπίτι, το κτίριο ή τον χώρο σας. Θα σας απαντήσουμε μέσα σε μία εργάσιμη ημέρα.',
    f: { name: 'Όνομα', email: 'Email', phone: 'Τηλέφωνο (προαιρετικό)', type: 'Τύπος έργου', types: ['Αρχιτεκτονική', 'Εσωτερικός σχεδιασμός', 'Αρχιτεκτονική + εσωτερικός', 'Άλλο'],
      msg: 'Πείτε μας για το έργο σας', send: 'Αποστολή', sending: 'Αποστολή…', ok: 'Ευχαριστούμε! Το αίτημά σας στάλθηκε. Θα επικοινωνήσουμε σύντομα μαζί σας.',
      err: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά ή στείλτε μας email.', off: 'Η φόρμα ρυθμίζεται. Προς το παρόν, στείλτε μας email στο',
      subject: 'Νέο αίτημα από την ιστοσελίδα QUBE WORKS', consent: 'Με την αποστολή συμφωνείτε να επικοινωνήσουμε μαζί σας για το αίτημά σας.' },
    projectsTitle: 'Έργα', projectsDesc: 'Έργα αρχιτεκτονικής και εσωτερικού σχεδιασμού από το', all: 'Όλα',
    type: 'Τύπος', location: 'Τοποθεσία', scope: 'Αντικείμενο', images: 'Εικόνες',
    scopeArch: 'Αρχιτεκτονική, 3D απεικόνιση', scopeInt: 'Εσωτερικός σχεδιασμός, 3D απεικόνιση',
    brochure: 'Λήψη μπροσούρας (PDF)', seeOther: c => c === 'exterior' ? 'Δείτε την αρχιτεκτονική του έργου' : 'Δείτε τους εσωτερικούς χώρους του έργου',
    next: 'Επόμενο έργο', image: 'εικόνα', close: 'Κλείσιμο', prev: 'Προηγούμενη', nextImg: 'Επόμενη', menu: 'Μενού'
  }
};

const base = manifest.map(p => {
  const key = `${p.cat}/${p.slug}`, m = meta[key] || {};
  return { ...p, ...m, key, name: m.name || p.name, page: `project/${p.cat}-${p.slug}.html`, img: n => `img/${p.cat}/${p.slug}/${n}` };
});
const srcset = (p, n, a = '') => { const im = p.images.find(i => i.n === n) || { w: 2000, h: 2000 }; const sc = m => Math.round(im.w * Math.min(1, m / Math.max(im.w, im.h)));
  const ws = [['-s', sc(800)], ['-m', sc(1400)], ['', im.w]]; const seen = new Set();
  return ws.filter(([, w]) => !seen.has(w) && seen.add(w)).map(([suf, w]) => `${a}${p.img(n + suf + '.webp')} ${w}w`).join(', '); };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const logo = `<svg class="logo-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 21 7v10l-9 5-9-5V7z M3 7l9 5 9-5 M12 12v10" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`;
const arrow = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
const favicon = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2 21 7v10l-9 5-9-5V7z M3 7l9 5 9-5 M12 12v10" fill="none" stroke="#1b1a18" stroke-width="1.6" stroke-linejoin="round"/></svg>');

function build(lang) {
  const t = T[lang], other = lang === 'en' ? 'el' : 'en';
  const projects = base.map(p => lang === 'en' ? p : { ...p, ...metaEl[p.key] });
  const ext = projects.filter(p => p.cat === 'exterior'), int = projects.filter(p => p.cat === 'interior');
  const ordered = [...ext, ...int];
  const catLabel = c => c === 'exterior' ? t.arch : t.interior;
  const out = rel => { const f = path.join(ROOT, t.dir, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); return f; };

  // a = path to site root (assets/images), h = path to this language root, rel = page path within language
  function layout({ title, desc, body, a, h, rel, active = '', dark = false }) {
    const nav = [['projects.html', t.nav.projects, 'projects'], ['index.html#services', t.nav.services, 'services'], ['index.html#studio', t.nav.studio, 'studio'], ['index.html#contact', t.nav.contact, 'contact']];
    const otherHref = `${a}${T[other].dir}${rel}`;
    const switcher = `<div class="lang">${['en', 'el'].map(l => l === lang ? `<span class="is-on">${T[l].langName}</span>` : `<a href="${otherHref}" hreflang="${l}" lang="${l}">${T[l].langName}</a>`).join('<i>/</i>')}</div>`;
    return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<link rel="alternate" hreflang="${other}" href="${otherHref}">
<link rel="icon" href="data:image/svg+xml,${favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${a}assets/style.css">
</head>
<body class="${dark ? 'has-hero' : ''} lang-${lang}">
<header class="site-header">
  <a class="logo" href="${h}index.html">${logo}<span>${STUDIO}</span></a>
  <nav class="nav" id="nav">
    ${nav.map(([hr, l, k]) => `<a href="${h}${hr}"${active === k ? ' class="is-active"' : ''}>${l}</a>`).join('\n    ')}
  </nav>
  ${switcher}
  <a class="btn btn-line header-cta" href="${h}index.html#contact">${t.cta}</a>
  <button class="burger" aria-label="${t.menu}" aria-controls="nav" aria-expanded="false"><span></span><span></span></button>
</header>
<main>
${body}
</main>
<footer class="site-footer">
  <div class="footer-top">
    <a class="logo" href="${h}index.html">${logo}<span>${STUDIO}</span></a>
    <p>${t.footerLine}<br>${t.city}</p>
    <p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
  </div>
  <div class="footer-bottom">
    <span>© ${new Date().getFullYear()} ${STUDIO}</span>
    <span><a href="${h}projects.html">${t.nav.projects}</a> · <a href="${h}index.html#contact">${t.nav.contact}</a> · ${switcher}</span>
  </div>
</footer>
<script src="${a}assets/main.js"></script>
</body>
</html>
`;
  }

  const card = (p, a, h, size = '') => `<a class="card ${size}" href="${h}${p.page}" data-cat="${p.cat}">
    <div class="card-img"><img src="${a}${p.img(p.cover + '-m.webp')}" srcset="${srcset(p, p.cover, a)}" sizes="${size ? '(max-width:760px) 100vw, 66vw' : '(max-width:760px) 100vw, (max-width:1000px) 50vw, 33vw'}" alt="${esc(p.name)}" loading="lazy"></div>
    <div class="card-meta"><h3>${esc(p.name)}</h3><span>${catLabel(p.cat)} · ${esc(p.location || '')}</span></div>
  </a>`;

  // ---------- Home ----------
  {
    const a = lang === 'en' ? '' : '../', h = '';
    const find = k => projects.find(p => p.key === k);
    const heroSlides = [['exterior/xenofontos-nova', '02'], ['exterior/psilogenis', '03'], ['interior/xenofontos-nova', '07'], ['interior/nasser-apart', '05']].map(([k, n]) => ({ p: find(k), n }));
    const featured = ['exterior/solos-villas', 'interior/kallithea-apart', 'exterior/olo', 'interior/triangle-apart', 'exterior/xenofontos-nova', 'interior/xenofontos-duo'].map(find);
    const totalImages = projects.reduce((s, p) => s + p.images.length, 0);
    const f = t.f;
    const body = `
<section class="hero">
  <div class="hero-slides">
    ${heroSlides.map(({ p, n }, i) => `<div class="hero-slide${i === 0 ? ' is-on' : ''}" style="background-image:url('${a}${p.img(n + '.webp')}')" data-name="${esc(p.name)}" data-href="${h}${p.page}"></div>`).join('\n    ')}
  </div>
  <div class="hero-shade"></div>
  <div class="hero-content">
    <h1>${t.hero}</h1>
    <div class="hero-foot">
      <a class="hero-caption" href="${h}${heroSlides[0].p.page}"><span class="hero-caption-name">${esc(heroSlides[0].p.name)}</span>${arrow}</a>
      <div class="hero-dots">${heroSlides.map((_, i) => `<button aria-label="${i + 1}"${i === 0 ? ' class="is-on"' : ''}></button>`).join('')}</div>
    </div>
  </div>
</section>

<section class="intro wrap reveal">
  <h2 class="display">${t.introH}</h2>
  <div class="intro-text">
    <p class="lead">${STUDIO} ${t.introLead}</p>
    <p>${t.introText}</p>
    <a class="link-arrow" href="${h}projects.html">${t.viewAll} ${arrow}</a>
  </div>
</section>

<section class="stats wrap reveal">
  <div><strong>${projects.length}</strong><span>${t.stats[0]}</span></div>
  <div><strong>${ext.length}</strong><span>${t.stats[1]}</span></div>
  <div><strong>${int.length}</strong><span>${t.stats[2]}</span></div>
  <div><strong>${totalImages}+</strong><span>${t.stats[3]}</span></div>
</section>

<section class="services wrap" id="services">
  <a class="service reveal" href="${h}projects.html#exterior" style="background-image:url('${a}${find('exterior/xenofontos-duo').img('03-m.webp')}')">
    <div><span class="eyebrow">01</span><h3>${t.s1h}</h3><p>${t.s1p}</p></div>
    <span class="round">${arrow}</span>
  </a>
  <a class="service reveal" href="${h}projects.html#interior" style="background-image:url('${a}${find('interior/triangle-apart').img('14-m.webp')}')">
    <div><span class="eyebrow">02</span><h3>${t.s2h}</h3><p>${t.s2p}</p></div>
    <span class="round">${arrow}</span>
  </a>
</section>

<section class="selected wrap">
  <div class="section-head reveal">
    <h2 class="display">${t.selected}</h2>
    <a class="link-arrow" href="${h}projects.html">${t.allProjects} ${arrow}</a>
  </div>
  <div class="grid grid-featured">
    ${featured.map((p, i) => card(p, a, h, i % 3 === 0 ? 'card-wide' : '')).join('\n    ')}
  </div>
</section>

<section class="approach wrap" id="studio">
  <div class="section-head reveal"><h2 class="display">${t.howH}</h2>
  <p class="approach-lead">${t.howLead}</p></div>
  <ol class="steps">
    ${t.steps.map(([s, d], i) => `<li class="reveal"><span>0${i + 1}</span><h4>${s}</h4><p>${d}</p></li>`).join('\n    ')}
  </ol>
</section>

<section class="contact wrap" id="contact">
  <div class="contact-inner reveal">
    <div class="contact-intro">
      <h2 class="display">${t.contactH}</h2>
      <p>${t.contactP}</p>
      <p class="contact-direct"><a href="mailto:${EMAIL}">${EMAIL}</a><br><span class="muted">${t.city}</span></p>
    </div>
    <form class="contact-form" data-endpoint="${FORM_EMAIL ? `https://formsubmit.co/ajax/${FORM_EMAIL}` : ''}" data-subject="${esc(f.subject)}" data-lang="${lang}" novalidate>
      <div class="f-row">
        <label><span>${f.name}</span><input name="name" required autocomplete="name"></label>
        <label><span>${f.email}</span><input name="email" type="email" required autocomplete="email"></label>
      </div>
      <div class="f-row">
        <label><span>${f.phone}</span><input name="phone" type="tel" autocomplete="tel"></label>
        <label><span>${f.type}</span><select name="project_type">${f.types.map(x => `<option>${x}</option>`).join('')}</select></label>
      </div>
      <label><span>${f.msg}</span><textarea name="message" rows="4" required></textarea></label>
      <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="f-foot">
        <button class="btn btn-solid" type="submit" data-sending="${esc(f.sending)}">${f.send} ${arrow}</button>
        <p class="f-note">${f.consent}</p>
      </div>
      <p class="f-status" role="status" data-ok="${esc(f.ok)}" data-err="${esc(f.err)}" data-off="${esc(f.off)} ${EMAIL}"></p>
    </form>
  </div>
</section>
`;
    fs.writeFileSync(out('index.html'), layout({ title: `${STUDIO} — ${t.homeTitle}, ${t.city}`, desc: `${STUDIO} ${t.homeDesc}`, body, a, h, rel: 'index.html', dark: true }));
  }

  // ---------- Projects index ----------
  {
    const a = lang === 'en' ? '' : '../', h = '';
    const body = `
<section class="page-head wrap">
  <h1 class="display">${t.projectsTitle}</h1>
  <div class="filters" role="tablist">
    <button class="is-on" data-filter="all">${t.all} <sup>${projects.length}</sup></button>
    <button data-filter="exterior">${t.arch} <sup>${ext.length}</sup></button>
    <button data-filter="interior">${t.interior} <sup>${int.length}</sup></button>
  </div>
</section>
<section class="wrap">
  <div class="grid grid-all">
    ${ordered.map(p => card(p, a, h)).join('\n    ')}
  </div>
</section>
`;
    fs.writeFileSync(out('projects.html'), layout({ title: `${t.projectsTitle} — ${STUDIO}`, desc: `${t.projectsDesc} ${STUDIO}.`, body, a, h, rel: 'projects.html', active: 'projects' }));
  }

  // ---------- Project pages ----------
  ordered.forEach((p, idx) => {
    const next = ordered[(idx + 1) % ordered.length];
    const a = lang === 'en' ? '../' : '../../', h = '../';
    const imgs = p.images.filter(im => im.n !== p.cover);
    const sibling = projects.find(q => q !== p && q.name === p.name);
    const wide = im => im.w > im.h * 1.2 && im.w >= 1800;
    const body = `
<section class="project-hero" style="background-image:url('${a}${p.img(p.cover + '.webp')}')">
  <div class="hero-shade"></div>
  <div class="project-hero-content wrap">
    <a class="back" href="${h}projects.html#${p.cat}">← ${catLabel(p.cat)}</a>
    <h1>${esc(p.name)}</h1>
  </div>
</section>
<section class="project-info wrap reveal">
  <dl>
    <div><dt>${t.type}</dt><dd>${esc(p.type || '')}</dd></div>
    <div><dt>${t.location}</dt><dd>${esc(p.location || '')}</dd></div>
    <div><dt>${t.scope}</dt><dd>${p.cat === 'exterior' ? t.scopeArch : t.scopeInt}</dd></div>
    <div><dt>${t.images}</dt><dd>${p.images.length}</dd></div>
  </dl>
  <div class="project-text">
    <p class="lead">${esc(p.text || '')}</p>
    ${p.pdf ? `<p><a class="link-arrow" href="${a}${p.pdf}" target="_blank" rel="noopener">${t.brochure} ${arrow}</a></p>` : ''}
    ${sibling ? `<p><a class="link-arrow" href="${h}${sibling.page}">${t.seeOther(sibling.cat)} ${arrow}</a></p>` : ''}
  </div>
</section>
${p.video ? `<section class="wrap project-video reveal"><video src="${a}${p.video}" controls playsinline muted preload="metadata" poster="${a}${p.img(p.cover + '.webp')}"></video></section>` : ''}
<section class="wrap">
  <div class="gallery">
    ${imgs.map(im => `<a class="g-item${wide(im) ? '' : (im.w > im.h * 1.2 ? ' g-half' : ' g-tall')}" href="${a}${p.img(im.n + '.webp')}" data-lightbox><img src="${a}${p.img(im.n + '-m.webp')}" srcset="${srcset(p, im.n, a)}" sizes="${wide(im) ? '100vw' : '(max-width:760px) 100vw, 50vw'}" width="${im.w}" height="${im.h}" alt="${esc(p.name)} — ${t.image} ${+im.n}" loading="lazy"></a>`).join('\n    ')}
  </div>
</section>
<section class="next-project wrap">
  <a href="${h}${next.page}">
    <span class="eyebrow">${t.next}</span>
    <span class="next-name">${esc(next.name)} ${arrow}</span>
    <img src="${a}${next.img(next.cover + '-s.webp')}" alt="" loading="lazy">
  </a>
</section>
<div class="lightbox" hidden>
  <button class="lb-close" aria-label="${t.close}">×</button>
  <button class="lb-prev" aria-label="${t.prev}">‹</button>
  <img alt="">
  <button class="lb-next" aria-label="${t.nextImg}">›</button>
  <span class="lb-count"></span>
</div>
`;
    fs.writeFileSync(out(p.page), layout({ title: `${p.name} — ${catLabel(p.cat)} — ${STUDIO}`, desc: p.text || p.name, body, a, h, rel: p.page, dark: true, active: 'projects' }));
  });
  console.log(lang, 'generated', ordered.length, 'project pages');
}

build('en');
build('el');
