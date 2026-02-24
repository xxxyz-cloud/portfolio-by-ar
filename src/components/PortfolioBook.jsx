
import {
  Suspense, useState, useEffect, useRef, useMemo, Component,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCursor, Environment, Sparkles, OrbitControls } from "@react-three/drei";
import { easing } from "maath";
import {
  Bone, BoxGeometry, CanvasTexture, Color,
  Float32BufferAttribute, MathUtils, MeshStandardMaterial,
  Skeleton, SkinnedMesh, SRGBColorSpace, Uint16BufferAttribute, Vector3,
} from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { projects } from "../constants";

/* ── Error boundary ─────────────────────────────────────────── */
class BookErrorBoundary extends Component {
  constructor(p) { super(p); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError)
      return <div className="w-full h-full flex items-center justify-center">
        <p className="font-mono text-xs text-text-dim tracking-widest uppercase">[ 3D unavailable ]</p>
      </div>;
    return this.props.children;
  }
}

/* ── Palette ────────────────────────────────────────────────── */
// Muted/desaturated accent colours — less neon, more refined
const ACCENT = "#00ff88";
const BLUE   = "#00d4ff";
const PURPLE = "#b77bff";
const GOLD   = "#ffcc44";

// INFO PAGE uses softer, desaturated versions of acc
const INFO_THEMES = [
  { bg1:"#10181a", bg2:"#0c1210", acc:"#3ecf82", glow:"rgba(62,207,130,0.10)"  },
  { bg1:"#101620", bg2:"#0c1018", acc:"#38b8d8", glow:"rgba(56,184,216,0.10)"  },
  { bg1:"#16101e", bg2:"#100c18", acc:"#9d6ee0", glow:"rgba(157,110,224,0.10)" },
  { bg1:"#1c1610", bg2:"#14100a", acc:"#c9a23a", glow:"rgba(201,162,58,0.10)"  },
  { bg1:"#10181a", bg2:"#0c1210", acc:"#3ecf82", glow:"rgba(62,207,130,0.10)"  },
];

const THEMES = [
  { bg1:"#071210", bg2:"#030a07", acc: ACCENT, glow:"rgba(0,255,136,0.18)"   },
  { bg1:"#060f18", bg2:"#030810", acc: BLUE,   glow:"rgba(0,212,255,0.18)"   },
  { bg1:"#0f0a18", bg2:"#07050f", acc: PURPLE, glow:"rgba(183,123,255,0.18)" },
  { bg1:"#181204", bg2:"#0e0b02", acc: GOLD,   glow:"rgba(255,204,68,0.18)"  },
  { bg1:"#071210", bg2:"#030a07", acc: ACCENT, glow:"rgba(0,255,136,0.18)"   },
];

/* ── Per-project rich metadata ───────────────────────────────── */
const PROJECT_META = [
  {
    category: "Real-Time Collaboration",
    year: "2025",
    description: "A browser-based collaborative IDE where multiple developers can write, run, and debug code simultaneously. Powered by Socket.io for live sync and an AI assistant for smart completions.",
    highlights: [
      "50+ concurrent users via Socket.io",
      "In-browser code exec with WebContainer API",
      "AI code assistant powered by Gemini",
    ],
    metrics: [
      { label: "Performance", value: 85 },
      { label: "Innovation",  value: 95 },
      { label: "UI Craft",    value: 88 },
    ],
    status: "LIVE",
  },
  {
    category: "3D Creative Agency",
    year: "2025",
    description: "An immersive agency showcase built with Three.js featuring a glowing neon helmet hero, a massive GPU-driven particle system, and silky scroll animations choreographed with GSAP.",
    highlights: [
      "Custom WebGL shader for neon helmet glow",
      "GPU particle system with 100k+ particles",
      "Locomotive Scroll + GSAP scroll-linked fx",
    ],
    metrics: [
      { label: "Performance", value: 90 },
      { label: "Innovation",  value: 92 },
      { label: "UI Craft",    value: 98 },
    ],
    status: "LIVE",
  },
  {
    category: "3D Browser Game",
    year: "2025",
    description: "An endless runner game that runs entirely in the browser using Three.js. Features procedurally generated tracks, smooth 60fps on mobile, and an adaptive difficulty system that keeps players engaged.",
    highlights: [
      "Procedural infinite track generation",
      "Locked 60fps on mobile devices",
      "Difficulty curve with adaptive scaling",
    ],
    metrics: [
      { label: "Performance", value: 95 },
      { label: "Innovation",  value: 88 },
      { label: "UI Craft",    value: 82 },
    ],
    status: "LIVE",
  },
  {
    category: "Educational Platform",
    year: "2025",
    description: "An interactive learning hub covering REST APIs through hands-on modules and quizzes. Each lesson is paired with live API calls against JSONPlaceholder so learners see real responses instantly.",
    highlights: [
      "50+ interactive API topic modules",
      "Progressive quiz with instant scoring",
      "Canvas particle animations throughout",
    ],
    metrics: [
      { label: "Performance", value: 80 },
      { label: "Innovation",  value: 78 },
      { label: "UI Craft",    value: 85 },
    ],
    status: "LIVE",
  },
  {
    category: "Animated Landing Page",
    year: "2026",
    description: "A premium landing page with a custom pencil cursor that leaves an ink trail, ghost handwriting animations drawn on canvas, and depth-aware tilt cards that react to mouse movement.",
    highlights: [
      "Custom pencil cursor with ink trail effect",
      "Ghost handwriting canvas animation",
      "Darkroom tilt-card hover interactions",
    ],
    metrics: [
      { label: "Performance", value: 88 },
      { label: "Innovation",  value: 90 },
      { label: "UI Craft",    value: 96 },
    ],
    status: "LIVE",
  },
];

