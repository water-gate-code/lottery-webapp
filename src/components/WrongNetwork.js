import { useState, useEffect, useContext } from "react";

import { supportChainIds, chains } from "../chains";
import { WalletContext } from "../contexts/WalletContext";
import { switchNetwork, addToNetwork, connectWallet } from "../utils";

const fetchChainData = (function () {
  let chainDataCatch = [];
  return async function () {
    if (chainDataCatch.length > 0) return chainDataCatch;
    const response = await fetch("https://chainid.network/chains.json");
    chainDataCatch = await response.json();
    return chainDataCatch;
  };
})();

async function changeNetwork(address, chain) {
  try {
    if (!address) {
      await connectWallet();
    }
    await switchNetwork(chain.chainId);
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      addToNetwork({ address, chain });
    }
  }
}

function ChainItem({ address, chain, onClick }) {
  return (
    <div className="card m-3">
      <div className="card-body">
        <h5 className="card-title">{chain.name}</h5>
        <p className="card-text"></p>
        <button
          className="btn btn-primary"
          onClick={() => onClick && onClick()}
        >
          Change Network
        </button>
      </div>
    </div>
  );
}

export function WrongNetwork() {
  const [fullChainList, setFullChainList] = useState([]);
  const [loading, setLoading] = useState(true);

  const wallet = useContext(WalletContext);
  const address = wallet.accounts.length > 0 ? wallet.accounts[0] : null;

  useEffect(() => {
    fetchChainData()
      .then(setFullChainList)
      .then(() => setLoading(false));
  }, []);

  const selectedNetwork = fullChainList.find(
    (chain) => chain.chainId === wallet.chainId
  );
  const network = selectedNetwork ? (
    <span className="text-primary">{`{${selectedNetwork.name}}`}</span>
  ) : (
    "the selected network"
  );

  return (
    <div className="container text-center my-5 py-5">
      {loading ? (
        <h6 className="display-6 my-5">&nbsp;</h6>
      ) : (
        <h6 className="display-6 my-5">We don't support {network} yet!</h6>
      )}
      <p className="lead">Please select the supported network below</p>
      <div className="d-flex flex-row justify-content-center">
        {supportChainIds
          .filter((id) => !chains[id].local)
          .map((id) => (
            <ChainItem
              key={id}
              chain={chains[id].info}
              address={address}
              onClick={() => {
                changeNetwork(address, chains[id].info);
              }}
            />
          ))}
      </div>
    </div>
  );
}
