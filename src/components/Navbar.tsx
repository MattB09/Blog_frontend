import React, { useState, useRef} from 'react'
import Link from 'next/link'
import { useAuthContext } from './auth/AuthProvider'
import API from '../utils/api'
import router from 'next/router'

const Navbar: React.FC = () => {
  const { status, logout } = useAuthContext();
  const navList = useRef<HTMLInputElement>(null);

  const handleLogoutClicked = (): void => {
    API.post(`/logout`, {}, { withCredentials: true })
    logout()
    router.push(`/`)
  }

  function toggleNav() {
    navList?.current?.classList.toggle('hidden');
  }

  return (
    <header className="flex items-center flex-wrap bg-blue-800 text-gray-100 py-3 pl-10 pr-6 md:pl-14 md:pr-14">

      <Link href="/">
        <a className="no-underline font-bold text-2xl tracking-wider">
          Blog
        </a>
      </Link>

      <button className="inline-flex px-2 py-1 hover:bg-gray-100 hover:text-blue-800 rounded md:hidden ml-auto outline-none focus:outline-none" onClick={toggleNav}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <nav ref={navList} className="hidden ml-auto w-full md:inline-flex md:w-auto">
        <ul className="w-full items-start justify-end flex flex-col md:inline-flex md:flex-row md:w-auto md:ml-auto md:items-center md:h-auto">
          <li className="mt-1 md:mt-0 md:mr-6"><Link href="/"><a onClick={toggleNav}>Home</a></Link></li>
          {status === 'authenticated' 
          ? (
          <>
            <li className="mt-1 md:mt-0 md:mr-6"><Link href="/addpost"><a onClick={toggleNav}>Add a Post</a></Link></li>
            <li className="mt-1 md:mt-0 md:mr-6"><Link href="/myposts"><a onClick={toggleNav}>My Posts</a></Link></li>
            <li className="mt-2 md:mt-0">
              <button onClick={handleLogoutClicked} className="px-2 py-1 bg-gray-100 text-blue-800 hover:bg-gray-400 rounded outline-none focus:outline-none">
                Logout
              </button>
            </li>
          </>
          )
          : (
          <>
            <li className="mt-1 md:mt-0 md:mr-6" onClick={toggleNav}><Link href="/about"><a onClick={toggleNav}>About</a></Link></li>
            <li className="mt-2 md:mt-0">
              <Link href="/signin">
                <a onClick={toggleNav} className="px-2 py-1 bg-gray-100 text-blue-800 hover:bg-gray-400 rounded outline-none focus:outline-none">
                  Sign In
                </a>
              </Link>
            </li>
          </>
          )}
        </ul>
      </nav>
      
    </header>
  )
}

export default Navbar
