export const DICE = {
  address: "0x8453e76c1875DBc48B7f9ced3d9F2c84F0b59a0a",
  abi: [
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "isBig",
          "type": "bool"
        }
      ],
      "name": "createGame",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getGameCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getGames",
      "outputs": [
        {
          "internalType": "contract DiceGame[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "gameAddress",
          "type": "address"
        }
      ],
      "name": "play",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    }
  ],
};
