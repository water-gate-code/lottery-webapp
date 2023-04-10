import { useState, useEffect } from "react";

import { supportChainIds, chains, ChainInfo } from "../utils/chains";
import { switchNetwork, addToNetwork, connectWallet } from "../utils/wallet";
import { useAppSelector } from "../hooks";
import { selectUser } from "../store/slices/user";
import { selectChain } from "../store/slices/chain";

const fetchChainData = (function () {
  let chainDataCatch: any[] = [];
  return async function () {
    if (chainDataCatch.length > 0) return chainDataCatch;
    const response = await fetch("https://chainid.network/chains.json");
    chainDataCatch = await response.json();
    return chainDataCatch;
  };
})();

async function changeNetwork(address: string | null, chainInfo: ChainInfo) {
  try {
    if (address === null) {
      await connectWallet();
    }
    await switchNetwork(chainInfo.chainId);
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      addToNetwork(address, chainInfo);
    }
  }
}

function ChainItem({ chain, onClick }: any) {
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
  const [fullChainList, setFullChainList] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const user = useAppSelector(selectUser);
  const chain = useAppSelector(selectChain);

  useEffect(() => {
    fetchChainData()
      .then(setFullChainList)
      .then(() => setLoading(false));
  }, []);

  const selectedNetwork = fullChainList.find(
    (c: ChainInfo) => c.chainId === chain.id
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
              onClick={() => {
                changeNetwork(
                  user.authed ? user.address : null,
                  chains[id].info
                );
              }}
            />
          ))}
      </div>
    </div>
  );
}
