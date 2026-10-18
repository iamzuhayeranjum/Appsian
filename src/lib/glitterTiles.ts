// Seeded PRNG: mulberry32
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createGlitterTile(seed: number): string {
  if (typeof document === 'undefined') return '';
  const width = 260;
  const height = 140;
  const dpr = 2;

  const canvas = document.createElement('canvas');
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const rand = mulberry32(seed);

  const numSparkles = 9; // 9 sparkles per tile
  const padding = 6;

  for (let i = 0; i < numSparkles; i++) {
    const x = padding + rand() * (width - padding * 2);
    const y = padding + rand() * (height - padding * 2);
    const alpha = 0.30 + rand() * 0.25; // 0.30 to 0.55
    const isStar = rand() > 0.6; // 40% stars, 60% dots

    if (!isStar) {
      // 60% DOTS: rgba(125,185,248, a), radius 0.7 to 1.5px
      const radius = 0.7 + rand() * 0.8;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
      grad.addColorStop(0, `rgba(125, 185, 248, ${alpha})`);
      grad.addColorStop(1, 'rgba(125, 185, 248, 0)');

      ctx.beginPath();
      ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    } else {
      // 40% STARS: size 3 to 6px, thin lines 0.8px, rgba(90,169,245, a) with tiny white center dot
      const size = 3 + rand() * 3;
      const armLength = size * 2;
      const thickness = 0.8;

      ctx.save();

      // Horizontal ray
      const hGrad = ctx.createLinearGradient(x - armLength, y, x + armLength, y);
      hGrad.addColorStop(0, 'rgba(90, 169, 245, 0)');
      hGrad.addColorStop(0.5, `rgba(90, 169, 245, ${alpha})`);
      hGrad.addColorStop(1, 'rgba(90, 169, 245, 0)');
      ctx.fillStyle = hGrad;
      ctx.fillRect(x - armLength, y - thickness / 2, armLength * 2, thickness);

      // Vertical ray
      const vGrad = ctx.createLinearGradient(x, y - armLength, x, y + armLength);
      vGrad.addColorStop(0, 'rgba(90, 169, 245, 0)');
      vGrad.addColorStop(0.5, `rgba(90, 169, 245, ${alpha})`);
      vGrad.addColorStop(1, 'rgba(90, 169, 245, 0)');
      ctx.fillStyle = vGrad;
      ctx.fillRect(x - thickness / 2, y - armLength, thickness, armLength * 2);

      // Tiny white centre dot
      ctx.beginPath();
      ctx.arc(x, y, 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, alpha * 1.4)})`;
      ctx.fill();

      ctx.restore();
    }
  }

  return canvas.toDataURL('image/png');
}

let initialized = false;

export function initGlitterTiles(): void {
  if (initialized || typeof document === 'undefined') return;
  try {
    const tileA = createGlitterTile(1337);
    const tileB = createGlitterTile(4242);
    if (tileA && tileB) {
      document.documentElement.style.setProperty('--gl-a', `url("${tileA}")`);
      document.documentElement.style.setProperty('--gl-b', `url("${tileB}")`);
      initialized = true;
    }
  } catch (err) {
    console.error('Failed to initialize glitter tiles', err);
  }
}
