import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { setCurrentInstance, setInstances } from '../../store/chtInstanceSlice'
import api from '../../helpers/api'
import Link from 'next/link'
import { Button } from 'react-bootstrap'
import environmentTypes from 'src/config/environmentTypes'

const CurrentChtInstanceButton = () => {
  const [, setLoading] = useState(false)
  const currentChtInstance = useSelector((state) => state.chtInstance.current)
  const dispatch = useDispatch()

  const envs = environmentTypes.reduce((acc, i) => ({ ...acc, [i.code]: i }), {})

  const fetchChtInstances = async () => {
    try {
      setLoading(true)
      const res = await api.get('/cht-instances')
      dispatch(setInstances(res.data.data))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChtInstances()
  }, [])

  return (
    <div className="d-flex">
      {currentChtInstance && <Link href="/">
        <Button variant={envs[currentChtInstance.environment]?.colorVariant ?? 'info'}>
            Instance&nbsp;:&nbsp;
            <strong>{currentChtInstance.name}</strong>&nbsp;
            ({currentChtInstance.environment})
        </Button>
      </Link>}

      {/* <Form.Select
        value={currentChtInstance?.id}
        onChange={(event) => {
          dispatch(setCurrentInstance(Number(event.target.value)))
        }}
      >
        <option value="">Choisissez votre instance</option>
        {chtInstances.map((instance: ChtInstance) => (
          <option value={instance.id} key={instance.id}>
            {instance.name}
          </option>
        ))}
      </Form.Select> */}
    </div>
  )
}

export default CurrentChtInstanceButton
