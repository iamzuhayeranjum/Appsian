// Seeded PRNG: mulberry32
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Creates a master glitter tile for the hero headline.
 * Size: 260 x 140 CSS px at DPR 2.
 * Sparkles are tinted pale blue with bright white center dots to remain
 * distinctly visible on white and ice-blue letterfills.
 */
function createHeadlineGlitterTile(seed: number): string {
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
    const alpha = 0.45 + rand() * 0.30; // 0.45 to 0.75 for clear visibility on white letters
    const isStar = rand() > 0.6; // 40% stars, 60% dots

    if (!isStar) {
      // 60% DOTS: rgba(125,185,248, a), radius 0.7 to 1.5px
      const radius = 0.7 + rand() * 0.8;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.2);
      grad.addColorStop(0, `rgba(125, 185, 248, ${alpha})`);
      grad.addColorStop(0.7, `rgba(90, 169, 245, ${alpha * 0.75})`);
      grad.addColorStop(1, 'rgba(125, 185, 248, 0)');

      ctx.beginPath();
      ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Tiny white core flash for fine glitter dust look
      ctx.beginPath();
      ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, alpha * 1.3)})`;
      ctx.fill();
    } else {
      // 40% STARS: size 3 to 6px, thin lines 0.8px, rgba(90,169,245, a) with tiny white center dot
      const size = 3 + rand() * 3;
      const armLength = size * 1.8;
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

      // Tiny bright white centre dot
      ctx.beginPath();
      ctx.arc(x, y, 0.75, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, alpha * 1.4)})`;
      ctx.fill();

      ctx.restore();
    }
  }

  return canvas.toDataURL('image/png');
}

/**
 * Creates a small glitter tile for buttons.
 * Size: 96 x 56 CSS px at DPR 2.
 * 6 sparkles per tile, kept >= 5px from edges.
 * 60% dots (radius 0.7 to 1.4px) and 40% tiny 4-point stars (3 to 5px).
 */
function createButtonGlitterTile(seed: number, isLightButton: boolean): string {
  if (typeof document === 'undefined') return '';
  const width = 96;
  const height = 56;
  const dpr = 2;

  const canvas = document.createElement('canvas');
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const rand = mulberry32(seed);

  const numSparkles = 6; // 6 sparkles per button tile
  const padding = 5;

  for (let i = 0; i < numSparkles; i++) {
    const x = padding + rand() * (width - padding * 2);
    const y = padding + rand() * (height - padding * 2);
    const alpha = 0.50 + rand() * 0.35; // 0.50 to 0.85
    const isStar = rand() > 0.6; // 40% stars, 60% dots

    if (!isLightButton) {
      // White sparkles for dark & blue buttons
      if (!isStar) {
        // 60% DOTS: radius 0.7 to 1.4px
        const radius = 0.7 + rand() * 0.7;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(0.7, `rgba(220, 240, 255, ${alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      } else {
        // 40% STARS: size 3 to 5px
        const size = 3 + rand() * 2;
        const armLength = size * 1.5;
        const thickness = 0.8;

        ctx.save();

        const hGrad = ctx.createLinearGradient(x - armLength, y, x + armLength, y);
        hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        hGrad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
        hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = hGrad;
        ctx.fillRect(x - armLength, y - thickness / 2, armLength * 2, thickness);

        const vGrad = ctx.createLinearGradient(x, y - armLength, x, y + armLength);
        vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        vGrad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
        vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = vGrad;
        ctx.fillRect(x - thickness / 2, y - armLength, thickness, armLength * 2);

        // Bright white center dot
        ctx.beginPath();
        ctx.arc(x, y, 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, alpha * 1.4)})`;
        ctx.fill();

        ctx.restore();
      }
    } else {
      // Blue sparkles for light / white buttons
      if (!isStar) {
        // 60% DOTS: radius 0.7 to 1.4px in pale blue
        const radius = 0.7 + rand() * 0.7;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        grad.addColorStop(0, `rgba(45, 115, 235, ${alpha})`);
        grad.addColorStop(0.7, `rgba(90, 169, 245, ${alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(45, 115, 235, 0)');

        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      } else {
        // 40% STARS: size 3 to 5px in blue with azure core
        const size = 3 + rand() * 2;
        const armLength = size * 1.5;
        const thickness = 0.8;

        ctx.save();

        const hGrad = ctx.createLinearGradient(x - armLength, y, x + armLength, y);
        hGrad.addColorStop(0, 'rgba(50, 120, 240, 0)');
        hGrad.addColorStop(0.5, `rgba(50, 120, 240, ${alpha})`);
        hGrad.addColorStop(1, 'rgba(50, 120, 240, 0)');
        ctx.fillStyle = hGrad;
        ctx.fillRect(x - armLength, y - thickness / 2, armLength * 2, thickness);

        const vGrad = ctx.createLinearGradient(x, y - armLength, x, y + armLength);
        vGrad.addColorStop(0, 'rgba(50, 120, 240, 0)');
        vGrad.addColorStop(0.5, `rgba(50, 120, 240, ${alpha})`);
        vGrad.addColorStop(1, 'rgba(50, 120, 240, 0)');
        ctx.fillStyle = vGrad;
        ctx.fillRect(x - thickness / 2, y - armLength, thickness, armLength * 2);

        // Core dot
        ctx.beginPath();
        ctx.arc(x, y, 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(25, 90, 220, ${Math.min(1.0, alpha * 1.3)})`;
        ctx.fill();

        ctx.restore();
      }
    }
  }

  return canvas.toDataURL('image/png');
}

let initialized = false;

export function initGlitterTiles(): void {
  if (initialized || typeof document === 'undefined') return;
  try {
    // Master headline tiles (260x140)
    const tileA = createHeadlineGlitterTile(1337);
    const tileB = createHeadlineGlitterTile(4242);
    if (tileA && tileB) {
      document.documentElement.style.setProperty('--gl-a', `url("${tileA}")`);
      document.documentElement.style.setProperty('--gl-b', `url("${tileB}")`);
    }

    // Button hover tiles (96x56)
    // White sparkles for dark & blue buttons
    const btnTileWA = createButtonGlitterTile(5101, false);
    const btnTileWB = createButtonGlitterTile(7717, false);
    if (btnTileWA && btnTileWB) {
      document.documentElement.style.setProperty('--btn-gl-w-a', `url("${btnTileWA}")`);
      document.documentElement.style.setProperty('--btn-gl-w-b', `url("${btnTileWB}")`);
    }

    // Blue sparkles for light / white buttons
    const btnTileBA = createButtonGlitterTile(8303, true);
    const btnTileBB = createButtonGlitterTile(9949, true);
    if (btnTileBA && btnTileBB) {
      document.documentElement.style.setProperty('--btn-gl-b-a', `url("${btnTileBA}")`);
      document.documentElement.style.setProperty('--btn-gl-b-b', `url("${btnTileBB}")`);
    }

    initialized = true;
  } catch (err) {
    console.error('Failed to initialize glitter tiles', err);
  }
}
