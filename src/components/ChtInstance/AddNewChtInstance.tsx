import {
  Button, Card, Form,
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { chtInstancesTemplates } from '../../config/config'

const AddNewChtInstance = () => {
  const [template, setTemplate] = useState('')
  const [instanceUrl, setInstanceUrl] = useState('')

  useEffect(() => {
    if (!template && template === 'custom') {
      return
    }

    const selectedTemplate = chtInstancesTemplates.find((i) => i.name === template)

    if (selectedTemplate) {
      setInstanceUrl(selectedTemplate.url)
    }
  }, [template])

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
                  value={template}
                  onChange={(event) => {
                    setTemplate(event.currentTarget.value)
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

              <Form.Group className="mb-3" controlId="instanceUrl">
                <Form.Label>URL de l'instance</Form.Label>
                <Form.Control
                  value={instanceUrl}
                  onChange={(e) => setInstanceUrl(e.currentTarget.value)}
                  type="text"
                  placeholder="https://muso-mali.medi..."
                  readOnly={template !== 'custom'}
                />
              </Form.Group>

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

export default AddNewChtInstance
