import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between px-4 py-3 border-b border-gray-300
    bg-white transition-all'>
      <Link to='/'>
        <img src={assets.logo} alt="logo" className='h-9 invert opcaity-80' />
      </Link>
      <UserButton/>
    </div>
  )
}

export default Navbar
