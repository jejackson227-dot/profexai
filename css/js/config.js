export const APP = {
  name: "PROFEXAI Institutional",
};

export const CRONOS = {
  chainIdHex: "0x19",              // 25
  chainIdDec: 25,
  chainName: "Cronos Mainnet",
  nativeSymbol: "CRO",
  rpcUrls: ["https://evm.cronos.org"],
  blockExplorerUrls: ["https://cronoscan.com"],
};

export const CONTRACTS = {
  buyContract: {
    address: "0x411061F195595f9ECBdEEA3C6B9f7F8da30e7f42",
    abi: [
      "function trade() external payable"
    ],
    fixedRate: 5.53,
  },
};
