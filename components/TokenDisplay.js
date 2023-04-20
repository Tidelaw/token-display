import React, { useState } from "react";
import Image from 'next/image';

export default function AddressInput({ tokens }) {
    let divs = [];
    console.log(tokens, 'uiyf')

    for (let i = 0; i < tokens.length; i++) {

        if (tokens[i].onChainData) {
            if (tokens[i].onChainData.tokenStandard == "Fungible" || tokens[i].onChainData.tokenStandard == "FungibleAsset") { continue }
        }

        if (tokens[i].offChainData) {
            divs.push(
                <div key={tokens[i].offChainData.mint} className='flex w-64 flex-col h-max rounded-lg cursor-pointer '>
                    <div className='flex rounded-lg bg-neutral-800 hover:bg-neutral-700 duration-200 flex-col'>
                        <a target="_blank" rel="noreferrer" href={"https://xray.helius.xyz/token/" + tokens[i].mint}>

                            <div className='flex'>
                                <img className='flex w-64 rounded-lg' src={tokens[i].offChainData.image}></img>
                            </div>

                            <div className='flex flex-row justify-between p-4 h-18 text-md'>
                                <div className="flex flex-col">
                                    <div className='flex flex-row space-x-2'>
                                        <div className=' text-slate-100 font-medium truncate'>{tokens[i].offChainData.name}</div>
                                        <Image alt="Verified" src="/verified.svg" width="16" height="16"></Image>
                                    </div>
                                    <div className='flex text-orange font-bold text-sm'>{tokens[i].onChainData.data.symbol?(tokens[i].onChainData.data.symbol):tokens[i].offChainData.symbol}</div>
                                </div>
                                
                                <div className="flex flex-col items-start h-full">
                                    <a target="_blank" rel="noreferrer" href={"https://www.magiceden.io/item-details/" + tokens[i].mint}>
                                        <Image className="flex flex-start hover:bg-neutral-600 duration-200 p-1 rounded-lg" alt="ME" src="/ME.svg" width="24" height="24"></Image>
                                    </a>
                                </div>
                            </div>

                        </a>
                    </div>

                </div>
            )
        }
    }

    return (
        tokens
            ? (
                <div className='flex full h-max rounded-lg flex-row flex-wrap items-center justify-center gap-4'>
                    {divs}
                </div>
            ) : (
                <div></div>
            )
    )
}