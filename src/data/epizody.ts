/** Průvodci epizodami stažení z TMDB (scripts/stahni-epizody.ts). */
export interface Epizoda {
  c: number;
  nazev: string;
  original?: string;
  datum?: string;
  popis?: string;
  /** Popis je jen anglicky (český v TMDB chybí). */
  jazyk?: 'en';
}

export interface Rada {
  cislo: number;
  rok?: string;
  epizody: Epizoda[];
}

export interface Pruvodce {
  tmdb: number;
  rady: Rada[];
}

const soubory = import.meta.glob<Pruvodce>('./epizody/*.json', { eager: true, import: 'default' });

export const pruvodci: Record<string, Pruvodce> = Object.fromEntries(
  Object.entries(soubory).map(([cesta, data]) => [cesta.replace(/^.*\/(.+)\.json$/, '$1'), data]),
);

export const pocetEpizod = (p: Pruvodce) => p.rady.reduce((n, r) => n + r.epizody.length, 0);
