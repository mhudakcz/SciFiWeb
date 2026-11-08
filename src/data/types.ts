export type Typ = 'film' | 'serial' | 'mini' | 'animace';

export type Nalada = 'mozek' | 'akce' | 'strach' | 'smich' | 'epos' | 'srdce';

export type Motiv =
  | 'planeta'
  | 'mrizka'
  | 'slunce'
  | 'spirala'
  | 'oko'
  | 'talir'
  | 'vez'
  | 'orbita'
  | 'prazdno'
  | 'raketa'
  | 'dna';

export interface Titul {
  slug: string;
  nazev: string;
  original?: string;
  typ: Typ;
  rok: number;
  /** Rok konce u seriálů; `null` = stále běží. */
  rokDo?: number | null;
  zeme: string;
  tvurce: string;
  delka: string;
  fransiza?: string;
  subzanry: string[];
  nalady: Nalada[];
  mustSee?: boolean;
  /** Vhodné pro děti / rodinné sledování. */
  deti?: boolean;
  perex: string;
  text: string[];
  proc: string;
}

export interface Subzanr {
  slug: string;
  nazev: string;
  kratce: string;
  popis: string;
  motiv: Motiv;
  hue: number;
}

export interface Fransiza {
  slug: string;
  nazev: string;
  od: number;
  kratce: string;
  popis: string[];
  hue: number;
}
