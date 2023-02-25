export const DICE = {
  address: "0xCCd9e7970761b6AeC113FacAcd72e9e575a69C99",
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "_gameAddress",
          type: "address",
        },
      ],
      name: "CreateGame",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "_rollNumber",
          type: "uint256",
        },
      ],
      name: "PlayGame",
      type: "event",
    },
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
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ],
};
