import React, { useEffect, useState } from 'react'
import { Editor } from 'novel'

export default function NovelEditor({ setContent, content }) {
  return (
    <Editor
      defaultValue={content}
      onUpdate={(editor) => {
        setContent(editor?.getHTML())
      }}
      onDebouncedUpdate={(editor) => {
        setContent(editor?.getHTML())
      }}
      disableLocalStorage={true}
      className='rounded-md border shadow-none'
    />
  )
}

// import React, { useEffect, useState } from 'react'
// import { Editor } from 'novel'

// export default function NovelEditor({ setContent, content }) {
//   return (
//     <Editor
//       defaultValue={content}
//       onUpdate={(editor) => {
//         setContent(editor?.getHTML())
//       }}
//       onDebouncedUpdate={(editor) => {
//         setContent(editor?.getHTML())
//       }}
//       disableLocalStorage={true}
//       className='rounded-md border shadow-none'
//     />
//   )
// }
