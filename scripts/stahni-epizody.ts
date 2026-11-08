/**
 * Stáhne seznam epizod (názvy, data, synopse) z TMDB do src/data/epizody/<slug>.json.
 * Česká data mají přednost, chybějící názvy a popisy se doplní anglicky (s označením jazyka).
 *
 *   npm run epizody                 seriály ze seznamu SERIALY níže
 *   npm run epizody -- andor dark   jen vybrané slugy
 *
 * Potřebuje TMDB_TOKEN v .env a TMDB id seriálu v src/data/plakaty.json (zdroj „tmdb:tv/…“).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SERIALY = [
  'star-trek',
  'star-trek-nova-generace',
  'star-trek-deep-space-nine',
  'star-trek-voyager',
  'star-trek-discovery',
  'star-trek-picard',
  'star-trek-strange-new-worlds',
  'cerveny-trpaslik',
  'battlestar-galactica',
  'hvezdna-brana',
];

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'data', 'epizody');
const token = process.env.TMDB_TOKEN;
if (!token) {
  console.error('Chybí TMDB_TOKEN v .env.');
  process.exit(1);
}

const plakaty: Record<string, { zdroj: string }> = JSON.parse(readFileSync(join(root, 'src', 'data', 'plakaty.json'), 'utf8'));

async function api(cesta: string) {
  const res = await fetch(`https://api.themoviedb.org/3/${cesta}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`TMDB ${res.status} ${cesta}`);
  return res.json();
}

// TMDB u nepřeložených dílů vrací zástupný název „Epizoda 12“
const zastupny = (nazev: string | undefined) => !nazev || /^(Epizoda|Episode|Díl) \d+$/i.test(nazev.trim());

interface Epizoda {
  c: number;
  nazev: string;
  original?: string;
  datum?: string;
  popis?: string;
  jazyk?: 'en';
}

async function stahni(slug: string) {
  const zdroj = plakaty[slug]?.zdroj;
  if (!zdroj?.startsWith('tmdb:tv/')) return `přeskočeno (chybí TMDB id)`;
  const id = Number(zdroj.split('/')[1]);
  const detail = await api(`tv/${id}?language=cs-CZ`);

  const rady = [];
  for (const s of detail.seasons ?? []) {
    if (!s.season_number) continue; // řada 0 = speciály
    const [cs, en] = await Promise.all([
      api(`tv/${id}/season/${s.season_number}?language=cs-CZ`),
      api(`tv/${id}/season/${s.season_number}?language=en-US`),
    ]);
    const enPodleCisla = new Map(en.episodes.map((e: { episode_number: number }) => [e.episode_number, e]));
    const epizody: Epizoda[] = cs.episodes.map((e: any) => {
      const anglicky: any = enPodleCisla.get(e.episode_number) ?? {};
      const csNazev = zastupny(e.name) ? undefined : e.name.trim();
      const enNazev = zastupny(anglicky.name) ? undefined : anglicky.name?.trim();
      const ep: Epizoda = { c: e.episode_number, nazev: csNazev ?? enNazev ?? `Díl ${e.episode_number}` };
      if (csNazev && enNazev && csNazev !== enNazev) ep.original = enNazev;
      if (e.air_date) ep.datum = e.air_date;
      if (e.overview?.trim()) ep.popis = e.overview.trim();
      else if (anglicky.overview?.trim()) Object.assign(ep, { popis: anglicky.overview.trim(), jazyk: 'en' as const });
      return ep;
    });
    if (!epizody.length) continue;
    rady.push({ cislo: s.season_number, rok: (s.air_date ?? '').slice(0, 4) || undefined, epizody });
  }

  writeFileSync(join(outDir, `${slug}.json`), JSON.stringify({ tmdb: id, rady }, null, 1) + '\n');
  const vse = rady.flatMap((r) => r.epizody);
  const cesky = vse.filter((e) => e.popis && !e.jazyk).length;
  const en = vse.filter((e) => e.jazyk === 'en').length;
  return `${rady.length} řad, ${vse.length} dílů · popis česky ${cesky}, anglicky ${en}, bez popisu ${vse.length - cesky - en}`;
}

mkdirSync(outDir, { recursive: true });
const vybrane = process.argv.slice(2).filter((a) => !a.startsWith('-'));
for (const slug of vybrane.length ? vybrane : SERIALY) {
  try {
    console.log(`${slug.padEnd(30)} ${await stahni(slug)}`);
  } catch (e) {
    console.log(`${slug.padEnd(30)} chyba: ${(e as Error).message}`);
  }
}
if (!existsSync(outDir)) process.exit(1);
