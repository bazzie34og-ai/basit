/**
 * "Wand lines": the fan-shaped stripes a hot-water extraction wand leaves on a carpet.
 * Each lane is one path made of soft ")" arcs, so when it draws in (stroke-dashoffset)
 * it travels along the lane like a wand pass. Seeded, so every build is identical.
 */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export interface WandOpts {
  width: number;
  height: number;
  lanes: number;
  seed?: number;
  /** arc spacing as a share of lane height */
  step?: number;
  /** gap between lanes as a share of lane height */
  gap?: number;
}

export function wandPaths({ width, height, lanes, seed = 7, step = 0.3, gap = 0.12 }: WandOpts): string[] {
  const r = rng(seed);
  const laneH = height / (lanes + gap * (lanes - 1));
  const out: string[] = [];
  for (let l = 0; l < lanes; l++) {
    const y0 = l * laneH * (1 + gap);
    const y1 = y0 + laneH;
    const dir = l % 2 === 0 ? 1 : -1; // wand passes alternate direction
    let x = -laneH * 0.4 + r() * laneH * step;
    const parts: string[] = [];
    while (x < width + laneH * 0.4) {
      const bow = laneH * (0.22 + r() * 0.08) * dir;
      const j = () => (r() - 0.5) * laneH * 0.04;
      const a = (n: number) => n.toFixed(1);
      parts.push(`M${a(x + j())} ${a(y0 + laneH * 0.04)}C${a(x + bow)} ${a(y0 + laneH * 0.32)} ${a(x + bow)} ${a(y1 - laneH * 0.32)} ${a(x + j())} ${a(y1 - laneH * 0.04)}`);
      x += laneH * step * (0.85 + r() * 0.3);
    }
    out.push(parts.join(''));
  }
  return out;
}
