'use client'

import React, { useEffect, useRef, useState } from 'react'
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

const EditorForEdit = ({ formData, setFormData }) => {
  const [editorState, setEditorState] = useState(null)
  const [textEditor, setTextEditor] = useState({ isReady: false })
  const editorRef = useRef(null)

  console.log(formData.setupinstructions[0]?.blocks)

  useEffect(() => {
    const editor = new EditorJS({
      holder: 'textEditor',
      data: Array.isArray(formData.setupinstructions)
        ? formData.setupinstructions[0]
        : formData.setupinstructions,
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
      data: formData.setupinstructions || {},
      onChange: async () => {
        const content = await editor.save()
        setFormData((prevState) => ({
          ...prevState,
          setupinstructions: content,
        }))
      },
      placeholder: 'Type / for commands and start making changes...',
    })

    editorRef.current = editor

    editor.isReady.then(() => {
      setTextEditor({ isReady: true })
      setEditorState(editor)
    })
  }, [formData, setFormData])

  return <div id='textEditor' className='prose max-w-full' />
}

export default EditorForEdit
