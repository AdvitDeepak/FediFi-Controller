/*

0xf45fF976a1bB8321950fDc3f7EcCAb3C6805B7Ac

**Installation and Usage**

REF: https://dev.to/sadeedpv/build-an-http-server-in-bun-4k8l

Installing Bun:
- Make sure to use WSL for Windows! 

  `sudo apt install unzip`
  `curl -fsSL https://bun.sh/install | bash`

- For Windows, run `source /home/advit/.bashrc` on WSL 

Then, to run, simply use `bun run dev`

Todo: can experiment w/ bun features like grouping 
*/

import express from "express";
import { Database } from "bun:sqlite";
import { ethers } from "ethers";
const bodyParser = require("body-parser");

// Set up the DB/tables, if they don't already exist
const DB = new Database("db.sqlite", { create: true });

DB.query(
  `
  CREATE TABLE IF NOT EXISTS Relations (
    ID_creator TEXT NOT NULL,
    ID_advertisement TEXT NOT NULL
  );`
).run();

DB.query(
  `
  CREATE TABLE IF NOT EXISTS Advertisements (
    ID_advertisement TEXT NOT NULL,
    Advertisement TEXT NOT NULL
  );`
).run();

DB.query(
  `
  CREATE TABLE IF NOT EXISTS Creators (
    ID_creator TEXT NOT NULL,
    earnings INT NOT NULL
  );`
).run();

console.log("Database and tables created successfully.");

// Set up the Backend Application

const app = express();
const port = 8080;

app.use(bodyParser.json());

// 01 - Home
app.get("/", (req, res) => {
  res.send("Hello FediFi!");
});

// 02 - POST /get_ad --> get ad given creator id

app.post("/get_ad", (req, res) => {
  console.log("/get_ad hit");
  const requestData = req.body;
  const creatorId = requestData.creatorId;
  console.log(requestData.creatorId);

  const resp = DB.query(
    `SELECT DISTINCT ID_advertisement FROM Relations WHERE ID_creator = '${creatorId}'`
  ).values();
  console.log("Retrieved: " + resp);

  const adId = resp[0][0];
  console.log("AdId: " + adId);
  console.log(typeof adId);

  const resp2 = DB.query(
    `SELECT DISTINCT Advertisement FROM Advertisements WHERE ID_advertisement = '${adId}'`
  ).values();
  console.log("Retreived: " + resp2);
  const ad = resp2[0][0];

  res.send({ image: ad, adId: adId });
});

// 02 - GET /get_all_ads --> returns ALL ads

app.get("/get_all_ads", (req, res) => {
  console.log("/get_all_ads hit");
  const resp = DB.query(`SELECT * FROM Advertisements`).values();
  console.log("Retrieved: " + resp);
  res.send(resp);
});

// 03 - POST /view_ad --> triggers the transaction

app.post("/view_ad", (req, res) => {
  console.log("/view_ad");
  const requestData = req.body;

  // Bump up that creator's viewcount total
  const creatorId = requestData.creatorId;
  const dump0 = DB.query(
    `INSERT OR IGNORE INTO Creators (ID_creator, earnings) VALUES ('${creatorId}', '0');`
  ).run();

  const resp4 = DB.query(
    `UPDATE Creators SET earnings = earnings + 1 WHERE ID_creator = '${creatorId}';`
  ).run();

  // TODO -- call the caledera chain thing!
  res.send("Still a work in progress, but good luck!");
});

// 04 - POST /use_ad --> save ad to creator portfolio

app.post("/use_ad", (req, res) => {
  console.log("/use_ad hit");
  const requestData = req.body;

  const creatorId = requestData.creatorId;
  const imgEncoded = requestData.imageEncoded;
  const adId = requestData.adId;

  // If creator doesn't already exist, add them to the table with view count 0
  //const dump0 = DB.query(`INSERT INTO Creators (ID_creator, earnings) VALUES ('${creatorId}', 0) WHERE NOT EXISTS (SELECT 1 FROM Creators WHERE ID_creator = '${creatorId}');`).run();

  const dump0 = DB.query(
    `INSERT OR IGNORE INTO Creators (ID_creator, earnings) VALUES ('${creatorId}', 0);`
  ).run();

  const dump1 = DB.query(
    `INSERT INTO Relations (ID_creator, ID_advertisement) VALUES ('${creatorId}', '${adId}')`
  ).run();
  console.log("Added to Relations Table");

  const dump2 = DB.query(
    `INSERT INTO Advertisements (ID_advertisement, Advertisement) VALUES ('${adId}', '${imgEncoded}')`
  ).run();
  console.log("Added to Advertisements Table");

  res.send("Successfully stored.");
});

// 05 - POST /view_earnings --> given a creator id

app.post("/view_earnings", (req, res) => {
  console.log("/view_earnings");
  const requestData = req.body;
  const creatorId = requestData.creatorId;

  const resp5 = DB.query(
    `SELECT DISTINCT earnings FROM Creators WHERE ID_creator = '${creatorId}'`
  ).values();
  console.log("Retrieved: " + resp5);

  const viewCount = resp5[0][0];
  res.send({ viewCount: viewCount });
});

// 06 - POST /payout -->

app.post("/payout", (req, res) => {
  console.log("/payout");
  // const requestData = req.body;
  // const creatorId = requestData.creatorId;
  // const walletId = requestData.walletId;

  // Call tranferEther function
  transferEther();

  // Right now transferring from us, but ideally should be from advertiser/people
  res.send({ result: "Payout successful!" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

// HELPER FUNCTION

function transferEther() {
  // Infura endpoint or any other Ethereum node endpoint
  const provider = new ethers.JsonRpcProvider(
    "https://treehacks-devnet.rpc.caldera.xyz/http"
  );

  // ABI (Application Binary Interface) of the smart contract
  const abi = [
    {
      inputs: [
        {
          internalType: "address payable",
          name: "recipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferEther",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ];

  // Address of the smart contract
  const contractAddress = "0x1baa54ee571ad7ad1010b920fbecd196e2fb1ddb";

  // Connect to the contract
  const contract = new ethers.Contract(contractAddress, abi, provider);

  const wallet = new ethers.Wallet(
    "afd92790cabb2bbc9ed5057391aaee950584ddfeb0205353db999f4725a25966",
    provider
  );

  (async () => {
    const transaction = await wallet.sendTransaction({
      value: ethers.parseEther("0.001"),
      to: "0xf45fF976a1bB8321950fDc3f7EcCAb3C6805B7Ac",
    });
    await transaction.wait();
  })();

  // (async () => {
  //   const wallet = new ethers.Wallet(
  //     "afd92790cabb2bbc9ed5057391aaee950584ddfeb0205353db999f4725a25966",
  //     provider
  //   ); // Replace with your private key
  //   const contractWithSigner = contract.connect(wallet);

  //   // Specify the recipient's address and the value to transfer
  //   const recipient = "0xf45fF976a1bB8321950fDc3f7EcCAb3C6805B7Ac"; // Replace with the recipient's Ethereum address
  //   const amount = ethers.parseEther("0.000001"); // Replace with the value in Ether you want to transfer

  //   // Call the contract function to transfer ether
  //   console.log(await wallet.estimateGas({ to: recipient, value: amount }));
  //   const tx = await contractWithSigner.transferEther(recipient, amount);
  //   console.log("Transaction hash:", tx.hash);

  //   // Wait for the transaction to be mined
  //   tx.wait();
  //   console.log("Transaction confirmed.");

  //   // Check the recipient's balance or other relevant information if needed
  // })();
}
