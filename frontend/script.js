const eventStream = document.getElementById("eventStream");
const watchlistEl = document.getElementById("watchlist");
const fileInput = document.getElementById("fileInput");
const whatIfText = document.getElementById("whatIfText");
const confidenceText = document.getElementById("confidenceText");
const creditScoreEl = document.getElementById("creditScore");
const creditLabelEl = document.getElementById("creditLabel");

let riskHistory = [20, 25, 30, 35, 40];
let creditScore = 30;
let watchlist = new Map();

const ctx = document.getElementById("riskChart").getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["T-4", "T-3", "T-2", "T-1", "Now"],
    datasets: [{
      label: "Portfolio Risk",
      data: riskHistory,
      fill: true,
      borderWidth: 2,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { min: 0, max: 100 } }
  }
});

function addEvent(text) {
  const div = document.createElement("div");
  div.className = "bg-white/10 p-3 rounded";
  div.textContent = text;
  eventStream.prepend(div);
}

function updateWatchlist(company) {
  watchlist.set(company, (watchlist.get(company) || 0) + 1);

  watchlistEl.innerHTML = "";
  watchlist.forEach((count, name) => {
    if (count >= 2) {
      const li = document.createElement("li");
      li.textContent = `${name} — Sustained Risk`;
      watchlistEl.appendChild(li);
    }
  });
}

function updateWhatIf(type) {
  if (type === "cost") {
    whatIfText.textContent =
      "If operating costs rise by 5%, downside risk intensifies.";
  } else if (type === "fraud") {
    whatIfText.textContent =
      "If transaction spikes persist, fraud exposure increases.";
  } else {
    whatIfText.textContent =
      "Liquidity stress may lead to refinancing risk.";
  }
  confidenceText.textContent = "Confidence: Medium";
}

function updateCreditScore(delta) {
  creditScore = Math.min(100, creditScore + delta);
  creditScoreEl.textContent = creditScore;

  creditLabelEl.textContent =
    creditScore < 40 ? "Low credit stress"
    : creditScore < 70 ? "Moderate credit stress"
    : "High credit stress";
}

fileInput.addEventListener("change", () => {
  const company = "XYZ Ltd";

  addEvent("EARNINGS UPDATE — Sentiment turned cautious");
  addEvent("PORTFOLIO HYPOTHESIS — Logistics cost pressure");
  addEvent("CREDIT RISK — Liquidity stress detected for " + company);

  updateWatchlist(company);

  riskHistory.push(riskHistory[riskHistory.length - 1] + 10);
  riskHistory.shift();
  chart.data.datasets[0].data = riskHistory;
  chart.update();

  updateWhatIf("cost");
  updateCreditScore(15);
});
