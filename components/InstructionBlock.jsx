'use client'

import { CheckCheck, Copy, Minus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const List = ({ style, data }) => {
  return (
    <ol
      className={`pl-5 space-y-4 ${
        style === 'unordered' ? 'list-disc' : 'list-decimal'
      }`}
    >
      {data.items.map((item, index) => (
        <li
          key={index}
          className='my-4'
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      ))}
    </ol>
  )
}

const InstructionBlock = ({ instruction }) => {
  let { type, data } = instruction

  if (type === 'paragraph') {
    return (
      <p
        className='leading-7 [&:not(:first-child)]:mt-6'
        dangerouslySetInnerHTML={{ __html: data.text }}
      />
    )
  }

  if (type === 'header') {
    const headerClasses = {
      1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    }

    return React.createElement(`h${data.level}`, {
      className: headerClasses[data.level],
      dangerouslySetInnerHTML: { __html: data.text },
    })
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
          className='rounded-lg border bg-muted px-4 py-4 font-mono text-sm overflow-x-auto'
          style={{
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {data.code}
        </pre>
        <Button
          variant='ghost'
          size='icon'
          className='absolute right-4 top-2 text-muted-foreground'
          onClick={handleCopy}
        >
          {copied ? (
            <CheckCheck className='h-4 w-4' />
          ) : (
            <Copy className='h-4 w-4' />
          )}
          <span className='sr-only'>Copy code</span>
        </Button>
      </div>
    )
  }

  if (type === 'image') {
    const { caption, withBorder, withBackground, stretched, file } = data

    const imageClasses = [
      'w-full',
      'object-cover',
      'transition-all',
      'hover:scale-105',
      withBorder ? 'border' : '',
      withBackground ? 'bg-background scale-80' : '',
      stretched ? 'h-full' : '',
    ].join(' ')

    return (
      <figure className='my-8'>
        <div>
          <Image
            src={file.url}
            alt={caption}
            width={1000}
            height={1000}
            className={imageClasses}
          />
        </div>
        {caption && (
          <figcaption className='mt-2 text-center text-sm text-muted-foreground'>
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (type === 'quote') {
    return (
      <Card className='my-8'>
        <blockquote className='border-l-4 border-primary p-6'>
          <p className='text-xl font-semibold leading-loose'>{data.text}</p>
          {data.caption && (
            <footer className='mt-2 text-sm text-muted-foreground'>
              — {data.caption}
            </footer>
          )}
        </blockquote>
      </Card>
    )
  }

  if (type === 'horizontalRule') {
    return <hr className='my-8' />
  }

  if (type === 'list') {
    return <List style={data.style} data={data} />
  }

  if (type === 'table') {
    return (
      <div className='my-8 w-full overflow-auto'>
        <Table>
          {data.withHeadings && (
            <TableHeader>
              <TableRow>
                {data.content[0].map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {(data.withHeadings ? data.content.slice(1) : data.content).map(
              (row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (type === 'embed') {
    return (
      <div className='my-8 aspect-video overflow-hidden rounded-lg'>
        <iframe
          src={data.embed}
          className='h-full w-full'
          width={data.width}
          height={data.height}
          frameBorder='0'
          allowFullScreen
        />
      </div>
    )
  }

  if (type === 'checklist') {
    return (
      <div className='my-8 space-y-4'>
        {data.items.map((item, index) => (
          <div key={index} className='flex items-center space-x-2'>
            <Checkbox id={`item-${index}`} checked={item.checked} />
            <label
              htmlFor={`item-${index}`}
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              {item.text}
            </label>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'raw') {
    return (
      <div className='my-8' dangerouslySetInnerHTML={{ __html: data.html }} />
    )
  }

  if (type === 'linkTool') {
    return (
      <Card className='my-8'>
        <a
          href={data.link}
          className='block p-6 hover:bg-muted/50'
          target='_blank'
          rel='noopener noreferrer'
        >
          <p className='text-sm text-muted-foreground'>{data.link}</p>
        </a>
      </Card>
    )
  }

  if (type === 'delimiter') {
    return (
      <div className='my-8 flex items-center justify-center'>
        <Minus className='h-6 w-6 text-muted-foreground' />
      </div>
    )
  }

  return null
}

export default InstructionBlock
