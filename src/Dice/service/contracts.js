export const DICE = {
  address: "0xcb55426d3087279028B512Af3414980a8680354B",
  abi: [
    {
     "inputs": [],
     "stateMutability":"nonpayable",
     "type":"constructor",
    },
    {
     "inputs": [],
     "name":"FundMe__NotOwner",
     "type":"error",
    },
    {
     "inputs": [
        {
         "internalType":"uint256",
         "name":"_betNumber",
         "type":"uint256"
        }
      ],
     "name":"createGame",
     "outputs": [],
     "stateMutability":"payable",
     "type":"function"
    },
    {
     "inputs": [],
     "name":"getGames",
     "outputs": [
        {
         "components": [
            {
             "internalType":"uint256",
             "name":"id",
             "type":"uint256"
            },
            {
             "internalType":"address",
             "name":"player",
             "type":"address"
            },
            {
             "internalType":"uint256",
             "name":"value",
             "type":"uint256"
            },
            {
             "internalType":"uint256",
             "name":"betNumber",
             "type":"uint256"
            }
          ],
         "internalType":"struct Dice.Game[]",
         "name":"",
         "type":"tuple[]",
        }
      ],
     "stateMutability":"view",
     "type":"function",
    },
    {
     "inputs": [
        {
         "internalType":"uint256",
         "name":"gameId",
         "type":"uint256"
        },
        {
         "internalType":"uint256",
         "name":"_betNumber",
         "type":"uint256"
        }
      ],
     "name":"play",
     "outputs": [],
     "stateMutability":"payable",
     "type":"function"
    },
    {
     "inputs": [],
     "name":"withdraw",
     "outputs": [],
     "stateMutability":"nonpayable",
     "type":"function"
    }
  ],
};
