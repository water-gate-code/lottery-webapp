import React, { useContext, useEffect, useState } from 'react';
import { ethRequest } from "../service/utils";

const { ethereum } = window;

const defaultAccountContext = {
  wallet: 'MetaMask', // 当前连接的钱包
  account: '', // 当前登陆的账号　
  isConnected: false, // 是否连上钱包
}

const AccountContext = React.createContext(defaultAccountContext);

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  return context;
}

export const AccountProvider = React.memo((props) => {
  const [accountInfo, setAccountInfo] = useState(defaultAccountContext.account);

  useEffect(() => {
    ethereum.on("accountsChanged", updateConnectionStatus);

    return () => {
      ethereum.remove("accountsChanged", updateConnectionStatus);
    }
  }, [])

  const updateConnectionStatus = async () => {
    try {
      const accounts = await ethRequest({ method: "eth_accounts" });
      const isConnected = accounts.length > 0;
      const account = isConnected ? accounts[0] : "";
      console.log(`accountsChanged :`, JSON.stringify(accounts));
      setAccountInfo({ ...accountInfo, account, isConnected });
    } catch (err) {
      console.error(`accountsChanged failed:`, JSON.stringify(err));
    }
  }

  const connectWallet = async () => {
    try {
      const accounts = await ethRequest({ method: "eth_requestAccounts" });
      console.log(`accountsChanged :`, JSON.stringify(accounts));
      setAccountInfo({ ...accountInfo, account: accounts[0], isConnected: true });
    } catch (err) {
      console.error(`accountsRequest failed:`, JSON.stringify(err));
    }
  }

  return (
    <AccountContext.Provider value={{...defaultAccountContext, connectWallet}}>
      { props && props.children }
    </AccountContext.Provider>
  )
});