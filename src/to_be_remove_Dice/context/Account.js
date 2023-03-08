import React, { useContext, useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethRequest } from "../service/utils";

const { ethereum } = window;

const defaultAccountContext = {
  wallet: "MetaMask", // 当前连接的钱包
  chainId: "",
  account: "", // 当前登陆的账号
  isConnected: false, // 是否连上钱包
};

const AccountContext = React.createContext(defaultAccountContext);

const SUPPORT_CHAIN_ID_LIST = ["1337", "5"];
const CHAIN_ID_NAME_MAP = {
  1337: "GANACHE",
  5: "GOERLI TEST NET",
};

const isSupportChain = (chainId) =>
  SUPPORT_CHAIN_ID_LIST.includes(`${chainId}`);
const getChainName = (chainId) => {
  const chainDisplayName = CHAIN_ID_NAME_MAP[`${chainId}`];
  return chainDisplayName || "您正链接的";
};
const getChainId = async () => {
  const chainId = await ethRequest({ method: "eth_chainId" });
  return chainIdConvertHexToInt(chainId).toString();
};
const chainIdConvertHexToInt = (chainId) => parseInt(chainId);

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  return context;
};

export const AccountProvider = React.memo((props) => {
  const [accountInfo, setAccountInfo] = useState(defaultAccountContext.account);

  useEffect(() => {
    const checkMetaMask = async () => {
      const provider = await detectEthereumProvider();
      if (!provider) {
        window.alert("请安装 MetaMask!");
        return;
      }
      if (provider !== ethereum) {
        window.alert("您是否安装了多个钱包？目前仅支持 MetaMask!");
      }
      const accounts = await ethRequest({ method: "eth_accounts" });
      if (accounts.length > 0) {
        const chainId = await getChainId();
        if (!isSupportChain(chainId)) {
          window.alert(
            `目前不支持${getChainName(chainId)}链，请手动切换后刷新页面`
          );
        }
      }
    };
    checkMetaMask();
  }, []);

  useEffect(() => {
    ethereum.on("accountsChanged", handleAccountsChange);
    ethereum.on("chainChanged", handleChainChanged);
    // ethereum.on('connect', handleConnect);
    ethereum.on("disconnect", handleDisConnect);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChange);
      ethereum.removeListener("chainChanged", handleChainChanged);
      // ethereum.removeListener("connect", handleConnect);
      ethereum.removeListener("disconnect", handleDisConnect);
    };
  }, []);

  const handleDisConnect = (error) => {
    const { message, code, data = {} } = error;
    window.alert(`钱包断开连接`);
  };
  const handleConnect = (connectInfo) => {
    const { chainId } = connectInfo;
    const chainIdString = chainIdConvertHexToInt(chainId).toString();
    if (!isSupportChain(chainIdString)) {
      window.alert(
        `目前不支持${getChainName(chainIdString)}链，请手动切换后刷新页面`
      );
    } else {
      window.location.reload();
    }
  };

  const handleChainChanged = (chainId) => {
    if (!isSupportChain(chainIdConvertHexToInt(chainId).toString())) {
      window.alert(
        `目前不支持${getChainName(chainId)}链，请手动切换后刷新页面`
      );
    } else {
      window.location.reload();
    }
  };

  const handleAccountsChange = async () => {
    try {
      const accounts = await ethRequest({ method: "eth_accounts" });
      if (!(accounts.length > 0)) {
        window.alert(`目前无账户链`);
      }
      console.log(`accountsChanged :`, JSON.stringify(accounts));
      const chainId = await getChainId();
      console.log(`chainId :`, chainId);
      if (!isSupportChain(chainId)) {
        window.alert(
          `目前不支持${getChainName(chainId)}链，请手动切换后刷新页面`
        );
      } else {
        setAccountInfo({
          ...accountInfo,
          account: accounts[0],
          isConnected: ethereum.isConnected(),
          chainId,
        });
      }
    } catch (err) {
      console.error(`accountsChanged failed:`, JSON.stringify(err));
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await ethRequest({ method: "eth_requestAccounts" });
      if (!(accounts.length > 0)) {
        window.alert(`目前无账户链`);
      }
      const chainId = await getChainId();
      console.log(`chainId :`, chainId);
      if (!isSupportChain(chainId)) {
        window.alert(`目前不支持${getChainName(chainId)}链`);
      } else {
        setAccountInfo({
          ...accountInfo,
          account: accounts[0],
          isConnected: ethereum.isConnected(),
          chainId,
        });
      }
    } catch (err) {
      console.error(`accountsRequest failed:`, JSON.stringify(err));
    }
  };

  return (
    <AccountContext.Provider
      value={{ ...defaultAccountContext, connectWallet }}
    >
      {props && props.children}
    </AccountContext.Provider>
  );
});
