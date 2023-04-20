import Head from 'next/head'
import AddressInput from '../../components/AddressInput';

export default function Home() {
  return (
    <div className=''>
      <Head>
        <title>Events</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
      <div className="flex container flex-col min-w-full justify-center ">

        <div className='flex justify-center text-8xl font-black text-orange p-16 text-transparent bg-clip-text font-sans bg-gradient-to-r from-orange to-light-orange'>TOKEN SCAN</div>

        <AddressInput></AddressInput>

      </div>


    </div>
  )
}
