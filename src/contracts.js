export const CASINO = {
  RpcUrl: "HTTP://127.0.0.1:7545",
  address: "0xbB73fc9C107394fdD2A381d7acC4Ea1dCCaE2654",
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
