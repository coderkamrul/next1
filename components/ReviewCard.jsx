'use client'
import React from 'react'
import { FaStar } from 'react-icons/fa'
import { motion, px } from 'framer-motion'
const ReviewCard = ({ from, message, image, name, star, color }) => {
  return (
    <motion.div
      whileHover={{
        scale: [null, 1.05, 1.02, 1.05],
        translateY: [null, 0, 0, -5],
      }}
      transition={{ duration: 0.5 }}
      className='relative p-6 rounded-2xl bg-white/90 dark:bg-gray-950 backdrop-blur-sm
        shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] transform-gpu transition-colors duration-300 ease-in-out'
    >
      <div className='absolute -top-3 -left-3'>
        <div
          className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
        >
          {image}
        </div>
      </div>
      <div className='mt-4'>
        <div className='flex mb-2'>
          {[...Array(Number(star))].map((_, i) => (
            <FaStar key={i} size={16} className='fill-yellow-400' />
          ))}
        </div>
        <p className='text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed'>
          {message}
        </p>
        <div className='mt-4 border-t border-gray-100 dark:border-gray-700 pt-4'>
          <p className='font-semibold text-primary'>{name}</p>
          <p className='text-sm text-gray-500 dark:text-gray-400'>{from}</p>
        </div>
      </div>
      <div className='absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-primary to-primary-600 rounded-full'></div>
    </motion.div>
  )
}

export default ReviewCard
