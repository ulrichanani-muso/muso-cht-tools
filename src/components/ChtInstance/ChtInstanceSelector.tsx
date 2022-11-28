import { useSelector, useDispatch } from 'react-redux'
import {
  Button, Card, Dropdown, Table, Form,
} from 'react-bootstrap'
import { useState } from 'react'
import { setInstance, unsetInstance } from '../../store/chtInstanceSlice'
import { chtInstancesTemplates } from '../../config/config'

const ChtInstanceSelector = () => {
  const currentChtInstance = useSelector((state) => state.chtInstance.current)
  const defaultInstances = useSelector((state) => state.chtInstance.defaultInstances)
  const dispatch = useDispatch()

  const [selectedTemplate, setSelectedTemplate] = useState('')

  return (
    <div>
      <div>
        Rajoutez une instance CHT:
      </div>

      <Card className="my-4">
        <Card.Header>
          Connectez vous à une instance CHT:
        </Card.Header>
        <Card.Body className="mx-3">
          <div className="row">
            <Form>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Template :</Form.Label>
                <Form.Select
                  value={selectedTemplate}
                  onChange={(event) => {
                    setSelectedTemplate(event.currentTarget.value)
                  }}
                >
                  <option value="">Choisissez votre instance</option>
                  {chtInstancesTemplates.map((instance) => (
                    <option value={instance.name} key={instance.name}>
                      {instance.label}
                    </option>
                  ))}
                  <option value="custom">Autre</option>
                </Form.Select>
              </Form.Group>

              {selectedTemplate === 'custom' && (
              <Form.Group className="mb-3" controlId="instanceUrl">
                <Form.Label>URL de l'instance</Form.Label>
                <Form.Control type="text" placeholder="https://muso-mali.medi..." />
              </Form.Group>
              )}

              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Username" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control type="password" placeholder="Mot de passe" />
              </Form.Group>

              <Button variant="primary" type="submit">
                Ajouter
              </Button>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ChtInstanceSelector
