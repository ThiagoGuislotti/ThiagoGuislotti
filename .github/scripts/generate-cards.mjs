// Importa os fetchers do github-readme-stats clonado em /tmp/grs pelo workflow.
// O token PAT_1 é lido automaticamente pelo retryer interno a partir do env.
import { fetchStats } from '/tmp/grs/src/fetchers/stats-fetcher.js';
import { renderStatsCard } from '/tmp/grs/src/cards/stats-card.js';
import { fetchTopLanguages } from '/tmp/grs/src/fetchers/top-langs-fetcher.js';
import { renderTopLanguages } from '/tmp/grs/src/cards/top-languages-card.js';
import { writeFileSync, mkdirSync } from 'fs';

const username = 'ThiagoGuislotti';

// Garante que a pasta de saída existe antes de escrever os SVGs
mkdirSync('dist', { recursive: true });

// --- Stats card ---
// count_private: inclui contribuições em repositórios privados
// include_all_commits: conta todos os commits do histórico, não só o ano atual
const stats = await fetchStats(username, {
  count_private: true,
  include_all_commits: true,
});

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