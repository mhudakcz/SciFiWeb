/**
 * Stáhne plakáty z TMDB (themoviedb.org) do public/plakaty/<slug>.jpg
 * a zapíše mapu do src/data/plakaty.json.
 *
 *   TMDB_TOKEN=<API Read Access Token> npm run plakaty
 *   TMDB_TOKEN=... npm run plakaty -- --force     (stáhne znovu i existující)
 *
 * Špatně spárovaný titul opravíte v src/data/tmdb-opravy.json:
 *   { "slug": { "typ": "movie" | "tv", "id": 123 } }
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tituly } from '../src/data/index';
import type { Titul } from '../src/data/types';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'plakaty');
const mapaSoubor = join(root, 'src', 'data', 'plakaty.json');
const opravySoubor = join(root, 'src', 'data', 'tmdb-opravy.json');

const token = process.env.TMDB_TOKEN;
const apiKey = process.env.TMDB_API_KEY;
if (!token && !apiKey) {
  console.error('Chybí TMDB_TOKEN (API Read Access Token) nebo TMDB_API_KEY.');
  process.exit(1);
}
const force = process.argv.includes('--force');

type Druh = 'movie' | 'tv';
interface Zaznam {
  tmdb: string;
  nazev: string;
  rok: string;
}

const mapa: Record<string, Zaznam> = existsSync(mapaSoubor) ? JSON.parse(readFileSync(mapaSoubor, 'utf8')) : {};
const opravy: Record<string, { typ: Druh; id: number }> = existsSync(opravySoubor)
  ? JSON.parse(readFileSync(opravySoubor, 'utf8'))
  : {};

async function api(cesta: string, params: Record<string, string | number> = {}) {
  const url = new URL(`https://api.themoviedb.org/3/${cesta}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  if (apiKey && !token) url.searchParams.set('api_key', apiKey);
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) throw new Error(`TMDB ${res.status} ${url.pathname}`);
  return res.json();
}

const druhTitulu = (t: Titul): Druh =>
  t.typ === 'film' || (t.typ === 'animace' && t.rokDo === undefined) ? 'movie' : 'tv';

async function najdi(t: Titul): Promise<{ druh: Druh; id: number } | null> {
  if (opravy[t.slug]) return { druh: opravy[t.slug].typ, id: opravy[t.slug].id };
  const druh = druhTitulu(t);
  const rokParam = druh === 'movie' ? 'year' : 'first_air_date_year';
  const dotazy = [
    { query: t.original ?? t.nazev, [rokParam]: t.rok },
    { query: t.nazev, language: 'cs-CZ', [rokParam]: t.rok },
    { query: t.original ?? t.nazev },
  ];
  for (const d of dotazy) {
    const r = await api(`search/${druh}`, d);
    if (r.results?.length) return { druh, id: r.results[0].id };
  }
  return null;
}

async function stahni(t: Titul) {
  const soubor = join(outDir, `${t.slug}.jpg`);
  if (!force && existsSync(soubor) && mapa[t.slug]) return 'preskoceno';

  const nalez = await najdi(t);
  if (!nalez) return 'nenalezeno';

  // Český plakát má přednost, jinak anglický, jinak bez textu
  const detail = await api(`${nalez.druh}/${nalez.id}`, { language: 'cs-CZ' });
  const obrazky = await api(`${nalez.druh}/${nalez.id}/images`, { include_image_language: 'cs,en,null' });
  const poradi = ['cs', 'en', null];
  const plakat =
    poradi.map((jazyk) => obrazky.posters?.find((p: { iso_639_1: string | null }) => p.iso_639_1 === jazyk)).find(Boolean)
      ?.file_path ?? detail.poster_path;
  if (!plakat) return 'bez plakátu';

  const img = await fetch(`https://image.tmdb.org/t/p/w500${plakat}`);
  if (!img.ok) throw new Error(`obrázek ${img.status}`);
  writeFileSync(soubor, Buffer.from(await img.arrayBuffer()));

  mapa[t.slug] = {
    tmdb: `${nalez.druh}/${nalez.id}`,
    nazev: detail.title ?? detail.name,
    rok: (detail.release_date ?? detail.first_air_date ?? '').slice(0, 4),
  };
  return 'ok';
}

mkdirSync(outDir, { recursive: true });
const souhrn: Record<string, number> = {};
for (const t of tituly) {
  let stav: string;
  try {
    stav = await stahni(t);
  } catch (e) {
    stav = `chyba: ${(e as Error).message}`;
  }
  souhrn[stav.split(':')[0]] = (souhrn[stav.split(':')[0]] ?? 0) + 1;
  const m = mapa[t.slug];
  const nesedi = m && m.rok && Math.abs(Number(m.rok) - t.rok) > 1 ? '  ⚠ jiný rok – zkontrolujte' : '';
  console.log(`${stav.padEnd(12)} ${t.nazev} (${t.rok})${m ? ` → ${m.nazev} (${m.rok}) [${m.tmdb}]` : ''}${nesedi}`);
}

writeFileSync(mapaSoubor, JSON.stringify(mapa, null, 2) + '\n');
console.log('\nSouhrn:', souhrn);
