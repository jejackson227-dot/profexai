import { CONTRACTS, CRONOS } from "./config.js";
import { state, isCronos } from "./web3.js";

function mountTradingView() {
  const el = document.getElementById("chart-container");
  if (!el) return;
  el.innerHTML = "";

  new TradingView.widget({
    autosize: true,
    symbol: "COINBASE:CROUSD",
    interval: "60",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    enable_publishing: false,
    container_id: "chart-container",
    overrides: {
      "paneProperties.background": "#0F1115",
      "mainSeriesProperties.candleStyle.upColor": "#D4AF37",
      "mainSeriesProperties.candleStyle.downColor": "#1A3C28"
    }
  });
}

export function renderTerminal(ctx) {
  const { contentEl, toast } = ctx;

  contentEl.innerHTML = `
    <div class="grid">
      <div class="panel">
        <div class="panel-head">LIVE MARKET DATA</div>
        <div class="panel-body" style="padding:0;">
          <div id="chart-container" style="height:100%; min-height:520px;"></div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">ORDER ENTRY</div>
        <div class="panel-body">
          <div class="badge">
            <i class="fa-solid fa-circle-info"></i>
            <span id="modeLabel">Mode: Buy (CRO → PFXAI)</span>
          </div>

          <div style="height:12px"></div>

          <div class="input-box">
            <div class="input-label">PAYING (${CRONOS.nativeSymbol})</div>
            <input type="number" id="payAmount" placeholder="0.00" inputmode="decimal" />
          </div>

          <div style="text-align:center; color: var(--gold-primary); margin: 6px 0;">
            <i class="fa-solid fa-arrow-down"></i>
          </div>

          <div class="input-box gold-border">
            <div class="input-label">RECEIVING (PFXAI)</div>
            <input type="text" id="receiveAmount" readonly placeholder="0.00" />
          </div>

          <div class="row">
            <span class="badge"><i class="fa-solid fa-shield"></i><span id="netReq">Requires: Cronos</span></span>
            <span class="badge"><i class="fa-solid fa-wallet"></i><span id="walletReq">Wallet: Not connected</span></span>
          </div>

          <button class="primary-btn" id="executeBtn">EXECUTE</button>
          <div id="status" class="muted small" style="margin-top:10px; text-align:center;"></div>
        </div>
      </div>
    </div>
  `;

  mountTradingView();

  const pay = document.getElementById("payAmount");
  const recv = document.getElementById("receiveAmount");
  const status = document.getElementById("status");
  const execBtn = document.getElementById("executeBtn");
  const walletReq = document.getElementById("walletReq");

  if (state.address) walletReq.textContent = `Wallet: ${state.address.slice(0,6)}...${state.address.slice(-4)}`;

  pay.addEventListener("input", () => {
    const val = parseFloat(pay.value || "0");
    if (!val) return (recv.value = "");
    const rate = CONTRACTS.buyContract.fixedRate;
    recv.value = (val * rate).toFixed(2);
  });

  execBtn.addEventListener("click", async () => {
    try {
      status.textContent = "";
      const amount = pay.value;
      if (!amount) throw new Error("Enter an amount.");
      if (!state.signer || !state.provider) throw new Error("Connect your wallet first.");
      if (!isCronos(state.chainId)) throw new Error("Wrong network. Switch to Cronos.");

      status.textContent = "Processing transaction…";

      const c = new ethers.Contract(
        CONTRACTS.buyContract.address,
        CONTRACTS.buyContract.abi,
        state.signer
      );

      const tx = await c.trade({ value: ethers.utils.parseEther(amount) });
      status.textContent = `Submitted: ${tx.hash.slice(0,10)}…`;
      await tx.wait();

      status.textContent = "✅ Success";
      toast("✅ Buy complete.");
      pay.value = "";
      recv.value = "";
    } catch (e) {
      status.textContent = "❌ Failed";
      toast(e?.message || "Transaction failed.");
    }
  });
}
