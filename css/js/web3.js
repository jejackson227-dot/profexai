import { CRONOS } from "./config.js";

export const state = {
  provider: null,
  signer: null,
  address: null,
  chainId: null,
};

export function hasWallet() {
  return typeof window.ethereum !== "undefined";
}

export async function connectWallet() {
  if (!hasWallet()) throw new Error("No wallet detected. Install MetaMask.");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  state.provider = new ethers.providers.Web3Provider(window.ethereum);
  state.signer = state.provider.getSigner();
  state.address = await state.signer.getAddress();
  const net = await state.provider.getNetwork();
  state.chainId = net.chainId;
  return { address: state.address, chainId: state.chainId };
}

export async function getChainId() {
  if (!hasWallet()) return null;
  const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
  return parseInt(chainIdHex, 16);
}

export function isCronos(chainId) {
  return chainId === CRONOS.chainIdDec;
}

export async function switchToCronos() {
  if (!hasWallet()) throw new Error("No wallet detected.");
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CRONOS.chainIdHex }],
    });
  } catch (e) {
    if (e?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: CRONOS.chainIdHex,
          chainName: CRONOS.chainName,
          rpcUrls: CRONOS.rpcUrls,
          nativeCurrency: { name: "Cronos", symbol: CRONOS.nativeSymbol, decimals: 18 },
          blockExplorerUrls: CRONOS.blockExplorerUrls,
        }],
      });
    } else {
      throw e;
    }
  }
}

export function shorten(addr) {
  if (!addr) return "—";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}
