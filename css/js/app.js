import { renderRoute } from "./router.js";
import { connectWallet, getChainId, isCronos, switchToCronos, shorten, state } from "./web3.js";
import { CRONOS } from "./config.js";

const contentEl = document.getElementById("content");
const connectBtn = document.getElementById("connectBtn");
const switchBtn = document.getElementById("switchBtn");
const netLabel = document.getElementById("netLabel");
const walletLabel = document.getElementById("walletLabel");
const toastEl = document.getElementById("toast");

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.style.display = "block";
  setTimeout(() => (toastEl.style.display = "none"), 3400);
}

function setActive(route) {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.route === route);
  });
}

function render(route) {
  setActive(route);
  renderRoute(route, { contentEl, toast });
}

function updateHeader() {
  netLabel.textContent = state.chainId
    ? (isCronos(state.chainId) ? CRONOS.chainName : `Chain ${state.chainId}`)
    : "—";

  walletLabel.textContent = state.address ? shorten(state.address) : "—";

  if (typeof window.ethereum !== "undefined" && state.chainId && !isCronos(state.chainId)) {
    switchBtn.classList.remove("hidden");
  } else {
    switchBtn.classList.add("hidden");
  }

  if (state.address) {
    connectBtn.textContent = "CONNECTED";
    connectBtn.style.background = "#1A3C28";
    connectBtn.style.color = "#D4AF37";
  } else {
    connectBtn.textContent = "Initialize Wallet";
    connectBtn.removeAttribute("style");
  }
}

// nav clicks
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => render(btn.dataset.route));
});

// connect
connectBtn.addEventListener("click", async () => {
  try {
    const chainId = await getChainId();
    state.chainId = chainId;

    if (chainId && !isCronos(chainId)) {
      toast("Wrong network. Click “Switch to Cronos”.");
      updateHeader();
      return;
    }

    const res = await connectWallet();
    state.chainId = res.chainId;

    updateHeader();
    toast("Wallet connected.");

    const active = document.querySelector(".nav-item.active")?.dataset.route || "terminal";
    render(active);
  } catch (e) {
    toast(e?.message || "Wallet connect failed.");
  }
});

switchBtn.addEventListener("click", async () => {
  try {
    await switchToCronos();
    state.chainId = await getChainId();
    updateHeader();
    toast("Switched to Cronos.");
  } catch (e) {
    toast(e?.message || "Network switch failed.");
  }
});

// wallet events
if (typeof window.ethereum !== "undefined") {
  window.ethereum.on("chainChanged", async () => {
    state.chainId = await getChainId();
    updateHeader();
    const active = document.querySelector(".nav-item.active")?.dataset.route || "terminal";
    render(active);
  });

  window.ethereum.on("accountsChanged", async (accounts) => {
    state.address = accounts?.[0] || null;
    updateHeader();
    const active = document.querySelector(".nav-item.active")?.dataset.route || "terminal";
    render(active);
  });
}

// initial render
(async function init() {
  state.chainId = await getChainId();
  updateHeader();
  render("terminal");
})();
