'use client'
import { useEffect } from 'react'

const useAddCopyButtons = () => {
  useEffect(() => {
    const preBlocks = document.querySelectorAll('.parsed-html pre')

    preBlocks.forEach((pre) => {
      // Check if a button already exists to avoid duplicates
      if (pre.querySelector('.copy-btn')) return

      // Create the button element
      const button = document.createElement('button')
      button.textContent = 'Copy'
      button.className =
        'copy-btn absolute top-2 right-2 px-2 py-1 text-xs text-white bg-blue-600 rounded hidden group-hover:block'

      // Add click event to copy content
      button.addEventListener('click', () => {
        navigator.clipboard.writeText(pre.innerText).then(() => {
          button.textContent = 'Copied!'
          setTimeout(() => {
            button.textContent = 'Copy'
          }, 2000)
        })
      })

      // Add the group class to the parent <pre> to enable hover-based display of the button
      pre.classList.add('group')

      // Style pre as a relative container and append the button
      pre.style.position = 'relative'
      pre.appendChild(button)
    })
  }, [])
}

export default useAddCopyButtons
