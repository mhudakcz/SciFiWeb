# SciFiWeb

Fun průvodce světem sci-fi filmů a seriálů (sesterský projekt RetroWebu). Statický web v Astru.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # výstup do dist/
```

Push do `main` se na https://scifiwebcz.netlify.app nasadí automaticky (GitHub webhook → Netlify build hook).

## Kde jsou data

- `src/data/filmy.ts`, `serialy.ts`, `rodinne-a-ceske.ts`: tituly (přidáním položky vznikne nová stránka)
- `src/data/fransizy.ts`, `subzanry.ts`: franšízy a subžánry
- `src/data/index.ts`: éry, nálady a pomocné funkce

Záběry z filmů vybírá `npm run fotky` do `src/data/fotky.json` (jen cesty, obrázky se načítají z image.tmdb.org).

Průvodce epizodami stahuje `npm run epizody` (TMDB, seznam seriálů v `scripts/stahni-epizody.ts`) do `src/data/epizody/`.

Plakáty stahuje `npm run plakaty` (Wikipedie, s tokenem v `.env` i TMDB) do `public/plakaty/`. Opravy shod jsou v `src/data/plakaty-opravy.json`. Kde plakát chybí, zobrazí se generované SVG (`src/components/Poster.astro`).
