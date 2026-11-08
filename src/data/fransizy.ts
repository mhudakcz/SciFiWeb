import type { Fransiza } from './types';

export const fransizy: Fransiza[] = [
  {
    slug: 'star-wars',
    nazev: 'Star Wars',
    od: 1977,
    kratce: 'Předaleká galaxie, Síla a rodinná sága, která změnila kino.',
    popis: [
      'Když George Lucas v roce 1977 uvedl „Hvězdné války“, nikdo ve studiu nevěřil, že pohádka o farmáři, princezně a pašerákovi uspěje. Z filmu se stal fenomén, který vynalezl moderní blockbuster, merchandising i fanouškovskou kulturu, jak ji známe.',
      'Sága dnes zahrnuje tři filmové trilogie, samostatné filmy, animované seriály i hrané seriály pro Disney+. Ty nejlepší z nich (Mandalorian, Andor) dokazují, že předaleká galaxie unese westernové dobrodružství i dospělé politické drama.',
    ],
    hue: 45,
  },
  {
    slug: 'star-trek',
    nazev: 'Star Trek',
    od: 1966,
    kratce: 'Optimistická budoucnost, Federace a odvaha jít tam, kam se nikdo nevydal.',
    popis: [
      'Gene Roddenberry v 60. letech prodal Star Trek jako „Wagon Train ke hvězdám“. Ve skutečnosti ale vytvořil jednu z nejoptimističtějších vizí budoucnosti: lidstvo bez hladu a válek, které zkoumá vesmír z čisté zvědavosti.',
      'Následovalo přes deset seriálů a třináct filmů. Každá generace si našla svůj Star Trek, od kapitána Kirka přes Picarda po dnešní Strange New Worlds. Společné mají jedno: morální dilemata jsou tu důležitější než phaserové přestřelky.',
    ],
    hue: 210,
  },
  {
    slug: 'vetrelec',
    nazev: 'Vetřelec',
    od: 1979,
    kratce: 'Xenomorf, Ellen Ripleyová a nejděsivější tvor filmové historie.',
    popis: [
      'Vetřelec spojil B-filmovou monstrózní zápletku s artovou estetikou H. R. Gigera a výsledkem byl jeden z nejvlivnějších hororů vůbec. Každý další díl si vzal jiného režiséra a jiný žánr: Cameron natočil válečnou akci, Fincher depresivní vězeňské drama, Scott filozofické prequely.',
      'Série se dál rozrůstá o filmy jako Vetřelec: Romulus a o seriál Vetřelec: Země. Xenomorf ale nejvíc děsí pořád v originálu z roku 1979.',
    ],
    hue: 140,
  },
  {
    slug: 'terminator',
    nazev: 'Terminátor',
    od: 1984,
    kratce: 'Skynet, cestování časem a „I’ll be back“.',
    popis: [
      'Nízkorozpočtový thriller Jamese Camerona o kyborgovi z budoucnosti se stal kultem a z Arnolda Schwarzeneggera udělal ikonu. Pokračování Den zúčtování posunulo hranice digitálních efektů a dodnes patří k nejlepším akčním filmům.',
      'Další díly už takový ohlas neměly, ale otázka, kterou série položila, je dnes aktuálnější než kdy dřív: co se stane, až umělá inteligence usoudí, že lidi nepotřebuje?',
    ],
    hue: 0,
  },
  {
    slug: 'blade-runner',
    nazev: 'Blade Runner',
    od: 1982,
    kratce: 'Replikanti, déšť, neony a otázka, co je skutečně lidské.',
    popis: [
      'Volná adaptace románu Philipa K. Dicka „Sní androidi o elektrických ovečkách?“ v kinech propadla. Postupně se ale z ní stal nejvlivnější kyberpunkový film všech dob. Ridley Scott vytvořil Los Angeles roku 2019, které se dodnes kopíruje ve filmech, hrách i reklamách.',
      'Po 35 letech přišel Denis Villeneuve s pokračováním 2049. To se odvážilo být stejně pomalé, melancholické a krásné jako originál.',
    ],
    hue: 320,
  },
  {
    slug: 'duna',
    nazev: 'Duna',
    od: 1984,
    kratce: 'Arrakis, koření, písečné červy a mesiášský mýtus.',
    popis: [
      'Román Franka Herberta z roku 1965 dlouho platil za nezfilmovatelný. Jodorowsky svou verzi nikdy nedotočil, Lynchova adaptace z roku 1984 se stala kultovní kuriozitou a miniseriál z roku 2000 si našel věrné publikum.',
      'Až Denis Villeneuve dokázal Dunu převést na plátno v celé její monumentalitě. Jeho dvoudílná adaptace je dnes měřítkem toho, jak má vypadat velkolepé sci-fi.',
    ],
    hue: 35,
  },
];

export const fransizaBySlug = Object.fromEntries(fransizy.map((f) => [f.slug, f]));
