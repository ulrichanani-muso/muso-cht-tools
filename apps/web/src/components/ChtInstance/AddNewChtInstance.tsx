/* eslint-disable react/jsx-props-no-spreading */
import {
  Button, Card, Col, Form, Row, Spinner,
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import environmentTypes from 'src/config/environmentTypes'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { flash } from 'src/store/flashMessagesSlice'
import { toast } from 'react-toastify'
import { chtInstancesTemplates } from '../../config/config'
import api from '../../helpers/api'

const { Control: { Feedback } } = Form

const AddNewChtInstance = () => {
  const [template, setTemplate] = useState('')
  const [submiting, setSubmiting] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()

  const validationSchema = Yup.object({
    name: Yup.string().required('Requis'),
    description: Yup.string(),
    url: Yup.string().url('URL invalide').required('Requis'),
    username: Yup.string().required('Requis'),
    password: Yup.string().required('Requis'),
    environment: Yup.string().required('Requis'),
  })

  const submitData = async (data) => {
    setSubmiting(true)
    try {
      await api.post('/cht-instances', data)
      dispatch(flash({ text: 'Nouvelle instance rajoutée !' }))
      await router.push('/')
    } catch (error) {
      console.error(error)
      toast.error(`Une erreur s'est produite : \n${error?.message}`)
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

  useEffect(() => {
    if (!template || template === 'custom') {
      return
    }

    const selectedTemplate = chtInstancesTemplates.find((i) => i.code === template)

    if (selectedTemplate) {
      formik.setFieldValue('url', selectedTemplate.url)
      formik.setFieldValue('environment', selectedTemplate.environment)

      if (!formik.values.name) {
        formik.setFieldValue('name', selectedTemplate.name)
      }
    }
  }, [template])

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
              <Form.Group as={Row} className="mb-4" controlId="template">
                <Form.Label column sm="3" className="text-start text-sm-end">Template :</Form.Label>
                <Col sm="9">
                  <Form.Select
                    value={template}
                    onChange={(event) => setTemplate(event.currentTarget.value)}
                  >
                    <option value="">Choisissez un template</option>
                    {chtInstancesTemplates.map((i) => (
                      <option value={i.code} key={i.code}>
                        {i.name}
                      </option>
                    ))}
                    <option value="custom">Autre</option>
                  </Form.Select>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4" controlId="name">
                <Form.Label column sm="3" className="text-start text-sm-end">Nom :</Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    isInvalid={!!formik.errors?.name}
                    {...formik.getFieldProps('name')}
                  />
                  <Feedback type="invalid">{formik.errors?.name}</Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4" controlId="description">
                <Form.Label column sm="3" className="text-start text-sm-end">Description :</Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="text"
                    placeholder="Description"
                    isInvalid={!!formik.errors?.description}
                    {...formik.getFieldProps('description')}
                  />
                  <Feedback type="invalid">{formik.errors?.description}</Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4" controlId="instanceUrl">
                <Form.Label column sm="3" className="text-start text-sm-end">URL de l&apos;instance :</Form.Label>
                <Col sm="9">
                  <Form.Control
                    className="mb-0"
                    type="text"
                    placeholder="https://muso-mali.medi..."
                  // readOnly={!template || template !== 'custom'}
                    isInvalid={!!formik.errors?.url}
                    {...formik.getFieldProps('url')}
                  />
                  <Feedback type="invalid">{formik.errors?.url}</Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4" controlId="username">
                <Form.Label column sm="3" className="text-start text-sm-end">Username :</Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    isInvalid={!!formik.errors?.username}
                    {...formik.getFieldProps('username')}
                  />
                  <Feedback type="invalid">{formik.errors?.username}</Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4" controlId="password">
                <Form.Label column sm="3" className="text-start text-sm-end">Mot de passe :</Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="password"
                    placeholder="Mot de passe"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    isInvalid={!!formik.errors?.password}
                  />
                  <Feedback type="invalid">{formik.errors?.password}</Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-4" controlId="environment">
                <Form.Label column sm="3" className="text-start text-sm-end">Environement :</Form.Label>
                <Col sm="9">
                  <Form.Select
                    isInvalid={!!formik.errors?.environment}
                    {...formik.getFieldProps('environment')}
                  >
                    <option value="">Choisissez un Environement</option>
                    {environmentTypes.map((env) => (
                      <option value={env.code} key={env.code}>
                        {env.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Feedback type="invalid">{formik.errors?.environment}</Feedback>
                </Col>
              </Form.Group>

              <Row>
                <Col sm={{ span: 9, offset: 3 }}>
                  <Button variant="primary" type="submit" className="mt-3">
                    {submiting && <Spinner size="sm" animation="border" role="status" />}
                    {' '}
                    Ajouter
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AddNewChtInstance
