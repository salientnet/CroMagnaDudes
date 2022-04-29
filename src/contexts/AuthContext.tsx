import { createContext, useContext, useEffect, useState } from "react";
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

    try {
      setLoading(true);

      if (ethereum) {
        try {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          handleAccountsChanged(accounts);

          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x19" }],
          });
        } catch (error: any) {
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
            }
          } else if (error.code === 4001) {
            showSnackbar({
              severity: "error",
              message: "Request denied",
            });
          }

          console.error(error);
        }
      } else {
        showSnackbar({
          severity: "error",
          message: "No provider was found",
        });
        setLoading(false);

        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      handleAccountsChanged(accounts);
      const chainId = await ethereum.request({ method: "eth_chainId" });
      handleChainChanged(chainId);

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
    if (accounts.length === 0) {
      showSnackbar({
        severity: "error",
        message: "Please connect to MetaMask.",
      });

      setAddress(null);
      return;
    }

    setAddress(accounts[0]);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
