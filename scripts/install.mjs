#!/usr/bin/env node
/**
 * Instala as skills deste repositório e as fontes de terceiros declaradas
 * em skills.manifest.json, delegando a instalação ao CLI `skills`
 * (https://github.com/vercel-labs/skills).
 *
 * Uso:
 *   node scripts/install.mjs                 skills/ + preview/ + tudo do manifesto
 *   node scripts/install.mjs --mine          só as minhas (loop de desenvolvimento)
 *   node scripts/install.mjs -s <nome>...    só as skills nomeadas (inclusive de lab/)
 *   node scripts/install.mjs -a <agente>...  sobrescreve os agentes do manifesto
 *   node scripts/install.mjs --list          mostra o que existe, sem instalar
 *   node scripts/install.mjs --dry-run       imprime os comandos, sem executar
 *   node scripts/install.mjs --share         o comando para os outros instalarem preview/
 */

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STABLE_DIR = join(REPO_ROOT, 'skills');
const PREVIEW_DIR = join(REPO_ROOT, 'preview');
const LAB_DIR = join(REPO_ROOT, 'lab');
const MANIFEST_PATH = join(REPO_ROOT, 'skills.manifest.json');

/** O repositório, do jeito que um terceiro o endereça. Ver ADR-0005. */
const REPO_PUBLICO = 'https://github.com/daniel-bernardino747/skills';

// ---------------------------------------------------------------- argumentos

function parseArgs(argv) {
  const opts = { mine: false, list: false, dryRun: false, share: false, skills: [], agents: [] };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const collect = (into) => {
      while (i + 1 < argv.length && !argv[i + 1].startsWith('-')) into.push(argv[++i]);
    };

    switch (arg) {
      case '--mine':
        opts.mine = true;
        break;
      case '--list':
        opts.list = true;
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--share':
        opts.share = true;
        break;
      case '-s':
      case '--skill':
        collect(opts.skills);
        break;
      case '-a':
      case '--agent':
        collect(opts.agents);
        break;
      case '-h':
      case '--help':
        opts.help = true;
        break;
      default:
        die(`Argumento desconhecido: ${arg}\nRode com --help para ver o uso.`);
    }
  }

  return opts;
}

function usage() {
  console.log(
    [
      '',
      'Instala as skills deste repositório e as fontes do manifesto.',
      '',
      '  node scripts/install.mjs                 skills/ + preview/ + manifesto',
      '  node scripts/install.mjs --mine          só as minhas (loop de desenvolvimento)',
      '  node scripts/install.mjs -s <nome>...    só as skills nomeadas (inclusive lab/)',
      '  node scripts/install.mjs -a <agente>...  sobrescreve os agentes do manifesto',
      '  node scripts/install.mjs --list          mostra o que existe, sem instalar',
      '  node scripts/install.mjs --dry-run       imprime os comandos, sem executar',
      '  node scripts/install.mjs --share         o comando para os outros instalarem preview/',
      '',
    ].join('\n')
  );
}

// -------------------------------------------------------------------- helpers

function die(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

/** Nomes de pasta em `dir` que contêm um SKILL.md. */
function localSkills(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(dir, e.name, 'SKILL.md')))
    .map((e) => e.name)
    .sort();
}

function readManifest() {
  if (!existsSync(MANIFEST_PATH)) die(`Manifesto não encontrado: ${MANIFEST_PATH}`);

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (error) {
    die(`Manifesto inválido (${MANIFEST_PATH}): ${error.message}`);
  }

  if (!Array.isArray(manifest.agents) || manifest.agents.length === 0) {
    die('Manifesto sem `agents`. Declare ao menos um agente-alvo.');
  }
  if (!Array.isArray(manifest.sources)) {
    die('Manifesto sem `sources`. Use `"sources": []` se ainda não há fontes de terceiros.');
  }

  for (const entry of manifest.sources) {
    if (!entry?.source) die('Toda entrada de `sources` precisa de um campo `source`.');
    const list = entry.skills;
    const ok = list === '*' || (Array.isArray(list) && list.length > 0);
    if (!ok) die(`Fonte "${entry.source}": \`skills\` deve ser "*" ou uma lista não vazia.`);
  }

  return manifest;
}

/**
 * Caminho do CLI `skills` instalado como dependência.
 * Resolvemos por arquivo, e não pelo PATH, porque o bin deste pacote também
 * se chama `skills` — buscar pelo PATH poderia chamar a nós mesmos.
 */
function resolveSkillsCli() {
  const require = createRequire(import.meta.url);
  const candidates = [];

  try {
    candidates.push(require.resolve('skills/bin/cli.mjs'));
  } catch {
    // exports restritos ou pacote ausente; tentamos o caminho direto abaixo
  }
  candidates.push(join(REPO_ROOT, 'node_modules', 'skills', 'bin', 'cli.mjs'));

  const found = candidates.find((path) => existsSync(path));
  if (!found) {
    die(
      'CLI `skills` não encontrado.\n' +
        `  Rode \`npm install\` em ${REPO_ROOT} e tente de novo.`
    );
  }
  return found;
}

// ----------------------------------------------------------------- instalação

