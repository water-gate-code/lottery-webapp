export const DICE = {
  address: "0xA13fd279652d369BF05D0bE1eE93119471e6e32D",
  abi: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "betNumber",
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
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "player1",
              type: "address",
            },
            {
              internalType: "address",
              name: "player2",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "betAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "player1BetNumber",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "player2BetNumber",
              type: "uint256",
            },
          ],
          internalType: "struct DiceGameLobby.DiceGame[]",
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
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "betNumber",
          type: "uint256",
        },
      ],
      name: "play",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ],
};
