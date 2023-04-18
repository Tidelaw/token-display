import axios from 'axios';
import React, { useState } from "react";
import TokenDisplay from "./TokenDisplay";

export default function AddressInput() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState();
  const [submit, setSubmit] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await axios.post("/api/events", { address: address });

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
    <div className='flex h-full flex-col justify-center items-center xl:p-16 p-4 pt-8 space-y-24'>

      <form onSubmit={handleSubmit} className="flex row-start-1 col-span-2 p-2 space-x-4 items-center justify-center">
        <input
          type="text"
          value={address}
          className="rounded-lg w-full xl:w-[28.3rem] h-12 outline-0 p-4 bg-zinc-800 text-white"
          onChange={(e) => setAddress(e.target.value)}
        />
        <input className='p-2 rounded-lg bg-orange font-bold text-light-black duration-200 hover:bg-light-orange cursor-pointer' type="submit"></input>

      </form>

      <React.Fragment>{(
        submit?(
          <TokenDisplay tokens={balance}></TokenDisplay>
        ):(
          <div></div>
        )
      )}
      </React.Fragment>

    </div>
  )
}