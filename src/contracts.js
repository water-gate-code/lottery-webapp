export const CASINO = {
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
