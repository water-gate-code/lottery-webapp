
import { FUND_ME } from './contracts';

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
  const contract = new ethers.Contract(FUND_ME.address, FUND_ME.abi, signer);
  return { contract, provider };
}

export const connectWallet = async () => {
  try {
    await ethRequest({ method: "eth_requestAccounts" });
    const accounts = await ethRequest({ method: "eth_accounts" });
    const isConnected = accounts.length > 0;
    console.log(`connectWallet Succeed:`);
    return isConnected;
  } catch (e) {
    console.log(`connectWallet failed:`, JSON.stringlify(e));
    return Promise.resolve(false);
  }
}

export const payMoney = async (amount) => {
  const betValue = parseFloat(amount).toString();
  console.log(`Pay with ${betValue}...`);
  const { contract, provider } = getContractAndProvider(betValue);
  try {
    const transactionResponse = await contract.fund({
      value: ethers.utils.parseEther(betValue),
    });
    await listenForTransactionMine(transactionResponse, provider);
  } catch (error) {
    console.log(error);
  }
}

export const getCurrentActiveDice = async () => {
  // const { contract, provider } = getContractAndProvider(betValue);
  // const games = await contract.getGames();

  const mockData = [
    {
      diceId: 123,
      gamblerName: '0xadsfasdfasdfasdfwer', 
      gamblerAdress: '0xadsfasdfasdfasdfwer', 
      select: 'big',
    }, {
      diceId: 234,
      gamblerName: '0xadsfasdfasdfaasdfasdftre', 
      gamblerAdress: '0xadsfasdfasdfaasdfasdftre', 
      select: 'small',
    }, {
      diceId: 456,
      gamblerName: '0xadsfasdfasdfdfdfasdfasdftre',
      gamblerAddress: '0xadsfasdfasdfdfdfasdfasdftre',
      select: 'big',
    },
  ];
  return Promise.resolve(mockData);
}
