#!/usr/bin/env node
/**
 * dlmf.mjs — a mecânica do `dont-let-me-forget`.
 *
 * O script cuida do que modelo erra em silêncio: data, frontmatter, movimentação
 * de arquivo e sorteio. A prosa e a condução da revisão são do modelo.
 *
 * Sem dependências: ele roda a partir de ~/.agents/skills/, onde não há node_modules.
 *
 *   setup   --path <dir> [--git|--no-git] [--hook|--no-hook] [--script-path <p>]
 *   config  [--json]
 *   add     --titulo <t> --porque <p> [--origem <o>]     (corpo pela stdin)
 *   due     [--json]
 *   list    [--all] [--json]
 *   random  [--json]
 *   show    <arquivo>
 *   advance <arquivo> [--nota <texto>]
 *   act     <arquivo> --artefato <texto>
 *   archive <arquivo> --motivo <texto>
 *   revive  <arquivo>
 *   remind
 *   hook-check
 *   commit  [--m <msg>] [--no-push]
 */

import { spawnSync } from 'node:child_process';
import {
  copyFileSync, existsSync, mkdirSync, readdirSync,
  readFileSync, renameSync, writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOME = homedir();
const CONFIG_PATH = join(HOME, '.dont-let-me-forget.json');
const SETTINGS_PATH = join(HOME, '.claude', 'settings.json');
const CANONICAL_SCRIPT = join(HOME, '.agents', 'skills', 'dont-let-me-forget', 'scripts', 'dlmf.mjs');
const HOOK_MARKER = 'dlmf.mjs';

/** A escada. O último degrau é a Parede: dali não se adia. */
const ESCADA = [
  { estagio: '1d', dias: 1 },
  { estagio: '3d', dias: 3 },
  { estagio: '1w', dias: 7 },
  { estagio: '2w', dias: 14 },
  { estagio: '4w', dias: 28 },
];
const PAREDE = ESCADA[ESCADA.length - 1].estagio;

// ------------------------------------------------------------------- básicos

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function hoje() {
  return isoLocal(new Date());
}

function isoLocal(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Soma dias a uma data ISO ancorando ao meio-dia local: imune a horário de verão. */
function somaDias(iso, dias) {
  const [y, m, d] = iso.split('-').map(Number);
  const base = new Date(y, m - 1, d, 12, 0, 0, 0);
  base.setDate(base.getDate() + dias);
  return isoLocal(base);
}

function diasEntre(a, b) {
  const ms = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0, 0).getTime();
  };
  return Math.round((ms(b) - ms(a)) / 86400000);
}

function degrau(estagio) {
  return ESCADA.findIndex((e) => e.estagio === estagio);
}

// ------------------------------------------------------------------ argumentos

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) flags[key] = true;
      else { flags[key] = next; i++; }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

function bandeira(flags, nome, padrao) {
  if (flags[`no-${nome}`] === true) return false;
  const v = flags[nome];
  if (v === undefined) return padrao;
  if (v === true || v === 'true' || v === 'sim') return true;
  if (v === 'false' || v === 'nao' || v === 'não') return false;
  return padrao;
}

function texto(flags, nome) {
  const v = flags[nome];
  return v && v !== true ? String(v) : '';
}

function lerStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

// --------------------------------------------------------------------- config

function lerConfig({ exigir = true } = {}) {
  if (!existsSync(CONFIG_PATH)) {
    if (!exigir) return null;
    die(
      'NAO_CONFIGURADO — o Acervo ainda não existe.\n' +
      '  O setup precisa rodar antes de qualquer outro verbo.'
    );
  }
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  } catch (e) {
    return die(`Config inválida em ${CONFIG_PATH}: ${e.message}`);
  }
}

function pastas(cfg) {
  return {
    raiz: cfg.acervo,
    notas: join(cfg.acervo, 'notas'),
    archive: join(cfg.acervo, 'archive'),
  };
}

// ---------------------------------------------------------------- frontmatter

/**
 * Parser deliberadamente pequeno: o formato da Nota é nosso e é fechado.
 * Escalares `chave: valor`, mais uma lista `adiamentos:` de itens `- data: "texto"`.
 */
