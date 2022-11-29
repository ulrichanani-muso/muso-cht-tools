import {
  Button, Card, Form, Spinner, Toast,
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import environmentTypes from 'src/config/environmentTypes'
import { useRouter } from 'next/router'
import axios from 'axios'
import { chtInstancesTemplates } from '../../config/config'

const AddNewChtInstance = () => {
  const [template, setTemplate] = useState('')
  const [submiting, setSubmiting] = useState(false)
  const router = useRouter()

  const validationSchema = Yup.object({
    name: Yup.string().required('Requis'),
    description: Yup.string(),
    url: Yup.string().url('URL invalide').required('Requis'),
    username: Yup.string().required('Requis'),
    password: Yup.string().required('Requis'),
    environment: Yup.string().required('Requis'),
  })

  useEffect(() => {
    if (!template || template === 'custom') {
      return
    }

    const selectedTemplate = chtInstancesTemplates.find((i) => i.code === template)

    if (selectedTemplate) {
      formik.setFieldValue('url', selectedTemplate.url)
    }
  }, [template])

  const submitData = async (data) => {
    setSubmiting(true)
    try {
      await axios.post(
        '/api/cht-instances/create',
        data,
      )
      await router.push('/')
    } catch (error) {
      console.error(error)
    } finally {
      setSubmiting(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      url: '',
      username: '',
      password: '',
      environment: '',
    },
    validationSchema,
    onSubmit: (values) => {
      submitData(values)
    },
  })

  return (
    <div>
      <h4 className="mb-4">
        Ajouter une instance :
      </h4>

      <Card className="my-4">
        <Card.Header>
          Connectez vous à une instance CHT:
        </Card.Header>
        <Card.Body className="mx-3">
          <div className="row">
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-4" controlId="template">
                <Form.Label>Template :</Form.Label>
                <Form.Select
                  value={template}
                  onChange={(event) => {
                    setTemplate(event.currentTarget.value)
                  }}
                >
                  <option value="">Choisissez un template</option>
                  {chtInstancesTemplates.map((template) => (
                    <option value={template.code} key={template.code}>
                      {template.name}
                    </option>
                  ))}
                  <option value="custom">Autre</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4" controlId="name">
                <Form.Label>Nom :</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  isInvalid={!!formik.errors.name}
                  {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name ? (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.name}
                  </Form.Control.Feedback>
                ) : null}
              </Form.Group>

              <Form.Group className="mb-4" controlId="description">
                <Form.Label>Description :</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Description"
                  isInvalid={!!formik.errors.description}
                  {...formik.getFieldProps('description')}
                />
                {formik.touched.description && formik.errors.description ? (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.description}
                  </Form.Control.Feedback>
                ) : null}
              </Form.Group>

              <Form.Group className="mb-4" controlId="instanceUrl">
                <Form.Label>URL de l'instance :</Form.Label>
                <Form.Control
                  className="mb-0"
                  type="text"
                  placeholder="https://muso-mali.medi..."
                  // readOnly={!template || template !== 'custom'}
                  isInvalid={!!formik.errors.url}
                  {...formik.getFieldProps('url')}
                />
                {formik.touched.url && formik.errors.url ? (
                  <Form.Control.Feedback type="invalid" className="mt-0">
                    {formik.errors.url}
                  </Form.Control.Feedback>
                ) : null}
              </Form.Group>

              <Form.Group className="mb-4" controlId="username">
                <Form.Label>Username :</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  isInvalid={!!formik.errors.username}
                  {...formik.getFieldProps('username')}
                />
                {formik.touched.username && formik.errors.username ? (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.username}
                  </Form.Control.Feedback>
                ) : null}
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Mot de passe :</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Mot de passe"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  isInvalid={!!formik.errors.password}
                />
                {formik.touched.password && formik.errors.password ? (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                ) : null}
              </Form.Group>

              <Form.Group className="mb-4" controlId="environment">
                <Form.Label>Environement :</Form.Label>
                <Form.Select
                  type="environment"
                  isInvalid={!!formik.errors.environment}
                  {...formik.getFieldProps('environment')}
                >
                  <option value="">Choisissez un Environement</option>
                  {environmentTypes.map((env) => (
                    <option value={env.code} key={env.code}>
                      {env.name}
                    </option>
                  ))}
                </Form.Select>
                {formik.touched.environment && formik.errors.environment ? (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.environment}
                  </Form.Control.Feedback>
                ) : null}
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                {submiting && <Spinner size="sm" animation="border" role="status" />}
                {' '}
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
