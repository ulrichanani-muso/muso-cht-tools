import { useSelector, useDispatch } from 'react-redux'
import { Form } from 'react-bootstrap'
import { ChtInstance } from '@prisma/client'
import { setCurrentInstance } from '../../store/chtInstanceSlice'

const ChtInstanceSelector = () => {
  const currentChtInstance = useSelector((state) => state.chtInstance.current)
  const chtInstances = useSelector((state) => state.chtInstance.instances)
  const dispatch = useDispatch()

  return (
    <div className="d-flex">
      <span>
        Instance :
      </span>

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

export default ChtInstanceSelector
