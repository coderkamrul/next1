// 'use client'

// import React, { useEffect, useRef, useState, useCallback } from 'react'
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

// const getEditorConfig = (holder, onChange, initialData) => ({
//   holder,
//   data: initialData,
//   tools: {
//     header: {
//       class: Header,
//       config: {
//         placeholder: 'Type Heading...',
//         levels: [2, 3],
//         defaultLevel: 2,
//       },
//       inlineToolbar: true,
//     },
//     checklist: Checklist,
//     embed: Embed,
//     table: Table,
//     image: {
//       class: Image,
//       config: {
//         uploader: {
//           uploadByFile: uploadImageByFile,
//           uploadByUrl: uploadImageByURL,
//         },
//       },
//     },
//     quote: {
//       class: Quote,
//       inlineToolbar: true,
//     },
//     code: Code,
//     linkTool: {
//       class: Link,
//       config: {
//         endpoint: '/api/link',
//       },
//     },
//     inlineCode: InlineCode,
//     marker: Marker,
//     delimiter: Delimiter,
//     raw: Raw,
//     list: {
//       class: List,
//       inlineToolbar: true,
//     },
//     simpleImage: SimpleImage,
//   },
//   onChange,
//   placeholder: 'Type / for commands and start making changes...',
// })

// const Editor = ({ setTextEditor, setEditorState, formData, setFormData }) => {
//   const editorRef = useRef(null)
//   const [isEditorReady, setIsEditorReady] = useState(false)
//   const editorInstanceRef = useRef(null)

//   const initialData = {
//     blocks: formData.description ? [{ type: 'paragraph', data: { text: formData.description } }] : formData.setupinstructions?.[0]?.blocks || [],
//   }

//   const handleEditorChange = useCallback(async () => {
//     if (editorInstanceRef.current) {
//       const content = await editorInstanceRef.current.save()
//       setFormData((prevState) => ({
//         ...prevState,
//         setupinstructions: [content],
//       }))
//     }
//   }, [setFormData])

//   useEffect(() => {
//     if (!editorInstanceRef.current && editorRef.current) {
//       const editor = new EditorJS(
//         getEditorConfig(editorRef.current, handleEditorChange, initialData)
//       )

//       editorInstanceRef.current = editor

//       editor.isReady
//         .then(() => {
//           setIsEditorReady(true)
//           setTextEditor({ isReady: true })
//           setEditorState(editor)
//         })
//         .catch((error) => {
//           console.error('Editor.js initialization failed:', error)
//         })
//     }

//     return () => {
//       if (editorInstanceRef.current && editorInstanceRef.current.destroy) {
//         editorInstanceRef.current.destroy()
//         editorInstanceRef.current = null
//       }
//     }
//   }, [setTextEditor, setEditorState, handleEditorChange])

//   useEffect(() => {
//     const updateEditorContent = async () => {
//       if (isEditorReady && editorInstanceRef.current) {
//         const currentData = await editorInstanceRef.current.save()
//         const newData = formData.setupinstructions?.[0]?.blocks || []

//         if (JSON.stringify(currentData.blocks) !== JSON.stringify(newData)) {
//           await editorInstanceRef.current.render({ blocks: newData })
//         }
//       }
//     }

//     updateEditorContent()
//   }, [isEditorReady, formData.setupinstructions])

//   return (
//     <div className='editor-wrapper'>
//       {!isEditorReady && (
//         <div className='editor-loading'>Loading editor...</div>
//       )}
//       <div
//         ref={editorRef}
//         className={`prose max-w-full ${!isEditorReady ? 'hidden' : ''}`}
//       />
//     </div>
//   )
// }

// export default React.memo(Editor)



















'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import Header from '@editorjs/header';
import Checklist from '@editorjs/checklist';
import Link from '@editorjs/link';
import Marker from '@editorjs/marker';
import Raw from '@editorjs/raw';
import List from '@editorjs/list';
import Delimiter from '@editorjs/delimiter';
import SimpleImage from '@editorjs/simple-image';

