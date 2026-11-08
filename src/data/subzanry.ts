import type { Subzanr } from './types';

export const subzanry: Subzanr[] = [
  {
    slug: 'space-opera',
    nazev: 'Space opera',
    kratce: 'Hvězdné flotily, impéria a dobrodružství napříč galaxií.',
    popis:
      'Velká dobrodružství v obřím měřítku. Vesmírné bitvy, rytíři, pašeráci, mezihvězdná impéria a planety, z nichž každá má vlastní kulturu. Space opera se nebojí patosu ani pohádkových motivů. Fyziku klidně obětuje příběhu, za to vám dá celou galaxii.',
    motiv: 'planeta',
    hue: 265,
  },
  {
    slug: 'kyberpunk',
    nazev: 'Kyberpunk',
    kratce: '„High tech, low life“ – neony, déšť, implantáty a korporace.',
    popis:
      'Města zalitá deštěm a neonem, kde technologie pokročily, ale život zůstal stejně drsný. Hackeři, kyborgové, všemocné korporace a otázka, kolik stroje ještě snese člověk, než přestane být člověkem. Žánr se zrodil v 80. letech a dodnes určuje, jak si budoucnost představujeme.',
    motiv: 'mrizka',
    hue: 300,
  },
  {
    slug: 'postapo',
    nazev: 'Postapokalypsa',
    kratce: 'Svět po konci světa. Pustiny, přeživší a nové začátky.',
    popis:
      'Jaderná válka, pandemie, ekologický kolaps, nebo prostě konec, o kterém už nikdo nemluví. Postapo zkoumá, co z civilizace zbude, když se zhroutí. Někdy jde o čistý adrenalin v pustině, jindy o tichou meditaci nad tím, co dělá člověka člověkem.',
    motiv: 'slunce',
    hue: 25,
  },
  {
    slug: 'cestovani-casem',
    nazev: 'Cestování časem',
    kratce: 'Paradoxy, smyčky a otázka „co kdyby“.',
    popis:
      'Stroj času, DeLorean, modrá policejní budka. Cestování časem je ideální hřiště pro paradoxy, zápletky jako hodinový strojek i nostalgii. Patří sem také multivesmíry a alternativní realita, tedy všechno, kde se mění samotná osnova příběhu.',
    motiv: 'spirala',
    hue: 190,
  },
  {
    slug: 'umela-inteligence',
    nazev: 'Umělá inteligence a roboti',
    kratce: 'Stroje, které myslí. A někdy cítí.',
    popis:
      'Od robota Marie z Metropolis přes HAL 9000 až po replikanty a hosty z Westworldu. Příběhy o umělé inteligenci jsou ve skutečnosti příběhy o nás: o tom, co je vědomí, co je duše a jestli stvořitel může mít navrch nad svým výtvorem.',
    motiv: 'oko',
    hue: 160,
  },
  {
    slug: 'prvni-kontakt',
    nazev: 'První kontakt a invaze',
    kratce: 'Nejsme sami. Otázka je, jestli je to dobrá zpráva.',
    popis:
      'Mimozemšťané přilétají v míru, ve válce, nebo tak nepochopitelní, že se s nimi nedá ani domluvit. Žánr osciluje mezi strachem z neznámého a nadějí, že se ve vesmíru dorozumíme lépe než mezi sebou.',
    motiv: 'talir',
    hue: 120,
  },
  {
    slug: 'dystopie',
    nazev: 'Dystopie',
    kratce: 'Společnost, ve které se něco hodně pokazilo.',
    popis:
      'Totalitní státy, dokonale optimalizované korporace, genetické kasty a sociální sítě, které hodnotí každý váš krok. Dystopie jsou varovné zrcadlo. Přehánějí to, co už se kolem nás děje, a ptají se, kam až to může dojít.',
    motiv: 'vez',
    hue: 0,
  },
  {
    slug: 'hard-sf',
    nazev: 'Hard sci-fi',
    kratce: 'Věda bere vážně. Fyzika platí i v kině.',
    popis:
      'Orbitální mechanika, relativita, život na Marsu podle skutečných čísel. Hard sci-fi staví drama na tom, co je vědecky možné nebo aspoň uvěřitelné. Napětí tu nevzniká z laserů, ale z toho, že vesmír je obrovský, chladný a k chybám nemilosrdný.',
    motiv: 'orbita',
    hue: 210,
  },
  {
    slug: 'kosmicky-horor',
    nazev: 'Kosmický horor',
    kratce: 'Ve vesmíru vás nikdo neuslyší křičet.',
    popis:
      'Temné chodby lodí, signály z neznáma a bytosti, které nechtějí mluvit, chtějí jen přežít, a to na váš úkor. Kosmický horor spojuje klaustrofobii hororu s prázdnotou vesmíru, kde žádná pomoc nepřijde.',
    motiv: 'prazdno',
    hue: 340,
  },
  {
    slug: 'genetika',
    nazev: 'Genetika a biotech',
    kratce: 'DNA, klony, mutace a život, který jsme si upravili.',
    popis:
      'Naklonovaní dinosauři, geneticky optimalizovaní lidé a mutace, které mění samotnou podstatu života. Biotechnologické sci-fi se ptá, kam až smíme zasahovat do přírody a co se stane, když příroda začne psát vlastní kód.',
    motiv: 'dna',
    hue: 95,
  },
  {
    slug: 'komedie',
    nazev: 'Sci-fi komedie',
    kratce: 'Budoucnost s nadhledem, parodií a dávkou absurdity.',
    popis:
      'Ne každá budoucnost musí být ponurá. Sci-fi komedie si dělají legraci z žánrových klišé, cestujících v čase i z nás samotných, a často tím řeknou víc než nejvážnější drama.',
    motiv: 'raketa',
    hue: 50,
  },
];

export const subzanrBySlug = Object.fromEntries(subzanry.map((s) => [s.slug, s]));
