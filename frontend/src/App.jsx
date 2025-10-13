import { useState } from 'react'
import styles from './App.module.css'

function App() {
  const [file, setFile] = useState()
  const [rotatedImage, setRotatedImage] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const onFileChange = e => {
    setFile(e.target.files[0])
    setRotatedImage(null)
  }

  const onUploadClick = async () => {
    if (!file) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:8000/api/rotate-image', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        setRotatedImage(imageUrl)
      }
    } catch (error) {
      console.log('Error: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.app}>
      <div className={styles.uploadSection}>
        <input type='file' accept='image/*' onChange={onFileChange}/>
        <button onClick={onUploadClick} disabled={!file || isLoading}>
          {isLoading ? 'Rotating...' : 'Upload & Rotate'}
        </button>
      </div>
      {rotatedImage && (
        <div className={styles.imageSection}>
          <img src={rotatedImage} alt='Rotated'/>
        </div>
      )}
    </div>
  )
}

export default App
