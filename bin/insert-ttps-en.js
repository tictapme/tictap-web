const fs = require('fs');
const filePath = 'C:/Users/alexl/bretenbits-webs/tictap-web/astro/legacy-sources/en/index.html';
let html = fs.readFileSync(filePath, 'utf8');

const anchor = 'data-id="37be582"';
const anchorPos = html.indexOf(anchor);
if (anchorPos === -1) { console.log('anchor 37be582 not found'); process.exit(1); }
const insertPos = html.lastIndexOf('<div', anchorPos);
console.log('Inserting before pos:', insertPos);

const ttps = `
<style id="tt-ps-css">
  /* ─── TicTAP · Problem/Solution V2 (prefix .tt-ps) ─── */
  .tt-ps {
    --tt-brand:        #00B0FF;
    --tt-brand-dark:   #0096d9;
    --tt-brand-darker: #007bb3;
    --tt-brand-light:  #D9F3FF;
    --tt-coral:        #E0556B;
    --tt-ink:          #2a2a2a;
    --tt-ink-2:        #484848;
    --tt-ink-3:        #737373;
    --tt-line-soft:    #EDEDED;
    --tt-radius:       20px;
    --tt-f-display:    'Varela Round', system-ui, sans-serif;
    --tt-f-body:       'Lato', system-ui, sans-serif;
    width: 100%;
    padding: 88px 56px;
    background: #fbfaf7;
    font-family: var(--tt-f-body);
    color: var(--tt-ink-2);
    box-sizing: border-box;
  }
  .tt-ps *, .tt-ps *::before, .tt-ps *::after { box-sizing: border-box; }
  .tt-ps__inner { max-width: 1200px; margin: 0 auto; }
  .tt-ps__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: stretch; }
  .tt-ps__panel { border-radius: var(--tt-radius); display: flex; flex-direction: column; min-height: 720px; position: relative; overflow: hidden; padding: 52px 44px; }
  .tt-ps__panel--problem { background: linear-gradient(155deg, #ffffff 0%, #fafafa 100%); color: var(--tt-ink); border: 1px solid var(--tt-line-soft); border-top: 3px solid var(--tt-coral); box-shadow: 0 30px 60px -30px rgba(60,40,40,.15); }
  .tt-ps__panel--solution { background: linear-gradient(155deg, #00B0FF 0%, #0096d9 100%); color: #fff; border-top: 3px solid #ffffff; box-shadow: 0 30px 60px -20px rgba(0,120,180,.4); }
  .tt-ps__panel--solution::before { content: ""; position: absolute; top: -200px; right: -200px; width: 520px; height: 520px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 65%); pointer-events: none; }
  .tt-ps__ribbon { margin: -52px -44px 32px; padding: 12px 44px; display: flex; align-items: center; gap: 10px; font-family: var(--tt-f-body); font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; position: relative; }
  .tt-ps__ribbon--coral { background: var(--tt-coral); color: #fff; }
  .tt-ps__ribbon--white { background: #ffffff; color: var(--tt-brand-darker); }
  .tt-ps__ribbon-icon { width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 900; letter-spacing: 0; }
  .tt-ps__ribbon--coral .tt-ps__ribbon-icon { background: rgba(255,255,255,.22); color: #fff; }
  .tt-ps__ribbon--white .tt-ps__ribbon-icon { background: var(--tt-brand-light); color: var(--tt-brand-darker); font-size: 11px; }
  .tt-ps__h3 { font-family: var(--tt-f-display); font-size: 32px; font-weight: 400; letter-spacing: -0.015em; line-height: 1.12; margin: 0 0 16px; position: relative; }
  .tt-ps__panel--solution .tt-ps__h3 { color: #fff; }
  .tt-ps__h3 em { font-style: normal; color: var(--tt-brand); font-weight: 400; }
  .tt-ps__panel--solution .tt-ps__h3 em { color: #fff; font-weight: 700; }
  .tt-ps__copy { font-size: 16px; line-height: 1.6; margin: 0 0 32px; max-width: 480px; position: relative; }
  .tt-ps__panel--problem .tt-ps__copy { color: var(--tt-ink-2); }
  .tt-ps__panel--solution .tt-ps__copy { color: rgba(255,255,255,.88); }
  .tt-ps__viz { margin: 0 -8px 32px; position: relative; }
  .tt-ps__viz svg { display: block; width: 100%; height: auto; }
  .tt-ps__viz--solution svg { max-width: 526px; margin: 0 auto; }
  .tt-ps__bullets { list-style: none; margin: auto 0 0; padding: 0; display: flex; flex-direction: column; gap: 12px; position: relative; }
  .tt-ps__bullets li { display: flex; align-items: flex-start; gap: 12px; font-size: 15px; line-height: 1.5; }
  .tt-ps__bullets-mark { flex: 0 0 auto; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 700; margin-top: 1px; }
  .tt-ps__panel--problem .tt-ps__bullets li { color: var(--tt-ink-2); }
  .tt-ps__panel--problem .tt-ps__bullets-mark { background: #fbe6e6; color: #b8404a; }
  .tt-ps__panel--solution .tt-ps__bullets li { color: rgba(255,255,255,.88); }
  .tt-ps__panel--solution .tt-ps__bullets-mark { background: #ffffff; color: var(--tt-brand-darker); }
  .tt-ps__bullets b { color: var(--tt-ink); }
  .tt-ps__panel--solution .tt-ps__bullets b { color: #fff; }
  .tt-ps__cta { text-align: center; margin-top: 52px; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
  .tt-ps__btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 24px; border-radius: 999px; font-family: var(--tt-f-body); font-weight: 700; font-size: 15px; text-decoration: none; cursor: pointer; border: 0; transition: background .15s, color .15s; }
  .tt-ps__btn--primary { background: var(--tt-brand); color: #fff; }
  .tt-ps__btn--primary:hover { background: var(--tt-brand-dark); }
  .tt-ps__btn--ghost { background: transparent; color: var(--tt-ink); border: 1.5px solid var(--tt-ink); }
  .tt-ps__btn--ghost:hover { background: var(--tt-ink); color: #fff; }
  @media (max-width: 900px) {
    .tt-ps { padding: 56px 24px; }
    .tt-ps__grid { grid-template-columns: 1fr; gap: 20px; }
    .tt-ps__title { font-size: 34px; }
    .tt-ps__panel { padding: 40px 28px; min-height: 0; }
    .tt-ps__ribbon { margin: -40px -28px 24px; padding: 12px 28px; }
    .tt-ps__h3 { font-size: 26px; }
  }
</style>

<section class="tt-ps">
  <div class="tt-ps__inner">
    <div class="tt-ps__grid">

      <!-- PROBLEM PANEL -->
      <article class="tt-ps__panel tt-ps__panel--problem">
        <div class="tt-ps__ribbon tt-ps__ribbon--coral">
          <span class="tt-ps__ribbon-icon">×</span>
          The problem
        </div>
        <h3 class="tt-ps__h3">Industrial operations live in silos</h3>
        <p class="tt-ps__copy">
          Assets in a spreadsheet, maintenance logs somewhere else, manuals in a drawer, and the «how does this work» only in one technician's head. Every system runs alone and every decision costs a phone call.
        </p>
        <div class="tt-ps__viz">
          <svg viewBox="0 0 620 400" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#00b0ff" stroke-width="1.5" fill="none" stroke-dasharray="2 9" opacity="1">
              <path d="M 120 100 Q 220 30 280 70" />
              <path d="M 340 80 Q 420 40 490 110" />
              <path d="M 130 250 Q 220 240 310 290" />
              <path d="M 370 300 Q 460 320 520 310" />
              <path d="M 90 120 Q 70 200 100 250" />
            </g>
            <g stroke="#E0556B" stroke-width="2.25" stroke-linecap="round">
              <g transform="translate(215,55)"><line x1="-5" y1="-5" x2="5" y2="5"/><line x1="-5" y1="5" x2="5" y2="-5"/></g>
              <g transform="translate(450,72)"><line x1="-5" y1="-5" x2="5" y2="5"/><line x1="-5" y1="5" x2="5" y2="-5"/></g>
              <g transform="translate(430,312)"><line x1="-5" y1="-5" x2="5" y2="5"/><line x1="-5" y1="5" x2="5" y2="-5"/></g>
            </g>
            <g font-family="Lato, sans-serif">
              <g transform="translate(80,70)">
                <circle r="40" fill="#F2F2F2" stroke="#D9D9D9" stroke-width="1" />
                <circle r="19" fill="#3b8a5a" />
                <text y="5" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">XLS</text>
                <text y="64" text-anchor="middle" font-size="15" font-weight="700" fill="#484848">Excel</text>
              </g>
              <g transform="translate(310,50)">
                <circle r="40" fill="#F2F2F2" stroke="#D9D9D9" stroke-width="1" />
                <circle r="19" fill="#6a737d" />
                <text y="5" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">☎</text>
                <text y="64" text-anchor="middle" font-size="15" font-weight="700" fill="#484848">WhatsApp</text>
              </g>
              <g transform="translate(510,110)">
                <circle r="40" fill="#F2F2F2" stroke="#D9D9D9" stroke-width="1" />
                <circle r="19" fill="#c9583a" />
                <text y="5" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">PDF</text>
                <text y="64" text-anchor="middle" font-size="15" font-weight="700" fill="#484848">PDF</text>
              </g>
              <g transform="translate(100,250)">
                <circle r="40" fill="#F2F2F2" stroke="#D9D9D9" stroke-width="1" />
                <circle r="19" fill="#c6a151" />
                <text y="5" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">◈</text>
                <text y="64" text-anchor="middle" font-size="15" font-weight="700" fill="#484848">Paper</text>
              </g>
              <g transform="translate(340,290)">
                <circle r="40" fill="#F2F2F2" stroke="#D9D9D9" stroke-width="1" />
                <circle r="19" fill="#6a737d" />
                <text y="5" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">@</text>
                <text y="64" text-anchor="middle" font-size="15" font-weight="700" fill="#484848">Email</text>
              </g>
              <g transform="translate(530,310)">
                <circle r="40" fill="#F2F2F2" stroke="#D9D9D9" stroke-width="1" />
                <circle r="19" fill="#8a6bb3" />
                <text y="5" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">?</text>
                <text y="64" text-anchor="middle" font-size="15" font-weight="700" fill="#484848">«Pete knows»</text>
              </g>
            </g>
          </svg>
        </div>
        <ul class="tt-ps__bullets">
          <li><span class="tt-ps__bullets-mark">×</span><span>Documentation scattered across Excel, PDF, WhatsApp and paper.</span></li>
          <li><span class="tt-ps__bullets-mark">×</span><span>Zero traceability: every inspection depends on who did it last.</span></li>
          <li><span class="tt-ps__bullets-mark">×</span><span>Last-minute audits that sometimes don't pass.</span></li>
        </ul>
      </article>

      <!-- SOLUTION PANEL -->
      <article class="tt-ps__panel tt-ps__panel--solution">
        <div class="tt-ps__ribbon tt-ps__ribbon--white">
          <span class="tt-ps__ribbon-icon">✓</span>
          The solution
        </div>
        <h3 class="tt-ps__h3">TicTAP connects everything <em>with one tap</em></h3>
        <p class="tt-ps__copy">
          One NFC tag the size of a coin on each asset. Hold your phone up to it and everything you need — history, manuals, next work order — appears on screen.
        </p>
        <div class="tt-ps__viz tt-ps__viz--solution">
          <svg viewBox="0 0 620 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="tt-ps-grad-hub" cx="30%" cy="25%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="100%" stop-color="#e0f4ff" />
              </radialGradient>
              <radialGradient id="tt-ps-grad-halo" cx="50%" cy="50%">
                <stop offset="0%"   stop-color="#ffffff" stop-opacity=".22" />
                <stop offset="60%"  stop-color="#ffffff" stop-opacity=".05" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
              </radialGradient>
            </defs>
            <circle cx="310" cy="200" r="200" fill="url(#tt-ps-grad-halo)" />
            <g fill="none" stroke="#ffffff" stroke-width="1">
              <circle cx="310" cy="200" r="95"  opacity=".35" />
              <circle cx="310" cy="200" r="150" opacity=".22" />
              <circle cx="310" cy="200" r="195" opacity=".12" />
            </g>
            <g stroke="#ffffff" stroke-width="1.5" opacity=".55">
              <line x1="310" y1="200" x2="167" y2="118" />
              <line x1="310" y1="200" x2="310" y2="45"  />
              <line x1="310" y1="200" x2="453" y2="118" />
              <line x1="310" y1="200" x2="453" y2="282" />
              <line x1="310" y1="200" x2="310" y2="360" />
              <line x1="310" y1="200" x2="163" y2="285" />
            </g>
            <g transform="translate(310,200)" font-family="Lato, sans-serif">
              <circle r="62" fill="url(#tt-ps-grad-hub)" />
              <circle r="62" fill="none" stroke="#ffffff" stroke-width="2" />
              <text y="-3" text-anchor="middle" font-family="Varela Round, sans-serif" font-size="22" fill="#007bb3">TicTAP</text>
              <text y="17" text-anchor="middle" font-size="9.5" fill="#0096d9" opacity=".95" letter-spacing="1.4" font-weight="700">ONE TAP</text>
            </g>
            <g font-family="Lato, sans-serif">
              <g transform="translate(167,118)">
                <circle r="30" fill="#fff" />
                <circle r="13" fill="#5a6470" opacity=".9" />
                <text y="5"  text-anchor="middle" font-size="15" font-weight="700" fill="#fff">⚙</text>
                <text y="52" text-anchor="middle" font-size="15" font-weight="700" fill="#ffffff">Assets</text>
              </g>
              <g transform="translate(310,45)">
                <circle r="30" fill="#fff" />
                <circle r="13" fill="#2aa45a" opacity=".9" />
                <text y="5"  text-anchor="middle" font-size="15" font-weight="700" fill="#fff">✓</text>
                <text y="52" text-anchor="middle" font-size="15" font-weight="700" fill="#ffffff">Work orders</text>
              </g>
              <g transform="translate(453,118)">
                <circle r="30" fill="#fff" />
                <circle r="13" fill="#8a6bb3" opacity=".9" />
                <text y="5"  text-anchor="middle" font-size="15" font-weight="700" fill="#fff">#</text>
                <text y="52" text-anchor="middle" font-size="15" font-weight="700" fill="#ffffff">Inventory</text>
              </g>
              <g transform="translate(453,282)">
                <circle r="30" fill="#fff" />
                <circle r="13" fill="#2aa45a" opacity=".9" />
                <text y="5"  text-anchor="middle" font-size="15" font-weight="700" fill="#fff">✓</text>
                <text y="52" text-anchor="middle" font-size="15" font-weight="700" fill="#ffffff">Audits</text>
              </g>
              <g transform="translate(310,360)">
                <circle r="30" fill="#fff" />
                <circle r="13" fill="#c6a151" opacity=".9" />
                <text y="5"  text-anchor="middle" font-size="15" font-weight="700" fill="#fff">◐</text>
                <text y="52" text-anchor="middle" font-size="15" font-weight="700" fill="#ffffff">Field team</text>
              </g>
              <g transform="translate(163,285)">
                <circle r="30" fill="#fff" />
                <circle r="13" fill="#5a6470" opacity=".9" />
                <text y="5"  text-anchor="middle" font-size="15" font-weight="700" fill="#fff">⏱</text>
                <text y="52" text-anchor="middle" font-size="15" font-weight="700" fill="#ffffff">History</text>
              </g>
            </g>
          </svg>
        </div>
        <ul class="tt-ps__bullets">
          <li><span class="tt-ps__bullets-mark">✓</span><span><b>One single source of truth</b> for assets, work orders and inventory.</span></li>
          <li><span class="tt-ps__bullets-mark">✓</span><span><b>Native traceability:</b> every tap leaves an automatic record.</span></li>
          <li><span class="tt-ps__bullets-mark">✓</span><span><b>Ready from any technician's phone,</b> no training needed.</span></li>
        </ul>
      </article>

    </div>

    <div class="tt-ps__cta">
      <a href="/en/free-demo-tictap-industry/" class="tt-ps__btn tt-ps__btn--primary">Book a demo</a>
      <a href="/en/sucess-stories/" class="tt-ps__btn tt-ps__btn--ghost">See success stories →</a>
    </div>

  </div>
</section>

`;

html = html.slice(0, insertPos) + ttps + html.slice(insertPos);
fs.writeFileSync(filePath, html);
console.log('Done. tt-ps section inserted before data-id="37be582".');
