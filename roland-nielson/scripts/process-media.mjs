// Turns the raw files in /assets-src into web-ready images, video, poster and captions.
// Run with: npm run media   (needs ffmpeg + ffprobe on PATH)
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = 'assets-src';
const has = (f) => existsSync(`${SRC}/${f}`);
mkdirSync('src/assets', { recursive: true });
mkdirSync('public/images', { recursive: true });
mkdirSync('public/videos', { recursive: true });

// Gentle warm grade: lift reds a touch, pull blues a touch. Faces are not retouched.
const warm = (img) => img.linear([1.03, 1.0, 0.95], [3, 1, -3]).modulate({ saturation: 1.02 });

// --- Wall photo -------------------------------------------------------------
// Crop just above the belt so the ID badge and lanyard (y ≈ 790+) never appear.
if (has('roland-wall.jpg')) {
  const wall = () => warm(sharp(`${SRC}/roland-wall.jpg`).extract({ left: 0, top: 0, width: 671, height: 770 }));
  await wall().jpeg({ quality: 92, mozjpeg: true }).toFile('src/assets/roland-nielson-mens-life-coach-omaha.jpg');
  await wall().webp({ quality: 82 }).toFile('public/images/roland-nielson-mens-life-coach-omaha.webp');
  await wall().jpeg({ quality: 84, mozjpeg: true }).toFile('public/images/roland-nielson-mens-life-coach-omaha.jpg');
  // Tight head-and-shoulders crop for author boxes and the OG card.
  await warm(sharp(`${SRC}/roland-wall.jpg`).extract({ left: 40, top: 230, width: 380, height: 380 }))
    .jpeg({ quality: 90 }).toFile('src/assets/roland-nielson-headshot.jpg');
  await warm(sharp(`${SRC}/roland-wall.jpg`).extract({ left: 0, top: 120, width: 671, height: 650 }))
    .jpeg({ quality: 90 }).toFile('src/assets/og-photo.jpg');
}

// --- Note photo -------------------------------------------------------------
if (has('roland-note.jpg')) {
  const note = () => warm(sharp(`${SRC}/roland-note.jpg`));
  await note().jpeg({ quality: 92, mozjpeg: true }).toFile('src/assets/rebuilding-after-addiction-coaching-omaha.jpg');
  await note().webp({ quality: 82 }).toFile('public/images/rebuilding-after-addiction-coaching-omaha.webp');
}

// --- Recovery video ---------------------------------------------------------
const VIDEO = `${SRC}/roland-recovery-story.mp4`;
const OUT = 'public/videos/roland-nielson-recovery-story-omaha';
if (existsSync(VIDEO)) {
  const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
  // Source is vertical 1080x1920. Serve 720x1280: sharp on phones, small on the wire.
  if (!existsSync(`${OUT}.mp4`)) {
    ff(['-i', VIDEO, '-vf', 'scale=720:-2', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow',
      '-b:v', '1600k', '-maxrate', '2000k', '-bufsize', '3200k', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', `${OUT}.mp4`]);
  }
  if (!existsSync(`${OUT}.webm`)) {
    ff(['-i', VIDEO, '-vf', 'scale=720:-2', '-c:v', 'libvpx-vp9', '-b:v', '1200k', '-row-mt', '1',
      '-deadline', 'good', '-cpu-used', '2', '-c:a', 'libopus', '-b:a', '96k', `${OUT}.webm`]);
  }
  // Poster: 9.6 s, a calm frame with Roland's face clear and no burned-in caption.
  ff(['-ss', '9.6', '-i', VIDEO, '-frames:v', '1', '-vf', 'scale=720:-2', `${SRC}/poster-frame.png`]);
  await sharp(`${SRC}/poster-frame.png`).resize(540).webp({ quality: 72 }).toFile('public/videos/roland-recovery-story-poster.webp');
  await sharp(`${SRC}/poster-frame.png`).jpeg({ quality: 82 }).toFile('public/videos/roland-recovery-story-poster.jpg');

  const duration = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=nw=1:nk=1', `${OUT}.mp4`]).toString().trim());

  // Captions: prefer a hand-made .srt; fall back to the local Whisper segments.
  let cues = [];
  if (has('roland-recovery-story.srt')) {
    const srt = readFileSync(`${SRC}/roland-recovery-story.srt`, 'utf8').replace(/\r/g, '');
    for (const block of srt.split(/\n\n+/)) {
      const lines = block.trim().split('\n');
      const t = lines.find((l) => l.includes('-->'));
      if (!t) continue;
      const [a, b] = t.split('-->').map((s) => toSec(s.trim()));
      cues.push({ start: a, end: b, text: lines.slice(lines.indexOf(t) + 1).join(' ') });
    }
  } else if (has('roland-recovery-story.segments.json')) {
    const segs = JSON.parse(readFileSync(`${SRC}/roland-recovery-story.segments.json`, 'utf8'));
    for (const s of segs) cues.push(...splitSegment(s));
  }
  if (cues.length) {
    const vtt = 'WEBVTT\n\n' + cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join('\n');
    writeFileSync(`${OUT}.en.vtt`, vtt);
  }
  // Paragraphs for the on-page transcript.
  const fullText = cues.map((c) => c.text).join(' ').replace(/\s+/g, ' ').trim();
  writeFileSync('src/data/recovery-video.json', JSON.stringify({
    durationSeconds: Math.round(duration),
    hasCaptions: cues.length > 0,
    transcript: fullText ? paragraphs(fullText) : [],
  }, null, 2) + '\n');
  console.log(`Video: ${duration.toFixed(1)} s, ${cues.length} caption cues`);
}
console.log('Media processed.');

function toSec(s) {
  const [h, m, rest] = s.replace(',', '.').split(':');
  return Number(h) * 3600 + Number(m) * 60 + Number(rest);
}
function ts(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${s.toFixed(3).padStart(6, '0')}`;
}
// Break a long speech segment into readable cues (≤ 10 words), timed by word share.
function splitSegment({ start, end, text }) {
  const sentences = text.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
  const chunks = [];
  for (const s of sentences) {
    const words = s.split(/\s+/);
    const n = Math.ceil(words.length / 10), size = Math.ceil(words.length / n);
    for (let i = 0; i < words.length; i += size) chunks.push(words.slice(i, i + size).join(' '));
  }
  const total = chunks.reduce((n, c) => n + c.split(/\s+/).length, 0);
  let t = start;
  return chunks.map((c) => {
    const d = ((end - start) * c.split(/\s+/).length) / total;
    const cue = { start: t, end: t + d, text: c };
    t += d;
    return cue;
  });
}
function paragraphs(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [text];
  const out = [];
  for (let i = 0; i < sentences.length; i += 4) out.push(sentences.slice(i, i + 4).join(' '));
  return out;
}
