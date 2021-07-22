import React from 'react'
import Link from 'next/link'

const Footer: React.FC = () => {
  return (
    <footer className="grid grid-cols-1 md:grid-cols-3 justify-items-center gap-x-1 gap-y-4 py-4 mx-8 mt-10 text-gray-500 font-semibold border-t border-gray-300">
      <div className="flex flex-col md:text-center w-48">
        <Link href="/">
          <a className="text-2xl font-semibold text-gray-600">Blog</a>
        </Link>
      </div>
      <div className="flex flex-col w-48">
        <h3 className="text-xl font-semibold text-gray-600">Contact</h3>
        <ul>
          <li><address>(000) 000 - 0000</address></li>
          <li><address>blogemail@blogemail.com</address></li>
        </ul>
      </div>
      <div className="flex flex-col w-48">
        <h3 className="text-xl font-semibold text-gray-600">Company</h3>
        <ul>
          <li><Link href="/about"><a>About</a></Link></li>
          <li>Careers</li>
        </ul>
      </div>
      <p className="text-center col-span-full text-gray-400">Copyright 2021 Blog. All rights reserved.</p>
    </footer>
  )
}

export default Footer