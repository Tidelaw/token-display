const url = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_KEY}`

const getAssetsByOwner = async (context) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: context,
        page: 1, // Starts at 1
        limit: 1000
      },
    }),
  });
  const { result } = await response.json();
  return result.items;
};

export default async function handler(req, res) {

  try {
    if (req.method === "POST") {
      let wallet = req.body.address;
      let balance = await getAssetsByOwner(wallet)
      res.status(200).json(balance)
    };

  }

  catch (err) { console.log(err) }
}
