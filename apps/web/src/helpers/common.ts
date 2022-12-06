const isSsr = () => typeof window === 'undefined'

const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(new Blob([blob]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)

  // Append to html link element page
  document.body.appendChild(link)

  // Start download
  link.click()

  // Clean up and remove the link
  link.parentNode.removeChild(link)
}

export { isSsr, downloadFile }
