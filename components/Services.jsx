import Image from 'next/image'
import React from 'react'

const services = [
  {
    id: 1,
    image: '/science.webp',
    name: 'React',
  },
  {
    id: 2,
    image: '/next.webp',
    name: 'Next.js',
  },
  {
    id: 3,
    image: '/tailwind.webp',
    name: 'Tailwind CSS',
  },
  {
    id: 4,
    image: '/ts.webp',
    name: 'TypeScript',
  },
  {
    id: 5,
    image: '/Mongo.webp',
    name: 'MongoDB',
  },
  {
    id: 6,
    image: '/mern.webp',
    name: 'Mern',
  },
]

const Services = () => {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center'>
      {services.map((service) => (
        <div
          key={service.id}
          className='group relative flex flex-col items-center p-2 rounded-xl bg-background backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-lg'
        >
          <div className='relative h-16 w-16 mb-4'>
            <Image
              src={service.image}
              alt={service.name}
              loading='lazy'
              className='dark:hidden transition-transform duration-300 group-hover:scale-110 absolute w-full h-full object-contain'
              width={100}
              height={100}
            />
            <div
              className='absolute inset-0 bg-white hidden dark:block transition-transform duration-300 group-hover:scale-110'
              aria-hidden='true'
              style={{
                maskImage: `url("${service.image}")`,
                WebkitMaskImage: `url("${service.image}")`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center center',
              }}
            ></div>
          </div>

          <span className='text-base sm:text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300'>
            {service.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Services