// Lucide-React icons as SVG strings
const lucideIcons = {
  square: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    </svg>
  `,
  image: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  `,
  maximize: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    </svg>
  `,
  download: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  `,
  alignLeft: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="21" y1="10" x2="3" y2="10"/>
      <line x1="17" y1="6" x2="3" y2="6"/>
      <line x1="17" y1="14" x2="3" y2="14"/>
      <line x1="21" y1="18" x2="3" y2="18"/>
    </svg>
  `,
  alignCenter: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="21" y1="10" x2="3" y2="10"/>
      <line x1="17" y1="6" x2="7" y2="6"/>
      <line x1="17" y1="14" x2="7" y2="14"/>
      <line x1="21" y1="18" x2="3" y2="18"/>
    </svg>
  `,
  alignRight: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="21" y1="10" x2="3" y2="10"/>
      <line x1="21" y1="6" x2="7" y2="6"/>
      <line x1="21" y1="14" x2="7" y2="14"/>
      <line x1="21" y1="18" x2="3" y2="18"/>
    </svg>
  `,
  palette: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="13.5" cy="6.5" r="1.5"/>
      <circle cx="17.5" cy="10.5" r="1.5"/>
      <circle cx="8.5" cy="7.5" r="1.5"/>
      <circle cx="6.5" cy="12.5" r="1.5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  `,
  text: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 6.1H7"/>
      <path d="M19 12.1H5"/>
      <path d="M15 18.1H9"/>
    </svg>
  `,
};

// Custom Image Tool (unchanged from your provided code)
class CustomImageTool {
  constructor({ data, config, api }) {
    this.api = api;
    this.config = config || {};
    this.data = {
      file: { url: '' },
      caption: '',
      link: '',
      alignment: 'center',
      size: 100,
      withBorder: false,
      withBackground: false,
      stretched: false,
      ...data,
    };

    this.wrapper = null;
    this.isUploading = false;
    this.settings = [
      { name: 'withBorder', icon: lucideIcons.square, title: 'With border' },
      { name: 'withBackground', icon: lucideIcons.image, title: 'Background' },
      { name: 'stretched', icon: lucideIcons.maximize, title: 'Stretch image' },
      { name: 'alignLeft', icon: lucideIcons.alignLeft, title: 'Align left' },
      { name: 'alignCenter', icon: lucideIcons.alignCenter, title: 'Align center' },
      { name: 'alignRight', icon: lucideIcons.alignRight, title: 'Align right' },
    ];
  }

  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg width="17" height="15"><path d="M2 2h13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 1v9h13V3H2zm2 2h3v3H4V5zm0 4h7v3H4V9zm9-4h3v7h-3V5z"/></svg>',
    };
  }

  render() {
    console.log('Rendering CustomImageTool with data:', this.data);

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('ce-block--image', 'mx-auto', 'max-w-full', 'p-2', 'rounded-lg', 'bg-gray-50', 'shadow-sm');

    if (!this.data.file.url) {
      const uploadArea = document.createElement('div');
      uploadArea.className = 'image-tool__upload-area border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:border-blue-500 transition';
      uploadArea.innerHTML = `
        <div class="image-tool__upload-placeholder flex flex-col items-center gap-2 text-gray-500">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p>Drag & drop an image here or click to upload</p>
        </div>
      `;

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.className = 'image-tool__file-input hidden';
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          await this.handleUpload(file, uploadArea);
        }
      });

      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('border-blue-500');
      });
      uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('border-blue-500');
      });
      uploadArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        uploadArea.classList.remove('border-blue-500');
        const file = e.dataTransfer.files[0];
        if (file) {
          await this.handleUpload(file, uploadArea);
        }
      });

      uploadArea.addEventListener('click', () => {
        fileInput.click();
      });

      this.wrapper.appendChild(uploadArea);
      this.wrapper.appendChild(fileInput);

      const urlInputWrapper = document.createElement('div');
      urlInputWrapper.className = 'image-tool__url-input-wrapper flex flex-col gap-2 mt-2';

      const urlInput = document.createElement('input');
      urlInput.className = 'image-tool__url-input w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
      urlInput.placeholder = 'Paste an image URL...';
      urlInput.addEventListener('input', (e) => {
        const url = e.target.value;
        if (url) {
          urlInputWrapper.querySelector('.image-tool__url-upload-button').textContent = 'Upload Image';
        }
      });
      urlInputWrapper.appendChild(urlInput);

      const urlUploadButton = document.createElement('button');
      urlUploadButton.className = 'image-tool__url-upload-button px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed';
      urlUploadButton.textContent = 'Upload Image';
      urlUploadButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = urlInput.value;
        if (url) {
          try {
            this.isUploading = true;
            urlUploadButton.textContent = 'Uploading...';
            urlUploadButton.disabled = true;
            urlInput.disabled = true;
            const response = await this.config.uploader.uploadByUrl(url);
            if (response.success) {
              this.data.file.url = response.file.url;
              this.wrapper.innerHTML = '';
              this.wrapper.appendChild(this.renderImageBlock());
            }
          } catch (error) {
            alert(error.message);
          } finally {
            this.isUploading = false;
            urlUploadButton.textContent = 'Upload Image';
            urlUploadButton.disabled = false;
            urlInput.disabled = false;
          }
        }
      });
      urlInputWrapper.appendChild(urlUploadButton);

      this.wrapper.appendChild(urlInputWrapper);
    } else {
      this.wrapper.appendChild(this.renderImageBlock());
    }

    return this.wrapper;
  }

  async handleUpload(file, uploadArea) {
    try {
      this.isUploading = true;
      uploadArea.innerHTML = '<p class="text-gray-500">Uploading...</p>';
      const response = await this.config.uploader.uploadByFile(file);
      if (response.success) {
        this.data.file.url = response.file.url;
        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(this.renderImageBlock());
      }
    } catch (error) {
      alert(error.message);
    } finally {
      this.isUploading = false;
    }
  }

  renderImageBlock() {
    const container = document.createElement('div');
    container.classList.add('image-tool', 'flex', 'flex-col', 'gap-2', 'items-center');
    if (this.data.withBorder) container.classList.add('border-2', 'border-gray-200', 'p-2');
    if (this.data.withBackground) container.classList.add('bg-gray-100', 'p-2');
    if (this.data.stretched) container.classList.add('w-full');
    container.setAttribute('data-alignment', this.data.alignment);

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-tool__image-wrapper w-full text-center';
    const image = document.createElement('img');
    image.src = this.data.file.url;
    image.className = 'max-w-full h-auto rounded';
    image.style.width = `${this.data.size}%`;
    if (this.config.lazyLoading) image.loading = 'lazy';

    if (this.data.link) {
      const link = document.createElement('a');
      link.href = this.data.link;
      link.className = 'inline-block';
      link.appendChild(image);
      imageWrapper.appendChild(link);
    } else {
      imageWrapper.appendChild(image);
    }

    const fieldsWrapper = document.createElement('div');
    fieldsWrapper.className = 'image-tool__fields-wrapper w-full flex flex-col gap-2';

    const caption = document.createElement('input');
    caption.classList.add('image-tool__caption', 'p-2', 'border', 'border-gray-300', 'rounded-lg', 'text-sm', 'text-gray-700', 'bg-white', 'focus:outline-none', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200');
    caption.placeholder = this.config.captionPlaceholder || 'Enter image caption...';
    caption.value = this.data.caption || '';
    caption.addEventListener('input', (e) => {
      this.data.caption = e.target.value;
    });
    fieldsWrapper.appendChild(caption);

    const linkInput = document.createElement('input');
    linkInput.classList.add('image-tool__link', 'p-2', 'border', 'border-gray-300', 'rounded-lg', 'text-sm', 'text-gray-700', 'bg-white', 'focus:outline-none', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200');
    linkInput.placeholder = this.config.urlPlaceholder || 'Enter link URL (optional)...';
    linkInput.value = this.data.link || '';
    linkInput.addEventListener('input', (e) => {
      this.data.link = e.target.value;
      imageWrapper.innerHTML = '';
      if (this.data.link) {
        const link = document.createElement('a');
        link.href = this.data.link;
        link.className = 'inline-block';
        link.appendChild(image);
        imageWrapper.appendChild(link);
      } else {
        imageWrapper.appendChild(image);
      }
    });
    fieldsWrapper.appendChild(linkInput);

    container.appendChild(imageWrapper);
    container.appendChild(fieldsWrapper);

    return container;
  }

  save(blockContent) {
    return this.data;
  }

  renderSettings() {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-tool__settings-wrapper flex flex-col gap-1 p-1';

    this.settings.forEach((setting) => {
      const settingItem = document.createElement('div');
      settingItem.className = 'image-tool__setting-item flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 transition';

      const icon = document.createElement('span');
      icon.className = 'image-tool__setting-icon';
      icon.innerHTML = setting.icon;

      const text = document.createElement('span');
      text.className = 'image-tool__setting-text text-sm';
      text.textContent = setting.title;

      settingItem.appendChild(icon);
      settingItem.appendChild(text);

      if (setting.name.startsWith('align')) {
        const isActive = this.data.alignment === setting.name.replace('align', '').toLowerCase();
        settingItem.classList.toggle('bg-blue-100', isActive);
        settingItem.classList.toggle('text-blue-500', isActive);
        settingItem.addEventListener('click', (e) => {
          e.preventDefault();
          this.data.alignment = setting.name.replace('align', '').toLowerCase();
          this.wrapper.querySelector('.image-tool').setAttribute('data-alignment', this.data.alignment);
          wrapper.querySelectorAll('.image-tool__setting-item').forEach((item) =>
            item.classList.remove('bg-blue-100', 'text-blue-500')
          );
          settingItem.classList.add('bg-blue-100', 'text-blue-500');
        });
      } else {
        settingItem.classList.toggle('bg-blue-100', this.data[setting.name]);
        settingItem.classList.toggle('text-blue-500', this.data[setting.name]);
        settingItem.addEventListener('click', (e) => {
          e.preventDefault();
          this.data[setting.name] = !this.data[setting.name];
          this.wrapper.querySelector('.image-tool').classList.toggle(setting.name, this.data[setting.name]);
          settingItem.classList.toggle('bg-blue-100', this.data[setting.name]);
          settingItem.classList.toggle('text-blue-500', this.data[setting.name]);
        });
      }

      wrapper.appendChild(settingItem);
    });

    const sizeWrapper = document.createElement('div');
    sizeWrapper.className = 'image-tool__setting-item flex items-center gap-2 p-2 rounded cursor-pointer';

    const sizeIcon = document.createElement('span');
    sizeIcon.className = 'image-tool__setting-icon';
    sizeIcon.innerHTML = lucideIcons.maximize;

    const sizeLabel = document.createElement('span');
    sizeLabel.className = 'image-tool__setting-text text-sm';
    sizeLabel.textContent = `${this.data.size}%`;

    const sizeInputWrapper = document.createElement('div');
    sizeInputWrapper.className = 'image-tool__size-input-wrapper w-full';
    const sizeInput = document.createElement('input');
    sizeInput.type = 'range';
    sizeInput.min = '10';
    sizeInput.max = '100';
    sizeInput.value = this.data.size;
    sizeInput.className = 'w-full';
    sizeInput.addEventListener('input', (e) => {
      this.data.size = e.target.value;
      sizeLabel.textContent = `Size: ${this.data.size}%`;
      this.wrapper.querySelector('.image-tool__image-wrapper img').style.width = `${this.data.size}%`;
    });
    sizeInputWrapper.appendChild(sizeInput);

    sizeWrapper.appendChild(sizeIcon);
    sizeWrapper.appendChild(sizeLabel);
    sizeWrapper.appendChild(sizeInputWrapper);
    wrapper.appendChild(sizeWrapper);

    this.config.actions?.forEach((action) => {
      const actionItem = document.createElement('div');
      actionItem.className = 'image-tool__setting-item flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 transition';

      const icon = document.createElement('span');
      icon.className = 'image-tool__setting-icon';
      icon.innerHTML = action.icon;

      const text = document.createElement('span');
      text.className = 'image-tool__setting-text text-sm';
      text.textContent = action.title;

      actionItem.appendChild(icon);
      actionItem.appendChild(text);

      actionItem.addEventListener('click', (e) => {
        e.preventDefault();
        action.action(action.name);
      });

      wrapper.appendChild(actionItem);
    });

    return wrapper;
  }
}

// Custom Button Tool with Tailwind CSS and additional settings
class CustomButtonTool {
  constructor({ data, config, api }) {
    this.api = api;
    this.config = config || {};
    this.data = {
      text: 'Click Me',
      url: '',
      alignment: 'center',
      backgroundColor: '#3b82f6', // Default blue
      textColor: '#ffffff', // Default white
      textSize: 'md', // sm, md, lg
      buttonSize: 'md', // sm, md, lg
      isStretched: false, // New property for full-width toggle
      ...data,
    };

    this.wrapper = null;
    this.settings = [
      // Alignment Settings Group
      { group: 'Alignment', name: 'alignLeft', icon: lucideIcons.alignLeft, title: 'Align Left', tooltip: 'Align the button to the left' },
      { group: 'Alignment', name: 'alignCenter', icon: lucideIcons.alignCenter, title: 'Align Center', tooltip: 'Center the button' },
      { group: 'Alignment', name: 'alignRight', icon: lucideIcons.alignRight, title: 'Align Right', tooltip: 'Align the button to the right' },
      // Stretch Setting
      { group: 'Layout', name: 'stretch', icon: lucideIcons.maximize, title: 'Full Width', tooltip: 'Make the button full-width' },
      // Text Size Settings Group
      { group: 'Text Size', name: 'textSizeSm', icon: lucideIcons.text, title: 'Text Small', tooltip: 'Set text size to small' },
      { group: 'Text Size', name: 'textSizeMd', icon: lucideIcons.text, title: 'Text Medium', tooltip: 'Set text size to medium' },
      { group: 'Text Size', name: 'textSizeLg', icon: lucideIcons.text, title: 'Text Large', tooltip: 'Set text size to large' },
      // Button Size Settings Group
      { group: 'Button Size', name: 'buttonSizeSm', icon: lucideIcons.maximize, title: 'Button Small', tooltip: 'Set button size to small' },
      { group: 'Button Size', name: 'buttonSizeMd', icon: lucideIcons.maximize, title: 'Button Medium', tooltip: 'Set button size to medium' },
      { group: 'Button Size', name: 'buttonSizeLg', icon: lucideIcons.maximize, title: 'Button Large', tooltip: 'Set button size to large' },
    ];
  }

  static get toolbox() {
    return {
      title: 'Button',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="10" rx="2" ry="2"/><path d="M12 10v4"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('ce-block--button', 'mx-auto', 'max-w-full', 'p-2', 'rounded-lg', 'bg-gray-50', 'shadow-sm');

    const container = document.createElement('div');
    container.classList.add('button-tool', 'flex', 'flex-col', 'gap-2');
    
    // Apply alignment to the container
    const alignmentClasses = {
      left: 'items-start',
      center: 'items-center',
      right: 'items-end',
    };
    container.classList.add(alignmentClasses[this.data.alignment] || 'items-center');
    container.setAttribute('data-alignment', this.data.alignment);

    // Text input
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.classList.add('button-tool__text', 'w-full', 'p-2', 'border', 'border-gray-300', 'rounded-lg', 'text-sm', 'text-gray-700', 'bg-white', 'focus:outline-none', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200');
    textInput.placeholder = 'Enter button text...';
    textInput.value = this.data.text || '';
    textInput.addEventListener('input', (e) => {
      this.data.text = e.target.value;
      this.wrapper.querySelector('.button-tool__preview').textContent = this.data.text || 'Click Me';
    });

    // URL input
    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.classList.add('button-tool__url', 'w-full', 'p-2', 'border', 'border-gray-300', 'rounded-lg', 'text-sm', 'text-gray-700', 'bg-white', 'focus:outline-none', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200');
    urlInput.placeholder = 'Enter URL...';
    urlInput.value = this.data.url || '';
    urlInput.addEventListener('input', (e) => {
      this.data.url = e.target.value;
    });

    // Preview button (non-clickable in editor)
    const previewButton = document.createElement('button');
    previewButton.classList.add('button-tool__preview');
    previewButton.textContent = this.data.text || 'Click Me';
    previewButton.disabled = true;

    // Apply Tailwind classes based on settings
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
    previewButton.className = [
      'button-tool__preview',
      'rounded-lg',
      textSizeClasses[this.data.textSize],
      buttonSizeClasses[this.data.buttonSize],
      'transition',
      this.data.isStretched ? 'w-full' : 'w-auto', // Apply full-width if stretched
    ].join(' ');
    previewButton.style.backgroundColor = this.data.backgroundColor;
    previewButton.style.color = this.data.textColor;

    container.appendChild(previewButton);
    container.appendChild(textInput);
    container.appendChild(urlInput);

    this.wrapper.appendChild(container);
    return this.wrapper;
  }

  save(blockContent) {
    return this.data;
  }

  renderSettings() {
    const wrapper = document.createElement('div');
    wrapper.className = 'button-tool__settings-wrapper flex flex-col gap-2 p-2 bg-gray-100 rounded-lg';

    // Group settings by category
    const groups = {};
    this.settings.forEach((setting) => {
      if (!groups[setting.group]) {
        groups[setting.group] = [];
      }
      groups[setting.group].push(setting);
    });

    // Render each group with a label
    Object.keys(groups).forEach((groupName) => {
      const groupWrapper = document.createElement('div');
      groupWrapper.className = 'group-wrapper flex flex-col gap-1';

      const groupLabel = document.createElement('div');
      groupLabel.className = 'text-xs font-semibold text-gray-600 uppercase mb-1';
      groupLabel.textContent = groupName;
      groupWrapper.appendChild(groupLabel);

      groups[groupName].forEach((setting) => {
        const settingItem = document.createElement('div');
        settingItem.className = 'button-tool__setting-item flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-200 transition';
        settingItem.title = setting.tooltip; // Add tooltip for better UX

        const icon = document.createElement('span');
        icon.className = 'button-tool__setting-icon w-5 h-5';
        icon.innerHTML = setting.icon;

        const text = document.createElement('span');
        text.className = 'button-tool__setting-text text-sm flex-1';
        text.textContent = setting.title;

        settingItem.appendChild(icon);
        settingItem.appendChild(text);

        if (setting.name.startsWith('align')) {
          const alignmentValue = setting.name.replace('align', '').toLowerCase();
          const isActive = this.data.alignment === alignmentValue;
          settingItem.classList.toggle('bg-blue-100', isActive);
          settingItem.classList.toggle('text-blue-500', isActive);
          settingItem.addEventListener('click', (e) => {
            e.preventDefault();
            this.data.alignment = alignmentValue;
            const container = this.wrapper.querySelector('.button-tool');
            container.setAttribute('data-alignment', this.data.alignment);
            container.classList.remove('items-start', 'items-center', 'items-end');
            container.classList.add(alignmentValue === 'left' ? 'items-start' : alignmentValue === 'center' ? 'items-center' : 'items-end');
            wrapper.querySelectorAll('.button-tool__setting-item').forEach((item) =>
              item.classList.remove('bg-blue-100', 'text-blue-500')
            );
            settingItem.classList.add('bg-blue-100', 'text-blue-500');
          });
        } else if (setting.name === 'stretch') {
          settingItem.classList.toggle('bg-blue-100', this.data.isStretched);
          settingItem.classList.toggle('text-blue-500', this.data.isStretched);
          settingItem.addEventListener('click', (e) => {
            e.preventDefault();
            this.data.isStretched = !this.data.isStretched;
            const previewButton = this.wrapper.querySelector('.button-tool__preview');
            previewButton.classList.toggle('w-full', this.data.isStretched);
            previewButton.classList.toggle('w-auto', !this.data.isStretched);
            settingItem.classList.toggle('bg-blue-100', this.data.isStretched);
            settingItem.classList.toggle('text-blue-500', this.data.isStretched);
          });
        } else if (setting.name.startsWith('textSize')) {
          const textSizeValue = setting.name.replace('textSize', '').toLowerCase();
          const isActive = this.data.textSize === textSizeValue;
          settingItem.classList.toggle('bg-blue-100', isActive);
          settingItem.classList.toggle('text-blue-500', isActive);
          settingItem.addEventListener('click', (e) => {
            e.preventDefault();
            this.data.textSize = textSizeValue;
            const previewButton = this.wrapper.querySelector('.button-tool__preview');
            previewButton.classList.remove('text-sm', 'text-base', 'text-lg');
            previewButton.classList.add(textSizeValue === 'sm' ? 'text-sm' : textSizeValue === 'md' ? 'text-base' : 'text-lg');
            wrapper.querySelectorAll('.button-tool__setting-item').forEach((item) =>
              item.classList.remove('bg-blue-100', 'text-blue-500')
            );
            settingItem.classList.add('bg-blue-100', 'text-blue-500');
          });
        } else if (setting.name.startsWith('buttonSize')) {
          const buttonSizeValue = setting.name.replace('buttonSize', '').toLowerCase();
          const isActive = this.data.buttonSize === buttonSizeValue;
          settingItem.classList.toggle('bg-blue-100', isActive);
          settingItem.classList.toggle('text-blue-500', isActive);
          settingItem.addEventListener('click', (e) => {
            e.preventDefault();
            this.data.buttonSize = buttonSizeValue;
            const previewButton = this.wrapper.querySelector('.button-tool__preview');
            previewButton.classList.remove('px-2', 'py-1', 'px-4', 'py-2', 'px-6', 'py-3');
            previewButton.classList.add(buttonSizeValue === 'sm' ? 'px-2' : buttonSizeValue === 'md' ? 'px-4' : 'px-6');
            previewButton.classList.add(buttonSizeValue === 'sm' ? 'py-1' : buttonSizeValue === 'md' ? 'py-2' : 'py-3');
            wrapper.querySelectorAll('.button-tool__setting-item').forEach((item) =>
              item.classList.remove('bg-blue-100', 'text-blue-500')
            );
            settingItem.classList.add('bg-blue-100', 'text-blue-500');
          });
        }

        groupWrapper.appendChild(settingItem);
      });

      wrapper.appendChild(groupWrapper);
    });

    // Background color picker
    const bgColorWrapper = document.createElement('div');
    bgColorWrapper.className = 'group-wrapper flex flex-col gap-1';

    const bgColorLabel = document.createElement('div');
    bgColorLabel.className = 'text-xs font-semibold text-gray-600 uppercase mb-1';
    bgColorLabel.textContent = 'Colors';
    bgColorWrapper.appendChild(bgColorLabel);

    const bgColorItem = document.createElement('div');
    bgColorItem.className = 'button-tool__setting-item flex items-center gap-2 p-2 rounded cursor-pointer';
    bgColorItem.title = 'Choose the button background color';

    const bgColorIcon = document.createElement('span');
    bgColorIcon.className = 'button-tool__setting-icon w-5 h-5';
    bgColorIcon.innerHTML = lucideIcons.palette;

    const bgColorText = document.createElement('span');
    bgColorText.className = 'button-tool__setting-text text-sm flex-1';
    bgColorText.textContent = 'Background Color';

    const bgColorInput = document.createElement('input');
    bgColorInput.type = 'color';
    bgColorInput.value = this.data.backgroundColor;
    bgColorInput.className = 'w-6 h-6 p-0 border-none cursor-pointer';
    bgColorInput.addEventListener('input', (e) => {
      this.data.backgroundColor = e.target.value;
      this.wrapper.querySelector('.button-tool__preview').style.backgroundColor = this.data.backgroundColor;
    });

    bgColorItem.appendChild(bgColorIcon);
    bgColorItem.appendChild(bgColorText);
    bgColorItem.appendChild(bgColorInput);
    bgColorWrapper.appendChild(bgColorItem);

    // Text color picker
    const textColorItem = document.createElement('div');
    textColorItem.className = 'button-tool__setting-item flex items-center gap-2 p-2 rounded cursor-pointer';
    textColorItem.title = 'Choose the button text color';

    const textColorIcon = document.createElement('span');
    textColorIcon.className = 'button-tool__setting-icon w-5 h-5';
    textColorIcon.innerHTML = lucideIcons.text;

    const textColorLabel = document.createElement('span');
    textColorLabel.className = 'button-tool__setting-text text-sm flex-1';
    textColorLabel.textContent = 'Text Color';

    const textColorInput = document.createElement('input');
    textColorInput.type = 'color';
    textColorInput.value = this.data.textColor;
    textColorInput.className = 'w-6 h-6 p-0 border-none cursor-pointer';
    textColorInput.addEventListener('input', (e) => {
      this.data.textColor = e.target.value;
      this.wrapper.querySelector('.button-tool__preview').style.color = this.data.textColor;
    });

    textColorItem.appendChild(textColorIcon);
    textColorItem.appendChild(textColorLabel);
    textColorItem.appendChild(textColorInput);
    bgColorWrapper.appendChild(textColorItem);

    wrapper.appendChild(bgColorWrapper);

    return wrapper;
  }
}

class InlineTextColor {
  static get isInline() {
    return true;
  }

  constructor({ api, config }) {
    this.api = api;
    this.config = config || {};
    this.button = null;
    this.state = false;
    this.tag = 'SPAN';
    this.className = 'inline-text-color';
    this.color = null; // Will store the selected color
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.api.styles.inlineToolButton);
    this.button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        <circle cx="13.5" cy="6.5" r="1.5"/>
        <circle cx="17.5" cy="10.5" r="1.5"/>
        <circle cx="8.5" cy="7.5" r="1.5"/>
        <circle cx="6.5" cy="12.5" r="1.5"/>
      </svg>
    `;
    return this.button;
  }

  surround(range) {
    if (this.state) {
      this.unwrap(range);
      return;
    }

    this.wrap(range);
  }

  wrap(range) {
    const selectedText = range.extractContents();
    const span = document.createElement(this.tag);
    span.classList.add(this.className);
    span.style.color = this.color || '#000000'; // Default to black if no color is selected
    span.appendChild(selectedText);
    range.insertNode(span);
    this.api.selection.expandToTag(span);
  }

  unwrap(range) {
    const span = this.api.selection.findParentTag(this.tag, this.className);
    if (span) {
      const text = span.firstChild;
      span.parentNode.replaceChild(text, span);
      range.selectNode(text);
    }
  }

  checkState(selection) {
    const span = this.api.selection.findParentTag(this.tag, this.className);
    this.state = !!span;
    if (span) {
      this.color = span.style.color || '#000000';
    }
    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, this.state);
    return this.state;
  }

  renderActions() {
    this.actionContainer = document.createElement('div');
    this.actionContainer.classList.add('inline-tool-actions', 'flex', 'gap-2', 'p-2', 'bg-white', 'rounded-lg', 'shadow-sm');

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.classList.add('inline-tool-color-picker', 'w-8', 'h-8', 'p-0', 'border-none', 'cursor-pointer');
    colorInput.value = this.color || '#000000'; // Default to black

    colorInput.addEventListener('input', (e) => {
      this.color = e.target.value;
      const span = this.api.selection.findParentTag(this.tag, this.className);
      if (span) {
        span.style.color = this.color;
      } else {
        const range = this.api.selection.getRange();
        if (range && !range.collapsed) {
          this.wrap(range);
        }
      }
    });

    this.actionContainer.appendChild(colorInput);
    return this.actionContainer;
  }

  clear() {
    this.color = null;
    this.state = false;
  }

  static get sanitize() {
    return {
      span: {
        class: 'inline-text-color',
        style: true,
      },
    };
  }
}

const uploadImageByFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const { secure_url } = await response.json();

  return {
    success: 1,
    file: {
      url: secure_url,
    },
  };
};

const uploadImageByURL = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');
    return {
      success: 1,
      file: { url },
    };
  } catch (error) {
    console.error('Error uploading image by URL:', error);
    return {
      success: 0,
      file: null,
    };
  }
};

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
      inlineToolbar: ['bold', 'italic', 'inlineCode', 'marker', 'inlineTextColor'],
    },
    checklist: Checklist,
    embed: Embed,
    table: Table,
    inlineTextColor: InlineTextColor,
    image: {
      class: CustomImageTool,
      config: {
        uploader: {
          uploadByFile: async (file) => {
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) throw new Error('File size exceeds 5MB limit');
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
              throw new Error('Only JPEG, PNG, and GIF files are allowed');
            }
            return uploadImageByFile(file);
          },
          uploadByUrl: uploadImageByURL,
          additionalRequestHeaders: {
            'Custom-Header': 'Value',
          },
          additionalRequestData: {
            folder: 'editor_uploads',
          },
          field: 'image',
        },
        captionPlaceholder: 'Enter image caption...',
        urlPlaceholder: 'Enter link URL (optional)...',
        lazyLoading: true,
        actions: [
          {
            name: 'download_image',
            icon: lucideIcons.download,
            title: 'Download',
            toggle: false,
            action: (name) => {
              const imageUrl = document.querySelector('.ce-block--image img').src;
              const link = document.createElement('a');
              link.href = imageUrl;
              link.download = 'image.jpg';
              link.click();
            },
          },
        ],
      },
    },
    button: {
      class: CustomButtonTool,
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
});