function parseNota(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;

  const fm = { adiamentos: [] };
  let emLista = false;

  for (const linha of m[1].split(/\r?\n/)) {
    if (!linha.trim()) continue;

    if (/^\s+-\s/.test(linha)) {
      if (!emLista) continue;
      const item = linha.trim().slice(2);
      const sep = item.indexOf(':');
      const data = sep === -1 ? '' : item.slice(0, sep).trim();
      const t = sep === -1 ? item.trim() : desaspar(item.slice(sep + 1).trim());
      fm.adiamentos.push({ data, texto: t });
      continue;
    }

    const sep = linha.indexOf(':');
    if (sep === -1) continue;
    const chave = linha.slice(0, sep).trim();
    const valor = linha.slice(sep + 1).trim();

    if (chave === 'adiamentos') {
      emLista = true;
      continue;
    }
    emLista = false;
    fm[chave] = desaspar(valor);
  }

  return { fm, corpo: m[2] };
}

function desaspar(s) {
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
    return s.slice(1, -1).replace(/\\"/g, '"');
  }
  return s;
}

function aspar(s) {
  return `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function serializarNota(fm, corpo) {
  const linhas = ['---'];
  for (const chave of ['criado', 'estagio', 'proxima', 'status']) {
    linhas.push(`${chave}: ${fm[chave]}`);
  }
  if (fm.origem) linhas.push(`origem: ${aspar(fm.origem)}`);
  if (fm.fechamento) linhas.push(`fechamento: ${aspar(fm.fechamento)}`);
  if (fm.fechado_em) linhas.push(`fechado_em: ${fm.fechado_em}`);

  if (!fm.adiamentos || fm.adiamentos.length === 0) {
    linhas.push('adiamentos: []');
  } else {
    linhas.push('adiamentos:');
    for (const a of fm.adiamentos) linhas.push(`  - ${a.data}: ${aspar(a.texto)}`);
  }

  linhas.push('---', '');
  return linhas.join('\n') + corpo.replace(/^\n+/, '');
}

function tituloDe(corpo, arquivo) {
  const m = corpo.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : basename(arquivo, '.md');
}

// ------------------------------------------------------------------- o acervo

function carregar(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const caminho = join(dir, f);
      const parsed = parseNota(readFileSync(caminho, 'utf8'));
      if (!parsed) return null;
      return { arquivo: f, caminho, titulo: tituloDe(parsed.corpo, f), ...parsed };
    })
    .filter(Boolean);
}

function acervoInteiro(cfg) {
  const p = pastas(cfg);
  return [...carregar(p.notas), ...carregar(p.archive)];
}

function naParede(n) {
  return n.fm.status === 'fila' && n.fm.estagio === PAREDE && n.fm.proxima <= hoje();
}

function vencidas(cfg) {
  const p = pastas(cfg);
  const hj = hoje();
  return carregar(p.notas)
    .filter((n) => n.fm.status === 'fila' && n.fm.proxima <= hj)
    .sort((a, b) => {
      const pa = naParede(a) ? 0 : 1;
      const pb = naParede(b) ? 0 : 1;
      if (pa !== pb) return pa - pb; // Parede primeiro, sempre.
      return a.fm.proxima.localeCompare(b.fm.proxima);
    });
}

function acharNota(cfg, ref) {
  const p = pastas(cfg);
  const alvo = basename(ref);
  for (const dir of [p.notas, p.archive]) {
    const direto = join(dir, alvo);
    if (existsSync(direto)) return { caminho: direto, dir };
  }
  const parcial = alvo.replace(/\.md$/, '');
  for (const dir of [p.notas, p.archive]) {
    if (!existsSync(dir)) continue;
    const hit = readdirSync(dir).find((f) => f.endsWith('.md') && f.includes(parcial));
    if (hit) return { caminho: join(dir, hit), dir };
  }
  return die(`Nota não encontrada: ${ref}`);
}

function slugificar(t) {
  const s = t
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
  return s || 'nota';
}

// ----------------------------------------------------------------------- git

function git(cfg, args, { silencioso = false } = {}) {
  const r = spawnSync('git', ['-C', cfg.acervo, ...args], { encoding: 'utf8' });
  if (!silencioso && r.status !== 0 && r.stderr) process.stderr.write(r.stderr);
  return r;
}

function temRemote(cfg) {
  const r = git(cfg, ['remote'], { silencioso: true });
  return r.status === 0 && r.stdout.trim().length > 0;
}

// ================================================================== comandos

function cmdSetup(flags) {
  const bruto = texto(flags, 'path');
  if (!bruto) die('setup exige --path <dir>');

  const acervo = resolve(bruto.replace(/^~(?=[/\\]|$)/, HOME));
  const usarGit = bandeira(flags, 'git', true);
  const usarHook = bandeira(flags, 'hook', true);

  const p = { raiz: acervo, notas: join(acervo, 'notas'), archive: join(acervo, 'archive') };
  for (const dir of [p.raiz, p.notas, p.archive]) mkdirSync(dir, { recursive: true });

  const readme = join(acervo, 'README.md');
  if (!existsSync(readme)) {
    writeFileSync(readme, [
      '# Acervo',
      '',
      'Notas do `dont-let-me-forget`. `notas/` é a fila viva; `archive/` guarda o que foi',
      'agido ou arquivado. **Nada aqui é apagado por automação** — exclusão é sempre manual.',
      '',
      'A escada é 1d → 3d → 1w → 2w → 4w. No 4w está a Parede: ali só se age ou se arquiva.',
      '',
      `Config desta máquina: \`${CONFIG_PATH}\``,
      '',
    ].join('\n'), 'utf8');
  }

  writeFileSync(
    CONFIG_PATH,
    JSON.stringify({ acervo, git: usarGit, hook: usarHook }, null, 2) + '\n',
    'utf8'
  );

  console.log(`✓ Acervo em ${acervo}`);
  console.log(`✓ Config em ${CONFIG_PATH}`);

  const cfg = { acervo, git: usarGit, hook: usarHook };

  if (usarGit) {
    if (!existsSync(join(acervo, '.git'))) {
      const r = git(cfg, ['init', '-q']);
      console.log(r.status === 0
        ? '✓ git init'
        : '! git init falhou — o Acervo funciona, mas sem versionamento');
    } else {
      console.log('· já era um repositório git');
    }
    if (!temRemote(cfg)) {
      console.log('· sem remote. Para criar o privado no GitHub, de dentro do Acervo:');
      console.log('    gh repo create --private --source . --remote origin');
    }
  }

  if (usarHook) instalarHook(texto(flags, 'script-path'));
  else console.log('· lembrete não instalado (--no-hook)');
}

