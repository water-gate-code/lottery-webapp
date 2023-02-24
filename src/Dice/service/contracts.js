export const DICE = {
  address: "0xA62c32cb896A936Dd372F4Ca0d3A6Fb76cB99b6F",
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
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "getGameCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
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
          internalType: "contract DiceGame[]",
          name: "",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "gameAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "betNumber",
          type: "uint256",
        },
      ],
      name: "play",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
  ],
};
