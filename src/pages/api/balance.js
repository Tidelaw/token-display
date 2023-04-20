const axios = require('axios');
const fs = require('fs')

async function getBalance(req) {
  const url = `https://api.helius.xyz/v0/addresses/${req}/balances?api-key=${process.env.HELIUS_KEY}`
  let {data} = await axios.get(url);
  return data.tokens
}

async function getMetadata(tokens) {

  let url = `https://api.helius.xyz/v0/tokens/metadata?api-key=${process.env.HELIUS_KEY}`
  let mintAccounts = [], queriedTokens = tokens.map((e)=>e.mint);
  if (tokens.length > 100) {
    for (let i = 0; i < Math.ceil(tokens.length / 100); i++) {
      let batch = queriedTokens.slice(0, 100)
      queriedTokens = queriedTokens.slice(100, queriedTokens.length)
      let query = await axios.post(url, { mintAccounts: batch })
      mintAccounts = mintAccounts.concat(query.data)
    }
  }
  else {
    let query = await axios.post(url, { mintAccounts: tokens })
    mintAccounts = query.data;
  }

  mintAccounts.map((e,i)=>e.amount = tokens[i].amount);
  return mintAccounts
}

export default async function handler(req, res) {

  try {
    if (req.method === "POST") {
      let wallet = req.body.address;

      let balance = await getBalance(wallet)
      let balanceMetadata = await getMetadata(balance);

      // await fs.writeFile('balance.json', JSON.stringify(balance), 'utf8', ((err)=>console.log(err)));
      // await fs.writeFile('balance-metadata.json', JSON.stringify(balanceMetadata), 'utf8', ((err)=>console.log(err)));

      res.status(200).json(balanceMetadata)
    };

  }

  catch (err) { console.log(err) }
}