function instalarHook(scriptPathFlag) {
  const scriptPath = scriptPathFlag || CANONICAL_SCRIPT;

  if (!existsSync(SETTINGS_PATH)) {
    console.log(`! ${SETTINGS_PATH} não existe — lembrete não instalado.`);
    return;
  }

  let settings;
  try {
    settings = JSON.parse(readFileSync(SETTINGS_PATH, 'utf8'));
  } catch (e) {
    console.log(`! settings.json não é JSON válido (${e.message}) — não vou tocar nele.`);
    return;
  }

  settings.hooks = settings.hooks || {};
  const lista = Array.isArray(settings.hooks.SessionStart) ? settings.hooks.SessionStart : [];

  if (JSON.stringify(lista).includes(HOOK_MARKER)) {
    console.log('· lembrete já estava instalado no SessionStart');
    return;
  }

  const comando = `node "${scriptPath.replace(/\\/g, '/')}" remind 2>/dev/null || true`;
  const backup = `${SETTINGS_PATH}.dlmf-backup-${hoje()}`;
  copyFileSync(SETTINGS_PATH, backup);

  settings.hooks.SessionStart = [...lista, { hooks: [{ type: 'command', command: comando, timeout: 10 }] }];
  writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + '\n', 'utf8');

  console.log(`✓ backup:  ${backup}`);
  console.log(`✓ lembrete instalado — SessionStart passou de ${lista.length} para ${lista.length + 1} entrada(s).`);
  console.log('  acrescentado, e nada mais mudou:');
  console.log(`    + ${comando}`);

  if (!existsSync(scriptPath)) {
    console.log(`  ! ${scriptPath} ainda não existe.`);
    console.log('    Rode `node scripts/install.mjs -s dont-let-me-forget` para esse caminho passar a existir.');
  }
}

