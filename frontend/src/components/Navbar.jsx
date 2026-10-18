import React from 'react'

export const Navbar = () => {
  return (
    <nav className="flex justify-between bg-violet-400 p-2  sticky top-0 z-50">
      <div className="text-xl font-bold">Project<span className='text-purple-800'>Manager</span></div>
      {/* <span className='size-8  absolute left-24 '><img src="assets/password-manager.png" alt="" /></span> */}
        <li className="list-none"> 
            <ul className="flex flex-row gap-5">
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </ul>
        </li>
    </nav>
  )
}
