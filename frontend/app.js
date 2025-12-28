/* ---------- DOM ---------- */
const feed = document.getElementById("feed");
const watchlist = document.getElementById("watchlist");
const marketText = document.getElementById("marketText");
const creditValueText = document.getElementById("creditValue");

/* ---------- STATE ---------- */
let portfolioRisk = 55;
let creditRisk = 62;
let companiesAtRisk = new Set();

/* ---------- HELPERS ---------- */
function addFeed(text) {
  const div = document.createElement("div");
  div.className = "glass rounded-lg p-2";
  div.textContent = text;
  feed.prepend(div);
  if (feed.children.length > 6) feed.removeChild(feed.lastChild);
}

function updateWatchlist() {
  watchlist.innerHTML = "";
  companiesAtRisk.forEach(c => {
    const li = document.createElement("li");
    li.textContent = "• " + c;
    watchlist.appendChild(li);
  });
}

/* ---------- CHARTS ---------- */
const signalChart = new Chart(
  document.getElementById("signalChart"), {
    type: "line",
    data: {
      labels: ["T-4","T-3","T-2","T-1","Now"],
      datasets: [{
        data: [40,45,50,52,portfolioRisk],
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.25)",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      plugins:{legend:{display:false}},
      scales:{y:{min:0,max:100}}
    }
  }
);

const creditChart = new Chart(
  document.getElementById("creditChart"), {
    type: "doughnut",
    data: {
      datasets:[{
        data:[creditRisk,100-creditRisk],
        backgroundColor:["#ef4444","rgba(255,255,255,0.1)"],
        borderWidth:0
      }]
    },
    options:{cutout:"75%",plugins:{legend:{display:false}}}
  }
);

const creditTrend = new Chart(
  document.getElementById("creditTrend"), {
    type:"line",
    data:{
      labels:["-4","-3","-2","-1","Now"],
      datasets:[{
        data:[45,50,55,58,creditRisk],
        borderColor:"#f87171",
        tension:0.4
      }]
    },
    options:{
      plugins:{legend:{display:false}},
      scales:{y:{min:0,max:100}}
    }
  }
);

/* ---------- CORE AGENT LOGIC ---------- */
function processLiveEvent(type) {

  if (type === "earnings") {
    addFeed("Earnings sentiment turned cautious");
    portfolioRisk += 4;
    companiesAtRisk.add("ABC Corp — Margin Pressure");
    marketText.textContent = "Earnings-driven downside pressure detected";
  }

  if (type === "transactions") {
    addFeed("Fraud alert: Transaction spike detected");
    portfolioRisk += 6;
    companiesAtRisk.add("LMN Inc — Cost Volatility");
    marketText.textContent = "Transaction anomalies impacting portfolio risk";
  }

  if (type === "credit") {
    addFeed("Liquidity stress keyword detected");
    creditRisk += 7;
    companiesAtRisk.add("XYZ Ltd — Liquidity Risk");
    marketText.textContent = "Liquidity stress spreading across companies";
  }

  /* clamp */
  portfolioRisk = Math.min(95, portfolioRisk);
  creditRisk = Math.min(95, creditRisk);

  /* update charts */
  signalChart.data.datasets[0].data.shift();
  signalChart.data.datasets[0].data.push(portfolioRisk);
  signalChart.update();

  creditChart.data.datasets[0].data = [creditRisk,100-creditRisk];
  creditChart.update();

  creditTrend.data.datasets[0].data.shift();
  creditTrend.data.datasets[0].data.push(creditRisk);
  creditTrend.update();

  creditValueText.textContent = creditRisk;
  updateWatchlist();
}

/* ---------- FILE UPLOAD ---------- */
function handleFileUpload(e) {
  const name = e.target.files[0]?.name || "";

  if (name.includes("earn")) processLiveEvent("earnings");
  else if (name.includes("tran")) processLiveEvent("transactions");
  else processLiveEvent("credit");

  e.target.value = "";
}

/* ---------- INITIAL LIVE STATE ---------- */
addFeed("Agent initialized with live market state");
companiesAtRisk.add("ABC Corp — Margin Pressure");
updateWatchlist();
marketText.textContent = "Baseline portfolio risk established";

/* ---------- AUTONOMOUS LOOP ---------- */
setInterval(() => {
  const types = ["earnings","transactions","credit"];
  processLiveEvent(types[Math.floor(Math.random()*3)]);
}, 6000);