function cmdConfig(flags) {
  const cfg = lerConfig({ exigir: false });
  if (!cfg) {
    console.log(flags.json ? JSON.stringify({ configurado: false }) : 'NAO_CONFIGURADO');
    return;
  }
  const p = pastas(cfg);
  const info = {
    configurado: true,
    ...cfg,
    fila: carregar(p.notas).length,
    arquivadas: carregar(p.archive).length,
    hookInstalado: hookInstalado(),
  };
  if (flags.json) {
    console.log(JSON.stringify(info, null, 2));
    return;
  }
  console.log([
    `acervo:    ${info.acervo}`,
    `git:       ${info.git ? 'sim' : 'não'}`,
    `lembrete:  ${info.hook === false ? 'desligado no setup' : info.hookInstalado ? 'instalado' : 'AUSENTE'}`,
    `fila viva: ${info.fila}`,
    `archive:   ${info.arquivadas}`,
  ].join('\n'));
}

function cmdAdd(flags) {
  const cfg = lerConfig();
  const titulo = texto(flags, 'titulo');
  const porque = texto(flags, 'porque');

  if (!titulo) die('add exige --titulo <texto>');
  if (!porque) {
    die(
      'add exige --porque <texto>.\n' +
      '  "Por que guardei" é o campo que morre primeiro e o que mais importa:\n' +
      '  em quatro semanas ele é a única coisa que reconstrói o seu interesse de hoje.'
    );
  }

  const corpo = lerStdin().trim();
  const hj = hoje();
  const p = pastas(cfg);
  mkdirSync(p.notas, { recursive: true });

  const slug = slugificar(titulo);
  let arquivo = `${hj}-${slug}.md`;
  let n = 2;
  while (existsSync(join(p.notas, arquivo))) arquivo = `${hj}-${slug}-${n++}.md`;

  const fm = {
    criado: hj,
    estagio: ESCADA[0].estagio,
    proxima: somaDias(hj, ESCADA[0].dias),
    status: 'fila',
    origem: texto(flags, 'origem'),
    adiamentos: [],
  };

  const conteudo = [`# ${titulo}`, '', corpo, '', `**Por que guardei:** ${porque}`, ''].join('\n');
  writeFileSync(join(p.notas, arquivo), serializarNota(fm, conteudo), 'utf8');

  console.log(`✓ ${arquivo}`);
  console.log(`  volta em ${fm.proxima} (1d)`);
}

function resumo(n) {
  return {
    arquivo: n.arquivo,
    titulo: n.titulo,
    estagio: n.fm.estagio,
    proxima: n.fm.proxima,
    status: n.fm.status,
    origem: n.fm.origem || null,
    atraso: diasEntre(n.fm.proxima, hoje()),
    adiamentos: n.fm.adiamentos.length,
    parede: naParede(n),
  };
}

function linhaDeLista(n) {
  const atraso = diasEntre(n.fm.proxima, hoje());
  const marca = naParede(n) ? '▲ PAREDE  ' : '  ';
  const quando = atraso > 0 ? `${atraso}d atrasada` : atraso === 0 ? 'hoje' : `em ${-atraso}d`;
  const adiada = n.fm.adiamentos.length ? `, adiada ${n.fm.adiamentos.length}x` : '';
  return `${marca}${n.titulo}\n    ${n.arquivo}  [${n.fm.estagio}, ${quando}${adiada}]`;
}

function cmdDue(flags) {
  const cfg = lerConfig();
  const lista = vencidas(cfg);
  const parede = lista.filter(naParede);

  if (flags.json) {
    console.log(JSON.stringify({
      hoje: hoje(),
      total: lista.length,
      parede: parede.length,
      itens: lista.map(resumo),
    }, null, 2));
    return;
  }

  if (lista.length === 0) {
    console.log('Nada vencido. A fila está em dia.');
    return;
  }

  console.log(`${lista.length} vencida(s)${parede.length ? `, ${parede.length} na Parede` : ''}\n`);
  for (const n of lista) console.log(linhaDeLista(n));
}