const Editor = ({ setTextEditor, setEditorState, formData, setFormData }) => {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorInstanceRef = useRef(null);

  const initialData = {
    blocks: formData.description
      ? [{ type: 'paragraph', data: { text: formData.description } }]
      : formData.setupinstructions?.[0]?.blocks || [],
  };

  const handleEditorChange = useCallback(async () => {
    if (editorInstanceRef.current) {
      try {
        const content = await editorInstanceRef.current.save();
        console.log('Saved content:', content);
        setFormData((prevState) => ({
          ...prevState,
          setupinstructions: [content],
        }));
      } catch (error) {
        console.error('Error saving editor content:', error);
      }
    }
  }, [setFormData]);

  useEffect(() => {
    if (!editorInstanceRef.current && editorRef.current) {
      try {
        const editor = new EditorJS(
          getEditorConfig(editorRef.current, handleEditorChange, initialData)
        );

        editorInstanceRef.current = editor;

        editor.isReady
          .then(() => {
            setIsEditorReady(true);
            setTextEditor({ isReady: true });
            setEditorState(editor);
            console.log('Editor.js initialized successfully');
          })
          .catch((error) => {
            console.error('Editor.js initialization failed:', error);
          });
      } catch (error) {
        console.error('Error initializing Editor.js:', error);
      }
    }

    return () => {
      if (editorInstanceRef.current && editorInstanceRef.current.destroy) {
        try {
          editorInstanceRef.current.destroy();
          editorInstanceRef.current = null;
        } catch (error) {
          console.error('Error destroying Editor.js:', error);
        }
      }
    };
  }, [setTextEditor, setEditorState, handleEditorChange]);

  useEffect(() => {
    const updateEditorContent = async () => {
      if (isEditorReady && editorInstanceRef.current) {
        try {
          const currentData = await editorInstanceRef.current.save();
          const newData = formData.setupinstructions?.[0]?.blocks || [];

          if (JSON.stringify(currentData.blocks) !== JSON.stringify(newData)) {
            await editorInstanceRef.current.render({ blocks: newData });
          }
        } catch (error) {
          console.error('Error updating editor content:', error);
        }
      }
    };

    updateEditorContent();
  }, [isEditorReady, formData.setupinstructions]);

  return (
    <div className="editor-wrapper">
      {!isEditorReady && <div className="editor-loading">Loading editor...</div>}
      <div
        ref={editorRef}
        className={`prose max-w-full ${!isEditorReady ? 'hidden' : ''}`}
      />
    </div>
  );
};

export default React.memo(Editor);