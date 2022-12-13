import Spinner from 'react-bootstrap/Spinner'
import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from 'src/helpers/api'
import { setCurrentInstance, setInstances } from 'src/store/chtInstanceSlice'

export default function ChtInstanceProvider({ children }: PropsWithChildren) {
  const chtInstances = useSelector((state) => state.chtInstance.instances)
  const chtInstancesLoaded = useSelector((state) => state.chtInstance.allInstancesLoaded)
  const currentChtInstance = useSelector((state) => state.chtInstance.current)
  const [loaded, setLoaded] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const fetchChtInstances = async () => {
    try {
      const res = await api.get('/cht-instances')
      dispatch(setInstances(res.data.data))
    } catch (error) {
      console.error(error)
    }
  }

  const loadCurrentInstance = () => {
    if (chtInstancesLoaded && !chtInstances.length) {
      router.push('/')
      return
    }

    if (currentChtInstance) {
      setLoaded(true)
      return
    }

    const instanceId = parseInt(localStorage.getItem('cht-utils.current-instance'), 10)
    if (!instanceId) {
      router.push('/')
    }

    const instance = chtInstances.find((i) => i.id === instanceId)

    if (instance) {
      dispatch(setCurrentInstance(instance.id))
      setLoaded(true)
    } else {
      router.push('/')
    }
  }

  useEffect(() => {
    if (chtInstancesLoaded) {
      loadCurrentInstance()
    } else {
      fetchChtInstances()
    }
  }, [])

  useEffect(() => {
    if (!chtInstancesLoaded) {
      return
    }

    loadCurrentInstance()
  }, [chtInstancesLoaded])

  if (!loaded) {
    return (
      <div className="w-100 h-100 mt-5 pt-5 text-center">
        <Spinner animation="border" role="status" />
      </div>
    )
  }

  return children
}
