export const CASINO = {
  // RpcUrl: "https://goerli.infura.io/v3/5fea7bd2205245578c0e4d4cc5c8abc9",
  // address: "0x4F2c8A3a13675EecE8B08796284Ea184836cE068",
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "gameType",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "bet",
          type: "uint256",
        },
      ],
      name: "createGame",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "targetGame",
          type: "address",
        },
      ],
      name: "getGame",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "id",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "wager",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "gameType",
              type: "uint256",
            },
            {
              components: [
                {
                  internalType: "address",
                  name: "id",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "bet",
                  type: "uint256",
                },
              ],
              internalType: "struct Gambler[]",
              name: "gamblers",
              type: "tuple[]",
            },
          ],
          internalType: "struct DisplayInfo",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getGames",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "id",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "wager",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "gameType",
              type: "uint256",
            },
            {
              components: [
                {
                  internalType: "address",
                  name: "id",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "bet",
                  type: "uint256",
                },
              ],
              internalType: "struct Gambler[]",
              name: "gamblers",
              type: "tuple[]",
            },
          ],
          internalType: "struct DisplayInfo[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "targetGame",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "bet",
          type: "uint256",
        },
      ],
      name: "playGame",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ],
};
