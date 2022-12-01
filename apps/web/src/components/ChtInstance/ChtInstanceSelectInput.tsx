import { useSelector, useDispatch } from 'react-redux'
import { Form } from 'react-bootstrap'
import { ChtInstance } from '@prisma/client'
import { useEffect, useState } from 'react'
import { setCurrentInstance, setInstances } from '../../store/chtInstanceSlice'
import api from '../../helpers/api'

const ChtInstanceSelectInput = () => {
  const [, setLoading] = useState(false)

  const currentChtInstance = useSelector((state) => state.chtInstance.current)
  const chtInstances = useSelector((state) => state.chtInstance.instances)
  const dispatch = useDispatch()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="d-flex">
      <p className="my-auto">Instance&nbsp;:&nbsp;</p>

      <Form.Select
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
      </Form.Select>
    </div>
  )
}

export default ChtInstanceSelectInput
