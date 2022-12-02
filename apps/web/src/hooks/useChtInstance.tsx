import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

function useChtInstance() {
  const currentChtInstance = useSelector((state) => state.chtInstance.current)
  const router = useRouter()

  useEffect(() => {
    if (!currentChtInstance) {
      router.push('/')
    }
  }, [currentChtInstance])

  return currentChtInstance
}

export default useChtInstance
