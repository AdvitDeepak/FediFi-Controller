/*

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
const bodyParser = require('body-parser');


// Set up the DB/tables, if they don't already exist 
const DB = new Database("db.sqlite", { create: true });

DB.query(`
  CREATE TABLE IF NOT EXISTS Relations (
    ID_creator TEXT NOT NULL,
    ID_advertisement TEXT NOT NULL
  );`).run();

DB.query(`
  CREATE TABLE IF NOT EXISTS Advertisements (
    ID_advertisement TEXT NOT NULL,
    Advertisement TEXT NOT NULL
  );`).run();


DB.query(`
  CREATE TABLE IF NOT EXISTS Creators (
    ID_creator TEXT NOT NULL,
    ID_wallet TEXT NOT NULL,
    earnings TEXT NOT NULL
  );`).run();


console.log('Database and tables created successfully.');


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

  const resp = DB.query(`SELECT DISTINCT ID_advertisement FROM Relations WHERE ID_creator = '${creatorId}'`).values();
  console.log("Retrieved: " + resp);

  const adId = resp[0][0]
  console.log("AdId: " + adId);
  console.log(typeof(adId));

  const resp2 = DB.query(`SELECT DISTINCT Advertisement FROM Advertisements WHERE ID_advertisement = '${adId}'`).values();
  console.log("Retreived: " + resp2);
  const ad = resp2[0][0]

  res.send({"image": ad, "adId":adId});
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

  // Bump up that creator's viewcount total 

  // TODO -- call the caledera chain thing! 

});


// 04 - POST /use_ad --> save ad to creator portfolio

app.post("/use_ad", (req, res) => {
  console.log("/use_ad hit");
  const requestData = req.body;

  const creatorId = requestData.creatorId;
  const imgEncoded = requestData.imageEncoded;
  const adId = requestData.adId; 
  
  const dump1 = DB.query(`INSERT INTO Relations (ID_creator, ID_advertisement) VALUES ('${creatorId}', '${adId}')`).run();
  console.log("Added to Relations Table");

  const dump2 = DB.query(`INSERT INTO Advertisements (ID_advertisement, Advertisement) VALUES ('${adId}', '${imgEncoded}')`).run();
  console.log("Added to Advertisements Table");

  res.send("Successfully stored.");
});


// 05 - POST /view_earnings --> given a creator id 

app.post("/view_earnings", )



app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});