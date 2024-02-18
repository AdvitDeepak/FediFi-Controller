const { ethers } = require("ethers");

// Infura endpoint or any other Ethereum node endpoint
const provider = new ethers.providers.JsonRpcProvider("https://treehacks-devnet.rpc.caldera.xyz/http");

// ABI (Application Binary Interface) of the smart contract
const abi = [
    [
        {
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferEther",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }
    ]
];

// Address of the smart contract
const contractAddress = "0xfAF5bDAE08e3e5a33917BE8024DBBCd1739110a8";

// Connect to the contract
const contract = new ethers.Contract(contractAddress, abi, provider);

(async () => {
    const wallet = new ethers.Wallet("afd92790cabb2bbc9ed5057391aaee950584ddfeb0205353db999f4725a25966", provider); // Replace with your private key
    const contractWithSigner = contract.connect(wallet);

    // Specify the recipient's address and the value to transfer
    const recipient = "0xf45fF976a1bB8321950fDc3f7EcCAb3C6805B7Ac"; // Replace with the recipient's Ethereum address
    const amount = ethers.utils.parseEther("0.0001"); // Replace with the value in Ether you want to transfer

    // Call the contract function to transfer ether
    const tx = await contractWithSigner.transfer(recipient, amount);
    console.log("Transaction hash:", tx.hash);

    // Wait for the transaction to be mined
    await tx.wait();
    console.log("Transaction confirmed.");

    // Check the recipient's balance or other relevant information if needed
})();
