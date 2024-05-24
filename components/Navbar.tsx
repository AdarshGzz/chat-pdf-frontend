import Image from 'next/image'
import React from 'react'
import Logo from '@/public/ailogo.svg'
import Upload from './Upload'

const Navbar = () => {
  return (
    <div className='w-screen py-2 border-black top-0 shadow-md flex flex-row items-center justify-between px-10 gap-3'>
      <Image height={100} width={120} className='md:w-[7rem] w-20' alt='logo' src={Logo}/>
      <div>
        <Upload/>
      </div>
    </div>
  )
}

export default Navbar