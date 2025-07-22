import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";

function App() {
  const [text, setText] = useState("");
  const [fetchedMessage, setFetchedMessage] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text);
        await tx.wait();
        console.log("Message set successfully");
      } else {
        console.error("MetaMask not found.");
      }
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error.message || error);
    }
  };

  const handleGet = async () => {
    try {
      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const message = await contract.getMessage();
        setFetchedMessage(message);
      } else {
        console.error("MetaMask not found.");
      }
    } catch (error) {
      console.error("Error getting message:", error);
      alert(error.message || error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Set Message on Smart Contract</h1>
      <input
        className="input-field"
        type="text"
        placeholder="Enter your message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button className="message-button" onClick={handleSet}>
        Set Message
      </button>

      <h1 style={{ marginTop: "3rem" }}>Get Message from Smart Contract</h1>
      <button className="message-button" onClick={handleGet}>
        Get Message
      </button>

      {fetchedMessage && (
        <p style={{ marginTop: "1rem", fontSize: "1.2rem", color: "#333" }}>
          <strong>Fetched Message:</strong> {fetchedMessage}
        </p>
      )}
    </div>
  );
}

export default App;
