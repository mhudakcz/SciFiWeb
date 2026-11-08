/**
 * Stáhne plakáty do public/plakaty/ a zapíše mapu do src/data/plakaty.json.
 *
 * Zdroje (v tomto pořadí):
 *   1. TMDB (themoviedb.org) – jen když je v .env TMDB_TOKEN nebo TMDB_API_KEY
 *   2. Wikipedie – hlavní obrázek článku (anglická, u domácích titulů i česká)
 *
 *   npm run plakaty               stáhne chybějící
 *   npm run plakaty -- --force    stáhne znovu všechno
 *
 * Špatně spárovaný titul opravíte v src/data/plakaty-opravy.json:
 *   { "slug": { "tmdb": "movie/123" } }  nebo  { "slug": { "wiki": "en:Název článku" } }
 *   { "slug": { "vynechat": true } }     – nechat generovaný plakát
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jeCeskoslovensky, tituly } from '../src/data/index';
import type { Titul } from '../src/data/types';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'plakaty');
const mapaSoubor = join(root, 'src', 'data', 'plakaty.json');
const opravySoubor = join(root, 'src', 'data', 'plakaty-opravy.json');

const token = process.env.TMDB_TOKEN;
const apiKey = process.env.TMDB_API_KEY;
const maTmdb = Boolean(token || apiKey);
const force = process.argv.includes('--force');
const UA = 'SciFiWeb/0.1 (https://github.com/mhudakcz/SciFiWeb)';

type Druh = 'movie' | 'tv';
interface Zaznam {
  soubor: string;
  /** Oprava, podle které se plakát stáhl – při její změně se stáhne znovu. */
  podle?: string;
  zdroj: string;
  nazev: string;
  /** Obrázek na šířku (titulek seriálu, britský plakát) – zobrazí se celý na rozmazaném pozadí. */
  naSirku?: boolean;
}
interface Oprava {
  tmdb?: string;
  wiki?: string;
  vynechat?: boolean;
}
interface Plakat {
  url: string;
  naSirku?: boolean;
  zdroj: string;
  nazev: string;
}

const mapa: Record<string, Zaznam> = existsSync(mapaSoubor) ? JSON.parse(readFileSync(mapaSoubor, 'utf8')) : {};
const opravy: Record<string, Oprava> = existsSync(opravySoubor) ? JSON.parse(readFileSync(opravySoubor, 'utf8')) : {};

