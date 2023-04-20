import React from "react";
import Image from 'next/image';

export default function AddressInput({ tokens }) {

    let NFTs = [], FTs = [];

    for (let i = 0; i < tokens.length; i++) {

        if (tokens[i].onChainData) {
            if (tokens[i].onChainData.tokenStandard == "Fungible" || tokens[i].onChainData.tokenStandard == "FungibleAsset") {
                console.log(tokens[i], FTs)
                FTs.push(
                    <div key={tokens[i].mint} className="flex flex-row w-3/4 text-white border border-1 border-neutral-800 px-4 py-4 rounded-lg hover:bg-neutral-800 duration-200">
                        <a className="w-full" target="_blank" rel="noreferrer" href={"https://xray.helius.xyz/token/" + tokens[i].mint}>
                            <div className="flex w-full items-center justify-between">

                                <div className="flex items-center space-x-4">
                                    <React.Fragment>{(tokens[i].offChainData ?
                                        (<img className='flex w-8 h-8 rounded-lg' src={tokens[i].offChainData.image}></img>) : (<svg viewBox="64 64 896 896" focusable="false" data-icon="copyright" width="32" height="32" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm5.6-532.7c53 0 89 33.8 93 83.4.3 4.2 3.8 7.4 8 7.4h56.7c2.6 0 4.7-2.1 4.7-4.7 0-86.7-68.4-147.4-162.7-147.4C407.4 290 344 364.2 344 486.8v52.3C344 660.8 407.4 734 517.3 734c94 0 162.7-58.8 162.7-141.4 0-2.6-2.1-4.7-4.7-4.7h-56.8c-4.2 0-7.6 3.2-8 7.3-4.2 46.1-40.1 77.8-93 77.8-65.3 0-102.1-47.9-102.1-133.6v-52.6c.1-87 37-135.5 102.2-135.5z"></path></svg>
                                        ))}</React.Fragment>
                                    <div className="font-medium">
                                        {tokens[i].onChainData.data.name}
                                    </div>
                                </div>

                                <div className="font-semibold">{tokens[i].amount}</div>

                            </div>
                        </a>
                    </div>
                )

                continue
            }
        }

        if (tokens[i].offChainData) {
            NFTs.push(
                <div key={tokens[i].offChainData.mint} className='flex w-64 flex-col h-max rounded-lg cursor-pointer '>
                    <div className='flex rounded-lg border border-1 border-neutral-800 hover:bg-neutral-800 duration-200 flex-col'>
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
                                    <div className='flex text-orange font-bold text-sm'>{tokens[i].onChainData.data.symbol ? (tokens[i].onChainData.data.symbol) : tokens[i].offChainData.symbol}</div>
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
                <div className="flex flex-row">

                    <div className="flex w-2/5 h-max flex-col">
                        <div className="flex w-full h-full rounded-lg flex-col items-center gap-4" key="FTs">
                            {FTs}
                        </div>
                    </div>

                    <div className="flex w-3/5 h-max flex-col">
                        <div key="NFTS" className='flex w-full h-max rounded-lg flex-row flex-wrap items-center justify-center gap-4'>
                            {NFTs}
                        </div>
                    </div>

                </div>

            ) : (
                <div></div>
            )
    )
}