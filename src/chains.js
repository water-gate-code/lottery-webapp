import { CASINO } from "./contracts";

export const supportChainIds = [80001, 5, 1337];

export const chains = {
  1337: {
    info: {
      name: "Ganache",
      title: "Ethereum Local Testnet Ganache",
      chain: "ETH",
      icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
      nativeCurrency: { name: "Ganache Ether", symbol: "ETH", decimals: 18 },
      shortName: "ganache",
      chainId: 1337,
      networkId: 1337,
      rpc: ["http://127.0.0.1:7545"],
      infoURL: "http://127.0.0.1:7545",
      explorers: [],
    },
    local: true,
    contracts: {
      Casino: {
        address: "0x0Fa71a9Ba8dD2838A26f0290AC79251B1929890d",
        abi: CASINO.abi,
      },
    },
  },
  5: {
    info: {
      name: "Goerli",
      title: "Ethereum Testnet Goerli",
      chain: "ETH",
      icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
      nativeCurrency: { name: "Goerli Ether", symbol: "ETH", decimals: 18 },
      shortName: "gor",
      chainId: 5,
      networkId: 5,
      rpc: ["https://goerli.infura.io/v3/"],
      infoURL: "https://goerli.net/#about",
      explorers: [
        {
          name: "etherscan-goerli",
          url: "https://goerli.etherscan.io",
          standard: "EIP3091",
        },
      ],
    },
    contracts: {
      Casino: {
        address: "0x4F2c8A3a13675EecE8B08796284Ea184836cE068",
        abi: CASINO.abi,
      },
    },
  },
  80001: {
    info: {
      name: "Mumbai",
      title: "Polygon Testnet Mumbai",
      chain: "Polygon",
      icon: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      shortName: "maticmum",
      chainId: 80001,
      networkId: 80001,
      rpc: ["https://endpoints.omniatech.io/v1/matic/mumbai/public"],
      infoURL: "https://polygon.technology/",
      explorers: [
        {
          name: "polygonscan",
          url: "https://mumbai.polygonscan.com",
          standard: "EIP3091",
        },
      ],
    },
    contracts: {
      Casino: {
        address: "0x8453e76c1875DBc48B7f9ced3d9F2c84F0b59a0a",
        abi: CASINO.abi,
      },
    },
  },
};
