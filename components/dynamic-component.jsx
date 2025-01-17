// 'use client'

// import React, { useState, useEffect } from 'react'
// import { transform } from 'sucrase'
// import 'tailwindcss/tailwind.css'

// export const DynamicComponent = ({ code }) => {
//   const [component, setComponent] = useState(null)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     try {
//       const { code: transformedCode } = transform(code, {
//         transforms: ['typescript', 'jsx'],
//       })

//       const sanitizedCode = transformedCode
//         .replace(/import\s.*from\s.*/g, '')
//         .replace(/export\sdefault\s/g, '')

//       const createComponent = new Function(
//         'React',
//         `
//           ${sanitizedCode}
//           return MyComponent;
//         `
//       )

//       const Component = createComponent(React)

//       setComponent(React.createElement(Component))
//       setError(null)
//     } catch (err) {
//       console.error('Error:', err)
//       setError(String(err))
//       setComponent(null)
//     }
//   }, [code])

//   if (error) {
//     return (
//       <div className='p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
//         <pre className='whitespace-pre-wrap'>{error}</pre>
//       </div>
//     )
//   }

//   return (
//     <div className='preview'>
//       {component || <div>Error rendering component</div>}
//     </div>
//   )
// }

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { transform } from 'sucrase'

export const DynamicComponent = ({ code }) => {
  const [error, setError] = useState(null)

  const component = useMemo(() => {
    try {
      // Transform the code using Sucrase
      const { code: transformedCode } = transform(code, {
        transforms: ['typescript', 'jsx'],
      })

      // Sanitize imports and default exports
      const sanitizedCode = transformedCode
        .replace(/import\s.*from\s.*/g, '')
        .replace(/export\sdefault\s/g, '')

      // Create a new component from the sanitized code
      const createComponent = new Function(
        'React',
        `  
          ${sanitizedCode}
          return MyComponent;
        `
      )

      // Return the created React component
      setError(null)
      return React.createElement(createComponent(React))
    } catch (err) {
      console.error('Error:', err)
      setError(String(err))
      return null
    }
  }, [code])

  // Render error or component
  if (error) {
    return (
      <div className='p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
        <pre className='whitespace-pre-wrap'>{error}</pre>
      </div>
    )
  }
  console.log(component)
  return (
    <div className='preview'>
      {component || <div>Error rendering component</div>}
    </div>
  )
}