const druhTitulu = (t: Titul): Druh =>
  t.typ === 'film' || (t.typ === 'animace' && t.rokDo === undefined) ? 'movie' : 'tv';

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// ——— TMDB ———
async function tmdb(cesta: string, params: Record<string, string | number> = {}) {
  const url = new URL(`https://api.themoviedb.org/3/${cesta}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  if (apiKey && !token) url.searchParams.set('api_key', apiKey);
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) throw new Error(`TMDB ${res.status} ${url.pathname}`);
  return res.json();
}

async function zTmdb(t: Titul, oprava?: Oprava): Promise<Plakat | null> {
  let druh = druhTitulu(t);
  let id: number | undefined;
  if (oprava?.tmdb) {
    const [d, i] = oprava.tmdb.split('/');
    druh = d as Druh;
    id = Number(i);
  } else {
    const rokParam = druh === 'movie' ? 'year' : 'first_air_date_year';
    for (const d of [
      { query: t.original ?? t.nazev, [rokParam]: t.rok },
      { query: t.nazev, language: 'cs-CZ', [rokParam]: t.rok },
    ]) {
      const r = await tmdb(`search/${druh}`, d);
      if (r.results?.length) {
        id = r.results[0].id;
        break;
      }
    }
  }
  if (!id) return null;
  const detail = await tmdb(`${druh}/${id}`, { language: 'cs-CZ' });
  const obrazky = await tmdb(`${druh}/${id}/images`, { include_image_language: 'cs,en,null' });
  const cesta =
    ['cs', 'en', null]
      .map((jazyk) => obrazky.posters?.find((p: { iso_639_1: string | null }) => p.iso_639_1 === jazyk))
      .find(Boolean)?.file_path ?? detail.poster_path;
  if (!cesta) return null;
  return { url: `https://image.tmdb.org/t/p/w500${cesta}`, zdroj: `tmdb:${druh}/${id}`, nazev: detail.title ?? detail.name };
}

// ——— Wikipedie ———
async function wiki(jazyk: string, params: Record<string, string>) {
  const url = new URL(`https://${jazyk}.wikipedia.org/w/api.php`);
  for (const [k, v] of Object.entries({ format: 'json', formatversion: '2', ...params })) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Wikipedie ${res.status}`);
  return res.json();
}

/** Stránka → URL obrázku na výšku (plakát, obal), nebo null. */
async function obrazekStranky(jazyk: string, page: { title: string; pageprops?: Record<string, string> }) {
  const soubor = page.pageprops?.page_image ?? page.pageprops?.page_image_free;
  if (!soubor || /.svg$/i.test(soubor)) return null; // SVG bývají loga
  const r = await wiki(jazyk, { action: 'query', titles: `File:${soubor}`, prop: 'imageinfo', iiprop: 'url|size', iiurlwidth: '500' });
  const info = r.query?.pages?.[0]?.imageinfo?.[0];
  if (!info) return null;
  return { url: info.thumburl ?? info.url, naSirku: info.height < info.width * 1.15 };
}

async function zWikipedie(t: Titul, oprava?: Oprava): Promise<Plakat | null> {
  const kandidati: { jazyk: string; dotaz?: string; titul?: string; jmeno: string }[] = [];
  if (oprava?.wiki) {
    const [jazyk, ...rest] = oprava.wiki.split(':');
    kandidati.push({ jazyk, titul: rest.join(':'), jmeno: '' });
  } else {
    const druh = druhTitulu(t) === 'movie' ? 'film' : t.typ === 'animace' ? 'animated series' : 'TV series';
    const jmeno = t.original && /^[\p{Script=Latin}\d\s\p{P}]+$/u.test(t.original) ? t.original : t.nazev;
    if (jeCeskoslovensky(t)) kandidati.push({ jazyk: 'cs', dotaz: `${t.nazev} ${t.rok}`, jmeno: t.nazev });
    kandidati.push({ jazyk: 'en', dotaz: `${jmeno} ${t.rok} ${druh}`, jmeno });
    if (jmeno !== t.nazev) kandidati.push({ jazyk: 'en', dotaz: `${t.nazev} ${t.rok} ${druh}`, jmeno: t.nazev });
  }

  for (const k of kandidati) {
    const r = k.titul
      ? await wiki(k.jazyk, { action: 'query', titles: k.titul, prop: 'pageprops', redirects: '1' })
      : await wiki(k.jazyk, {
          action: 'query',
          generator: 'search',
          gsrsearch: k.dotaz!,
          gsrlimit: '6',
          prop: 'pageprops',
        });
    const stranky: { title: string; index?: number; pageprops?: Record<string, string> }[] = (r.query?.pages ?? []).sort(
      (a: { index?: number }, b: { index?: number }) => (a.index ?? 0) - (b.index ?? 0),
    );
    // U vyhledávání bereme jen článek, jehož název odpovídá titulu
    const hledany = norm(k.jmeno);
    const jinyDruh = /\([^)]*\b(album|score|soundtrack|character|novel|comics?|manga|video game|song|franchise|book|board game)\b[^)]*\)|: The Animated Series/i;
    const vhodne = k.titul
      ? stranky
      : stranky.filter(
          (p) => !jinyDruh.test(p.title) && (norm(p.title) === hledany || norm(p.title).startsWith(`${hledany} `)),
        );
    for (const p of vhodne) {
      const obr = await obrazekStranky(k.jazyk, p);
      if (obr) return { ...obr, zdroj: `wiki:${k.jazyk}:${p.title}`, nazev: p.title };
    }
  }
  return null;
}

async function stahni(t: Titul): Promise<string> {
  const oprava = opravy[t.slug];
  const stary = mapa[t.slug];
  if (oprava?.vynechat) {
    if (stary) rmSync(join(root, 'public', stary.soubor), { force: true });
    delete mapa[t.slug];
    return 'vynecháno';
  }
  const podle = oprava ? JSON.stringify(oprava) : undefined;
  if (!force && stary && stary.podle === podle && existsSync(join(root, 'public', stary.soubor))) return 'přeskočeno';

  let plakat: Plakat | null = null;
  // TMDB má přednost; opravy pro Wikipedii platí jen pro záložní hledání tam
  if (maTmdb) plakat = await zTmdb(t, oprava);
  if (!plakat) plakat = await zWikipedie(t, oprava);
  if (!plakat) {
    // Oprava nic nenašla – zahodíme i dřívější (špatný) plakát
    if (oprava && stary) {
      rmSync(join(root, 'public', stary.soubor), { force: true });
      delete mapa[t.slug];
    }
    return 'nenalezeno';
  }

  const img = await fetch(plakat.url, { headers: { 'User-Agent': UA } });
  if (!img.ok) throw new Error(`obrázek ${img.status}`);
  const typ = img.headers.get('content-type') ?? '';
  const pripona = typ.includes('png') ? 'png' : typ.includes('webp') ? 'webp' : 'jpg';
  if (stary) rmSync(join(root, 'public', stary.soubor), { force: true });
  const soubor = `/plakaty/${t.slug}.${pripona}`;
  writeFileSync(join(root, 'public', soubor), Buffer.from(await img.arrayBuffer()));
  mapa[t.slug] = { soubor, zdroj: plakat.zdroj, nazev: plakat.nazev, ...(plakat.naSirku && { naSirku: true }), ...(podle && { podle }) };
  return 'ok';
}

mkdirSync(outDir, { recursive: true });
console.log(maTmdb ? 'Zdroje: TMDB → Wikipedie' : 'Zdroje: Wikipedie (TMDB token není nastaven)');
const souhrn: Record<string, number> = {};
for (const t of tituly) {
  let stav: string;
  try {
    stav = await stahni(t);
  } catch (e) {
    stav = `chyba: ${(e as Error).message}`;
  }
  const klic = stav.split(':')[0];
  souhrn[klic] = (souhrn[klic] ?? 0) + 1;
  const m = mapa[t.slug];
  console.log(`${stav.padEnd(11)} ${t.nazev} (${t.rok})${m ? `  →  ${m.zdroj}` : ''}`);
}

writeFileSync(mapaSoubor, JSON.stringify(mapa, null, 2) + '\n');
console.log('\nSouhrn:', souhrn);
