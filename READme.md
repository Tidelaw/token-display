# **Token Balance and Metadata Helius API Showcase**

In this project walkthrough, we are going to go through how you can create a dAPP UI that allows users to track the inventory of any wallet using Helius's API.

**Sneak Peek:**

![[preview]](preview.png)

<br><br>

# **Getting Started:**

**In order to run locally:**


- **Node.js** needs to be installed on your OS
- Clone the **token-balance-metadata** [repo](https://github.com/Tidelaw/token-balance-metadata.git)
- Start the project
    1. Run `npm install` to install all our project dependencies
    2. Run `npm run dev` to run our application


`npm install` downloads the packages found in **package.json**

`npm run dev` runs the website. The website can now be accessed from `localhost:3000` or `0.0.0.0`

In order for queries to be made, a **Helius API** key is necessary - in order to obtain one, visit 

`https://www.helius.xyz `

Now, create a file called `.env.local` on the outermost directory of the cloned repo, adding the following text into the file.

```
HELIUS_KEY = <your Helius API key>
```
The site is now fully functional on your local machine.


<br><br>

# **balance.js**

As we are making queries to the **Helius API**, a way to make requests is necessary, this can be through the native fetch, or in this case Axios.

```js
const axios = require('axios');
```

```js
async function getBalance(req) {
  const url = `https://api.helius.xyz/v0/addresses/${req}/balances?api-key=${process.env.HELIUS_KEY}`
  let { data } = await axios.get(url);
  return data.tokens
}
```

An asynchronous function is used in order to make requests, Helius's API is especially great in this instance, *GET* requests being especially simple and fast, allowing us a simple query function.

The `req` variable is the wallet that the user has input from the front-end, it will be added later, for testing purposes an assigned variable can be set with a static wallet already chosen.

<br>

In the main function, the list of tokens fetched from Helius will be passed into another function `getMetadata` where the metadata for the tokens will be returned, this will allow us to display them on the website.

```js
let balance = await getBalance(wallet)
let balanceMetadata = await getMetadata(balance);
```

Again, an asynchronous function as used in order to fetch data from the Helius API. The endpoint this time however is `/tokens/metadata` as although we have just gotten the list of tokens from the previous endpoint, the data is concise and does not include details, example below.

``` json
{
    "tokenAccount":"GiLNww7rPrw2P6SsCccBTN26BwBijee5xdXq5uhRHaC",
    "mint":"9GnYb1ukBUKHobqpmNdzBE7VkYn7wWqianpKaYFPChk",
    "amount": 22000000000,
    "decimals": 9
}
```

```js
async function getMetadata(tokens) {

  let mintAccounts = [], queriedTokens = tokens.map((e)=>e.mint);
  let url = `https://api.helius.xyz/v0/tokens/metadata?api-key=${process.env.HELIUS_KEY}`
  
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

  return mintAccounts
}
```

The map function will be used in order to extract the mint addresses from each object in the array of objects that is the wallet's list of tokens, the output is the variable `queriedTokens` an array of the each token's mint addresses, this will be passed into Helius's API in order to obtain the tokens' metadata.

Another example of pagination can be found on [Helius](https://docs.helius.xyz/reference/examples/pagination).

<br>

```js
res.status(200).json(balanceMetadata)
```
Our internal API will now return the array of tokens that the wallet holds along with their metadata.

<br><br>

# **AddressInput.jsx** 

The `AddressInput` component is essential in connecting our front and backend, connecting the internal API's retrieved data with the `TokenDisplay` component.

We will be making requests to our internal API, therefore use of Axios will be continued. 

```jsx
import axios from 'axios';
import React, { useState } from "react";
import TokenDisplay from "./TokenDisplay";
```

The state variable `address` will be used to store our user's inputted wallet address. The variable `balance` will be used to store our user's retrieved token data from out internal API. The variable `submit` will be used in order for us to provide a better UX, by adding an indicator that the data is loading. The variable `enter` also accompanies the other loading related variables, used to determine when the user has entered the query, but before the query response has been received.
```jsx
const [address, setAddress] = useState("");
const [balance, setBalance] = useState();
const [submit, setSubmit] = useState(false)
const [enter, setEnter] = useState(false)
```

A simple form will be used in order for the user to input a wallet address. Classes and styling will not be including in this walkthrough as they are not relevant (they are still included in the actual code).

```jsx
<form onSubmit={handleSubmit}>
  <input
    type="text"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
  />
  <button type="submit">
    <Image alt="mag" src="/mag.svg" width="24" height="24"></Image>
  </button>
