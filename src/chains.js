import { CASINO } from "./contracts";

export const chains = {
  5: {
    name: "goerli",
    contracts: {
      Casino: {
        address: "0x4F2c8A3a13675EecE8B08796284Ea184836cE068",
        abi: CASINO.abi,
      },
    },
  },
  1337: {
    name: "ganache",
    contracts: {
      Casino: {
        address: "0x079fdE98dBeE3786Ea6ce9F79997D34Bd5cEDBbf",
        abi: CASINO.abi,
      },
    },
  },
  80001: {
    name: "mumbai",
    contracts: {
      Casino: {
        address: "0xF0eFA90068bcca7dE8E4bC1220Ca14e23c438203",
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
