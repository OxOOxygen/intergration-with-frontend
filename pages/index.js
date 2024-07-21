import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [stakedBalance, setStakedBalance] = useState(undefined);
  const [tokenPrice, setTokenPrice] = useState(ethers.utils.parseEther("0.00000000000000001"));

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    } else {
      console.log("Please install MetaMask!");
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

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
    } catch (error) {
      console.error("Error connecting account:", error);
    }
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

  const getStakedBalance = async () => {
    if (atm) {
      try {
        const stakedBalance = await atm.getStakedBalance();
        setStakedBalance(ethers.utils.formatEther(stakedBalance));
      } catch (error) {
        console.error("Error while fetching staked balance:", error);
      }
    }
  };

  const buy = async () => {
    if (atm) {
      try {
        const amount = prompt("Enter the amount of tokens you want to buy");
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
          alert("Invalid amount");
          return;
        }
        const tokenAmount = ethers.utils.parseEther(amount);
        const value = tokenAmount.mul(tokenPrice);
        
        console.log("Buying tokens:");
        console.log("Token Amount (ETH):", ethers.utils.formatEther(tokenAmount));
        console.log("Token Price (ETH):", ethers.utils.formatEther(tokenPrice));
        console.log("Total Value (ETH):", ethers.utils.formatEther(value));

        const tx = await atm.buy(tokenAmount, {
          value: value,
          gasLimit: 100000, // Adjust as needed
          gasPrice: ethers.utils.parseUnits('20', 'gwei') // Adjust as needed
        });
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error while buying:", error);
      }
    }
  };

  const sell = async () => {
    if (atm) {
      try {
        const amount = prompt("Enter the amount of tokens you want to sell");
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
          alert("Invalid amount");
          return;
        }
        const tokenAmount = ethers.utils.parseEther(amount);

        console.log("Selling tokens:");
        console.log("Token Amount (ETH):", ethers.utils.formatEther(tokenAmount));

        const tx = await atm.sell(tokenAmount, {
          gasLimit: 100000, // Adjust as needed
          gasPrice: ethers.utils.parseUnits('20', 'gwei') // Adjust as needed
        });
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error while selling:", error);
      }
    }
  };

  const transfer = async () => {
    if (atm) {
      try {
        const receiver = prompt("Enter the receiver's address");
        const amount = prompt("Enter the amount you want to transfer");
        if (!ethers.utils.isAddress(receiver)) {
          alert("Invalid receiver address");
          return;
        }
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
          alert("Invalid amount");
          return;
        }
        const parsedAmount = ethers.utils.parseEther(amount);

        const currentBalance = await atm.getBalance();
        if (currentBalance.lt(parsedAmount)) {
          alert("Not enough tokens to transfer");
          return;
        }

        console.log("Transferring tokens:");
        console.log("Receiver Address:", receiver);
        console.log("Transfer Amount (ETH):", ethers.utils.formatEther(parsedAmount));

        const tx = await atm.transfer(receiver, parsedAmount, {
          gasLimit: 100000, // Adjust as needed
          gasPrice: ethers.utils.parseUnits('20', 'gwei') // Adjust as needed
        });
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error while transferring:", error);
      }
    }
  };

  const stake = async () => {
    if (atm) {
      try {
        const amount = prompt("Enter the amount of tokens you want to stake");
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
          alert("Invalid amount");
          return;
        }
        const tokenAmount = ethers.utils.parseEther(amount);

        console.log("Staking tokens:");
        console.log("Token Amount (ETH):", ethers.utils.formatEther(tokenAmount));

        const tx = await atm.stake(tokenAmount, {
          gasLimit: 100000, // Adjust as needed
          gasPrice: ethers.utils.parseUnits('20', 'gwei') // Adjust as needed
        });
        await tx.wait();
        getStakedBalance();
        getBalance();
      } catch (error) {
        console.error("Error while staking:", error);
      }
    }
  };

  const unstake = async () => {
    if (atm) {
      try {
        const amount = prompt("Enter the amount of tokens you want to unstake");
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
          alert("Invalid amount");
          return;
        }
        const tokenAmount = ethers.utils.parseEther(amount);

        console.log("Unstaking tokens:");
        console.log("Token Amount (ETH):", ethers.utils.formatEther(tokenAmount));

        const tx = await atm.unstake(tokenAmount, {
          gasLimit: 100000, // Adjust as needed
          gasPrice: ethers.utils.parseUnits('20', 'gwei') // Adjust as needed
        });
        await tx.wait();
        getStakedBalance();
        getBalance();
      } catch (error) {
        console.error("Error while unstaking:", error);
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

    if (stakedBalance === undefined) {
      getStakedBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <p>Your Staked Balance: {stakedBalance} ETH</p>
        <button onClick={buy} style={{ backgroundColor: 'red', color: 'white' }}>Buy Token</button>
        <button onClick={sell} style={{ backgroundColor: 'red', color: 'white' }}>Sell Token</button>
        <button onClick={transfer} style={{ backgroundColor: 'red', color: 'white' }}>Transfer Token</button>
        <button onClick={stake} style={{ backgroundColor: 'red', color: 'white' }}>Stake Token</button>
        <button onClick={unstake} style={{ backgroundColor: 'red', color: 'white' }}>Unstake Token</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1># TrumpToken !</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: black;
          min-height: 100vh;
          color: white;
        }
        button {
          margin: 10px;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
