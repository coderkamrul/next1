// 'use client'

// import React, { useEffect, useRef, useState } from 'react'
// import EditorJS from '@editorjs/editorjs'
// import Embed from '@editorjs/embed'
// import Table from '@editorjs/table'
// import Image from '@editorjs/image'
// import Quote from '@editorjs/quote'
// import Code from '@editorjs/code'
// import InlineCode from '@editorjs/inline-code'
// import Header from '@editorjs/header'
// import Checklist from '@editorjs/checklist'
// import Link from '@editorjs/link'
// import Marker from '@editorjs/marker'
// import Raw from '@editorjs/raw'
// import List from '@editorjs/list'
// import Delimiter from '@editorjs/delimiter'
// import SimpleImage from '@editorjs/simple-image'

// const uploadImageByFile = async (file) => {
//   const formData = new FormData()
//   formData.append('file', file)
//   formData.append('upload_preset', 'ml_default')

//   const response = await fetch(
//     `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//     {
//       method: 'POST',
//       body: formData,
//     }
//   )

//   const { secure_url } = await response.json()

//   return {
//     success: 1,
//     file: {
//       url: secure_url,
//     },
//   }
// }

// const uploadImageByURL = async (url) => {
//   try {
//     const response = await fetch(url)
//     if (!response.ok) throw new Error('Failed to fetch image')
//     return {
//       success: 1,
//       file: { url },
//     }
//   } catch (error) {
//     console.error('Error uploading image by URL:', error)
//     return {
//       success: 0,
//       file: null,
//     }
//   }
// }

// const Editor = ({ setTextEditor, setEditorState, formData, setFormData }) => {
//   const editorRef = useRef(null)
//   const content = {
//     blocks: formData.setupinstructions[0],
//   }
//   console.log(content)

//   useEffect(() => {
//     if (!editorRef.current) {
//       const editor = new EditorJS({
//         holder: 'textEditor',
//         data: Array.isArray(content) ? content : content,
//         tools: {
//           header: {
//             class: Header,
//             config: {
//               placeholder: 'Type Heading...',
//               levels: [2, 3],
//               defaultLevel: 2,
//             },
//             inlineToolbar: true,
//           },
//           checklist: Checklist,
//           embed: Embed,
//           table: Table,
//           image: {
//             class: Image,
//             config: {
//               uploader: {
//                 uploadByFile: uploadImageByFile,
//                 uploadByUrl: uploadImageByURL,
//               },
//             },
//           },
//           quote: {
//             class: Quote,
//             inlineToolbar: true,
//           },
//           code: Code,
//           linkTool: {
//             class: Link,
//             config: {
//               endpoint: '/api/link',
//             },
//           },
//           inlineCode: InlineCode,
//           marker: Marker,
//           delimiter: Delimiter,
//           raw: Raw,
//           list: {
//             class: List,
//             inlineToolbar: true,
//           },
//           simpleImage: SimpleImage,
//         },
//         data: formData.setupinstructions || {},
//         onChange: async () => {
//           const content = await editor.save()
//           setFormData((prevState) => ({
//             ...prevState,
//             setupinstructions: content,
//           }))
//         },
//         placeholder: 'Type / for commands and start making changes...',
//       })

//       editorRef.current = editor

//       editor.isReady.then(() => {
//         setTextEditor({ isReady: true })
//         setEditorState(editor)
//       })
//     }

//     return () => {
//       if (editorRef.current && editorRef.current.destroy) {
//         editorRef.current.destroy()
//       }
//     }
//   }, [setTextEditor, setEditorState, setFormData])

//   return <div id='textEditor' className='prose max-w-full' />
// }

// export default Editor
'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import EditorJS from '@editorjs/editorjs'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Image from '@editorjs/image'
import Quote from '@editorjs/quote'
import Code from '@editorjs/code'
import InlineCode from '@editorjs/inline-code'
import Header from '@editorjs/header'
import Checklist from '@editorjs/checklist'
import Link from '@editorjs/link'
import Marker from '@editorjs/marker'
import Raw from '@editorjs/raw'
import List from '@editorjs/list'
import Delimiter from '@editorjs/delimiter'
import SimpleImage from '@editorjs/simple-image'

const uploadImageByFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'ml_default')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  const { secure_url } = await response.json()

  return {
    success: 1,
    file: {
      url: secure_url,
    },
  }
}

const uploadImageByURL = async (url) => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch image')
    return {
      success: 1,
      file: { url },
    }
  } catch (error) {
    console.error('Error uploading image by URL:', error)
    return {
      success: 0,
      file: null,
    }
  }
}

const getEditorConfig = (holder, onChange, initialData) => ({
  holder,
  data: initialData,
  tools: {
    header: {
      class: Header,
      config: {
        placeholder: 'Type Heading...',
        levels: [2, 3],
        defaultLevel: 2,
      },
      inlineToolbar: true,
    },
    checklist: Checklist,
    embed: Embed,
    table: Table,
    image: {
      class: Image,
      config: {
        uploader: {
          uploadByFile: uploadImageByFile,
          uploadByUrl: uploadImageByURL,
        },
      },
    },
    quote: {
      class: Quote,
      inlineToolbar: true,
    },
    code: Code,
    linkTool: {
      class: Link,
      config: {
        endpoint: '/api/link',
      },
    },
    inlineCode: InlineCode,
    marker: Marker,
    delimiter: Delimiter,
    raw: Raw,
    list: {
      class: List,
      inlineToolbar: true,
    },
    simpleImage: SimpleImage,
  },
  onChange,
  placeholder: 'Type / for commands and start making changes...',
})

const Editor = ({ setTextEditor, setEditorState, formData, setFormData }) => {
  const editorRef = useRef(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const editorInstanceRef = useRef(null)

  const initialData = {
    blocks: formData.setupinstructions?.[0]?.blocks || [],
  }

  const handleEditorChange = useCallback(async () => {
    if (editorInstanceRef.current) {
      const content = await editorInstanceRef.current.save()
      setFormData((prevState) => ({
        ...prevState,
        setupinstructions: [content],
      }))
    }
  }, [setFormData])

  useEffect(() => {
    if (!editorInstanceRef.current && editorRef.current) {
      const editor = new EditorJS(
        getEditorConfig(editorRef.current, handleEditorChange, initialData)
      )

      editorInstanceRef.current = editor

      editor.isReady
        .then(() => {
          setIsEditorReady(true)
          setTextEditor({ isReady: true })
          setEditorState(editor)
        })
        .catch((error) => {
          console.error('Editor.js initialization failed:', error)
        })
    }

    return () => {
      if (editorInstanceRef.current && editorInstanceRef.current.destroy) {
        editorInstanceRef.current.destroy()
        editorInstanceRef.current = null
      }
    }
  }, [setTextEditor, setEditorState, handleEditorChange])

  useEffect(() => {
    const updateEditorContent = async () => {
      if (isEditorReady && editorInstanceRef.current) {
        const currentData = await editorInstanceRef.current.save()
        const newData = formData.setupinstructions?.[0]?.blocks || []

        if (JSON.stringify(currentData.blocks) !== JSON.stringify(newData)) {
          await editorInstanceRef.current.render({ blocks: newData })
        }
      }
    }

    updateEditorContent()
  }, [isEditorReady, formData.setupinstructions])

  return (
    <div className='editor-wrapper'>
      {!isEditorReady && (
        <div className='editor-loading'>Loading editor...</div>
      )}
      <div
        ref={editorRef}
        className={`prose max-w-full ${!isEditorReady ? 'hidden' : ''}`}
      />
    </div>
  )
}

export default React.memo(Editor)
