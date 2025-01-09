import { CheckCheck, Copy, Minus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const List = ({ style, data }) => {
  return (
    <ol
      className={`pl-5 ${style === 'unordered' ? 'list-disc' : 'list-decimal'}`}
    >
      {data.items.map((item, index) => (
        <li
          key={index}
          className='my-4'
          dangerouslySetInnerHTML={{ __html: item.text }}
        />
      ))}
    </ol>
  )
}

const InstructionBlock = ({ instruction }) => {
  let { type, data } = instruction

  if (type === 'paragraph') {
    return <p dangerouslySetInnerHTML={{ __html: data.text }} />
  }

  if (type === 'header') {
    if (data.level === 3) {
      return (
        <h3
          className='text-lg font-semibold'
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      )
    }

    if (data.level === 2) {
      return (
        <h2
          className='text-xl font-bold'
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      )
    }

    if (data.level === 1) {
      return (
        <h1
          className='text-2xl font-extrabold'
          dangerouslySetInnerHTML={{ __html: data.text }}
        />
      )
    }
  }
  if (type === 'code') {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = () => {
      navigator.clipboard.writeText(data.code).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }

    return (
      <div className='relative my-8'>
        <pre
          className='rounded-lg border p-4 text-sm leading-6 overflow-x-auto bg-gray-900 text-white shadow-md'
          dangerouslySetInnerHTML={{ __html: data.code }}
        />
        <button
          type='button'
          className='absolute top-2 right-2 flex items-center px-2 py-1 rounded-md bg-background text-foreground hover:bg-muted-foreground'
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy'}
        >
          {copied ? (
            <CheckCheck className='w-4 h-4' />
          ) : (
            <Copy className='w-4 h-4' />
          )}
        </button>
      </div>
    )
  }
  if (type === 'image') {
    return (
      <div className='w-full overflow-hidden'>
        <Image
          src={data.file.url}
          alt={data.caption}
          title={data.caption}
          width={1000}
          height={1000}
        />
        <p className='text-center'>{data.caption}</p>
      </div>
    )
  }
  if (type === 'quote') {
    return (
      <div className='bg-purple-600/10 p-3 pl-5 border-l-4 border-purple-600'>
        <p className='text-xl leading-10 '>{data.text}</p>
        <p className='w-full text-purple-600 text-base'>{data.caption}</p>
      </div>
    )
  }
  if (type === 'horizontalRule') {
    return <hr />
  }
  if (type === 'list') {
    return <List style={data.style} items={data.items} />
  }
  if (type === 'table') {
    return (
      <div
        className={`w-full overflow-x-auto ${
          data.withHeadings ? '' : 'table-auto'
        }`}
      >
        <table className='w-full'>
          {data.withHeadings && (
            <thead>
              <tr>
                {data.content[0].map((header, index) => (
                  <th
                    key={index}
                    className='border border-gray-300 px-4 py-2 text-left'
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {data.content.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className='border border-gray-300 px-4 py-2 text-left'
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  if (type === 'embed') {
    return (
      <div
        className='relative w-full aspect-video rounded my-4 overflow-hidden'
        style={{ paddingBottom: `${(data.height / data.width) * 100}%` }}
      >
        <iframe
          src={data.embed}
          className='absolute inset-0 w-full h-full'
          width={data.width}
          height={data.height}
          frameBorder='0'
          allowFullScreen
        ></iframe>
      </div>
    )
  }
  if (type === 'checklist') {
    return (
      <ul className='list-none m-0 p-0 space-y-2 my-4'>
        {data.items.map((item, index) => (
          <li key={index} className='flex items-center'>
            <input
              type='checkbox'
              className='mr-2 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-offset-0 focus:ring-primary-200'
              checked={item.checked}
              onChange={() => {}}
            />
            <span className='select-none'>{item.text}</span>
          </li>
        ))}
      </ul>
    )
  }
  if (type === 'raw') {
    return (
      <div className='my-4' dangerouslySetInnerHTML={{ __html: data.html }} />
    )
  }
  if (type === 'linkTool') {
    return (
      <div className='my-4 w-full'>
        <a
          href={data.link}
          className='text-primary hover:underline w-full bg-gray-600/10 my-4 p-3 border-primary rounded block'
          target='_blank'
          rel='noopener noreferrer'
        >
          {data.link}
        </a>
      </div>
    )
  }

  if (type === 'delimiter') {
    return (
      <div className='my-6 flex items-center justify-center'>
        <Minus className='w-6 h-6 text-gray-300' />
      </div>
    )
  }
}

export default InstructionBlock
