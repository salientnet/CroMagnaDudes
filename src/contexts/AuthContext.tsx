import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";

import { useSnackbar } from "./Snackbar";
// import { config } from "../config";

export const AuthContext = createContext<any>({
  address: null,
  chainId: null,
  connect: () => null,
  loading: false,
  disconnect: () => null,
});

export const AuthProvider = ({ children }: any) => {
  const ethereum = window.ethereum;
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const { showSnackbar } = useSnackbar();

  const connect = async () => {
    if (address) {
      return;
    }

    setLoading(true);

    try {
      if (ethereum) {
        try {
          // check if the chain to connect to is installed
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x19" }],
          });
        } catch (error: any) {
          // if it is not, then install it into the user MetaMask
          if (error.code === 4902) {
            try {
              await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainName: "Cronos",
                    chainId: "0x19",
                    nativeCurrency: {
                      name: "CRO",
                      symbol: "CRO",
                      decimals: 18,
                    },
                    rpcUrls: ["https://evm.cronos.org"],
                    blockExplorerUrls: ["https://cronoscan.com/"],
                  },
                ],
              });
            } catch (addError) {
              console.error(addError);
              setLoading(false);

              return;
            }
          }

          console.error(error);
          setLoading(false);

          return;
        }
      } else {
        showSnackbar({
          severity: "error",
          message: '"No provider was found"',
        });
        setLoading(false);

        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      const chainId = await ethereum.request({ method: "eth_chainId" });

      setAddress(accounts[0]);
      setChainId(chainId);

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: "Failed to connect",
      });
    }

    setLoading(false);
  };

  const disconnect = () => {
    setAddress(null);
    setChainId(null);
  };

  const handleAccountsChanged = (accounts: Array<any>) => {
    const account = accounts[0] || null;
    setAddress(account);
  };

  const handleChainChanged = (cId: string) => {
    if (cId !== "0x19") {
      showSnackbar({
        severity: "error",
        message: "Wrong Network",
      });

      disconnect();
    }
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <AuthContext.Provider
      value={{ address, chainId, connect, loading, disconnect }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