function cmdList(flags) {
  const cfg = lerConfig();
  const p = pastas(cfg);
  const hj = hoje();
  const fila = carregar(p.notas).filter((n) => n.fm.status === 'fila');
  const arquivadas = carregar(p.archive);

  if (flags.json) {
    console.log(JSON.stringify({
      fila: fila.map(resumo),
      archive: flags.all ? arquivadas.map(resumo) : undefined,
      total_archive: arquivadas.length,
    }, null, 2));
    return;
  }

  const grupos = [
    ['VENCIDOS', fila.filter((n) => n.fm.proxima < hj)],
    ['HOJE', fila.filter((n) => n.fm.proxima === hj)],
    ['PRÓXIMOS', fila.filter((n) => n.fm.proxima > hj)],
  ];

  for (const [nome, itens] of grupos) {
    if (itens.length === 0) continue;
    console.log(`\n${nome} (${itens.length})`);
    for (const n of itens.sort((a, b) => a.fm.proxima.localeCompare(b.fm.proxima))) {
      console.log(linhaDeLista(n));
    }
  }

  if (fila.length === 0) console.log('\nA fila viva está vazia.');

  if (flags.all) {
    console.log(`\nARCHIVE (${arquivadas.length})`);
    const ord = arquivadas.sort((a, b) => (b.fm.fechado_em || '').localeCompare(a.fm.fechado_em || ''));
    for (const n of ord) {
      console.log(`  [${n.fm.status}] ${n.titulo}\n    ${n.arquivo}  ${n.fm.fechamento || ''}`);
    }
  } else {
    console.log(`\n${arquivadas.length} no archive/ — use --all para ver.`);
  }
}

function cmdRandom(flags) {
  const cfg = lerConfig();
  const todas = acervoInteiro(cfg);
  if (todas.length === 0) die('O Acervo está vazio.');

  const n = todas[Math.floor(Math.random() * todas.length)];

  if (flags.json) {
    console.log(JSON.stringify({ ...resumo(n), corpo: n.corpo }, null, 2));
    return;
  }

  const onde = n.fm.status === 'fila' ? 'na fila viva' : `no archive (${n.fm.status})`;
  console.log(`── sorteada entre ${todas.length}, ${onde} ──\n`);
  console.log(readFileSync(n.caminho, 'utf8').trimEnd());
  console.log(`\n── ${n.arquivo} ──`);
  if (n.fm.status !== 'fila') console.log(`Para trazer de volta à fila:  revive ${n.arquivo}`);
}

function cmdShow(positional) {
  const cfg = lerConfig();
  if (!positional[0]) die('show exige o nome do arquivo');
  console.log(readFileSync(acharNota(cfg, positional[0]).caminho, 'utf8'));
}

function cmdAdvance(positional, flags) {
  const cfg = lerConfig();
  if (!positional[0]) die('advance exige o nome do arquivo');

  const { caminho } = acharNota(cfg, positional[0]);
  const nota = parseNota(readFileSync(caminho, 'utf8'));
  if (!nota) die(`Frontmatter ilegível em ${caminho}`);

  if (nota.fm.status !== 'fila') {
    die(`Esta Nota está ${nota.fm.status}, fora da fila. Use revive para trazê-la de volta.`);
  }

  const i = degrau(nota.fm.estagio);
  if (i === -1) die(`Estágio desconhecido: ${nota.fm.estagio}`);
  if (i >= ESCADA.length - 1) {
    die(
      'Esta Nota está na Parede. Daqui não se adia.\n' +
      '  As saídas são `act --artefato "<o que passou a existir>"`\n' +
      '  ou `archive --motivo "<por que não presta mais>"`.'
    );
  }

  const proximo = ESCADA[i + 1];
  const hj = hoje();
  nota.fm.estagio = proximo.estagio;
  nota.fm.proxima = somaDias(hj, proximo.dias); // conta do dia da revisão, não do vencimento
  nota.fm.adiamentos.push({ data: hj, texto: texto(flags, 'nota') });

  writeFileSync(caminho, serializarNota(nota.fm, nota.corpo), 'utf8');

  console.log(`✓ adiada para ${nota.fm.proxima} (${proximo.estagio}) — ${nota.fm.adiamentos.length}º adiamento`);
  if (proximo.estagio === PAREDE) {
    console.log('  ▲ a próxima parada é a Parede: lá só se age ou se arquiva.');
  }
}

