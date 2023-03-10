export const CASINO = {
  RpcUrl: "HTTP://127.0.0.1:7545",
  address: "0x28e6Da9FC313356C8b22FBB61653FA688a3845c2",
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
