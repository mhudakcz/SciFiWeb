import { filmy } from './filmy';
import { serialy } from './serialy';
import { rodinneACeske } from './rodinne-a-ceske';
import { dalsi } from './dalsi';
import { vlna2Klasiky } from './vlna2-klasiky';
import { vlna2Osmdesatky } from './vlna2-osmdesatky';
import { vlna2Moderni } from './vlna2-moderni';
import { vlna2Serialy } from './vlna2-serialy';
import { subzanry, subzanrBySlug } from './subzanry';
import { fransizy, fransizaBySlug } from './fransizy';
import type { Nalada, Titul, Typ } from './types';

export { subzanry, subzanrBySlug, fransizy, fransizaBySlug };
export type * from './types';

export const tituly: Titul[] = [
  ...filmy,
  ...serialy,
  ...rodinneACeske,
  ...dalsi,
  ...vlna2Klasiky,
  ...vlna2Osmdesatky,
  ...vlna2Moderni,
  ...vlna2Serialy,
].sort(
  (a, b) => a.rok - b.rok || a.nazev.localeCompare(b.nazev, 'cs'),
);

export const titulBySlug = Object.fromEntries(tituly.map((t) => [t.slug, t]));

export const typy: Record<Typ, { nazev: string; mnozne: string; zkratka: string }> = {
  film: { nazev: 'Film', mnozne: 'Filmy', zkratka: 'FILM' },
  serial: { nazev: 'Seriál', mnozne: 'Seriály', zkratka: 'TV' },
  mini: { nazev: 'Miniseriál', mnozne: 'Miniseriály', zkratka: 'MINI' },
  animace: { nazev: 'Animace / anime', mnozne: 'Animace a anime', zkratka: 'ANIM' },
};

export const nalady: Record<Nalada, { nazev: string; ikona: string; popis: string }> = {
  mozek: { nazev: 'K zamyšlení', ikona: '🧠', popis: 'Chci, aby mi to vrtalo hlavou ještě týden.' },
  akce: { nazev: 'Akce', ikona: '💥', popis: 'Výbuchy, honičky, adrenalin.' },
  strach: { nazev: 'Strach', ikona: '👽', popis: 'Chci se bát a zhasnout světla.' },
  smich: { nazev: 'Smích', ikona: '😂', popis: 'Něco vtipného a odlehčeného.' },
  epos: { nazev: 'Epická jízda', ikona: '🚀', popis: 'Velké světy a ještě větší příběhy.' },
  srdce: { nazev: 'Pro srdce', ikona: '💜', popis: 'Něco dojemného, co zahřeje.' },
};

export interface Era {
  slug: string;
  nazev: string;
  roky: string;
  od: number;
  do: number;
  popis: string;
}

export const ery: Era[] = [
  { slug: 'zlaty-vek', nazev: 'Zlatý věk', roky: 'do 1965', od: 0, do: 1965, popis: 'Rakety, létající talíře a atomový strach. Odtud všechno začalo.' },
  { slug: 'nova-vlna', nazev: 'Nová vlna', roky: '1966–1979', od: 1966, do: 1979, popis: 'Sci-fi dospělo. Kubrick, Tarkovskij, první Star Trek i Star Wars.' },
  { slug: 'vhs', nazev: 'Éra VHS', roky: '1980–1994', od: 1980, do: 1994, popis: 'Blockbustery, kyborgové, neony a kazety z půjčovny.' },
  { slug: 'digital', nazev: 'Digitální zlom', roky: '1995–2009', od: 1995, do: 2009, popis: 'Matrix, anime, CGI a zlatá éra televizních seriálů.' },
  { slug: 'streaming', nazev: 'Éra streamingu', roky: '2010–dnes', od: 2010, do: 9999, popis: 'Velkolepé adaptace, Netflix, Disney+ a binge-watching.' },
];

export const eraTitulu = (t: Titul) => ery.find((e) => t.rok >= e.od && t.rok <= e.do)!;

export const jeCeskoslovensky = (t: Titul) => /Českosloven|Česk|Slovensk/.test(t.zeme);

export const rokyTitulu = (t: Titul) => {
  if (t.rokDo === undefined) return String(t.rok);
  if (t.rokDo === null) return `${t.rok}–dosud`;
  return t.rokDo === t.rok ? String(t.rok) : `${t.rok}–${t.rokDo}`;
};

export const dekada = (t: Titul) => Math.floor(t.rok / 10) * 10;

/** Deterministický pseudonáhodný generátor ze slugu – plakáty vypadají pokaždé stejně. */
export function hashSlug(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function podobne(t: Titul, kolik = 6) {
  return tituly
    .filter((o) => o.slug !== t.slug)
    .map((o) => ({
      o,
      skore:
        (o.fransiza && o.fransiza === t.fransiza ? 5 : 0) +
        o.subzanry.filter((s) => t.subzanry.includes(s)).length * 2 +
        o.nalady.filter((n) => t.nalady.includes(n)).length,
    }))
    .sort((a, b) => b.skore - a.skore || a.o.rok - b.o.rok)
    .slice(0, kolik)
    .map((x) => x.o);
}