function fechar(cfg, ref, status, fechamento) {
  const { caminho, dir } = acharNota(cfg, ref);
  const nota = parseNota(readFileSync(caminho, 'utf8'));
  if (!nota) die(`Frontmatter ilegível em ${caminho}`);

  const p = pastas(cfg);
  nota.fm.status = status;
  nota.fm.fechamento = fechamento;
  nota.fm.fechado_em = hoje();

  mkdirSync(p.archive, { recursive: true });
  writeFileSync(caminho, serializarNota(nota.fm, nota.corpo), 'utf8');

  const destino = join(p.archive, basename(caminho));
  if (dir !== p.archive) renameSync(caminho, destino);
  return destino;
}

function cmdAct(positional, flags) {
  const cfg = lerConfig();
  if (!positional[0]) die('act exige o nome do arquivo');
  const artefato = texto(flags, 'artefato');
  if (!artefato) {
    die(
      'act exige --artefato <texto>: o que passou a existir agora e não existia antes.\n' +
      '  Repo criado, issue aberta, leitura feita, nota nova derivada.\n' +
      '  Se não dá para nomear, não foi agir — foi adiar, e a Nota continua na fila.'
    );
  }
  const destino = fechar(cfg, positional[0], 'agido', artefato);
  console.log(`✓ agido — ${basename(destino)} foi para archive/`);
}

function cmdArchive(positional, flags) {
  const cfg = lerConfig();
  if (!positional[0]) die('archive exige o nome do arquivo');
  const motivo = texto(flags, 'motivo');
  if (!motivo) {
    die(
      'archive exige --motivo <texto>.\n' +
      '  É o que impede você de salvar a mesma ideia daqui a três meses\n' +
      '  e redescobrir sozinho que ela não presta.'
    );
  }
  const destino = fechar(cfg, positional[0], 'arquivado', motivo);
  console.log(`✓ arquivado — ${basename(destino)} foi para archive/`);
  console.log('  nada foi apagado. Exclusão é sempre manual.');
}

function cmdRevive(positional) {
  const cfg = lerConfig();
  if (!positional[0]) die('revive exige o nome do arquivo');

  const { caminho, dir } = acharNota(cfg, positional[0]);
  const nota = parseNota(readFileSync(caminho, 'utf8'));
  if (!nota) die(`Frontmatter ilegível em ${caminho}`);
  if (nota.fm.status === 'fila') die('Esta Nota já está na fila.');

  const p = pastas(cfg);
  const hj = hoje();
  const era = nota.fm.fechamento || '—';

  nota.fm.status = 'fila';
  nota.fm.estagio = ESCADA[0].estagio;
  nota.fm.proxima = somaDias(hj, ESCADA[0].dias);
  nota.fm.adiamentos.push({ data: hj, texto: `ressuscitada do archive (era: ${era})` });
  delete nota.fm.fechamento;
  delete nota.fm.fechado_em;

  mkdirSync(p.notas, { recursive: true });
  writeFileSync(caminho, serializarNota(nota.fm, nota.corpo), 'utf8');
  if (dir !== p.notas) renameSync(caminho, join(p.notas, basename(caminho)));

  console.log(`✓ de volta à fila — volta em ${nota.fm.proxima} (1d)`);
}

