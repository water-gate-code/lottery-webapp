export const GOERILI_DICE = {
  address: "0x2AbB89B6aB76197e05eBAf7E7510E5DaDA35E948",
  abi: [
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "player1",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "player2",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "betAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "player1BetNumber",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "player2BetNumber",
              "type": "uint256"
            }
          ],
          "indexed": false,
          "internalType": "struct DiceGameLobby.DiceGame",
          "name": "game",
          "type": "tuple"
        }
      ],
      "name": "CreateGame",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "roll",
          "type": "uint256"
        }
      ],
      "name": "PlayGame",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "betNumber",
          "type": "uint256"
        }
      ],
      "name": "createGame",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getGames",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "player1",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "player2",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "betAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "player1BetNumber",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "player2BetNumber",
              "type": "uint256"
            }
          ],
          "internalType": "struct DiceGameLobby.DiceGame[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "betNumber",
          "type": "uint256"
        }
      ],
      "name": "play",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ],
};
