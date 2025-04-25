'use client'

import { CheckCheck, Copy, Minus } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
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
      className={`pl-5 space-y-2 ml-2 ${
        style === 'unordered' ? 'list-disc' : 'list-decimal'
      }`}
    >
      {data.items.map((item, index) => (
        <li
          key={index}
          className=''
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
    const { caption, link, alignment, size, withBorder, withBackground, stretched, file } = data;

    // Define image classes with Tailwind CSS
    const imageClasses = [
      'w-full',
      'object-cover',
      'transition-all',
      'hover:scale-105',
      withBorder ? 'border' : '',
      withBackground ? 'bg-background scale-80' : '',
      stretched ? 'h-full' : '',
    ].filter(Boolean).join(' ');

    // Apply size as a percentage
    const imageStyle = { width: `${size}%` };

    // Define alignment classes for the figure element
    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };
    const figureClasses = [
      'my-8 flex',
      alignmentClasses[alignment || 'center'], // Default to center if alignment is not specified
    ].join(' ');

    // Render the image, optionally wrapped in a link
    const imageElement = (
      <Image
        src={file.url}
        alt={caption || 'Image'} // Use caption as alt if provided, otherwise default
        width={1000}
        height={1000}
        
        className={imageClasses}
      />
    );

    return (
      <figure >
        <div className="flex flex-col items-center gap-4 w-full">
          <div className={figureClasses}>
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" style={imageStyle} className='block'>
                {imageElement}
              </a>
            ) : (
              imageElement
            )}
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {caption}
            </figcaption>
          )}
        </div>
      </figure>
    );
  }
  
  if (type === 'button') {
    const { text, url, alignment, backgroundColor, textColor, textSize, buttonSize, isStretched } = data;

    // Define button classes with Tailwind CSS
    const textSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };
    const buttonSizeClasses = {
      sm: 'px-2 py-1',
      md: 'px-4 py-2',
      lg: 'px-6 py-3',
    };
    const buttonClasses = [
      'inline-block',
      'rounded-lg',
      'transition',
      'hover:scale-105',
      textSizeClasses[textSize || 'md'],
      buttonSizeClasses[buttonSize || 'md'],
      isStretched ? 'w-full text-center' : 'w-auto', // Apply full-width if stretched
    ].join(' ');

    // Apply background and text color as inline styles
    const buttonStyles = {
      backgroundColor: backgroundColor || '#3b82f6',
      color: textColor || '#ffffff',
    };

    // Define alignment classes for the container
    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };
    const containerClasses = [
      'my-4',
      alignmentClasses[alignment || 'center'], // Default to center if alignment is not specified
    ].join(' ');

    return (
      <div className={containerClasses}>
        <a
          href={url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses}
          style={buttonStyles}
        >
          {text || 'Click Me'}
        </a>
      </div>
    );
  }


 

  if (type === 'iframe') {
    const { url, width, height, alignment, withBorder, withBackground } = data;

    // Define iframe classes with Tailwind CSS
    const iframeClasses = ['rounded-lg', 'w-full'].join(' ');

    // Define container classes for alignment and styling
    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };
    const containerClasses = [
      'my-8',
      'max-w-full',
      alignmentClasses[alignment || 'center'], // Default to center if alignment is not specified
      withBorder ? 'border-2 border-gray-200 p-2' : '',
      withBackground ? 'bg-gray-100 p-2' : '',
    ].join(' ');

    // Prepare iframe attributes
    const iframeProps = {
      src: url,
      width: width || '100%',
      height: height || '400px',
      frameBorder: '0',
      allowFullScreen: true,
      className: iframeClasses,
    };

    // Handle Fiverr SDK for Fiverr widget iframes
    const iframeRef = useRef(null);

    useEffect(() => {
      if (url.includes('fiverr.com/gig_widgets') && iframeRef.current) {
        const script = document.createElement('script');
        script.src = 'https://www.fiverr.com/gig_widgets/sdk';
        script.async = true;
        script.addEventListener('load', () => {
          if (window.FW_SDK && iframeRef.current) {
            window.FW_SDK.register(iframeRef.current);
          }
        });
        document.body.appendChild(script);

        // Cleanup
        return () => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        };
      }
    }, [url]);

    return (
      <div className={containerClasses}>
        <div style={{ overflow: 'auto', maxHeight: '80vh' }}>
          <iframe ref={iframeRef} {...iframeProps} />
        </div>
      </div>
    );
  }

  if (type === 'amazonProductCard') {
    const { products, alignment, withBorder, withBackground } = data;

    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };
    const containerClasses = [
      'my-8',
      'max-w-7xl',
      'mx-auto',
      alignmentClasses[alignment || 'center'],
      withBorder ? 'border-2 border-gray-200 rounded-lg' : '',
      withBackground ? 'bg-gray-50 p-6' : 'p-4',
    ].join(' ');

    if (products.length === 1) {
      const product = products[0];
      return (
        <div className={containerClasses}>
          <Card className="flex flex-col sm:flex-row overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 max-w-4xl mx-auto gap-1 md:gap-4">
            <div className="relative w-full sm:w-1/2 h-64 sm:h-auto">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover rounded-t-lg sm:rounded-t-none sm:rounded-l-lg"
              />
            </div>
            <div className="p-6 w-full sm:w-1/2 flex flex-col justify-between">
              <div>
              <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=' hover:underline'
                >
                <h3 className="text-xl hover:text-orange-600 font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                </a>
                {product.price && (
                  <p className="text-lg font-bold mt-1 text-orange-600">$ {product.price}</p>
                )}
                {product.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                )}
              </div>
              <Button
                asChild
                className="mt-4 w-full rounded-md py-2 text-sm font-medium bg-orange-600 hover:bg-orange-700 transition-colors"
                
              >
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-orange-700"
                >
                  {product.buttonText || 'Buy Now'}
                </a>
              </Button>
            </div>
          </Card>
        </div>
      );
    } else {
      const gridClasses = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      }[products.length] || 'grid-cols-1';

      return (
        <div className={containerClasses}>
          <div className={`grid ${gridClasses} gap-6`}>
            {products.map((product, index) => (
              <Card
                key={index}
                className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 "
              >
                <div className="relative h-48">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=' hover:underline'
                >
                <h3 className="text-md hover:text-orange-600 font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                </a>
                  {product.price && (
                    <p className="text-lg mt-1 font-bold text-orange-600">$ {product.price}</p>
                  )}
                  {product.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-grow">{product.description}</p>
                  )}
                  <Button
                    asChild
                    className="mt-4 w-full rounded-md py-2 text-sm font-medium bg-orange-600 hover:bg-orange-700 transition-colors"
                  >
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-orange-700"
                    >
                      {product.buttonText || 'Buy Now'}
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      );
    }
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


  // if (type === 'image') {
  //   const { caption, withBorder, withBackground, stretched, file } = data

  //   const imageClasses = [
  //     'w-full',
  //     'object-cover',
  //     'transition-all',
  //     'hover:scale-105',
  //     withBorder ? 'border' : '',
  //     withBackground ? 'bg-background scale-80' : '',
  //     stretched ? 'h-full' : '',
  //   ].join(' ')

  //   return (
  //     <figure className='my-8'>
  //       <div>
  //         <Image
  //           src={file.url}
  //           alt={caption}
  //           width={1000}
  //           height={1000}
  //           className={imageClasses}
  //         />
  //       </div>
  //       {caption && (
  //         <figcaption className='mt-2 text-center text-sm text-muted-foreground'>
  //           {caption}
  //         </figcaption>
  //       )}
  //     </figure>
  //   )
  // }