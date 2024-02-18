// import { Database } from "bun:sqlite";

// const DB = new Database("db.sqlite", { create: false });

// // Creator-Related DB Functions 
// // Function to get all creator IDs
// async function getAllCreators(): Promise<number[]> {
//     return new Promise((resolve, reject) => {
//       // Define the query
//       const query = DB.query('SELECT id FROM Creators');
  
//       // Execute the query to get all creator IDs
//       query.all((queryErr, rows) => {
//         if (queryErr) {
//           reject(queryErr);
//           return;
//         }
  
//         // Extract creator IDs from the result rows
//         const creatorIds = rows.map((row) => row.id);
  
//         // Resolve with the array of creator IDs
//         resolve(creatorIds);
//       });
//     });
//   }




// Advertisement-Related DB Functions 

// Contract-Related DB Functions 

// View-Related DB Functions