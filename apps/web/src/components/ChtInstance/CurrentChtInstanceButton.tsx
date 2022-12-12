import Link from 'next/link'
import { Button } from 'react-bootstrap'
import environmentTypes from 'src/config/environmentTypes'
import useChtInstance from 'src/hooks/useChtInstance'

const CurrentChtInstanceButton = () => {
  const [currentChtInstance] = useChtInstance()

  const envs = environmentTypes.reduce((acc, i) => ({ ...acc, [i.code]: i }), {})

  return (
    <div className="d-flex">
      {currentChtInstance && (
      <Link href="/">
        <Button variant={envs[currentChtInstance.environment]?.colorVariant ?? 'info'}>
          Instance&nbsp;:&nbsp;
          <strong>{currentChtInstance.name}</strong>
          &nbsp;
          (
          {currentChtInstance.environment}
          )
        </Button>
      </Link>
      )}

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
