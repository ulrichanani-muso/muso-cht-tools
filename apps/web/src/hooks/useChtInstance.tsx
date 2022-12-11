import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentInstance } from 'src/store/chtInstanceSlice'

function useChtInstance() {
  const currentChtInstance = useSelector((state) => state.chtInstance.current)
  const chtInstances = useSelector((state) => state.chtInstance.instances)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentChtInstance || !chtInstances.length) {
      return
    }

    const instanceId = parseInt(localStorage.getItem('cht-utils.current-instance'), 10)
    if (!instanceId) {
      return
    }

    const instance = chtInstances.find((i) => i.id === instanceId)
    if (instance) {
      dispatch(setCurrentInstance(instance.id))
    }
  }, [chtInstances])

  // useEffect(() => {
  //   // setTimeout(() => {
  //   //   console.log({currentChtInstance})
  //   //   if (!currentChtInstance) {
  //   //     router.push('/')
  //   //   }
  //   // }, 5000)
  // }, [currentChtInstance])

  return currentChtInstance
}

export default useChtInstance
