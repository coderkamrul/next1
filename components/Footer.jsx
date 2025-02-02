import { Github } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { FaDiscord, FaGithub, FaWhatsapp, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='max-w-7xl mx-auto  z-10 '>
      <div className='border-t pt-6 sm:flex sm:items-center sm:justify-between'>
        <ul className='flex flex-wrap justify-center gap-4 text-base lg:justify-end'>
          <li>
            <p className='text-gray-500 transition hover:opacity-75'>
              Shahin Alam
            </p>
          </li>
          <li>
            <p className='text-gray-500 transition hover:opacity-75'>
              &copy; {new Date().getFullYear()}
            </p>
          </li>
        </ul>
        <ul className='my-4 flex justify-center gap-6 sm:mt-0 lg:justify-end'>
          <li>
            <Link href='https://github.com/coderkamrul' target='_blank'>
              <FaGithub
                className='text-gray-500 transition hover:text-primary'
                size={24}
              />
            </Link>
          </li>
          <li>
            <Link href='https://wa.me/+8801302032326' target='_blank'>
              <FaWhatsapp
                className='text-gray-500 transition hover:text-primary'
                size={24}
              />
            </Link>
          </li>
          <li>
            <Link href='https://www.youtube.com/@codingreact' target='_blank'>
              <FaYoutube
                className='text-gray-500 transition hover:text-primary'
                size={24}
              />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
