
import { DICE } from './contracts';
import { MOCK_JOIN_DICE, MOCK_CREATE_DICE, MOCK_DICE_LIST, MOCK_RESULT } from './mockData';

const { ethereum } = window;
const { ethers } = window;

const ethRequest = async (args) => {
  const response = await ethereum.request(args);
  console.log(`${args.method}:`, response);
  return response;
}

const listenForTransactionMine = (transactionResponse, provider) => {
  console.log(`Mining ${transactionResponse.hash}`);
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

const getContractAndProvider = (ethereum) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  // TODO: DICE Contract
  const contract = new ethers.Contract(DICE.address, DICE.abi, signer);
  return { contract, provider };
}

const delay = (number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, number)
  })
}

export const connectWallet = async () => {
  // try {
  //   await ethRequest({ method: "eth_requestAccounts" });
  //   const accounts = await ethRequest({ method: "eth_accounts" });
  //   const isConnected = accounts.length > 0;
  //   console.log(`connectWallet Succeed:`);
  //   return isConnected;
  // } catch (e) {
  //   console.log(`connectWallet failed:`, JSON.stringlify(e));
  //   return Promise.resolve(false);
  // }

  await delay(2000);
  return;
}

const payMoney = async (amount) => {
  // const betValue = parseFloat(amount).toString();
  // console.log(`Pay with ${betValue}...`);
  // const { contract, provider } = getContractAndProvider(betValue);
  // try {
  //   const transactionResponse = await contract.fund({
  //     value: ethers.utils.parseEther(betValue),
  //   });
  //   await listenForTransactionMine(transactionResponse, provider);
  // } catch (error) {
  //   console.log(error);
  // }
  await delay(2000);
  return Promise.resolve();
}

export const payMoneyAndCreateGame = async (amount) => {
  // const betValue = parseFloat(amount).toString();
  // console.log(`Pay with ${betValue}...`);
  // const { contract, provider } = getContractAndProvider(betValue);
  // try {
  //   const transactionResponse = await contract.fund({
  //     value: ethers.utils.parseEther(betValue),
  //   });
  //   await listenForTransactionMine(transactionResponse, provider);
  // } catch (error) {
  //   console.log(error);
  // }

  await delay(2000);
  return Promise.resolve(MOCK_CREATE_DICE);
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

export const play = async (diceId) => {
  // const { contract, provider } = getContractAndProvider(betValue);
  // const result = await contract.start();

  await delay(2000);
  return Promise.resolve(MOCK_RESULT);
}