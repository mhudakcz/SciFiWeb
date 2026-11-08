import { rokyTitulu, tituly, typy } from '../data';

export function GET() {
  const data = tituly.map((t) => ({
    s: t.slug,
    n: t.nazev,
    o: t.original ?? '',
    r: rokyTitulu(t),
    t: typy[t.typ].nazev,
  }));
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}