</form>
```
Once entered, the `onChange` function calls our state variable's function, assigning the user's input as the variable `address` added earlier.

```jsx
async function handleSubmit(event) {
  event.preventDefault();

  setEnter(true)

  const response = await axios.post("/api/balance", { address: address });

  setSubmit(true)

  try {
    setBalance(response.data)
    console.log(response.data)
  }
  catch (err) {
    console.log(err)
  }
}
```

When the user clicks the submit button, the variable `handleSubmit` is called, where the request to our internal API is made. This makes a request to our earlier designed internal API, with the payload containing an object with the property `address`, passing in the state variable we assigned earlier from the user's input.

The `setSubmit` state variable will be used in order to determine when the data is retrieved, so that a loading indicator can be used while the user waits. 

```jsx
<React.Fragment>{(
        enter ? (
          <React.Fragment>{(
            submit ? (
              <TokenDisplay tokens={balance}></TokenDisplay>
            ) : (
              <Image alt="load" src="/loading.svg"></Image>
              ))}</React.Fragment>
        ) : (
          <div></div>
        )
      )}
</React.Fragment>
```

Once the user's data has been received, it is passed into the TokenDisplay function.

<br><br>

# **TokenDisplay.jsx**

Where the magic happens, the user's tokens and data that have been fetched from Helius's API are displayed.

A quick edit is necessary, being the fungible token's most important value, the amount is currently not being passed back to the frontend, in order to fix this at the end of the `getMetadata` function in `balance.js`, add 
```js
mintAccounts.map((e,i)=>e.amount = tokens[i].amount);
```

Starting with the **fungible tokens**, 

```jsx
for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].onChainData) {
            if (tokens[i].onChainData.tokenStandard == "Fungible" || tokens[i].onChainData.tokenStandard "FungibleAsset") {
                FTs.push(
                    <div key={tokens[i].mint}>
                        <a target="_blank" rel="noreferrer" href={"https://xray.helius.xyz/token/" + tokens[i].mint}>
                            <div>
                                <div>
                                    <React.Fragment>{(tokens[i].offChainData ?
                                        (<img src={tokens[i].offChainData.image}></img>) : (<PlaceholderToken></PlaceholderToken>>
                                        ))}</React.Fragment>
                                    <div>
                                        {tokens[i].onChainData.data.name}
                                    </div>
                                </div>

                                <div>{tokens[i].amount}</div>

                            </div>
                        </a>
                    </div>
                )

                continue
            }
        }
}
```

First, we iterate through the list of the users tokens we obtained from the Helius API, the first `if` statement is not particularly important, simply to avoid errors from the second `if` statement. While some older tokens may not contain this specific piece of metadata to determine whether or not it is fungible, to be safe, we will be using tokens specifically with the `tokenStandard` of "Fungible" or "FungibleAsset".

Now that we've determined whether or not the token is fungible, we can start appending to an array of DIVs that we will output later. The mint address, name, and amount of tokens the wallet holds is virtually always present, a placeholder image being added incase an image is not attached on-chain.

Moving onto NFTs

```jsx
if (tokens[i].offChainData) {
  NFTs.push(
      <div key={tokens[i].offChainData.mint}>
          <div>
              <a target="_blank" rel="noreferrer" href={"https://xray.helius.xyz/token/" + tokens[i].mint}>
                  <div>
                      <img src={tokens[i].offChainData.image}></img>
                  </div>
                  <div>
                      <div>
                          <div>
                              <div>{tokens[i].offChainData.name}</div>
                              <Image alt="Verified" src="/verified.svg" width="16" height="16"></Image>
                          </div>
                          <div>{tokens[i].onChainData.data.symbol ? (tokens[i].onChainData.data.symbol) : tokens[i].offChainData.symbol}</div>
                      </div>

                      <div>
                          <a target="_blank" rel="noreferrer" href={"https://www.magiceden.io/item-details/" + tokens[i].mint}>
                              <Image alt="ME" src="/ME.svg" width="24" height="24"></Image>
                          </a>
                      </div>
                  </div>
              </a>
          </div>

      </div>
  )
}
```

To reiterate, the initial `if` statement is not particularly important, their main purpose to screen for errors - by screening for these errors, a number of older NFTs may be missing though the vast majority should still be able to be displayed.

Like before, jsx is created using each object's (tokens) data, for some NFTs, the symbol of the collection may be available on-chain, therefore a quarternary operator is used in order to add them if possible.

Thats it! A simple display of all tokens for any given wallet using minimal code.

# **Next Steps**

- Occasional issues with API calls, error code 400 unsure why
- Queries for wallets with a large number of tokens will fail as Vercel has a timeout on API calls over 10 seconds, therefore a cap of 100 tokens is put in place to bypass this.
- DIV array not clearing when new wallet is input
- Scam NFTs are causing Chrome to view site as dangerous as there is a link to the scam's website
