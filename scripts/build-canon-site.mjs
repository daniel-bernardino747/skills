#!/usr/bin/env node
// Gera o site público do Cânone de UI a partir de dont-mess-up-ui/principles e demos/.
//
//   node scripts/build-canon-site.mjs            → _site/
//   node scripts/build-canon-site.mjs --serve    → gera e serve em http://127.0.0.1:4173
//
// Fonte única: os .md do Cânone. O site só renderiza; nunca é editado à mão (ADR-0008).
// Páginas: index.html (visão geral), usar.html, e uma <ID>.html por Princípio.

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(REPO, '_site');
const SKILL = 'dont-mess-up-ui';
const DOMAINS = [
  { file: 'ui.md', prefix: 'UI', name: 'Aparência', blurb: 'Tipografia, cor, espaço, hierarquia e estados visuais.' },
  { file: 'ux.md', prefix: 'UX', name: 'Comportamento', blurb: 'Fluxo, feedback, foco, teclado, erros e alvos de toque.' },
  { file: 'motion.md', prefix: 'MOT', name: 'Movimento', blurb: 'Duração, easing, origem, interrupção e antecipação.' },
];

const SRC = ['skills', 'preview', 'lab'].map((t) => join(REPO, t, SKILL)).find(existsSync);
if (!SRC) throw new Error(`${SKILL} não encontrada em skills/, preview/ ou lab/`);

