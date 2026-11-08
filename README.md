# SciFiWeb

Fun průvodce světem sci-fi filmů a seriálů (sesterský projekt RetroWebu). Statický web v Astru.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # výstup do dist/ (Netlify: netlify.toml)
```

## Kde jsou data

- `src/data/filmy.ts`, `serialy.ts`, `rodinne-a-ceske.ts`: tituly (přidáním položky vznikne nová stránka)
- `src/data/fransizy.ts`, `subzanry.ts`: franšízy a subžánry
- `src/data/index.ts`: éry, nálady a pomocné funkce

Plakáty jsou generované SVG (`src/components/Poster.astro`), takže nejsou potřeba žádné obrázky.