function buildTasks(manifest, opts) {
  const stable = localSkills(STABLE_DIR);
  const preview = localSkills(PREVIEW_DIR);
  const lab = localSkills(LAB_DIR);
  const wanted = opts.skills;
  const tasks = [];

  const addLocal = (dir, label, names) => {
    if (names.length > 0) tasks.push({ label, source: dir, skills: names });
  };

  if (wanted.length === 0) {
    addLocal(STABLE_DIR, 'skills/ (minhas)', stable);
    // preview/ também é minha, e vai junto: pedir teste do que eu não rodo é ruim.
    addLocal(PREVIEW_DIR, 'preview/ (em teste)', preview);
    if (!opts.mine) {
      for (const entry of manifest.sources) {
        tasks.push({ label: entry.source, source: entry.source, skills: entry.skills });
      }
    }
    return tasks;
  }

  // Com -s: resolve em skills/, depois preview/, depois lab/, depois no manifesto.
  const unresolved = new Set(wanted);
  const take = (names) => names.filter((name) => unresolved.delete(name));

  addLocal(STABLE_DIR, 'skills/ (minhas)', take(stable));
  addLocal(PREVIEW_DIR, 'preview/ (em teste)', take(preview));
  addLocal(LAB_DIR, 'lab/ (experimentos)', take(lab));

  if (!opts.mine) {
    for (const entry of manifest.sources) {
      if (entry.skills === '*') continue; // não dá para saber o que "*" contém sem baixar
      const picked = entry.skills.filter((n) => unresolved.has(n));
      if (picked.length === 0) continue;
      picked.forEach((n) => unresolved.delete(n));
      tasks.push({ label: entry.source, source: entry.source, skills: picked });
    }
  }

  if (unresolved.size > 0) {
    die(
      `Não encontrei: ${[...unresolved].join(', ')}\n` +
        '  Procurei em skills/, preview/, lab/ e nas fontes do manifesto.\n' +
        '  Use --list para ver o que existe.'
    );
  }

  return tasks;
}

function commandFor(task, manifest, opts) {
  const agents = opts.agents.length > 0 ? opts.agents : manifest.agents;
  const args = ['add', task.source];

  const skillFlags = task.skills === '*' ? ['*'] : task.skills;
  for (const name of skillFlags) args.push('-s', name);
  for (const agent of agents) args.push('-a', agent);
  if (manifest.scope !== 'project') args.push('-g');
  args.push('-y');

  return args;
}

function list(manifest) {
  const show = (title, names) =>
    console.log(`\n${title}\n${names.length ? names.map((n) => `  · ${n}`).join('\n') : '  (vazio)'}`);

  show('skills/ — estáveis, instaladas por padrão', localSkills(STABLE_DIR));
  show('preview/ — em teste, instaladas por padrão e compartilháveis', localSkills(PREVIEW_DIR));
  show('lab/ — experimentos, só com -s <nome>', localSkills(LAB_DIR));

  const sources = manifest.sources.map(
    (e) => `${e.source} → ${e.skills === '*' ? 'todas' : e.skills.join(', ')}`
  );
  show('manifesto — fontes de terceiros', sources);

  console.log(`\nagentes-alvo: ${manifest.agents.join(', ')}\n`);
}

/**
 * O comando que eu entrego para outra pessoa. Aponta para a subpasta `preview/`
 * no GitHub, e não para a raiz: assim o CLI só enxerga o que está em teste, e
 * `lab/` não aparece no `-l` de quem recebeu o link. Ver ADR-0005.
 */
function share() {
  const nomes = localSkills(PREVIEW_DIR);

  if (nomes.length === 0) {
    console.log(
      '\npreview/ está vazia — não há o que compartilhar.\n' +
        '  Mova uma skill para lá primeiro:  git mv lab/<nome> preview/<nome>\n'
    );
    return;
  }

  const fonte = `${REPO_PUBLICO}/tree/main/preview`;

  console.log(`\n${nomes.length} skill(s) em teste: ${nomes.join(', ')}`);
  console.log('\nInstalar todas:\n');
  console.log(`  npx skills add ${fonte} -s '*' -g -y`);
  console.log('\nInstalar uma:\n');
  for (const nome of nomes) console.log(`  npx skills add ${fonte} -s ${nome} -g -y`);
  console.log('\nExperimentar sem instalar nada:\n');
  for (const nome of nomes) console.log(`  npx skills use ${fonte} --skill ${nome}`);
  console.log(
    '\nSem -a, o CLI pergunta quais agentes. Para um alvo fixo, acrescente -a claude-code.\n'
  );
}

// ---------------------------------------------------------------------- main

const opts = parseArgs(process.argv.slice(2));

if (opts.help) {
  usage();
  process.exit(0);
}

const manifest = readManifest();

if (opts.list) {
  list(manifest);
  process.exit(0);
}

if (opts.share) {
  share();
  process.exit(0);
}

const tasks = buildTasks(manifest, opts);

if (tasks.length === 0) {
  console.log(
    '\nNada para instalar.\n' +
      '  skills/ e preview/ estão vazias e o manifesto não declara fontes.\n' +
      '  Crie uma skill em skills/<nome>/SKILL.md ou adicione uma fonte ao manifesto.\n'
  );
  process.exit(0);
}

const cli = opts.dryRun ? null : resolveSkillsCli();
let failed = 0;

for (const task of tasks) {
  const args = commandFor(task, manifest, opts);

  if (opts.dryRun) {
    console.log(`skills ${args.join(' ')}`);
    continue;
  }

  console.log(`\n▸ ${task.label}`);
  const result = spawnSync(process.execPath, [cli, ...args], { stdio: 'inherit' });

  if (result.error) {
    console.error(`  ✗ falhou: ${result.error.message}`);
    failed++;
  } else if (result.status !== 0) {
    console.error(`  ✗ falhou com código ${result.status}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n✗ ${failed} de ${tasks.length} fonte(s) falharam.\n`);
  process.exit(1);
}

if (!opts.dryRun) console.log(`\n✓ ${tasks.length} fonte(s) instalada(s).\n`);