const git = (...args) => {
  try { return execFileSync('git', args, { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return ''; }
};

// ---------- parse ----------

function parse(md) {
  const principles = [];
  const retired = [];
  let section = null;
  let cur = null;
  for (const line of md.split(/\r?\n/)) {
    if (line.startsWith('## ')) { section = line.slice(3).trim(); cur = null; continue; }
    const h = line.match(/^### ([A-Z]+-\d{3}) — (.+)$/);
    if (h && section === 'Princípios') { cur = { id: h[1], title: h[2].trim(), f: {} }; principles.push(cur); continue; }
    const f = line.match(/^- \*\*(.+?):\*\* (.*)$/);
    if (f && cur) { cur.f[f[1]] = f[2].trim(); continue; }
    if (section === 'Aposentados' && line.startsWith('- ')) retired.push(line.slice(2).trim());
  }
  return { principles, retired };
}

const domains = DOMAINS.map((d) => ({ ...d, ...parse(readFileSync(join(SRC, 'principles', d.file), 'utf8')) }));
for (const d of domains) for (const p of d.principles) p.domain = d;
const all = domains.flatMap((d) => d.principles);

// ---------- versão ----------

const tag = git('describe', '--tags', '--match', 'canon-v*', '--abbrev=0', 'HEAD');
const sha = git('rev-parse', '--short', 'HEAD');
const date = git('log', '-1', '--format=%cs') || new Date().toISOString().slice(0, 10);
const relSrc = relative(REPO, SRC).split('\\').join('/');
const tagged = new Set();
if (tag) {
  for (const d of DOMAINS) {
    const old = git('show', `${tag}:${relSrc}/principles/${d.file}`);
    for (const m of old.matchAll(/^### ([A-Z]+-\d{3}) /gm)) tagged.add(m[1]);
  }
}
const remote = git('remote', 'get-url', 'origin').replace(/\.git$/, '').replace(/^git@github\.com:/, 'https://github.com/');
const slug = process.env.GITHUB_REPOSITORY || (remote.match(/github\.com\/(.+)$/) || [])[1] || 'owner/skills';
const repoUrl = `https://github.com/${slug}`;

// ---------- helpers ----------

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (s) => s.replace(/`/g, '');
const cap = (s) => s.replace(/^\p{Ll}/u, (c) => c.toUpperCase());
function inline(s) {
  return s.split('`').map((part, i) => {
    if (i % 2) return `<code>${esc(part)}</code>`;
    return esc(part)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/https?:\/\/[^\s<]+[^\s<.,;:)"]/g, (u) => `<a href="${u}" rel="noopener">${u.replace(/^https?:\/\/(www\.)?/, '')}</a>`)
      .replace(/\b((?:UI|UX|MOT)-\d{3})\b/g, (id) => (all.some((p) => p.id === id) ? `<a href="${id}.html">${id}</a>` : id));
  }).join('');
}
const demosDir = join(SRC, 'demos');
const hasDemo = (id) => existsSync(join(demosDir, `${id}.html`));
const sevOf = (p) => (p.f['Severidade'] || '').toLowerCase();
const isNew = (p) => tag && !tagged.has(p.id);

// ---------- layout ----------

function sidebar(current) {
  const link = (href, label, key) =>
    `<a href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;
  const groups = domains.map((d) => `
    <div class="nav-group">
      <p class="nav-title">${d.name} <span>${d.prefix}-</span></p>
      ${d.principles.length
        ? d.principles.map((p) => link(`${p.id}.html`, `<span class="nav-id">${p.id}</span><span class="nav-label">${inline(p.title)}</span>`, p.id)).join('')
        : '<p class="nav-empty">Nenhum ainda</p>'}
    </div>`).join('');
  return `
  <aside class="side" id="side">
    <div class="side-head">
      <a class="brand" href="index.html">Cânone<span class="dot" aria-hidden="true"></span></a>
      ${themeButton}
    </div>
    <div class="nav-group">
      ${link('index.html', 'Visão geral', 'index')}
      ${link('usar.html', 'Usar num projeto', 'usar')}
    </div>
    ${groups}
    <div class="nav-group nav-foot">
      <a href="${repoUrl}" rel="noopener">GitHub</a>
      ${tag ? `<span>${esc(tag)} · ${all.length} princípios</span>` : ''}
    </div>
  </aside>`;
}

const themeButton = `<button type="button" class="theme-btn" aria-label="Alternar tema claro e escuro">
        <svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        <svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>
      </button>`;

function page({ title, description, current, body }) {
  return `<!doctype html>
<html lang="pt-BR" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<script>try { if (localStorage.getItem('canon-theme') === 'light') document.documentElement.dataset.theme = 'light'; } catch {}</script>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='9' fill='%2300bb7f'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&display=swap">
<link rel="stylesheet" href="site.css">
</head>
<body>
<a class="skip" href="#main">Pular para o conteúdo</a>
<header class="mobile-bar">
  <a class="brand" href="index.html">Cânone<span class="dot" aria-hidden="true"></span></a>
  <button type="button" class="menu-btn" aria-controls="side" aria-expanded="false">Menu</button>
</header>
<div class="layout">
  ${sidebar(current)}
  <main class="content" id="main" tabindex="-1">
${body}
    <footer class="foot">
      Gerado de <a href="${repoUrl}/tree/${sha}/${relSrc}/principles">${relSrc}/principles</a> em ${sha || 'local'}, ${date}.
      Fontes externas aparecem sempre parafraseadas.
    </footer>
  </main>
</div>
<script src="site.js"></script>
</body>
</html>
`;
}

// ---------- páginas ----------

const pills = (p) => `
      <div class="pills">
        <span class="pill pill-id" title="ID">${p.id}</span>
        <span class="pill sev-${esc(sevOf(p))}" title="Severidade">${esc(sevOf(p))}</span>
        <span class="pill" title="Verificação">${esc(p.f['Verificação'] || '')}</span>
        ${isNew(p) ? `<span class="pill new" title="Ainda não está em nenhuma tag">depois da ${esc(tag)}</span>` : ''}
      </div>`;

function principlePage(p, i) {
  const f = p.f;
  const row = (k) => f[k] && f[k] !== '—' ? `<dt>${k}</dt><dd>${inline(f[k])}</dd>` : '';
  const prev = all[i - 1];
  const next = all[i + 1];
  const body = `
    <nav class="crumbs"><a href="index.html#${p.domain.prefix.toLowerCase()}">${p.domain.name}</a> / ${p.id}</nav>
    <header class="p-head">
      <h1>${inline(p.title)}</h1>
      ${pills(p)}
    </header>
    <p class="rule">${inline(cap(f['Regra'] || ''))}</p>
    ${f['Por quê'] ? `<p class="why">${inline(cap(f['Por quê']))}</p>` : ''}
    ${hasDemo(p.id)
      ? `<section class="demo-wrap"><h2>Na prática</h2><iframe class="demo" src="demos/${p.id}.html" title="Demonstração de ${p.id}"></iframe></section>`
      : f['Verificação'] === 'manual' ? '<p class="note">Verificação manual: este princípio vira item de checklist na revisão.</p>' : ''}
    <dl class="facts">${row('Sinais no código')}${row('Exceções')}${row('Fonte')}</dl>
    <nav class="pager">
      ${prev ? `<a class="prev" href="${prev.id}.html"><span>Anterior</span>${prev.id} · ${inline(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a class="next" href="${next.id}.html"><span>Próximo</span>${next.id} · ${inline(next.title)}</a>` : '<span></span>'}
    </nav>`;
  return page({
    title: `${p.id} — ${strip(p.title)} · Cânone de UI`,
    description: strip(f['Regra'] || p.title).slice(0, 180),
    current: p.id,
    body,
  });
}

function indexPage() {
  const sections = domains.map((d) => `
    <section class="domain" id="${d.prefix.toLowerCase()}">
      <h2>${d.name} <span class="prefix">${d.prefix}-</span></h2>
      <p class="blurb">${d.blurb}</p>
      ${d.principles.length ? `<ul class="list">${d.principles.map((p) => `
        <li><a href="${p.id}.html">
          <span class="l-id">${p.id}</span>
          <span class="l-title">${inline(p.title)}</span>
          <span class="pill sev-${esc(sevOf(p))}">${esc(sevOf(p))}</span>
        </a></li>`).join('')}</ul>` : '<p class="empty">Nenhum princípio ainda.</p>'}
      ${d.retired.length ? `<details class="retired"><summary>Aposentados (${d.retired.length})</summary><ul>${d.retired.map((r) => `<li>${inline(r)}</li>`).join('')}</ul></details>` : ''}
    </section>`).join('');
  const body = `
    <section class="hero">
      <h1>Cânone de UI</h1>
      <p>Princípios de aparência, comportamento e movimento que uso para revisar interfaces. Cada um entrou depois de ser discutido e confirmado individualmente, quase sempre olhando a demonstração que acompanha a página dele.</p>
      <p>Todo princípio tem uma regra que dá para conferir lendo só o código. É isso que a revisão automática <code>dont-mess-up-ui</code> mede em cada pull request. Veja <a href="usar.html">como usar num projeto</a>.</p>
      <div class="meta">
        <span><b>${all.length}</b> princípios</span>
        ${tag ? `<span>versão fixada <b>${esc(tag)}</b></span>` : ''}
        <span>atualizado em <b>${date}</b></span>
      </div>
    </section>
    ${sections}`;
  return page({
    title: 'Cânone de UI',
    description: 'Princípios de aparência, comportamento e movimento, cada um com uma demonstração, usados para revisar interfaces.',
    current: 'index',
    body,
  });
}

function usePage() {
  const ci = `jobs:
  ui-review:
    uses: ${slug}/.github/workflows/dont-mess-up-ui.yml@${tag || 'canon-v1'}
    with:
      mode: report   # ou gate: falha o PR com qualquer "bloqueia"
    secrets: inherit
    permissions:
      contents: read
      pull-requests: write`;
  const body = `
    <header class="p-head"><h1>Usar num projeto</h1></header>
    <h2>No CI</h2>
    <p>Chame o workflow reutilizável num workflow de <code>pull_request</code>. A revisão comenta no PR e atualiza o mesmo comentário a cada push.</p>
    <pre><code>${esc(ci)}</code></pre>
    <p>A tag depois do <code>@</code> fixa o Cânone usado. O projeto só recebe princípios novos quando você trocar a tag. Com <code>@main</code>, ele acompanha cada captura na hora.</p>
    <dl>
      <dt><code>mode: report</code></dt><dd>Padrão. Comenta e nunca falha.</dd>
      <dt><code>mode: gate</code></dt><dd>Falha o PR quando há pelo menos uma violação de severidade <span class="pill sev-bloqueia">bloqueia</span>. Use com uma tag fixa.</dd>
      <dt>Credencial</dt><dd>Um secret <code>ANTHROPIC_API_KEY</code> ou, na falta dele, <code>CLAUDE_CODE_OAUTH_TOKEN</code>. Sem nenhum, o job só avisa e termina.</dd>
    </dl>
    <h2>Localmente</h2>
    <p>Com a skill <code>dont-mess-up-ui</code> instalada, rode <code>/dont-mess-up-ui</code> numa branch para revisar o que mudou em relação à branch principal, ou <code>/dont-mess-up-ui --full</code> para uma auditoria do projeto inteiro, que nunca bloqueia.</p>
    <h2>Severidades</h2>
    <dl>
      <dt><span class="pill sev-bloqueia">bloqueia</span></dt><dd>Falha o PR em modo <code>gate</code>.</dd>
      <dt><span class="pill sev-avisa">avisa</span></dt><dd>Aparece no comentário, não falha.</dd>
      <dt><span class="pill sev-sugere">sugere</span></dt><dd>Melhoria opcional.</dd>
    </dl>`;
  return page({ title: 'Usar num projeto · Cânone de UI', description: 'Como rodar a revisão do Cânone de UI no CI e localmente.', current: 'usar', body });
}

// ---------- assets ----------

const css = `:root, :root[data-theme="dark"] {
  --bg: #09090b; --fg: #fafafa; --muted: #a1a1aa; --faint: #8b8b94;
  --line: #ffffff1a; --line-strong: #ffffff2e; --surface: #ffffff08; --surface-2: #ffffff0f;
  --accent: #00bb7f; --accent-text: #00bb7f; --on-accent: #09090b;
  --bloqueia: #ff6568; --avisa: #f5b041; --sugere: #a1a1aa;
  --dots: #ffffff26;
  color-scheme: dark;
}
:root[data-theme="light"] {
  --bg: #f8f8fc; --fg: #09090b; --muted: #52525b; --faint: #63636b;
  --line: #09090b1a; --line-strong: #09090b2e; --surface: #09090b05; --surface-2: #09090b0b;
  --accent: #00bb7f; --accent-text: #006c49; --on-accent: #09090b;
  --bloqueia: #c8001a; --avisa: #8a5a00; --sugere: #52525b;
  --dots: #09090b1f;
  color-scheme: light;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--bg); color: var(--fg);
  font: 16px/1.65 "Geist", ui-sans-serif, system-ui, sans-serif; font-feature-settings: "ss01"; }
::selection { background: color-mix(in srgb, var(--fg) 22%, transparent); color: var(--fg); }
:focus-visible { outline: 2px solid var(--fg); outline-offset: 2px; border-radius: 6px; }
* { scrollbar-color: var(--line-strong) transparent; scrollbar-width: thin; }
a { color: var(--fg); text-decoration-color: var(--line-strong); text-decoration-thickness: 1px; text-underline-offset: 3px; }
a:hover { text-decoration-color: currentColor; }
code { font: 500 .84em/1.4 "Geist Mono", ui-monospace, Consolas, monospace; background: var(--surface-2);
  border: 1px solid var(--line); padding: .05em .4em; border-radius: 6px; overflow-wrap: anywhere; }
pre { background: var(--surface); border: 1px solid var(--line); padding: 16px 18px; border-radius: 10px; overflow-x: auto; }
pre code { background: none; border: 0; padding: 0; font-size: 13px; line-height: 1.6; }
.mono { font-family: "Geist Mono", ui-monospace, Consolas, monospace; }

/* layout */
.layout { display: grid; grid-template-columns: 288px minmax(0, 1fr); min-height: 100vh; }
.side { position: sticky; top: 0; height: 100vh; overflow-y: auto; border-right: 1px solid var(--line);
  padding: 20px 14px 28px; font-size: 14px; background: var(--bg); }
.side-head { position: sticky; top: -20px; z-index: 2; display: flex; align-items: center; justify-content: space-between;
  margin: -20px -14px 8px; padding: 20px 22px 14px; background: var(--bg); }
.brand { display: inline-flex; align-items: center; gap: 7px; font-weight: 700; font-size: 17px; letter-spacing: -.01em;
  color: var(--fg); text-decoration: none; }
.brand .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); margin-top: 2px; }
.theme-btn { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 999px; cursor: pointer;
  background: transparent; color: var(--muted); border: 1px solid var(--line); }
.theme-btn:hover { color: var(--fg); border-color: var(--line-strong); }
.theme-btn svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
:root[data-theme="dark"] .i-moon, :root[data-theme="light"] .i-sun { display: none; }

.nav-group { margin-bottom: 20px; }
.nav-title { display: flex; justify-content: space-between; margin: 0 0 6px; padding: 0 8px;
  font-size: 13px; font-weight: 600; color: var(--fg); }
.nav-title span { font: 500 12px "Geist Mono", ui-monospace, monospace; color: var(--faint); }
.side a:not(.brand) { display: flex; gap: 10px; padding: 6px 8px; border-radius: 8px; color: var(--muted);
  text-decoration: none; line-height: 1.4; }
.side a:not(.brand):hover { color: var(--fg); background: var(--surface-2); }
.side a[aria-current="page"] { color: var(--fg); background: var(--surface-2); }
.side a[aria-current="page"] .nav-id { color: var(--fg); }
.nav-id { flex: none; width: 60px; font: 500 12px/1.65 "Geist Mono", ui-monospace, monospace; color: var(--faint); }
.nav-label code { background: none; border: 0; padding: 0; font-size: 12px; }
.nav-empty { margin: 0; padding: 4px 8px; color: var(--faint); }
.nav-foot { border-top: 1px solid var(--line); padding-top: 14px; color: var(--faint); font-size: 13px; }
.nav-foot span { display: block; padding: 4px 8px; font-family: "Geist Mono", ui-monospace, monospace; font-size: 12px; }

.content { width: 100%; max-width: 860px; padding: 0 56px; }
.mobile-bar { display: none; }

/* topo de cada página: grade de pontos da marca */
.content::before { content: ""; display: block; height: 56px; }
body { position: relative; isolation: isolate; }
body::before { content: ""; position: absolute; inset: 0 0 auto 0; height: 180px; z-index: -1; pointer-events: none;
  background-image: radial-gradient(var(--dots) 1px, transparent 1px); background-size: 16px 16px;
  mask-image: linear-gradient(#000, transparent); }
.skip { position: absolute; left: 12px; top: -48px; z-index: 50; padding: 8px 14px; border-radius: 999px;
  background: var(--fg); color: var(--bg); text-decoration: none; font-size: 14px; font-weight: 500; }
.skip:focus { top: 12px; }
.content:focus { outline: none; }

/* visão geral */
.hero h1, .p-head h1 { font-size: clamp(32px, 4.2vw, 48px); font-weight: 700; line-height: 1.08;
  letter-spacing: -.035em; margin: 0 0 18px; text-wrap: balance; }
.hero p { max-width: 62ch; color: var(--muted); margin: 0 0 14px; font-size: 17px; }
.meta { display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: 14px; color: var(--muted); margin-top: 22px; }
.meta b { color: var(--fg); font-weight: 600; font-variant-numeric: tabular-nums; }

.domain { padding-top: 56px; }
.domain h2 { display: flex; align-items: baseline; gap: 10px; font-size: 24px; font-weight: 700; letter-spacing: -.02em; margin: 0; }
h2 .prefix { font: 500 13px "Geist Mono", ui-monospace, monospace; color: var(--faint); letter-spacing: 0; }
.blurb { color: var(--muted); margin: 4px 0 16px; font-size: 15px; }
.list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.list li { border-bottom: 1px solid var(--line); }
.list a { display: grid; grid-template-columns: 76px 1fr auto; gap: 14px; align-items: baseline;
  padding: 14px 4px; color: var(--fg); text-decoration: none; }
.list a:hover .l-title { text-decoration: underline; text-decoration-color: var(--line-strong); text-underline-offset: 3px; }
.l-id { font: 500 12.5px "Geist Mono", ui-monospace, monospace; color: var(--faint); }
.l-title { font-weight: 500; transition: color 120ms ease-out; }
.empty { color: var(--muted); border: 1px dashed var(--line-strong); border-radius: 10px; padding: 16px 18px; margin: 0; }
.retired { color: var(--muted); font-size: 14px; margin-top: 12px; }
.retired summary { cursor: pointer; }

/* página de princípio */
.crumbs { font-size: 14px; color: var(--faint); margin: 0 0 20px; }
.crumbs a { color: var(--muted); text-decoration: none; }
.crumbs a:hover { color: var(--fg); }
.pills { display: flex; flex-wrap: wrap; gap: 6px; }
.pill { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 500; line-height: 24px;
  padding: 0 10px; border-radius: 999px; border: 1px solid var(--line-strong); color: var(--muted); white-space: nowrap; }
.pill-id { font-family: "Geist Mono", ui-monospace, monospace; color: var(--fg); }
.pill[class*="sev-"]::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.pill.sev-bloqueia { color: var(--bloqueia); }
.pill.sev-avisa { color: var(--avisa); }
.pill.sev-sugere { color: var(--sugere); }
.pill.new { color: var(--muted); border-color: var(--line-strong); border-style: dashed; }
.rule { font-size: clamp(19px, 1.7vw, 22px); line-height: 1.5; font-weight: 450; letter-spacing: -.01em;
  margin: 32px 0 14px; max-width: 64ch; text-wrap: pretty; }
.why { color: var(--muted); margin: 0; max-width: 64ch; font-size: 16.5px; }
dl { display: grid; grid-template-columns: 9.5rem 1fr; gap: 0; margin: 0; font-size: 15px; border-top: 1px solid var(--line); }
dt, dd { padding: 14px 0; border-bottom: 1px solid var(--line); }
dt { color: var(--faint); font-size: 13.5px; padding-top: 16px; }
dd { margin: 0; min-width: 0; color: var(--fg); }
.content h2 { font-size: 22px; font-weight: 700; letter-spacing: -.02em; margin: 48px 0 12px; }
.demo-wrap { margin-top: 40px; }
.demo-wrap + .facts, .note + .facts { margin-top: 40px; }
.demo-wrap h2 { margin: 0 0 14px; }
iframe.demo { display: block; width: 100%; height: 360px; border: 0; background: transparent; }
.note { color: var(--muted); }

.pager { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 56px; }
.pager a { display: block; border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; color: var(--fg);
  text-decoration: none; font-size: 14.5px; font-weight: 500; transition: border-color 120ms ease-out; }
.pager a:hover { border-color: var(--line-strong); }
.pager a span { display: block; font-size: 12.5px; font-weight: 400; color: var(--faint); margin-bottom: 2px; }
.pager .next { text-align: right; }
.foot { margin: 72px 0 40px; padding-top: 18px; border-top: 1px solid var(--line); color: var(--faint); font-size: 13.5px; }
.foot a { color: var(--muted); }

/* usar num projeto */
.use-dl dt { font-family: inherit; }

@media (max-width: 960px) {
  .layout { display: block; }
  .mobile-bar { display: flex; position: sticky; top: 0; z-index: 20; align-items: center; justify-content: space-between;
    height: 56px; padding: 0 16px; background: color-mix(in srgb, var(--bg) 92%, transparent);
    backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
  .menu-btn { font: inherit; font-size: 14px; font-weight: 500; padding: 6px 14px; border-radius: 999px;
    border: 1px solid var(--line-strong); background: transparent; color: var(--fg); cursor: pointer; }
  .side { position: fixed; z-index: 30; top: 56px; left: 0; bottom: 0; height: auto; width: min(320px, 88vw);
    transform: translateX(-100%); visibility: hidden;
    transition: transform 240ms cubic-bezier(.16, 1, .3, 1), visibility 0s 240ms; }
  body.menu-open .side { visibility: visible; transition: transform 240ms cubic-bezier(.16, 1, .3, 1); }
  .side-head .brand { display: none; }
  .side-head::before { content: "Tema"; font-size: 13px; color: var(--muted); }
  body.menu-open .side { transform: none; box-shadow: 0 0 0 100vmax rgb(0 0 0 / .45); }
  .content { padding: 0 16px; }
  .content::before { height: 32px; }
}
@media (max-width: 560px) {
  dl { grid-template-columns: 1fr; }
  dt { border-bottom: 0; padding-bottom: 0; }
  dd { padding-top: 4px; }
  .list a { grid-template-columns: 1fr auto; gap: 4px 12px; }
  .l-id { grid-column: 1 / -1; }
  .pager { grid-template-columns: 1fr; }
  .pager .next { text-align: left; }
}
@media (prefers-reduced-motion: reduce) { .side, .l-title, .pager a { transition: none; } }
`;

const js = `(() => {
  const root = document.documentElement;
  const btn = document.querySelector('.menu-btn');
  const side = document.getElementById('side');
  const cur = side.querySelector('[aria-current="page"]');
  const center = () => { if (cur) side.scrollTop = cur.offsetTop - side.clientHeight / 2; };
  const set = (open) => {
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Fechar' : 'Menu';
    if (open) center();
  };
  btn.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { set(false); btn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('menu-open') && !e.target.closest('.side, .menu-btn')) set(false);
  });
  center();

  const demos = () => document.querySelectorAll('iframe.demo');
  const broadcast = () => demos().forEach((f) => f.contentWindow && f.contentWindow.postMessage({ type: 'canon-theme', theme: root.dataset.theme }, '*'));
  document.querySelector('.theme-btn').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('canon-theme', root.dataset.theme); } catch {}
    broadcast();
  });
  addEventListener('message', (e) => {
    if (!e.data) return;
    for (const f of demos()) {
      if (f.contentWindow !== e.source) continue;
      if (e.data.type === 'canon-demo-height') f.style.height = e.data.h + 'px';
      if (e.data.type === 'canon-demo-ready') f.contentWindow.postMessage({ type: 'canon-theme', theme: root.dataset.theme }, '*');
    }
  });
})();
`;

// ---------- escrita ----------

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'site.css'), css);
writeFileSync(join(OUT, 'site.js'), js);
writeFileSync(join(OUT, 'index.html'), indexPage());
writeFileSync(join(OUT, 'usar.html'), usePage());
all.forEach((p, i) => writeFileSync(join(OUT, `${p.id}.html`), principlePage(p, i)));
writeFileSync(join(OUT, '.nojekyll'), '');
if (existsSync(demosDir)) cpSync(demosDir, join(OUT, 'demos'), { recursive: true });

const demoCount = existsSync(demosDir) ? readdirSync(demosDir).filter((n) => /^[A-Z]+-\d{3}\.html$/.test(n)).length : 0;
const missing = all.filter((p) => p.f['Verificação'] === 'código' && !hasDemo(p.id)).map((p) => p.id);
console.log(`✓ _site/ — ${all.length} princípios, ${demoCount} demos${tag ? `, ${tag}` : ''}${missing.length ? ` · sem demo: ${missing.join(', ')}` : ''}`);

// ---------- --serve ----------

if (process.argv.includes('--serve')) {
  const port = Number(process.env.PORT) || 4173;
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
  createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = join(OUT, p);
    if (!file.startsWith(OUT) || !existsSync(file)) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(readFileSync(file));
  }).listen(port, '127.0.0.1', () => console.log(`→ http://127.0.0.1:${port}/`));
}
