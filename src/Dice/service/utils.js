
import { DICE } from './contracts';
import { MOCK_JOIN_DICE, MOCK_RESULT, MOCK_DICE_STATUS, MOCK_CREATE_DICE } from './mockData';

const { ethereum } = window;
const { ethers } = window;

const ethRequest = async (args) => {
  const response = await ethereum.request(args);
  console.log(`${args.method}:`, response);
  return response;
}

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
}

const getContractAndProvider = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  // TODO: DICE Contract
  const contract = new ethers.Contract(DICE.address, DICE.abi, signer);
  return { contract, provider };
}

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
}

const gameAddressToDice = (address) => {
  const displayName = address.slice(0, 8);

  return ({
    diceId: address,
    gambers: [{
      name: displayName,
      address: address,
      select: 'big',
    }],
  })
}

export const payMoneyAndCreateGame = async (amount, selection) => {
  const { contract, provider } = getContractAndProvider();
  const betNumber = selection === 'big' ? 6 : 1;

  try {
    const transactionResponse = await Promise.resolve(MOCK_CREATE_DICE);
    const dice = await contract.createGame(betNumber, {
      value: ethers.utils.parseEther(amount)
    });
    console.log('payMoneyAndCreateGame Succeed, transactionResponse is: ', JSON.stringify(transactionResponse));
    // const dice = gameAddressToDice(transactionResponse[0]);

    const transaction = await listenForTransactionMine(transactionResponse, provider);
    console.log('payMoneyAndCreateGame Succeed, listenForTransactionMine is: ', JSON.stringify(transaction));

    return dice;
  } catch (err) {
    return Promise.reject(err);
  }
}

const gameToDice = (game) => {
  const [id, address, value, betNumber] = game;
  const realBetNumber = betNumber.toString();
  const realValue = value.toString();
  const displayName = address.slice(0, 8);

  const gambers = realBetNumber > '3' ? [
    { name: displayName, address: address, select: 'big', value: realValue, betNumber: realBetNumber },
    { name: '', address: '', select: 'small', value: '', betNumber: '' }
  ] : [
    { name: '', address: '', select: 'big', value: '', betNumber: '' },
    { name: displayName, address: address, select: 'small', value: realValue, betNumber: realBetNumber }
  ]
  const dice = {
    diceId: id.toString(),
    gambers: gambers,
  };

  return dice;
}

export const getCurrentActiveDice = async () => {
  const { contract } = getContractAndProvider();
  const games = await contract.getGames();
  console.log('contract.getGames Succeed, res is: ', JSON.stringify(games));

  const diceList = [];
  for (let i = 0; i < games.length; i++) {
    diceList.push(gameAddressToDice(games[i]));
  }
  console.log('getCurrentActiveDice Succeed, diceList is: ', JSON.stringify(diceList));
  return Promise.resolve(diceList);
}

export const payMoneyAndShoot = async (diceId, selection) => {
  const betNumber = selection === 'big' ? 6 : 1;

  const { contract } = getContractAndProvider();
  try {
    const result = await contract.play({
      diceId: diceId,
      betNumber: betNumber,
    });
    console.log('contract.play Succeed, res is: ', JSON.stringify(result));
    // 无真实的结果，先这么写吧
    return Promise.resolve(MOCK_RESULT);
  } catch (err) {
    console.log('contract.play Failed, err is: ', JSON.stringify(err));
    return Promise.reject();
  }
}


export const delay = (number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, number)
  })
}

export const joinDice = async () => {
  // const { contract, provider } = getContractAndProvider(betValue);
  // const games = await contract.connectWallet();
  // await payMoney(5);

  await delay(2000);
  return Promise.resolve(MOCK_JOIN_DICE);
}


export const getDiceStatus = async (diceId) => {
  // const { contract, provider } = getContractAndProvider(betValue);
  // const result = await contract.start();
  await delay(2000);
  return `${diceId}` === '456' ? Promise.resolve(MOCK_DICE_STATUS) : Promise.resolve(undefined);
}