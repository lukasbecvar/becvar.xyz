(function () {
    'use strict';

    var BIRTH = new Date(1999, 4, 28);
    var START_YEAR = 2012;
    var PROJECTS = [
        // aktivní
        { name: 'admin-suite', status: 'open', lang: 'PHP', featured: true, desc: 'Komplexní nástroj pro správu a monitoring linuxových serverů.' },
        { name: 'api-base', status: 'open', lang: 'PHP', featured: true, desc: 'Základní šablona pro vývoj REST API ve frameworku Symfony.' },
        { name: 'internal-platform-base', status: 'open', lang: 'PHP', desc: 'Základ pro interní aplikace postavené na Symfony.' },
        { name: 'ssr-website-base', status: 'open', lang: 'PHP', desc: 'Šablona pro server-side renderované weby v Symfony a Bootstrapu.' },
        { name: 'becvar-site', status: 'open', lang: 'PHP', desc: 'Můj osobní web postavený na Symfony.' },
        { name: 'react-app-base', status: 'open', lang: 'JavaScript', desc: 'Šablona React aplikace s Vite, Tailwindem, routerem, Dockerem a buildem přes Electron.' },
        { name: 'file-probe', status: 'open', lang: 'C++', desc: 'Utilita pro získání informací o souborech a adresářích.' },
        { name: 'useful-scripts', status: 'open', lang: 'Shell', desc: 'Sbírka skriptů, které se mi hodí při každodenní práci.' },
        // archiv
        { name: 'product-vault', status: 'closed', lang: 'PHP', desc: 'Bezpečné RESTful API pro správu produktových dat a napojení e-shopu.' },
        { name: 'system-scope', status: 'closed', lang: 'PHP', desc: 'REST API pro sběr metrik z linuxových serverů pro dashboardy.' },
        { name: 'ollama-api-reverse-proxy', status: 'closed', lang: 'PHP', desc: 'Reverzní proxy pro Ollama API s ověřováním požadavků přes API token.' },
        { name: 'engal', status: 'closed', lang: 'PHP', desc: 'Self-hosted šifrovaná galerie fotek a videí.' },
        { name: 'code-paste', status: 'closed', lang: 'PHP', desc: 'Služba pro ukládání a sdílení textu a útržků kódu.' },
        { name: 'media-api', status: 'closed', lang: 'PHP', desc: 'API pro ukládání obrázků, videí a GIFů.' },
        { name: 'file-share', status: 'closed', lang: 'PHP', desc: 'Jednoduchá aplikace pro sdílení souborů.' },
        { name: 'speed-test', status: 'closed', lang: 'PHP', desc: 'Web pro měření rychlosti internetového připojení.' },
        { name: 'ghost-talk', status: 'closed', lang: 'PHP', desc: 'Lehký anonymní chat postavený na Laravelu.' },
        { name: 'becwork', status: 'closed', lang: 'PHP', desc: 'Vlastní PHP framework.' },
        { name: 'becwork-utils', status: 'closed', lang: 'PHP', desc: 'Sada užitečných utilit pro webové aplikace.' },
        { name: 'mysql-ai-agent', status: 'closed', lang: 'Python', desc: 'AI agent, který rozumí požadavkům v přirozeném jazyce a provádí je nad MySQL.' },
        { name: 'gemini-cli-chat', status: 'closed', lang: 'Python', desc: 'Skript bez závislostí pro komunikaci s Google Gemini API z příkazové řádky.' },
        { name: 'ssh-hammer', status: 'closed', lang: 'Java', desc: 'Nástroj pro testování odolnosti SSH slovníkovým útokem.' },
        { name: 'discord-bot', status: 'closed', lang: 'Java', desc: 'Základ pro Discord bota v Javě.' },
        { name: 'dubinek-bot', status: 'closed', lang: 'Java', desc: 'Můj vlastní Discord bot.' },
        { name: 'becvold-core', status: 'closed', lang: 'Java', desc: 'Základní core plugin pro survival server.' },
        { name: 'ultra-erp-presentation-page', status: 'closed', lang: 'HTML', desc: 'Prezentační stránka systému ULTRA-ERP (webpack, Tailwind, Docker).' },
        { name: 'password-and-hash-generator', status: 'closed', lang: 'JavaScript', desc: 'Generátor hesel a hashů.' },
        { name: 'pooping-elephant-meme-page', status: 'closed', lang: 'JavaScript', desc: 'Interaktivní simulátor kadícího slona. Protože proč ne.' }
    ];

    var LANG_COLORS = {
        'PHP': '#8892bf', 'JavaScript': '#f1e05a', 'Python': '#3572a5', 'Java': '#b07219',
        'C++': '#f34b7d', 'Shell': '#89e051', 'HTML': '#e34c26'
    };

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function $(sel, ctx) { return (ctx || document).querySelector(sel); }
    function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

    function el(tag, cls, text) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text) e.textContent = text;
        return e;
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    /* ---------- dynamic values ---------- */
    var now = new Date();
    var age = now.getFullYear() - BIRTH.getFullYear();
    if (now < new Date(now.getFullYear(), BIRTH.getMonth(), BIRTH.getDate())) age--;
    $('#age').textContent = age;
    var years = now.getFullYear() - START_YEAR;
    $('#years').textContent = years;
    $('#years').setAttribute('data-count', years);
    $('#year').textContent = now.getFullYear();

    /* ---------- header + to-top ---------- */
    var header = $('#header');
    var toTop = $('#to-top');
    function onScroll() {
        var y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 20);
        toTop.classList.toggle('is-visible', y > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- mobile nav ---------- */
    var nav = $('#nav');
    var toggle = $('#nav-toggle');
    function setNav(open) {
        nav.classList.toggle('is-open', open);
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.innerHTML = open ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    }
    toggle.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });

    /* ---------- active nav link ---------- */
    var navLinks = $$('.nav a[href^="#"]');
    if ('IntersectionObserver' in window) {
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (a) {
                    a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        $$('main section[id]').forEach(function (s) { sectionObserver.observe(s); });
    }

    /* ---------- hero name split ---------- */
    var heroName = $('#hero-name');
    if (heroName && !reduceMotion) {
        var full = heroName.textContent;
        heroName.setAttribute('aria-label', full);
        heroName.textContent = '';
        var idx = 0;
        full.split(' ').forEach(function (word, wi) {
            if (wi > 0) heroName.appendChild(document.createTextNode(' '));
            var w = el('span', 'word');
            w.setAttribute('aria-hidden', 'true');
            word.split('').forEach(function (ch) {
                var c = el('span', 'char', ch);
                c.style.setProperty('--i', idx++);
                w.appendChild(c);
            });
            heroName.appendChild(w);
        });
    }

    /* ---------- typed text ---------- */
    var typed = $('#typed');
    var typedWrap = typed.parentNode;
    var words = typed.getAttribute('data-words').split('|');
    var srWord = el('span', 'sr-only', words.join(', '));
    typedWrap.appendChild(srWord);
    typed.setAttribute('aria-hidden', 'true');
    typed.textContent = '';

    function addChar(ch) {
        var c = el('span', 't-ch', ch === ' ' ? ' ' : ch);
        typed.appendChild(c);
    }
    function setTypingState(on) { typedWrap.classList.toggle('is-typing', on); }
    words[0].split('').forEach(addChar);
    var wi = 0, deleting = true;
    var tick = function () {
        if (deleting) {
            setTypingState(true);
            if (typed.lastChild) {
                typed.removeChild(typed.lastChild);
                return setTimeout(tick, 28);
            }
            deleting = false;
            wi = (wi + 1) % words.length;
            typed.setAttribute('data-i', wi % 4);
            return setTimeout(tick, 300);
        }
        var word = words[wi];
        var n = typed.childNodes.length;
        if (n < word.length) {
            addChar(word.charAt(n));
            return setTimeout(tick, 55 + Math.random() * 65);
        }
        setTypingState(false);
        typed.classList.remove('is-done');
        void typed.offsetWidth;
        typed.classList.add('is-done');
        deleting = true;
        setTimeout(tick, 2400);
    };
    setTimeout(tick, 2600);

    /* ---------- terminal lines ---------- */
    var termCode = $('#terminal code');
    var TERM_SCRIPT = [
        { cmd: 'whoami', out: [['', 'lukas – backend developer & sysadmin']] },
        { cmd: 'cat stack.txt', out: [['lang', 'php, javascript, java, python'], ['web', 'symfony, doctrine, react'], ['infra', 'linux, docker, kubernetes']] },
        { cmd: 'ls ~/projects | wc -l', out: [['', String(PROJECTS.length)]] }
    ];
    function promptLine() {
        var line = el('span', 't-line');
        line.appendChild(el('span', 't-prompt', '$'));
        line.appendChild(document.createTextNode(' '));
        var text = el('span');
        var cursor = el('span', 't-cursor');
        line.appendChild(text);
        line.appendChild(cursor);
        termCode.appendChild(line);
        return { text: text, cursor: cursor };
    }
    function runTerminal() {
        termCode.textContent = '';
        var step = 0;
        var next = function () {
            var p = promptLine();
            if (step >= TERM_SCRIPT.length) return;
            var item = TERM_SCRIPT[step++];
            var i = 0;
            var type = function () {
                if (i < item.cmd.length) {
                    p.text.textContent += item.cmd.charAt(i++);
                    return setTimeout(type, 45 + Math.random() * 70);
                }
                setTimeout(function () {
                    p.cursor.parentNode.removeChild(p.cursor);
                    termCode.appendChild(document.createTextNode('\n'));
                    var k = 0;
                    var out = function () {
                        if (k < item.out.length) {
                            var o = item.out[k++];
                            var line = el('span', 't-out t-anim');
                            if (o[0]) {
                                line.appendChild(el('span', 't-key', o[0]));
                                line.appendChild(document.createTextNode(new Array(9 - o[0].length).join(' ') + o[1]));
                            } else {
                                line.textContent = o[1];
                            }
                            termCode.appendChild(line);
                            termCode.appendChild(document.createTextNode('\n'));
                            return setTimeout(out, 110);
                        }
                        setTimeout(next, 650);
                    };
                    out();
                }, 380);
            };
            setTimeout(type, 500);
        };
        next();
    }
    if (!reduceMotion && termCode) setTimeout(runTerminal, 900);

    /* ---------- projects ---------- */
    var projectsEl = $('#projects');
    function card(p) {
        var color = LANG_COLORS[p.lang] || '#888';
        var url = 'https://github.com/lukasbecvar/' + p.name;
        return '' +
            '<a class="project' + (p.featured ? ' is-featured' : '') + '" data-status="' + p.status + '" href="' + url + '" target="_blank" rel="noopener">' +
                '<div class="project-top">' +
                    '<i class="bi bi-folder2"></i>' +
                    (p.status === 'open'
                        ? '<span class="badge badge-open">aktivní</span>'
                        : '<span class="badge">archiv</span>') +
                '</div>' +
                '<h3>' + escapeHtml(p.name) + '</h3>' +
                '<p>' + escapeHtml(p.desc) + '</p>' +
                '<div class="project-foot">' +
                    '<span class="lang"><i style="background:' + color + '"></i>' + escapeHtml(p.lang) + '</span>' +
                    '<span class="project-link">GitHub <i class="bi bi-arrow-up-right"></i></span>' +
                '</div>' +
            '</a>';
    }
    projectsEl.innerHTML = PROJECTS.map(card).join('');
    $$('.project', projectsEl).forEach(function (el, i) {
        el.classList.add('reveal');
        el.style.setProperty('--delay', (i % 3) * 0.08 + 's');
    });

    var openCount = PROJECTS.filter(function (p) { return p.status === 'open'; }).length;
    $('#count-all').textContent = PROJECTS.length;
    $('#count-open').textContent = openCount;
    $('#count-closed').textContent = PROJECTS.length - openCount;

    var filters = $$('.filter');
    function applyFilter(f) {
        filters.forEach(function (b) {
            var on = b.getAttribute('data-filter') === f;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        $$('.project', projectsEl).forEach(function (el, i) {
            var show = f === 'all' || el.getAttribute('data-status') === f;
            el.hidden = !show;
        });
    }
    filters.forEach(function (b) {
        b.addEventListener('click', function () {
            projectsEl.classList.remove('is-filtering');
            void projectsEl.offsetWidth;
            projectsEl.classList.add('is-filtering');
            applyFilter(b.getAttribute('data-filter'));
        });
    });
    applyFilter('open');

    /* ---------- copy e-mail ---------- */
    var copyBtn = $('#copy-mail');
    copyBtn.addEventListener('click', function () {
        var mail = copyBtn.getAttribute('data-mail');
        var label = $('span', copyBtn);
        var icon = $('i', copyBtn);
        var done = function () {
            label.textContent = 'Zkopírováno';
            icon.className = 'bi bi-check2';
            setTimeout(function () { label.textContent = 'Kopírovat'; icon.className = 'bi bi-copy'; }, 2000);
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(mail).then(done, function () { window.location.href = 'mailto:' + mail; });
        } else {
            var ta = document.createElement('textarea');
            ta.value = mail;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); done(); } catch (e) { window.location.href = 'mailto:' + mail; }
            document.body.removeChild(ta);
        }
    });

    /* ---------- counters ---------- */
    function countUp(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (!target || reduceMotion) return;
        var start = null, dur = 1200;
        var step = function (t) {
            if (!start) start = t;
            var k = Math.min((t - start) / dur, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    /* ---------- reveal on scroll ---------- */
    var reveals = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
        reveals.forEach(function (el) { el.classList.add('is-visible'); });
        $('#skills').classList.add('is-visible');
    } else {
        document.documentElement.classList.add('js-reveal');
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                $$('[data-count]', entry.target).forEach(countUp);
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { revealObserver.observe(el); });
    }

    /* ---------- scroll progress + hero parallax ---------- */
    var progress = $('#scroll-progress');
    var heroBg = $('#hero-bg');
    var ticking = false;
    function onFrame() {
        ticking = false;
        var y = window.scrollY;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
        if (!reduceMotion && y < window.innerHeight * 1.2) {
            heroBg.style.transform = 'translate3d(0,' + (y * 0.35) + 'px,0) scale(1.08)';
        }
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
    }, { passive: true });
    onFrame();

    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ---------- terminal tilt ---------- */
    var hero = $('.hero');
    var termBox = $('#terminal-box');
    if (canHover && !reduceMotion && hero && termBox) {
        hero.addEventListener('mousemove', function (e) {
            var r = hero.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            termBox.style.transform = 'perspective(1200px) rotateY(' + (x * 10) + 'deg) rotateX(' + (y * -8) + 'deg)';
        });
        hero.addEventListener('mouseleave', function () {
            termBox.style.transform = '';
        });
    }

    /* ---------- spotlight on cards ---------- */
    if (canHover && !reduceMotion) {
        $$('.card, .about-card, .project, .stat').forEach(function (c) { c.classList.add('spot'); });
        document.addEventListener('mousemove', function (e) {
            var t = e.target.closest ? e.target.closest('.spot') : null;
            if (!t) return;
            var r = t.getBoundingClientRect();
            t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            t.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }, { passive: true });
    }
})();
