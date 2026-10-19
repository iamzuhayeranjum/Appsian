import React, { useEffect, useRef, useState } from 'react';

interface HeroCurtainBackgroundProps {
  uDrift?: number;
  uWaveAmp?: number;
  uWaveSpeed?: number;
}

const VERTEX_SHADER_SRC = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time;
uniform float u_drift;
uniform float u_waveAmp;
uniform float u_waveSpeed;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float pdist(float a, float b) { return abs(fract(a - b + 0.5) - 0.5); }

vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 c = vec3(0.031, 0.165, 0.420);                       // #082a6b
  c = mix(c, vec3(0.043, 0.239, 0.600), smoothstep(0.00, 0.16, t)); // #0b3d99
  c = mix(c, vec3(0.071, 0.388, 0.839), smoothstep(0.16, 0.38, t)); // #1263d6
  c = mix(c, vec3(0.180, 0.525, 0.941), smoothstep(0.38, 0.60, t)); // #2e86f0
  c = mix(c, vec3(0.490, 0.725, 0.973), smoothstep(0.60, 0.76, t)); // #7db9f8
  c = mix(c, vec3(0.812, 0.910, 1.000), smoothstep(0.76, 0.88, t)); // #cfe8ff
  c = mix(c, vec3(0.957, 0.980, 1.000), smoothstep(0.88, 0.96, t)); // #f4faff
  c = mix(c, vec3(0.961, 0.965, 0.973), smoothstep(0.96, 1.00, t)); // #f5f6f8
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float x = uv.x;
  float y = 1.0 - uv.y;            // 0 = top of the hero, 1 = bottom
  float t = u_time;
  const float TAU = 6.2831853;

  // (b) vertical WAVE: the colour bands slide up and down, with a phase that travels across x
  float wave = u_waveAmp * sin(TAU * (x * 1.35 - t * u_waveSpeed))
             + u_waveAmp * 0.45 * sin(TAU * (x * 2.7 + t * u_waveSpeed * 0.64) + 1.7);
  float yy = y + wave;
  vec3 col = ramp(yy);

  // (a) vertical FOLDS drifting from left to right (wrapping around), tips lengthen and shorten
  float folds = 0.0;
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    float x0 = fract(fi * 0.1111 + 0.05 * hash(vec2(fi, 3.0)));
    float xi = fract(x0 + t * u_drift);
    float w = 0.016 + 0.020 * hash(vec2(fi, 7.0));
    float d = pdist(x, xi);
    float core = exp(-(d * d) / (w * w));
    float len = 0.50 + 0.22 * hash(vec2(fi, 11.0))
              + 0.08 * sin(t * (0.30 + 0.25 * hash(vec2(fi, 5.0))) + fi * 1.9);
    float taper = 1.0 - smoothstep(0.04, len, yy);
    folds += core * taper * (0.55 + 0.45 * hash(vec2(fi, 13.0)));
  }
  folds = clamp(folds, 0.0, 1.0);
  vec3 deep = ramp(yy - 0.22) * vec3(0.82, 0.90, 1.0);
  col = mix(col, deep, folds * 0.8);

  // faint broad light columns between the folds (also drifting)
  float lightCols = 0.5 + 0.5 * sin(TAU * (x * 3.0 - t * u_drift));
  col += vec3(0.025, 0.045, 0.075) * lightCols * (1.0 - smoothstep(0.15, 0.75, y));

  // thin soft vertical hairlines (subtle)
  for (int j = 0; j < 3; j++) {
    float fj = float(j);
    float xj = fract(0.16 + 0.31 * fj + 0.04 * sin(fj * 3.0) + t * u_drift);
    float dd = pdist(x, xj);
    float line = exp(-(dd * dd) / (0.0011 * 0.0011));
    float vis = smoothstep(0.06, 0.18, y) * (1.0 - smoothstep(0.30, 0.62, y));
    col += vec3(line * vis * 0.10);
  }

  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;   // dither, no banding
  gl_FragColor = vec4(col, 1.0);
}
`;

export const HeroCurtainBackground: React.FC<HeroCurtainBackgroundProps> = ({
  uDrift = 0.016,
  uWaveAmp = 0.045,
  uWaveSpeed = 0.11,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl =
        canvas.getContext('webgl', {
          alpha: false,
          antialias: false,
          powerPreference: 'low-power',
        }) ||
        (canvas.getContext('experimental-webgl', {
          alpha: false,
          antialias: false,
          powerPreference: 'low-power',
        }) as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }

    if (!gl) {
      return;
    }

    // Compile Shader helper
    const compileShader = (type: number, source: string): WebGLShader | null => {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);

    if (!vertShader || !fragShader) {
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Full-screen triangle buffer
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const aPosLoc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    const uResLoc = gl.getUniformLocation(program, 'u_res');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uDriftLoc = gl.getUniformLocation(program, 'u_drift');
    const uWaveAmpLoc = gl.getUniformLocation(program, 'u_waveAmp');
    const uWaveSpeedLoc = gl.getUniformLocation(program, 'u_waveSpeed');

    let isVisible = true;
    let rafId: number | null = null;
    let accumulatedTime = 0;
    let lastTimestamp = performance.now();
    let isContextLost = false;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const resize = () => {
      if (!gl || isContextLost) return;
      const clientW = container.clientWidth;
      const clientH = container.clientHeight;
      const isMobile = clientW < 768;
      const resScale = isMobile ? 0.5 : 0.6;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      const renderW = Math.max(1, Math.round(clientW * dpr * resScale));
      const renderH = Math.max(1, Math.round(clientH * dpr * resScale));

      if (canvas.width !== renderW || canvas.height !== renderH) {
        canvas.width = renderW;
        canvas.height = renderH;
        gl.viewport(0, 0, renderW, renderH);
        gl.uniform2f(uResLoc, renderW, renderH);
      }
    };

    resize();

    const drawFrame = (time: number) => {
      if (!gl || isContextLost) return;
      const isMobile = container.clientWidth < 768;
      const speedMult = isMobile ? 0.7 : 1.0;

      gl.uniform1f(uTimeLoc, time);
      gl.uniform1f(uDriftLoc, uDrift * speedMult);
      gl.uniform1f(uWaveAmpLoc, uWaveAmp);
      gl.uniform1f(uWaveSpeedLoc, uWaveSpeed * speedMult);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Draw initial frame (at 6.0 if reduced motion)
    if (prefersReducedMotion) {
      drawFrame(6.0);
      setCanvasReady(true);
    } else {
      drawFrame(0.0);
      setCanvasReady(true);
    }

    const animate = (now: number) => {
      if (!isVisible || isContextLost) {
        rafId = null;
        return;
      }
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;
      accumulatedTime += dt;

      drawFrame(accumulatedTime);

      rafId = requestAnimationFrame(animate);
    };

    if (!prefersReducedMotion) {
      lastTimestamp = performance.now();
      rafId = requestAnimationFrame(animate);
    }

    // ResizeObserver
    const ro = new ResizeObserver(() => {
      resize();
      if (prefersReducedMotion) {
        drawFrame(6.0);
      }
    });
    ro.observe(container);

    // IntersectionObserver to pause when hero is off screen
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry?.isIntersecting ?? true;
        if (isVisible && !rafId && !prefersReducedMotion && !isContextLost) {
          lastTimestamp = performance.now();
          rafId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0 }
    );
    io.observe(container);

    // VisibilityChange
    const handleVisibility = () => {
      if (document.hidden) {
        isVisible = false;
      } else {
        isVisible = true;
        if (!rafId && !prefersReducedMotion && !isContextLost) {
          lastTimestamp = performance.now();
          rafId = requestAnimationFrame(animate);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // WebGL Context loss handlers
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      isContextLost = true;
      if (rafId) cancelAnimationFrame(rafId);
      setCanvasReady(false);
    };

    const handleContextRestored = () => {
      isContextLost = false;
      // Triggers full re-init on remount
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        gl.deleteBuffer(posBuffer);
      }
    };
  }, [uDrift, uWaveAmp, uWaveSpeed]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      style={{
        background:
          'linear-gradient(180deg, #082a6b 0%, #0b3d99 16%, #1263d6 38%, #2e86f0 60%, #7db9f8 76%, #cfe8ff 88%, #f4faff 96%, #f5f6f8 100%)',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute pointer-events-none"
        style={{
          top: '-2px',
          left: '-2px',
          width: 'calc(100% + 4px)',
          height: 'calc(100% + 4px)',
          opacity: canvasReady ? 1 : 0,
          transition: 'opacity 0.6s ease-out',
        }}
      />
    </div>
  );
};
