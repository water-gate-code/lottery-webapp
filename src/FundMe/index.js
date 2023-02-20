
import { useState } from "react";
import { FUND_ME } from "../service/contracts";

const { ethereum } = window;
const { ethers } = window;

function listenForTransactionMine(transactionResponse, provider) {
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

async function fund(amount) {
  console.log(`Funding with ${amount}...`);
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(FUND_ME.address, FUND_ME.abi, signer);
  try {
    const transactionResponse = await contract.fund({
      value: ethers.utils.parseEther(amount),
    });
    await listenForTransactionMine(transactionResponse, provider);
  } catch (error) {
    console.log(error);
  }
}

async function withdraw() {
  console.log("Withdraw...");
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(FUND_ME.address, FUND_ME.abi, signer);
  try {
    const transactionResponse = await contract.withdraw();
    await listenForTransactionMine(transactionResponse, provider);
  } catch (error) {
    console.log(error);
  }
}


async function ethRequest(args) {
  const response = await ethereum.request(args);
  console.log(`${args.method}:`, response);
  return response;
}

function FundMeComponent({ account }) {
    const [amount, setAmount] = useState(0.01);
  
    function changeAmount(event) {
      setAmount(event.target.value);
    }
    function submitFund(event) {
      event.preventDefault();
      const fundEth = parseFloat(amount);
      console.log("fundEth:", fundEth);
      fund(fundEth.toString());
    }
    function submitWithdraw(event) {
      event.preventDefault();
      withdraw();
    }
  
    return (
      <div>
        <p>
          <strong>Account: {account}</strong>
        </p>
        <form className="row g-3" onSubmit={submitFund}>
          <div className="col-auto">
            <label htmlFor="inputAmount" className="visually-hidden">
              Amount
            </label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={changeAmount}
              className="form-control"
              id="inputAmount"
              placeholder="Amount"
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary mb-3">
              Fund
            </button>
          </div>
        </form>
        <form className="row g-3" onSubmit={submitWithdraw}>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary mb-3">
              Withdraw
            </button>
          </div>
        </form>
      </div>
    );
  }

const FundMe = React.memo((props)=> {
    const [isConnectedWallet, setIsConnectedWallet] = useState(false);
  const [account, setAccount] = useState(null);
  async function updateConnectionStatus() {
    const accounts = await ethRequest({ method: "eth_accounts" });
    const isConnected = accounts.length > 0;
    setIsConnectedWallet(isConnected);
    if (isConnected) {
      setAccount(accounts[0]);
    }
  }
  updateConnectionStatus();
  ethereum.on("accountsChanged", updateConnectionStatus);

  async function connectWallet() {
    await ethRequest({ method: "eth_requestAccounts" });
    updateConnectionStatus();
  }

    return (
        <div>
             <button
          type="button"
          className="btn btn-primary"
          onClick={() => props.goBack()}
        >
          Go back
        </button>
             <h1 className="display-1">Fund Me</h1>
      {isConnectedWallet ? (
        <FundMeComponent account={account} />
      ) : (
        <button
          type="button"
          className="btn btn-primary"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
        </div>
    )
});

export default FundMe;