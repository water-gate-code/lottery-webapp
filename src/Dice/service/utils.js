import { DICE } from "./contracts";
import { MOCK_JOIN_DICE, MOCK_DICE_STATUS } from "./mockData";

const { ethereum } = window;
const { ethers } = window;

const ethRequest = async (args) => {
  const response = await ethereum.request(args);
  console.log(`${args.method}:`, response);
  return response;
};

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
  // TODO: DICE Contract
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

export const payMoneyAndCreateGame = async (amount, selection) => {
  const { contract, provider } = getContractAndProvider();
  const betNumber = selection === "big" ? 6 : 1;

  try {
    const transactionResponse = await contract.createGame(betNumber, {
      value: ethers.utils.parseEther(amount),
    });
    const transactionReceipt = await transactionResponse.wait(0);

    const createGameEventList =
      (transactionReceipt && transactionReceipt.events) || [];
    let createGameAddress;

    createGameEventList.forEach((event) => {
      if (event.event === "CreateGame") {
        createGameAddress = event.args[0];
      }
    });

    if (!createGameAddress) {
      return Promise.reject(new Error("no address generate"));
    }

    console.log(
      "payMoneyAndCreateGame Succeed, createGameAddress is: ",
      createGameAddress
    );

    await listenForTransactionMine(transactionResponse, provider);

    const dice = gameAddressToDice(createGameAddress);
    return dice;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getCurrentActiveDice = async () => {
  const { contract } = getContractAndProvider();
  const games = await contract.getGames();
  console.log("contract.getGames Succeed, res is: ", JSON.stringify(games));

  const diceList = [];
  for (let i = 0; i < games.length; i++) {
    diceList.push(gameAddressToDice(games[i]));
  }
  console.log(
    "getCurrentActiveDice Succeed, diceList is: ",
    JSON.stringify(diceList)
  );
  return Promise.resolve(diceList);
};

export const payMoneyAndShoot = async (amount, diceId, selection) => {
  const betNumber = selection === "big" ? 6 : 1;

  const { contract } = getContractAndProvider();
  try {
    const transactionResponse = await contract.play(diceId, betNumber, {
      value: ethers.utils.parseEther(amount),
    });

    const transactionReceipt = await transactionResponse.wait(0);

    const playGameEventList =
      (transactionReceipt && transactionReceipt.events) || [];
    let roolDiceResult;

    playGameEventList.forEach((event) => {
      if (event.event === "PlayGame") {
        roolDiceResult = event.args[0];
      }
    });

    if (!roolDiceResult) {
      return Promise.reject(new Error("no roll result generate"));
    }

    console.log(
      "payMoneyAndShoot Succeed, roolDiceResult is: ",
      roolDiceResult
    );

    // const result = await contract.play(diceId, betNumber, {
    //   value: ethers.utils.parseEther(amount),
    // });
    // console.log("contract.play Succeed, res is: ", JSON.stringify(result));
    // 无真实的结果，先这么写吧
    return Promise.resolve({ result: roolDiceResult });
  } catch (err) {
    console.log("contract.play Failed, err is: ", JSON.stringify(err));
    return Promise.reject();
  }
};

export const delay = (number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, number);
  });
};

export const joinDice = async () => {
  // const { contract, provider } = getContractAndProvider(betValue);
  // const games = await contract.connectWallet();
  // await payMoney(5);

  await delay(2000);
  return Promise.resolve(MOCK_JOIN_DICE);
};

export const getDiceStatus = async (diceId) => {
  // const { contract, provider } = getContractAndProvider(betValue);
  // const result = await contract.start();
  await delay(2000);
  return `${diceId}` === "456"
    ? Promise.resolve(MOCK_DICE_STATUS)
    : Promise.resolve(undefined);
};
