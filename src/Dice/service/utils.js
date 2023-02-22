
import { DICE } from './contracts';
import { MOCK_JOIN_DICE, MOCK_DICE_LIST, MOCK_RESULT, MOCK_DICE_STATUS } from './mockData';

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

export const payMoneyAndCreateGame = async (amount, selection) => {
  const { contract, provider } = getContractAndProvider();
  const betNumber = selection === 'big' ? 6 : 1;

  try {
    const transactionResponse = await contract.createGame(betNumber);
    await listenForTransactionMine(transactionResponse, provider);
    return;
  } catch (err) {
    return Promise.reject(err);
  }
}


export const payMoneyAndShoot = async (diceId, selection) => {
  const betNumber = selection === 'big' ? 6 : 1;

  const { contract } = getContractAndProvider(betNumber);
  try {
    const result = await contract.play({
      diceId: diceId,
      betNumber: betNumber,
    });
    console.log('Play Succeed, result is: ', JSON.stringify(result));
    // 无真实的结果，先这么写吧
    return Promise.resolve(MOCK_RESULT);
  } catch(err) {
    console.log('Play Failed, err is: ', JSON.stringify(err));
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

export const getCurrentActiveDice = async () => {
  // const { contract, provider } = getContractAndProvider(betValue);
  // const games = await contract.getGames();

  await delay(2000);
  return Promise.resolve(MOCK_DICE_LIST);
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