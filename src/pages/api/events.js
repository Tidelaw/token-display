const axios = require('axios');

async function getBalance(req) {
  const url = `https://api.helius.xyz/v0/addresses/${req}/balances?api-key=${process.env.HELIUS_KEY}`

  let data = await axios.get(url);
  console.log('balance', data.data.tokens, '1')
  return data.data.tokens
}


export default async function handler(req, res) {

  try {
    if (req.method === "POST") {
      let wallet = req.body.address;

      let balance = await getBalance(wallet)
      console.log(balance, '1')
      res.status(200).json(balance)
    };

  }

  catch (err) { console.log(err) }
}
