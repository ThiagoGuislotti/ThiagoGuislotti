// Importa os fetchers do github-readme-stats clonado em /tmp/grs pelo workflow.
// O token PAT_1 é lido automaticamente pelo retryer interno a partir do env.
import { fetchStats } from '/tmp/grs/src/fetchers/stats.js';
import { renderStatsCard } from '/tmp/grs/src/cards/stats.js';
import { fetchTopLanguages } from '/tmp/grs/src/fetchers/top-languages.js';
import { renderTopLanguages } from '/tmp/grs/src/cards/top-languages.js';
import { writeFileSync, mkdirSync } from 'fs';

const username = 'ThiagoGuislotti';

// Garante que a pasta de saída existe antes de escrever os SVGs
mkdirSync('dist', { recursive: true });

// --- Stats card ---
// fetchStats(username, include_all_commits, exclude_repo, include_merged_pull_requests, ...)
// O token no env (PAT_1) garante que contribuições privadas sejam incluídas automaticamente.
// include_merged_pull_requests = true é necessário para popular totalPRsMerged e mergedPRsPercentage.
const stats = await fetchStats(
  username,
  true,   // include_all_commits — conta todos os commits do histórico
  [],     // exclude_repo — nenhum repositório excluído
  true,   // include_merged_pull_requests — habilita dados de PRs merged
);

writeFileSync(
  'dist/github-stats.svg',
  renderStatsCard(stats, {
    theme: 'midnight_purple',
    hide_border: true,
    show_icons: true,
    include_all_commits: true,
    // Exibe métricas extras: revisões, PRs merged e percentual de PRs merged
    show: ['reviews', 'prs_merged', 'prs_merged_percentage'],
  }),
);

console.log('Stats card generated');

// --- Top languages card ---
// O segundo argumento é a lista de repositórios a ignorar (vazio = nenhum)
const langs = await fetchTopLanguages(username, []);

writeFileSync(
  'dist/github-langs.svg',
  renderTopLanguages(langs, {
    theme: 'midnight_purple',
    hide_border: true,
    layout: 'compact', // layout compacto ocupa menos altura
    langs_count: 8,    // exibe até 8 linguagens
  }),
);

console.log('Languages card generated');