/** O lembrete. Silencioso em zero; escala conforme a fila aperta. */
function cmdRemind() {
  const cfg = lerConfig({ exigir: false });
  if (!cfg) return;

  let lista;
  try {
    lista = vencidas(cfg);
  } catch {
    return;
  }
  if (lista.length === 0) return;

  const parede = lista.filter(naParede);

  if (parede.length > 0) {
    console.log(`dont-let-me-forget — ${parede.length} na PAREDE (4w): agir ou arquivar, não dá para adiar.`);
    for (const n of parede.slice(0, 5)) console.log(`  ▲ ${n.titulo}  [${n.arquivo}]`);
    const resto = lista.length - parede.length;
    console.log(resto > 0
      ? `  e mais ${resto} vencida(s).  /dont-let-me-forget-review`
      : '  /dont-let-me-forget-review');
    return;
  }

  console.log(`dont-let-me-forget — ${lista.length} vencida(s).  /dont-let-me-forget-review`);
}

function hookInstalado() {
  if (!existsSync(SETTINGS_PATH)) return false;
  try {
    const s = JSON.parse(readFileSync(SETTINGS_PATH, 'utf8'));
    return JSON.stringify(s?.hooks?.SessionStart || []).includes(HOOK_MARKER);
  } catch {
    return false;
  }
}

function cmdHookCheck() {
  const cfg = lerConfig({ exigir: false });
  if (cfg && cfg.hook === false) {
    console.log('OK — lembrete desligado por escolha no setup.');
    return;
  }
  if (hookInstalado()) {
    console.log('OK — lembrete presente no SessionStart.');
    return;
  }
  console.log('AUSENTE — o lembrete sumiu do SessionStart.');
  console.log('  Outra ferramenta que escreve nesse arquivo (o Orca escreve) pode tê-lo removido.');
  console.log(`  Reinstale:  node <dlmf.mjs> setup --path "${cfg ? cfg.acervo : '<acervo>'}" --hook`);
}

function cmdCommit(flags) {
  const cfg = lerConfig();
  if (!cfg.git) {
    console.log('· git desligado no setup — nada a commitar.');
    return;
  }
  if (!existsSync(join(cfg.acervo, '.git'))) {
    console.log('! o Acervo não é um repositório git.');
    return;
  }

  const status = git(cfg, ['status', '--porcelain'], { silencioso: true });
  if (status.status === 0 && !status.stdout.trim()) {
    console.log('· nada mudou desde o último commit.');
    return;
  }

  const msg = texto(flags, 'm') || `revisão de ${hoje()}`;
  git(cfg, ['add', '-A']);
  if (git(cfg, ['commit', '-m', msg]).status !== 0) {
    console.log('! commit falhou — os arquivos continuam na worktree.');
    return;
  }
  console.log(`✓ commit: ${msg}`);

  if (flags['no-push']) {
    console.log('· push pulado (--no-push). Sem cópia remota até você enviar.');
    return;
  }
  if (!temRemote(cfg)) {
    console.log('· sem remote — nada foi enviado.');
    console.log('    gh repo create --private --source . --remote origin');
    return;
  }
  console.log(git(cfg, ['push']).status === 0
    ? '✓ push'
    : '! push falhou — o commit está local. Sem cópia remota até você resolver.');
}

function ajuda() {
  const fonte = readFileSync(fileURLToPath(import.meta.url), 'utf8');
  const bloco = fonte.slice(fonte.indexOf('/**'), fonte.indexOf('*/'));
  console.log(bloco.split('\n').slice(1).map((l) => l.replace(/^\s*\*\s?/, '')).join('\n'));
}

// ===================================================================== main

const { positional, flags } = parseArgs(process.argv.slice(2));
const comando = positional.shift();

switch (comando) {
  case 'setup': cmdSetup(flags); break;
  case 'config': cmdConfig(flags); break;
  case 'add': cmdAdd(flags); break;
  case 'due': cmdDue(flags); break;
  case 'list': cmdList(flags); break;
  case 'random': cmdRandom(flags); break;
  case 'show': cmdShow(positional); break;
  case 'advance': cmdAdvance(positional, flags); break;
  case 'act': cmdAct(positional, flags); break;
  case 'archive': cmdArchive(positional, flags); break;
  case 'revive': cmdRevive(positional); break;
  case 'remind': cmdRemind(); break;
  case 'hook-check': cmdHookCheck(); break;
  case 'commit': cmdCommit(flags); break;
  default:
    ajuda();
    process.exit(comando ? 1 : 0);
}
