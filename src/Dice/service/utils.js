import { DICE } from "./contracts";

const { ethereum } = window;
const { ethers } = window;

const ethRequest = async (args) => {
  const response = await ethereum.request(args);
  console.log(`${args.method}:`, response);
  return response;
};

const FAKE_ADDRESS = "0x0000000000000000000000000000000000000000";

// metaMask 链接钱包，本地接口很快
export const connectWallet = async () => {
  try {
    const accounts = await ethRequest({ method: "eth_accounts" });
    if (accounts.length > 1) {
      return true;
    }
    await ethRequest({ method: "eth_requestAccounts" });
    return true;
  } catch (e) {
    console.log(`connectWallet failed:`, JSON.stringlify(e));
    return Promise.resolve(false);
  }
};

const getContractAndProvider = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(DICE.address, DICE.abi, signer);
  return { contract, provider };
};

const listenForTransactionMine = (transactionResponse, provider) => {
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

const gameAddressToDice = (address) => {
  const displayName = address.slice(0, 8);

  return {
    diceId: address,
    gambers: [
      {
        name: displayName,
        address: address,
        select: "big",
      },
      {
        name: "",
        address: "",
        select: "small",
      },
    ],
  };
};

const gameToDice = (game) => {
  const [id, player1, player2, betAmount, player1BetNumber, player2BetNumber] =
    game;
  const player1Name = player1.slice(0, 8);
  const player1Bet = player1BetNumber.toString();
  const player2Name = player2.slice(0, 8);
  const player2Bet = player2BetNumber.toString();

  const gambers =
    player1Bet > "3"
      ? [
          {
            name: player1Name,
            address: player1 === FAKE_ADDRESS ? undefined : player1,
            select: "big",
            betNumber: player1Bet,
          },
          {
            name: player2Name,
            address: player2 === FAKE_ADDRESS ? undefined : player2,
            select: "small",
            betNumber: player2Bet,
          },
        ]
      : [
          {
            name: player2Name,
            address: player2 === FAKE_ADDRESS ? undefined : player2,
            select: "big",
            betNumber: player2Bet,
          },
          {
            name: player1Name,
            address: player1 === FAKE_ADDRESS ? undefined : player1,
            select: "small",
            betNumber: player1Bet,
          },
        ];
  const dice = {
    diceId: id.toString(),
    gambers: gambers,
  };

  return dice;
};

export const payMoneyAndCreateGame = async (amount, selection) => {
  const { contract, provider } = getContractAndProvider();
  const betNumber = selection === "big" ? 6 : 1;

  try {
    const transactionResponse = await contract.createGame(betNumber, {
      value: ethers.utils.parseEther(amount),
    });
    const transactionReceipt = await transactionResponse.wait(0);

    console.log(
      "payMoneyAndCreateGame Succeed, transactionReceipt is: ",
      JSON.stringify(transactionReceipt)
    );

    const createGameEventList =
      (transactionReceipt && transactionReceipt.events) || [];
    let createGameAddress;

    console.log(
      "payMoneyAndCreateGame Succeed, createGameEventList is: ",
      JSON.stringify(createGameEventList)
    );

    // createGameEventList.forEach((event) => {
    //   if (event.event === "CreateGame") {
    //     createGameAddress = event.args[0];
    //   }
    // });

    // if (!createGameAddress) {
    //   return Promise.reject(new Error("no address generate"));
    // }

    console.log(
      "payMoneyAndCreateGame Succeed, createGameAddress is: ",
      createGameAddress
    );

    await listenForTransactionMine(transactionResponse, provider);

    // const dice = gameToDice(createGameAddress);
    // return dice;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const delay = (number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, number);
  });
};

export const getCurrentActiveDice = async () => {
  const { contract } = getContractAndProvider();
  const games = await contract.getGames();
  console.log("contract.getGames Succeed, res is: ", JSON.stringify(games));

  const diceList = [];
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const gameAbleToPlay = game.slice(1, 3).includes(FAKE_ADDRESS);

    if (gameAbleToPlay) {
      diceList.push(gameToDice(game));
    }
  }
  console.log(
    "getCurrentActiveDice Succeed, diceList is: ",
    JSON.stringify(diceList)
  );
  return diceList;
};

export const payMoneyAndShoot = async (amount, diceId, selection) => {
  const betNumber = selection === "big" ? 6 : 1;

  const { contract } = getContractAndProvider();
  try {
    const transactionResponse = await contract.play(diceId, betNumber, {
      value: ethers.utils.parseEther(amount),
    });

    const transactionReceipt = await transactionResponse.wait(0);

    // const playGameEventList =
    //   (transactionReceipt && transactionReceipt.events) || [];
    // let roolDiceResult;

    // playGameEventList.forEach((event) => {
    //   if (event.event === "PlayGame") {
    //     roolDiceResult = event.args[0];
    //   }
    // });

    // if (!roolDiceResult) {
    //   return Promise.reject(new Error("no roll result generate"));
    // }

    console.log(
      "payMoneyAndShoot Succeed, transactionResponse is: ",
      JSON.stringify(transactionResponse)
    );
    // await delay(3000);
    return Promise.resolve({ result: 3 });
  } catch (err) {
    console.log("contract.play Failed, err is: ", JSON.stringify(err));
    return Promise.reject();
  }
};
