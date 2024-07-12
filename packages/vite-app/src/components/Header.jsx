import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "../../utils/AccountContext";

const Header = () => {
  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState("0x");
  const { account, setAccount } = useAccount();

  async function getAddress() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);
    } catch (error) {
      console.error("Failed to get address:", error);
    }
  }

  function updateButton() {
    const ethereumButton = document.querySelector(".enableEthereumButton");
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  async function connectWebsite() {
    const celoTestnetChainId = "0xaef3";
    const celoTestnetChainParams = {
      chainId: celoTestnetChainId,
      chainName: "Celo Alfajores Testnet",
      nativeCurrency: {
        name: "Celo",
        symbol: "CELO",
        decimals: 18,
      },
      rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
      blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org/"],
    };

    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      if (chainId !== celoTestnetChainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: celoTestnetChainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [celoTestnetChainParams],
              });
            } catch (addError) {
              console.error("Failed to add Celo Alfajores chain:", addError);
              return;
            }
          } else {
            console.error(
              "Failed to switch to Celo Alfajores chain:",
              switchError
            );
            return;
          }
        }
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      updateButton();
      console.log("Connected to MetaMask and Celo Alfajores network");
      await getAddress();
      window.location.replace(location.pathname);
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
    }
  }

  useEffect(() => {
    let val = window.ethereum.isConnected();
    if (val) {
      console.log("is it because of this?", val);
      getAddress();
      toggleConnect(val);
      updateButton();
    }
    window.ethereum.on("accountsChanged", function (account) {
      window.location.replace(location.pathname);
    });
  });

  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center flex-wrap md:flex-nowrap">
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link to="/" className="text-2xl font-bold">
          Celo Shop
        </Link>
        <button
          className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm md:hidden"
          onClick={connectWebsite}
        >
          {account ? "Connected" : "Connect"}
        </button>
      </div>

      <button
        className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm hidden md:block"
        onClick={connectWebsite}
      >
        {account ? "Connected" : "Connect"}
      </button>
    </header>
  );
};

export default Header;
