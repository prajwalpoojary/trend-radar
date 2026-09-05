// app.js — VIEW LAYER
// Reads from data.js (REELS) + trend-engine.js (window.TrendEngine).
// No framework — this is small enough that React would be pure overhead
// for a same-night proof. The moment this needs client-side routing,
// shared state across more than this one screen, or a component that's
// reused elsewhere, that's the trigger to reach for React — not before.

function sparkline(snapshots, color) {
  const w = 90, h = 28, pad = 3;
  const values = snapshots.map((s) => s.views);
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function pillClass(status) {
  return { "new spike": "new-spike", accelerating: "accelerating", steady: "steady", cooling: "cooling" }[status] || "steady";
}

function statusColor(status) {
  return { "new spike": "#e8a33d", accelerating: "#6fbf73", steady: "#9a9cc0", cooling: "#c46a5a" }[status] || "#9a9cc0";
}

function fmt(n) {
  return Math.round(n).toLocaleString("en-IN");
}

function renderHero(top) {
  const el = document.getElementById("hero");
  el.innerHTML = `
    <div>
      <div class="label">Right now, the fastest-moving thing is</div>
      <h2>${top.creator} — "${top.caption}"</h2>
      <div class="meta">${fmt(top.totalViews)} views so far · ${top.hashtags.join(" ")}</div>
      <div class="explain">${window.TrendEngine.explainTrend(top)}</div>
    </div>
    <div class="score-badge">
      <span class="num">${top.trendScore.toFixed(1)}</span>
      <span class="cap">trend score</span>
    </div>
  `;
}

function renderStats(scored) {
  const accelerating = scored.filter((r) => r.status === "accelerating" || r.status === "new spike").length;
  const cooling = scored.filter((r) => r.status === "cooling").length;
  document.getElementById("stat-strip").innerHTML = `
    <div class="stat"><span class="n">${scored.length}</span><span class="l">reels tracked</span></div>
    <div class="stat"><span class="n">${accelerating}</span><span class="l">accelerating / new spikes</span></div>
    <div class="stat"><span class="n">${cooling}</span><span class="l">cooling off</span></div>
  `;
}

function renderList(scored, activeId, onSelect) {
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  scored.forEach((r, i) => {
    const card = document.createElement("div");
    card.className = "card" + (r.id === activeId ? " active" : "");
    card.innerHTML = `
      <div class="rank">${i + 1}</div>
      <div class="who">
        <div class="creator">${r.creator}</div>
        <div class="caption">${r.caption}</div>
      </div>
      ${sparkline(r.snapshots, statusColor(r.status))}
      <span class="pill ${pillClass(r.status)}">${r.status}</span>
    `;
    card.addEventListener("click", () => onSelect(r.id));
    list.appendChild(card);
  });
}

function renderDetail(r) {
  const el = document.getElementById("detail-panel");
  el.innerHTML = `
    <div class="detail-card">
      <div class="creator">${r.creator}</div>
      <div class="caption">"${r.caption}"</div>
      <div class="hashtags">${r.hashtags.join("  ")}</div>
      <div class="metrics">
        <div><span class="n">${fmt(r.totalViews)}</span><span class="l">total views</span></div>
        <div><span class="n">${fmt(r.latestVelocity)}</span><span class="l">views / hr now</span></div>
        <div><span class="n">${r.reachRatio.toFixed(1)}x</span><span class="l">vs followers</span></div>
      </div>
      <div class="section-label">Why it's showing up here</div>
      <div class="explain-text">${window.TrendEngine.explainTrend(r)}</div>
      <div class="section-label">Suggested next move</div>
      <div class="action-box">${window.TrendEngine.recommendAction(r)}</div>
    </div>
  `;
}

function init() {
  const scored = window.TrendEngine.rankReels(REELS);
  renderStats(scored);
  renderHero(scored[0]);
  let activeId = scored[0].id;

  function select(id) {
    activeId = id;
    renderList(scored, activeId, select);
    renderDetail(scored.find((r) => r.id === id));
  }

  renderList(scored, activeId, select);
  renderDetail(scored[0]);
}

document.addEventListener("DOMContentLoaded", init);
