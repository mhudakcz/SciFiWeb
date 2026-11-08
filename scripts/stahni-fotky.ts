/**
 * Vybere k titulům záběry z filmu/seriálu (TMDB „backdrops“) a uloží jejich cesty
 * do src/data/fotky.json. Obrázky samotné se nestahují – web je načítá z image.tmdb.org.
 *
 *   npm run fotky              doplní chybějící tituly
 *   npm run fotky -- --force   vybere znovu u všech
 *
 * Potřebuje TMDB_TOKEN v .env a TMDB id v src/data/plakaty.json (zdroj „tmdb:…“).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tituly } from '../src/data/index';

const POCET = 6;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vystup = join(root, 'src', 'data', 'fotky.json');
const token = process.env.TMDB_TOKEN;
if (!token) {
  console.error('Chybí TMDB_TOKEN v .env.');
  process.exit(1);
}
const force = process.argv.includes('--force');

const plakaty: Record<string, { zdroj: string }> = JSON.parse(readFileSync(join(root, 'src', 'data', 'plakaty.json'), 'utf8'));
const fotky: Record<string, string[]> = existsSync(vystup) ? JSON.parse(readFileSync(vystup, 'utf8')) : {};

interface Obrazek {
  file_path: string;
  iso_639_1: string | null;
  vote_average: number;
  vote_count: number;
  width: number;
}

const souhrn = { ok: 0, preskoceno: 0, bez: 0 };
for (const t of tituly) {
  if (!force && fotky[t.slug]) {
    souhrn.preskoceno++;
    continue;
  }
  const zdroj = plakaty[t.slug]?.zdroj;
  if (!zdroj?.startsWith('tmdb:')) {
    souhrn.bez++;
    console.log(`bez TMDB    ${t.nazev}`);
    continue;
  }
  const cesta = zdroj.slice(5);
  const res = await fetch(`https://api.themoviedb.org/3/${cesta}/images?include_image_language=null`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  // Bez textu, aspoň HD, nejlépe hodnocené nahoře
  const vyber = ((data.backdrops ?? []) as Obrazek[])
    .filter((b) => b.iso_639_1 === null && b.width >= 1280)
    .sort((a, b) => b.vote_average - a.vote_average || b.vote_count - a.vote_count)
    .slice(0, POCET)
    .map((b) => b.file_path);
  if (vyber.length) {
    fotky[t.slug] = vyber;
    souhrn.ok++;
  } else {
    souhrn.bez++;
    console.log(`bez záběrů  ${t.nazev}`);
  }
}

const serazene = Object.fromEntries(Object.keys(fotky).sort().map((k) => [k, fotky[k]]));
writeFileSync(vystup, JSON.stringify(serazene, null, 1) + '\n');
console.log('Souhrn:', souhrn);