/* ── Canvas helpers ─────────────────────────────────────────── */
const W = 1024, H = 1366;

function roundRect(ctx, x, y, w, h, r = 5) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

function scanlines(ctx) {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
}

function grid(ctx, acc) {
  ctx.strokeStyle = `${acc}06`; ctx.lineWidth = 1;
  for (let x = -H; x <= W+H; x += 52) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x+H,H); ctx.stroke(); }
  ctx.strokeStyle = `${acc}04`;
  for (let y = 0; y <= H; y += 52) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
}

function wrapText(ctx, text, maxWidth, maxLines = 99) {
  const words = text.split(" ");
  let line = "", lines = [];
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function loadImg(src) {
  return new Promise(resolve => {
    const img = new Image();
    if (src.startsWith("http")) img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/* ── Section label helper ───────────────────────────────────── */
function drawSectionLabel(ctx, text, x, y, acc) {
  ctx.save();
  ctx.font = "700 12px monospace";
  ctx.fillStyle = `${acc}ee`;
  ctx.textAlign = "left";
  ctx.letterSpacing = "0.28em";
  ctx.fillText(text, x, y);
  // underline accent dot
  ctx.fillStyle = acc;
  ctx.beginPath(); ctx.arc(x, y + 8, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

/* ── Metric bar helper ──────────────────────────────────────── */
function drawMetricBar(ctx, label, value, x, y, totalW, acc) {
  const BAR_H   = 5;
  const labelW  = 120;
  const barW    = totalW - labelW - 56;
  const pctW    = barW * (value / 100);

  // Label
  ctx.save();
  ctx.font      = "500 13px monospace";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.textAlign = "left";
  ctx.fillText(label, x, y + BAR_H);

  // Track
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  roundRect(ctx, x + labelW, y - 1, barW, BAR_H, 3); ctx.fill();

  // Fill (gradient)
  const grad = ctx.createLinearGradient(x + labelW, 0, x + labelW + pctW, 0);
  grad.addColorStop(0, `${acc}cc`);
  grad.addColorStop(1, acc);
  ctx.fillStyle = grad;
  roundRect(ctx, x + labelW, y - 1, Math.max(pctW, 4), BAR_H, 3); ctx.fill();

  // Glow dot at end
  ctx.fillStyle = acc;
  ctx.beginPath(); ctx.arc(x + labelW + pctW, y + 1.5, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = acc; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(x + labelW + pctW, y + 1.5, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  // Percentage text
  ctx.font      = "600 11px monospace";
  ctx.fillStyle = `${acc}88`;
  ctx.textAlign = "right";
  ctx.fillText(`${value}%`, x + totalW, y + BAR_H);

  ctx.restore();
}

/* ── IMAGE page (left side) ─────────────────────────────────── */
async function makeImagePage(project, index) {
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  const { acc } = THEMES[index % THEMES.length];

  ctx.fillStyle = "#050505"; ctx.fillRect(0, 0, W, H);

  if (project?.image) {
    const img = await loadImg(project.image);
    if (img) {
      const iA = img.width/img.height, cA = W/H;
      let sx=0, sy=0, sw=img.width, sh=img.height;
      if (iA > cA) { sw=img.height*cA; sx=(img.width-sw)/2; }
      else         { sh=img.width/cA;  sy=(img.height-sh)/2; }
      ctx.drawImage(img, sx,sy,sw,sh, 0,0,W,H);

      const vig = ctx.createRadialGradient(W/2,H/2,H*0.22,W/2,H/2,H*0.82);
      vig.addColorStop(0,"rgba(0,0,0,0.1)"); vig.addColorStop(1,"rgba(0,0,0,0.68)");
      ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);

      const fade = ctx.createLinearGradient(0,H*0.62,0,H);
      fade.addColorStop(0,"transparent"); fade.addColorStop(1,"rgba(0,0,0,0.90)");
      ctx.fillStyle=fade; ctx.fillRect(0,H*0.62,W,H*0.38);
    }
  } else {
    const bgG = ctx.createLinearGradient(0,0,W,H);
    bgG.addColorStop(0,THEMES[index%THEMES.length].bg1);
    bgG.addColorStop(1,THEMES[index%THEMES.length].bg2);
    ctx.fillStyle=bgG; ctx.fillRect(0,0,W,H);
    grid(ctx, acc);
  }

  // Top accent bar
  const tb = ctx.createLinearGradient(0,0,W,0);
  tb.addColorStop(0,acc); tb.addColorStop(0.6,`${acc}50`); tb.addColorStop(1,"transparent");
  ctx.fillStyle=tb; ctx.fillRect(0,0,W,4);

  // Top-left corner bracket
  ctx.strokeStyle=`${acc}dd`; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(36,62); ctx.lineTo(36,36); ctx.lineTo(62,36); ctx.stroke();

  // Caption area
  const CAP_PAD = 44;
  const CAP_Y   = H - 148;

  ctx.font = "700 11px monospace"; ctx.textAlign="left"; ctx.fillStyle=`${acc}bb`;
  ctx.fillText(`0${index+1}`, CAP_PAD, CAP_Y);

  ctx.strokeStyle=`${acc}30`; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(CAP_PAD, CAP_Y+14); ctx.lineTo(W-CAP_PAD, CAP_Y+14); ctx.stroke();

  ctx.save();
  ctx.font="700 38px 'Arial Black',sans-serif"; ctx.textAlign="left";
  const nameMaxW = W - CAP_PAD*2;
  let nameStr = (project?.name??'').toUpperCase();
  while(ctx.measureText(nameStr).width > nameMaxW && nameStr.length > 2)
    nameStr = nameStr.slice(0,-1);
  if((project?.name??'').toUpperCase() !== nameStr) nameStr += '…';
  ctx.shadowColor=acc; ctx.shadowBlur=12;
  ctx.fillStyle="#ffffffee";
  ctx.fillText(nameStr, CAP_PAD, CAP_Y+56);
  ctx.shadowBlur=0; ctx.restore();

  const tags = (project?.frameworks??[]).slice(0,3).map(f=>f.name).join("  ·  ");
  ctx.font="400 13px monospace"; ctx.fillStyle=`${acc}80`; ctx.textAlign="left";
  ctx.fillText(tags, CAP_PAD, CAP_Y+84);

  scanlines(ctx);
  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

/* ── INFO page (right side) — editorial redesign ───────────── */
function makeInfoPage(project, index) {
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  const { bg1, bg2, acc, glow } = INFO_THEMES[index % INFO_THEMES.length];
  const meta = PROJECT_META[index] || PROJECT_META[0];

  // ── Background — mid-dark, not pitch black ─────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, bg1); bg.addColorStop(1, bg2);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Diagonal accent band — very subtle tint only
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = acc;
  ctx.beginPath();
  ctx.moveTo(W * 0.4, 0); ctx.lineTo(W, 0);
  ctx.lineTo(W, H * 0.55); ctx.lineTo(W * 0.4, 0);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();

  // Ambient glow — softer, smaller radius
  const glowG = ctx.createRadialGradient(W * 0.82, H * 0.18, 0, W * 0.82, H * 0.18, 220);
  glowG.addColorStop(0, `${acc}18`); glowG.addColorStop(1, "transparent");
  ctx.fillStyle = glowG; ctx.fillRect(0, 0, W, H);

  // Subtle grid
  grid(ctx, acc);

  // ── Ghost index number watermark ────────────────────────────
  ctx.save();
  ctx.font = "900 340px 'Arial Black', sans-serif";
  ctx.textAlign = "right";
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = acc;
  ctx.fillText(`0${index + 1}`, W - 20, H * 0.62);
  ctx.globalAlpha = 1;
  ctx.restore();

  // Left spine strip — muted, not glowing
  const lb = ctx.createLinearGradient(0, 0, 0, H);
  lb.addColorStop(0, "transparent"); lb.addColorStop(0.2, `${acc}70`); lb.addColorStop(0.7, `${acc}18`); lb.addColorStop(1, "transparent");
  ctx.fillStyle = lb; ctx.fillRect(0, 0, 2, H);

  // Top accent bar — thinner, softer
  const tb = ctx.createLinearGradient(0, 0, W, 0);
  tb.addColorStop(0, `${acc}cc`); tb.addColorStop(0.4, `${acc}30`); tb.addColorStop(1, "transparent");
  ctx.fillStyle = tb; ctx.fillRect(0, 0, W, 3);

  if (!project) { scanlines(ctx); const t = new CanvasTexture(cv); t.colorSpace = SRGBColorSpace; return t; }

  const P  = 56;
  const CW = W - P * 2;

  // ── SECTION 1: TOP META ROW  y=44 ───────────────────────────
  let y = 44;

  // Index tag — no glow, just tinted accent
  ctx.save();
  ctx.font = "700 13px monospace"; ctx.textAlign = "left";
  ctx.fillStyle = `${acc}cc`;
  ctx.fillText(`${String(index + 1).padStart(2, "0")}`, P, y + 14);

  // Divider dot
  ctx.fillStyle = `${acc}40`;
  ctx.beginPath(); ctx.arc(P + 28, y + 8, 2, 0, Math.PI * 2); ctx.fill();

  // Category text — dimmer
  ctx.font = "500 13px monospace";
  ctx.fillStyle = "rgba(200,200,210,0.38)";
  ctx.fillText(meta.category.toUpperCase(), P + 40, y + 14);
  ctx.restore();

  // Year — top right, quiet
  ctx.save();
  ctx.font = "600 13px monospace"; ctx.textAlign = "right";
  ctx.fillStyle = `${acc}50`;
  ctx.fillText(meta.year, W - P, y + 14);
  ctx.restore();

  // ── Thin full-width rule — muted ───────────────────────────
  y = 74;
  const rg = ctx.createLinearGradient(P, 0, W - P, 0);
  rg.addColorStop(0, `${acc}55`); rg.addColorStop(0.5, `${acc}20`); rg.addColorStop(1, "transparent");
  ctx.strokeStyle = rg; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(P, y); ctx.lineTo(W - P, y); ctx.stroke();
  // Small dot, no glow
  ctx.fillStyle = `${acc}55`;
  ctx.beginPath(); ctx.arc(P, y, 2, 0, Math.PI * 2); ctx.fill();

  // ── SECTION 2: PROJECT NAME ─────────────────────────────────
  y = 92;
  const NAME_FS = 66, NAME_LH = 72;
  ctx.save();
  ctx.font = `900 ${NAME_FS}px 'Arial Black', sans-serif`; ctx.textAlign = "left";
  const nameLines = wrapText(ctx, project.name.toUpperCase(), CW, 2);
  nameLines.forEach((l, li) => {
    // Flat off-white — no gradient, no glow, just clean type
    ctx.fillStyle = li === 0 ? "rgba(225,225,232,0.92)" : "rgba(200,200,210,0.65)";
    ctx.fillText(l, P, y + NAME_FS + li * NAME_LH);
  });
  ctx.restore();

  const nameBtm = y + NAME_FS + (nameLines.length - 1) * NAME_LH;

  // Accent underline — barely there
  y = nameBtm + 10;
  ctx.save();
  const ul = ctx.createLinearGradient(P, 0, P + CW * 0.38, 0);
  ul.addColorStop(0, `${acc}55`); ul.addColorStop(1, "transparent");
  ctx.fillStyle = ul; ctx.fillRect(P, y, CW * 0.38, 1);
  ctx.restore();

  // ── SECTION 3: DESCRIPTION ─────────────────────────────────
  y += 28;

  // Left accent border strip — very muted
  const descG = ctx.createLinearGradient(0, y, 0, y + 160);
  descG.addColorStop(0, `${acc}55`); descG.addColorStop(1, `${acc}00`);
  ctx.fillStyle = descG; ctx.fillRect(P, y, 2, 160);

  const descText = meta.description || project.description || "";
  ctx.save();
  ctx.font = "400 22px Arial, sans-serif";
  ctx.fillStyle = "rgba(170,170,182,0.60)";
  ctx.textAlign = "left";
  const descLines = wrapText(ctx, descText, CW - 22, 4);
  const DESC_LH = 34;
  descLines.forEach((l, li) => {
    ctx.fillText(l, P + 18, y + 26 + li * DESC_LH);
  });
  ctx.restore();

  const descBtm = y + 26 + (descLines.length - 1) * DESC_LH;

  // ── SECTION 4: TECH STACK ───────────────────────────────────
  y = descBtm + 44;

  // Section label
  ctx.save();
  ctx.font = "700 11px monospace"; ctx.textAlign = "left";
  ctx.fillStyle = `${acc}66`; ctx.letterSpacing = "0.2em";
  ctx.fillText("BUILT WITH", P, y);
  // Small line right of label
  ctx.strokeStyle = `${acc}20`; ctx.lineWidth = 1;
  const lwTxt = ctx.measureText("BUILT WITH").width;
  ctx.beginPath(); ctx.moveTo(P + lwTxt + 12, y - 4); ctx.lineTo(W - P, y - 4); ctx.stroke();
  ctx.restore();

  y += 14;
  const PILL_H = 38, PILL_GAP = 10, PILL_ROW_GAP = 10;
  ctx.font = "600 13px monospace"; ctx.textAlign = "left";
  let px = P, py = y, row = 0;
  for (const f of (project.frameworks ?? []).slice(0, 9)) {
    const label = f.name.toUpperCase();
    const tw = ctx.measureText(label).width + 28;
    if (px + tw > W - P) {
      row++; if (row >= 2) break;
      px = P; py += PILL_H + PILL_ROW_GAP;
    }
    // Background — very faint
    const pg = ctx.createLinearGradient(px, py, px, py + PILL_H);
    pg.addColorStop(0, `${acc}10`); pg.addColorStop(1, `${acc}05`);
    ctx.fillStyle = pg; roundRect(ctx, px, py, tw, PILL_H, 6); ctx.fill();
    // Border — muted
    ctx.strokeStyle = `${acc}30`; ctx.lineWidth = 1;
    roundRect(ctx, px, py, tw, PILL_H, 6); ctx.stroke();
    // Text — no glow
    ctx.fillStyle = `${acc}cc`;
    ctx.fillText(label, px + 14, py + 24);
    px += tw + PILL_GAP;
  }

  const pillBtm = py + PILL_H;

  // ── SECTION 5: KEY HIGHLIGHTS ───────────────────────────────
  y = pillBtm + 44;

  ctx.save();
  ctx.font = "700 11px monospace"; ctx.textAlign = "left";
  ctx.fillStyle = `${acc}66`;
  ctx.fillText("HIGHLIGHTS", P, y);
  const hlwTxt = ctx.measureText("HIGHLIGHTS").width;
  ctx.strokeStyle = `${acc}20`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(P + hlwTxt + 12, y - 4); ctx.lineTo(W - P, y - 4); ctx.stroke();
  ctx.restore();

  y += 18;
  const HL_ROW_H = 52;
  for (const [i, hl] of (meta.highlights ?? []).entries()) {
    const hy = y + i * HL_ROW_H;

    // Numbered badge — quiet
    ctx.save();
    ctx.font = "700 11px monospace"; ctx.textAlign = "center";
    const numBadgeW = 30, numBadgeH = 22;
    ctx.fillStyle = `${acc}0c`;
    roundRect(ctx, P, hy, numBadgeW, numBadgeH, 4); ctx.fill();
    ctx.strokeStyle = `${acc}30`; ctx.lineWidth = 1;
    roundRect(ctx, P, hy, numBadgeW, numBadgeH, 4); ctx.stroke();
    ctx.fillStyle = `${acc}bb`;
    ctx.fillText(`${String(i + 1).padStart(2, "0")}`, P + numBadgeW / 2, hy + 15);
    ctx.restore();

    // Dashed connector
    ctx.save();
    ctx.strokeStyle = `${acc}25`; ctx.lineWidth = 1; ctx.setLineDash([2, 5]);
    ctx.beginPath(); ctx.moveTo(P + 36, hy + 11); ctx.lineTo(P + 58, hy + 11); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();

    // Highlight text
    ctx.save();
    ctx.font = "400 20px Arial, sans-serif";
    ctx.fillStyle = "rgba(172,172,184,0.62)";
    ctx.textAlign = "left";
    ctx.fillText(hl, P + 64, hy + 17);
    ctx.restore();

    // Thin separator (not after last)
    if (i < (meta.highlights?.length ?? 0) - 1) {
      ctx.strokeStyle = `rgba(255,255,255,0.05)`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(P, hy + HL_ROW_H - 6); ctx.lineTo(W - P, hy + HL_ROW_H - 6); ctx.stroke();
    }
  }

  // ── BOTTOM STATUS BAR ────────────────────────────────────────
  const BTMY = H - 68;

  // Full-width gradient rule — very subtle
  const br = ctx.createLinearGradient(0, 0, W, 0);
  br.addColorStop(0, "transparent"); br.addColorStop(0.25, `${acc}20`);
  br.addColorStop(0.75, `${acc}20`); br.addColorStop(1, "transparent");
  ctx.strokeStyle = br; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(P, BTMY); ctx.lineTo(W - P, BTMY); ctx.stroke();

  // Status pill — muted
  ctx.save();
  ctx.font = "600 12px monospace"; ctx.textAlign = "left";
  const stTxt = `● ${meta.status}`;
  const stW = ctx.measureText(stTxt).width + 24;
  ctx.fillStyle = `${acc}0a`; roundRect(ctx, P, BTMY + 14, stW, 30, 15); ctx.fill();
  ctx.strokeStyle = `${acc}30`; ctx.lineWidth = 1; roundRect(ctx, P, BTMY + 14, stW, 30, 15); ctx.stroke();
  ctx.fillStyle = `${acc}aa`;
  ctx.fillText(stTxt, P + 12, BTMY + 33);
  ctx.restore();

  // CTA right side — dim
  ctx.save();
  ctx.font = "700 13px monospace"; ctx.textAlign = "right";
  ctx.fillStyle = "rgba(170,170,180,0.28)";
  ctx.fillText("VIEW LIVE PROJECT  ↗", W - P, BTMY + 33);
  ctx.restore();

  // Corner brackets — quieter
  ctx.strokeStyle = `${acc}40`; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W - P, H - P - 18); ctx.lineTo(W - P, H - P); ctx.lineTo(W - P - 18, H - P);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(P + 18, P); ctx.lineTo(P, P); ctx.lineTo(P, P + 18);
  ctx.stroke();

  // Bottom accent bar — softened
  const BTM = ctx.createLinearGradient(0, 0, W, 0);
  BTM.addColorStop(0, "transparent"); BTM.addColorStop(0.5, `${acc}88`); BTM.addColorStop(1, "transparent");
  ctx.fillStyle = BTM; ctx.fillRect(0, H - 3, W, 3);

  scanlines(ctx);
  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

/* ── COVER textures ─────────────────────────────────────────── */
async function makeCoverTexture(isFront) {
  const src = isFront ? "/assets/cover.png" : "/assets/cover_back.png";
  const cv  = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");

  const img = await loadImg(src);
  if (img) {
    const iA = img.width / img.height, cA = W / H;
    let sx=0, sy=0, sw=img.width, sh=img.height;
    if (iA > cA) { sw = img.height * cA; sx = (img.width - sw) / 2; }
    else         { sh = img.width  / cA; sy = (img.height - sh) / 2; }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  } else {
    ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0, 0, W, H);
    ctx.font = "300 14px monospace"; ctx.fillStyle = `${ACCENT}40`; ctx.textAlign = "center";
    ctx.fillText(isFront ? "FRONT COVER" : "BACK COVER", W/2, H/2);
  }

  scanlines(ctx);
  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

/* ── Page-array builder ─────────────────────────────────────── */
async function buildBookPages() {
  const N = projects.length;
  const [imgTextures, frontCover, backCover] = await Promise.all([
    Promise.all(projects.map((p,i) => makeImagePage(p,i))),
    makeCoverTexture(true),
    makeCoverTexture(false),
  ]);
  const infoTextures = projects.map((p,i) => makeInfoPage(p,i));

  const pages = [];
  pages.push({ frontTex: frontCover, backTex: imgTextures[0], isCover: true });
  for (let k = 1; k < N; k++) pages.push({ frontTex: infoTextures[k-1], backTex: imgTextures[k] });
  pages.push({ frontTex: infoTextures[N-1], backTex: backCover, isCover: true });
  return pages;
}

/* ── 3-D geometry ───────────────────────────────────────────── */
const PW=1.28, PH=1.71, PD=0.003, SEGS=30, SW=PW/SEGS;
const geo=new BoxGeometry(PW,PH,PD,SEGS,2); geo.translate(PW/2,0,0);
const _p=geo.attributes.position, _v=new Vector3(), _si=[], _sw=[];
for(let i=0;i<_p.count;i++){
  _v.fromBufferAttribute(_p,i);
  const idx=Math.max(0,Math.floor(_v.x/SW)), wgt=(_v.x%SW)/SW;
  _si.push(idx,idx+1,0,0); _sw.push(1-wgt,wgt,0,0);
}
geo.setAttribute("skinIndex",  new Uint16BufferAttribute(_si,4));
geo.setAttribute("skinWeight", new Float32BufferAttribute(_sw,4));
const WHITE=new Color("white");
const edgeMats=[
  new MeshStandardMaterial({color:new Color("#e4e4e4")}),
  new MeshStandardMaterial({color:new Color("#0a0a0a")}),
  new MeshStandardMaterial({color:new Color("#e4e4e4")}),
  new MeshStandardMaterial({color:new Color("#e4e4e4")}),
];
const EF=0.5, EFF=0.3, ICS=0.18, OCS=0.05, TCS=0.09;

/* ── Page component ─────────────────────────────────────────── */
const Page=({number,frontTex,backTex,page,opened,bookClosed,setPage,isCover})=>{
  const group=useRef(), turnedAt=useRef(0), lastOpened=useRef(opened), smRef=useRef();
  const [hl,setHl]=useState(false); useCursor(hl);

  const mesh=useMemo(()=>{
    if(!frontTex||!backTex) return null;
    const bones=[];
    for(let i=0;i<=SEGS;i++){const b=new Bone();bones.push(b);b.position.x=i===0?0:SW;if(i>0)bones[i-1].add(b);}
    const sk=new Skeleton(bones);
    const mats=[...edgeMats,
      new MeshStandardMaterial({color:WHITE,map:frontTex,roughness:0.1,metalness:0}),
      new MeshStandardMaterial({color:WHITE,map:backTex, roughness:0.1,metalness:0}),
    ];
    const m=new SkinnedMesh(geo,mats);
    m.castShadow=m.receiveShadow=true; m.frustumCulled=false;
    m.add(sk.bones[0]); m.bind(sk); return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[frontTex,backTex]);

  useFrame((_,delta)=>{
    if(!smRef.current||!mesh) return;
    if(lastOpened.current!==opened){turnedAt.current=+new Date();lastOpened.current=opened;}
    let tt=Math.min(400,new Date()-turnedAt.current)/400; tt=Math.sin(tt*Math.PI);
    let tr=opened?-Math.PI/2:Math.PI/2;
    if(!bookClosed) tr+=degToRad(number*0.8);
    const bones=smRef.current.skeleton.bones;
    for(let i=0;i<bones.length;i++){
      const t=i===0?group.current:bones[i];
      const ic=i<8?Math.sin(i*0.2+0.25):0, oc=i>=8?Math.cos(i*0.3+0.09):0;
      const ti=Math.sin(i*Math.PI*(1/bones.length))*tt;
      let ra=ICS*ic*tr-OCS*oc*tr+TCS*ti*tr;
      let fr=degToRad(Math.sign(tr)*2);
      if(bookClosed){ra=i===0?tr:0;fr=0;}
      easing.dampAngle(t.rotation,"y",ra,EF,delta);
      const fi=i>8?Math.sin(i*Math.PI*(1/bones.length)-0.5)*tt:0;
      easing.dampAngle(t.rotation,"x",fr*fi,EFF,delta);
    }
  });

  if(!mesh) return null;
  return(
    <group ref={group}
      onPointerEnter={e=>{e.stopPropagation();setHl(true);}}
      onPointerLeave={e=>{e.stopPropagation();setHl(false);}}
      onClick={e=>{e.stopPropagation();setPage(opened?number:number+1);setHl(false);}}
    >
      <primitive object={mesh} ref={smRef} position-z={-number*PD+page*PD}/>
    </group>
  );
};

/* ── Book group ─────────────────────────────────────────────── */
const Book=({page,setPage,bookPages})=>{
  const [dp,setDp]=useState(page);
  useEffect(()=>{
    let t;
    const go=()=>setDp(prev=>{
      if(page===prev) return prev;
      t=setTimeout(go,Math.abs(page-prev)>2?50:150);
      return page>prev?prev+1:prev-1;
    });
    go(); return ()=>clearTimeout(t);
  },[page]);
  return(
    <group rotation-y={-Math.PI/2}>
      {bookPages.map((pd,i)=>(
        <Page key={i} number={i} page={dp} opened={dp>i}
          bookClosed={dp===0||dp===bookPages.length}
          frontTex={pd.frontTex} backTex={pd.backTex}
          isCover={pd.isCover} setPage={setPage}
        />
      ))}
    </group>
  );
};

/* ── Camera float ───────────────────────────────────────────── */
const AutoFloat=()=>{
  const {camera}=useThree(); const t=useRef(0),base=useRef(camera.position.y);
  useFrame((_,d)=>{t.current+=d*0.18;camera.position.y=base.current+Math.sin(t.current)*0.05;});
  return null;
};

/* ── Camera responder — reacts to container resize live ─────── */
const CameraResponder=({containerRef})=>{
  const {camera}=useThree();
  useEffect(()=>{
    const getZ=()=>{
      const w=containerRef.current?.offsetWidth??window.innerWidth;
      return w>1200?1.8:w>900?2.1:w>768?2.4:w>480?2.8:3.2;
    };
    camera.position.z=getZ();
    const ro=new ResizeObserver(()=>{ camera.position.z=getZ(); });
    if(containerRef.current) ro.observe(containerRef.current);
    return ()=>ro.disconnect();
  },[camera,containerRef]);
  return null;
};

/* ── Enhanced Nav + project card ────────────────────────────── */
const BookNav=({page,setPage,total})=>{
  const N=projects.length;
  const idx = (page>=1&&page<=N) ? page-1 : null;
  const proj  = idx!==null ? projects[idx] : null;
  const theme = proj ? THEMES[idx%THEMES.length] : null;
  const meta  = idx!==null ? PROJECT_META[idx] : null;
  const isTouch = typeof window!=="undefined" && ("ontouchstart" in window || navigator.maxTouchPoints>0);

  return(
    <div className="w-full flex flex-col items-center gap-5 mt-7 select-none px-4">

      {/* Dot indicators */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {Array.from({length:total+1}).map((_,i)=>{
          const active=i===page;
          const lbl=i===0?"Cover":i===total?"Back":projects[i-1]?.name;
          return(
            <button key={i} onClick={()=>setPage(i)} title={lbl}
              className={`transition-all duration-300 rounded-full border ${active
                ?"w-8 h-2.5 bg-accent border-accent"
                :"w-2.5 h-2.5 bg-transparent border-text-dim/40 hover:border-accent hover:scale-125"}`}
              style={active?{boxShadow:"0 0 10px #00ff88,0 0 20px #00ff8840"}:{}}
            />
          );
        })}
      </div>

      {/* Prev / label / Next */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button onClick={()=>setPage(Math.max(0,page-1))} disabled={page===0}
          className="group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 rounded-full border border-border text-text-dim hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed font-mono text-[10px] sm:text-xs tracking-widest uppercase">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="group-hover:-translate-x-1 transition-transform duration-300">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Prev
        </button>

        <span className="font-mono text-[10px] sm:text-xs text-text-dim tracking-widest min-w-[60px] sm:min-w-[80px] text-center">
          {page===0?"COVER":page===total?"BACK":`${page} / ${N}`}
        </span>

        <button onClick={()=>setPage(Math.min(total,page+1))} disabled={page===total}
          className="group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 rounded-full border border-border text-text-dim hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed font-mono text-[10px] sm:text-xs tracking-widest uppercase">
          Next
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
            <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Rich project card — maxHeight generous so it never clips on mobile */}
      <div
        className="w-full max-w-4xl transition-all duration-500 overflow-hidden"
        style={{ maxHeight: proj ? "700px" : "0px", opacity: proj ? 1 : 0 }}
      >
        {proj && meta && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(10,10,10,0.85)",
              border: `1px solid ${theme.acc}20`,
              boxShadow: `0 0 40px ${theme.acc}0a, 0 20px 50px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Top stripe */}
            <div className="h-px w-full" style={{
              background: `linear-gradient(to right, transparent, ${theme.acc}60, transparent)`
            }} />

            <div className="flex gap-0">
              {/* Left accent bar */}
              <div className="w-1 flex-shrink-0 self-stretch" style={{
                background: `linear-gradient(to bottom, ${theme.acc}, ${theme.acc}30)`
              }} />

              <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4">
                {/* Top meta row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase"
                    style={{ color: `${theme.acc}cc` }}>
                    {meta.category}
                  </span>
                  <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.4)" }}>
                    {meta.year}
                  </span>
                </div>

                {/* Project name */}
                <p className="font-display font-bold text-white text-lg sm:text-2xl leading-tight">
                  {proj.name}
                </p>

                {/* Description — no fixed maxWidth, let it wrap naturally */}
                <p className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.55)" }}>
                  {meta.description}
                </p>

                {/* Bottom row: tech tags + CTA — wraps gracefully on small screens */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.frameworks.slice(0, 3).map(f => (
                      <span key={f.id}
                        className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase px-2 py-1 rounded"
                        style={{
                          color: theme.acc,
                          border: `1px solid ${theme.acc}45`,
                          background: `${theme.acc}12`,
                        }}>
                        {f.name}
                      </span>
                    ))}
                  </div>

                  <a
                    href={proj.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-mono text-[10px] sm:text-[11px] tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:brightness-125 whitespace-nowrap flex-shrink-0"
                    style={{
                      color: theme.acc,
                      border: `1px solid ${theme.acc}65`,
                      background: `${theme.acc}16`,
                      boxShadow: `0 0 20px ${theme.acc}18`,
                    }}
                  >
                    Live Preview
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interaction hints — touch-aware */}
      <div className="flex items-center gap-5 mt-2 opacity-30">
        <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.28rem] uppercase text-text-dim flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 11l5-5 5 5M7 17l5-5 5 5"/>
          </svg>
          {isTouch ? "Swipe to rotate" : "Drag to rotate"}
        </span>
        <span className="w-px h-3 bg-text-dim/40"/>
        <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.28rem] uppercase text-text-dim flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 6v4"/>
          </svg>
          {isTouch ? "Tap pages to turn" : "Click pages to turn"}
        </span>
      </div>
    </div>
  );
};

/* ── Main export ────────────────────────────────────────────── */
const PortfolioBook=()=>{
  const [page,setPage]           = useState(0);
  const [bookPages,setBookPages] = useState(null);
  const [mounted,setMounted]     = useState(false);
  const [cursor,setCursor]       = useState("grab");
  const wrapperRef  = useRef(null);
  const canvasWrapRef = useRef(null);
  const prevPage    = useRef(page);
  const isMobile    = typeof window!=="undefined" && window.innerWidth<768;

  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setMounted(true);},{threshold:0.05});
    if(wrapperRef.current) obs.observe(wrapperRef.current);
    return ()=>obs.disconnect();
  },[]);

  useEffect(()=>{
    if(!mounted) return;
    let cancelled=false;
    buildBookPages().then(pages=>{if(!cancelled)setBookPages(pages);});
    return ()=>{cancelled=true;};
  },[mounted]);

  useEffect(()=>{
    if(page!==prevPage.current){
      prevPage.current=page;
      try{const a=new Audio("/audios/page-flip-01a.mp3");a.volume=0.35;a.play().catch(()=>{});}catch(_){}
    }
  },[page]);

  const total = bookPages ? bookPages.length-1 : 0;

  return(
    <div ref={wrapperRef} className="relative w-full flex flex-col items-center py-8 sm:py-14 px-2 sm:px-4">

      {/* 3-D canvas — clamp lower on mobile so it doesn't eat the whole viewport */}
      <div
        ref={canvasWrapRef}
        className="relative w-full"
        style={{height: isMobile ? "clamp(500px,85vh,740px)" : "clamp(700px,90vh,1100px)", cursor}}
        onPointerDown={()=>setCursor("grabbing")}
        onPointerUp={()=>setCursor("grab")}
        onPointerLeave={()=>setCursor("grab")}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{background:"radial-gradient(ellipse 55% 45% at 50% 55%,rgba(0,255,136,0.05) 0%,transparent 70%)"}}/>

        {mounted&&bookPages?(
          <BookErrorBoundary>
            <Canvas
              shadows={!isMobile}
              camera={{position:[-0.5,0.5,4.5],fov: isMobile ? 62 : 52}}
              gl={{antialias:!isMobile, alpha:true, powerPreference: isMobile?"low-power":"high-performance"}}
              style={{background:"transparent"}}
            >
              <color attach="background" args={["#0a0a0a"]}/>
              <fog attach="fog" args={["#0a0a0a",14,24]}/>
              <ambientLight intensity={1.8}/>
              <directionalLight position={[4,6,4]} intensity={4.5} castShadow={!isMobile}
                shadow-mapSize-width={isMobile?1024:2048} shadow-mapSize-height={isMobile?1024:2048}
                shadow-bias={-0.0001} color="#ffffff"/>
              <directionalLight position={[-4,3,3]} intensity={2.8} color="#ffffff"/>
              <directionalLight position={[0,0,6]} intensity={2.0} color="#fffde8"/>
              <pointLight position={[0,-2.2,2.5]} intensity={3.5} color="#00ff88" distance={12}/>
              <pointLight position={[0,3,-3.5]} intensity={2.0} color="#b77bff" distance={14}/>
              <pointLight position={[2,1,3]} intensity={2.5} color="#00d4ff" distance={10}/>
              <Suspense fallback={null}>
                <group position={[0,0,0]}>
                  <Book page={page} setPage={setPage} bookPages={bookPages}/>
                </group>
                {/* Fewer sparkles on mobile — meaningful GPU saving */}
                <Sparkles count={isMobile?16:50} scale={[6,5,4]} size={1.2} speed={0.18} opacity={0.28} color="#00ff88"/>
                {!isMobile&&<Sparkles count={24} scale={[5,4,3]} size={0.8} speed={0.1} opacity={0.18} color="#00d4ff" position={[0.5,0,0]}/>}
                <mesh position-y={-1.55} rotation-x={-Math.PI/2} receiveShadow>
                  <planeGeometry args={[100,100]}/>
                  <shadowMaterial transparent opacity={0.22}/>
                </mesh>
                <Environment preset="warehouse" background={false}/>
              </Suspense>
              <AutoFloat/>
              {/* CameraResponder updates Z live on resize / rotation */}
              <CameraResponder containerRef={canvasWrapRef}/>
              <OrbitControls enableZoom={false} enablePan={false}
                rotateSpeed={isMobile?0.4:0.55}
                minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI*0.72}
                dampingFactor={0.06} enableDamping/>
            </Canvas>
          </BookErrorBoundary>
        ):(
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-5 opacity-40">
              <div className="relative w-20 h-24 border border-accent/40 rounded"
                style={{boxShadow:"0 0 24px rgba(0,255,136,0.12)"}}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border border-accent/30 rotate-45 animate-spin"
                    style={{animationDuration:"3s"}}/>
                </div>
              </div>
              <p className="font-mono text-xs tracking-[0.4rem] uppercase text-text-dim">
                {mounted?"Loading project images…":"Initializing 3D Book…"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      {bookPages&&(
        <BookNav page={page} setPage={setPage} total={total}/>
      )}
    </div>
  );
};

export default PortfolioBook;