// Renders the 1200x630 Open Graph image from the chosen logo on the dark night-road background.
// Usage: node scripts/og.mjs   (needs Playwright + Chromium available)
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const logo = readFileSync('public/img/lacaze-roadside-assistance-logo.png').toString('base64');
const inter = readFileSync('public/fonts/inter-var-latin.woff2').toString('base64');
const html = `<!doctype html><html><head><style>
@font-face{font-family:Inter;src:url(data:font/woff2;base64,${inter}) format('woff2');font-weight:100 900}
html,body{margin:0;width:1200px;height:630px;background:#0B0D0E;font-family:Inter;color:#F4F6F5;overflow:hidden}
.bg{position:absolute;inset:0;background:radial-gradient(60% 70% at 78% 105%,rgba(132,226,62,.22),transparent 60%),linear-gradient(180deg,#060708,#0E1213)}
.road{position:absolute;left:560px;bottom:0;width:800px;height:300px;clip-path:polygon(49.6% 0,50.4% 0,100% 100%,0 100%);background:linear-gradient(#0E1112,#1A1F21)}
.lane{position:absolute;left:957px;bottom:0;width:6px;height:300px;-webkit-mask-image:linear-gradient(transparent,#000);background:repeating-linear-gradient(0deg,rgba(244,246,245,.8) 0 34px,transparent 34px 64px);clip-path:polygon(45% 0,55% 0,100% 100%,0 100%)}
.in{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column}
img{width:560px;height:auto}
h1{font-size:60px;line-height:1.04;letter-spacing:-2.4px;font-weight:900;margin:48px 0 20px;max-width:760px}
p{margin:0;font-size:26px;font-weight:600;color:#C8CED1}
.ph{margin-top:auto;display:inline-flex;align-items:center;gap:14px;background:linear-gradient(135deg,#84E23E,#34AA3C);color:#071006;font-weight:800;font-size:30px;border-radius:999px;padding:16px 30px;width:fit-content;box-shadow:0 10px 40px -10px rgba(132,226,62,.8)}
.edge{position:absolute;left:560px;bottom:0;width:800px;height:300px;background:rgba(132,226,62,.5);clip-path:polygon(49.9% 0,50.1% 0,97% 100%,96.4% 100%,50% 1%,3.6% 100%,3% 100%)}.glow{position:absolute;left:930px;top:310px;width:60px;height:30px;border-radius:50%;background:radial-gradient(#F4FFE9,rgba(132,226,62,.4) 40%,transparent 70%)}</style></head><body><div class="bg"></div><div class="road"></div><div class="edge"></div><div class="lane"></div><div class="glow"></div>
<div class="in"><img src="data:image/png;base64,${logo}"><h1>24/7 Roadside Assistance in Spring &amp; North Houston</h1><p>Jump starts · Lockouts · Fuel delivery · No membership</p><span class="ph">Call (832) 949-4837</span></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.screenshot({ path: resolve('public/img/og-lacaze-roadside-assistance.jpg'), type: 'jpeg', quality: 88 });
await browser.close();
console.log('og image written');
