import { CASINO } from "./contracts";

export const supportChainIds = [137, 80001, 1337];

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
    testNet: true,
    nativeMinScale: 1,
    contracts: {
      Casino: {
        address: "0xD8b07B81b127F649402d4ACaB23b881e466dE881",
        abi: CASINO.abi,
      },
    },
  },
  // 5: {
  //   info: {
  //     name: "Goerli",
  //     title: "Ethereum Testnet Goerli",
  //     chain: "ETH",
  //     icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
  //     nativeCurrency: { name: "Goerli Ether", symbol: "ETH", decimals: 18 },
  //     shortName: "gor",
  //     chainId: 5,
  //     networkId: 5,
  //     rpc: ["https://goerli.infura.io/v3/"],
  //     infoURL: "https://goerli.net/#about",
  //     explorers: [
  //       {
  //         name: "etherscan-goerli",
  //         url: "https://goerli.etherscan.io",
  //         standard: "EIP3091",
  //       },
  //     ],
  //   },
  //   contracts: {
  //     Casino: {
  //       address: "0x9D234F00B143AE3566570C09015815218DE0DEc5",
  //       abi: CASINO.abi,
  //     },
  //   },
  // },
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
    local: false,
    testNet: true,
    nativeMinScale: 0.01,
    contracts: {
      Casino: {
        address: "0x8eac226eCadA790A7B7e03E8187c805bdeAE1e71",
        abi: CASINO.abi,
      },
    },
  },
  137: {
    info: {
      name: "Polygon Mainnet",
      chain: "Polygon",
      icon: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
      rpc: [
        "https://polygon-rpc.com/",
        "https://rpc-mainnet.matic.network",
        "https://matic-mainnet.chainstacklabs.com",
        "https://rpc-mainnet.maticvigil.com",
        "https://rpc-mainnet.matic.quiknode.pro",
        "https://matic-mainnet-full-rpc.bwarelabs.com",
        "https://polygon-bor.publicnode.com",
      ],
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      infoURL: "https://polygon.technology/",
      shortName: "matic",
      chainId: 137,
      networkId: 137,
      explorers: [
        {
          name: "polygonscan",
          url: "https://polygonscan.com",
          standard: "EIP3091",
        },
      ],
    },
    local: false,
    testNet: false,
    nativeMinScale: 1,
    contracts: {
      Casino: {
        address: "0xbB851Ddf38EE7Dd30737EbD5A30EAd463E508d3C",
        abi: CASINO.abi,
      },
    },
  },
};
