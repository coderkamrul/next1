export function debounce(func, waitFor) {
  let timeout = null

  return (...args) => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), waitFor)
  }
}
