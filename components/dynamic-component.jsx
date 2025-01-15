'use client'

import React, { useState, useEffect } from 'react'
import { transform } from 'sucrase'

export const DynamicComponent = ({ code }) => {
  const [component, setComponent] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const { code: transformedCode } = transform(code, {
        transforms: ['typescript', 'jsx'],
      })

      const sanitizedCode = transformedCode
        .replace(/import\s.*from\s.*/g, '')
        .replace(/export\sdefault\s/g, '')

      const createComponent = new Function(
        'React',
        `
          ${sanitizedCode}
          return MyComponent;
        `
      )

      const Component = createComponent(React)

      setComponent(React.createElement(Component))
      setError(null)
    } catch (err) {
      console.error('Error:', err)
      setError(String(err))
      setComponent(null)
    }
  }, [code])

  if (error) {
    return (
      <div className='p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
        <pre className='whitespace-pre-wrap'>{error}</pre>
      </div>
    )
  }

  return (
    <div className='preview'>
      {component || <div>Error rendering component</div>}
    </div>
  )
}

// 'use client'

// import React, { useState, useEffect } from 'react'
// import { transform } from 'sucrase'

// export const DynamicComponent = ({ code }) => {
//   const [component, setComponent] = useState(null)
//   const [error, setError] = useState(null)
//   const [timer, setTimer] = useState(null)

//   useEffect(() => {
//     if (timer) {
//       clearTimeout(timer)
//     }

//     const newTimer = setTimeout(() => {
//       try {
//         const { code: transformedCode } = transform(code, {
//           transforms: ['typescript', 'jsx'],
//         })

//         const sanitizedCode = transformedCode
//           .replace(/import\s.*from\s.*/g, '')
//           .replace(/export\sdefault\s/g, '')

//         const createComponent = new Function(
//           'React',
//           `
//             ${sanitizedCode}
//             return MyComponent;
//           `
//         )

//         const Component = createComponent(React)

//         setComponent(React.createElement(Component))
//         setError(null)
//       } catch (err) {
//         console.error('Error:', err)
//         setError(String(err))
//         setComponent(null)
//       }
//     }, 1000)

//     setTimer(newTimer)
//   }, [code])

//   if (error) {
//     return (
//       <div className='p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
//         <pre className='whitespace-pre-wrap'>{error}</pre>
//       </div>
//     )
//   }

//   return <div className='preview'>{component || <div>Loading...</div>}</div>
// }
