import { CASINO } from "./contracts";

export const chains = {
  1337: {
    name: "ganache",
    contracts: {
      Casino: {
        address: "0x0Fa71a9Ba8dD2838A26f0290AC79251B1929890d",
        abi: CASINO.abi,
      },
    },
  },
  5: {
    name: "goerli",
    contracts: {
      Casino: {
        address: "0x4F2c8A3a13675EecE8B08796284Ea184836cE068",
        abi: CASINO.abi,
      },
    },
  },
  80001: {
    name: "mumbai",
    contracts: {
      Casino: {
        address: "0x8453e76c1875DBc48B7f9ced3d9F2c84F0b59a0a",
        abi: CASINO.abi,
      },
    },
  },

  //   1: {
  //     name: "ethereum",
  //     rpcUrl: "https://mainnet.infura.io/v3/5fea7bd2205245578c0e4d4cc5c8abc9",
  //   },
  //   137: {
  //     name: "polygon",
  //     rpcUrl:
  //       "https://polygon-mainnet.infura.io/v3/5fea7bd2205245578c0e4d4cc5c8abc9",
  //   },
};
