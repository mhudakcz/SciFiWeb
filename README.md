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

Plakáty stahuje `npm run plakaty` (Wikipedie, s tokenem v `.env` i TMDB) do `public/plakaty/`. Opravy shod jsou v `src/data/plakaty-opravy.json`. Kde plakát chybí, zobrazí se generované SVG (`src/components/Poster.astro`).
