import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import TokenDisplay from "./TokenDisplay";
import Image from 'next/image';
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function AddressInput() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState();
  const [submit, setSubmit] = useState(false)
  const [enter, setEnter] = useState(false)
  let wallet = useWallet();

  useEffect(() => {

    async function main () {
      setEnter(true)

      const response = await axios.post("/api/balance", { address: wallet?.publicKey?.toBase58() });

      setSubmit(true)

      try {
        setBalance(response.data)
      }
      catch (err) {
        console.log(err)
      }
    }

    if (wallet?.publicKey?.toBase58()) {
      setAddress(wallet.publicKey.toBase58())
      console.log(wallet?.publicKey?.toBase58())
      main()
    }
  }, [wallet])

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


  return (
    <div className='flex w-full h-full flex-col justify-center items-center'>

      <div className='flex w-full justify-evenly'>

        <div className='flex justify-center space-x-2 py-16'>
          <form onSubmit={handleSubmit} className="flex items-center justify-center">
            <input
              type="text"
              value={address}
              className="flex px-4 py-2 rounded-l-lg w-full xl:w-[28.3rem] outline-0 bg-zinc-800 text-white"
              placeholder='T1d3crwf5cYLcVU5ojNRgJbJUXJta2uBgbtev2xWLAW'
              onChange={(e) => setAddress(e.target.value)}
            />
            <button className='flex p-2 rounded-r-lg bg-zinc-800 font-bold text-white duration-200 cursor-pointer' type="submit">
              <svg className='flex w-6 p-1 rounded-lg hover:bg-zinc-700 duration-200' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#FFFFFF" d="m15.97 17.031c-1.479 1.238-3.384 1.985-5.461 1.985-4.697 0-8.509-3.812-8.509-8.508s3.812-8.508 8.509-8.508c4.695 0 8.508 3.812 8.508 8.508 0 2.078-.747 3.984-1.985 5.461l4.749 4.75c.146.146.219.338.219.531 0 .587-.537.75-.75.75-.192 0-.384-.073-.531-.22zm-5.461-13.53c-3.868 0-7.007 3.14-7.007 7.007s3.139 7.007 7.007 7.007c3.866 0 7.007-3.14 7.007-7.007s-3.141-7.007-7.007-7.007z"></path></svg>
            </button>
          </form>

          <div className='flex'>
            <WalletMultiButtonDynamic className='flex z-10 bg-zinc-900 hover:bg-zinc-900 hover:opacity-100 duration-200 animate-fade' />
          </div>
        </div>
      </div>

      <React.Fragment>{(
        enter ? (

          <React.Fragment>{(
            submit ? (
              <TokenDisplay tokens={balance}></TokenDisplay>
            ) : (
              <svg aria-hidden="true" className="inline w-16 mr-2 text-neutral-800 animate-spin fill-orange" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>))}</React.Fragment>

        ) : (
          <div></div>
        )
      )}
      </React.Fragment>

    </div>
  )
}