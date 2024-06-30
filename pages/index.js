import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    } else {
      console.log("Please install MetaMask!");
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
      getATMContract();
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      try {
        const balance = await atm.getBalance();
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Error while fetching balance:", error);
      }
    }
  };

  const mint = async () => {
    if (atm) {
      try {
        const amount = prompt("Enter the amount you want to mint");
        const tx = await atm.mint(ethers.utils.parseEther(amount));
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error while minting:", error);
      }
    }
  };

  const burn = async () => {
    if (atm) {
      try {
        const amount = prompt("Enter the amount you want to burn");
        const tx = await atm.burn(ethers.utils.parseEther(amount));
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error while burning:", error);
      }
    }
  };
  const transfer = async () => {
    if (atm) {
      try {
        const receiver = prompt("Enter the receiver's address");
        const amount = prompt("Enter the amount you want to transfer");
        const parsedAmount = ethers.utils.parseEther(amount);

        const currentBalance = await atm.getBalance();
        if (currentBalance.lt(parsedAmount)) {
          alert("Not enough tokens to transfer");
          return;
        }

        const tx = await atm.transfer(receiver, parsedAmount);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error while transferring:", error);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this DApp.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your MetaMask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={mint}>Mint  Token</button>
        <button onClick={burn}>Burn  Token</button>
        <button onClick={transfer}>transfer  Token</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, [ethWallet]);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the TrumpToken Site!</h1>
      </header>
      {initUser()} {/* Display user interface based on wallet and balance */}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}

