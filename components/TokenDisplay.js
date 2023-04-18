import React, { useState } from "react";


export default function AddressInput({tokens}) {
    let divs = [];
    console.log(tokens, 'uiyf')
 
    for (let i = 0; i<tokens.length; i++){
        divs.push(
            <div className="flex w-full h-24 text-white">{tokens[i].tokenAccount} {tokens[i].amount}</div>
        )
    }

    return (
        tokens
        ? (
            <div className="flex w-full h-full text-white flex-col">
                {divs}
            </div>
        ) : (
            <div></div>
        )
    )
}