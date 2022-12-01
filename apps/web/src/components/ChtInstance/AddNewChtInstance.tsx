/* eslint-disable react/jsx-props-no-spreading */
import {
  Button, Card, Form, Spinner,
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import environmentTypes from 'src/config/environmentTypes'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { flash } from 'src/store/flashMessagesSlice'
import { toast } from 'react-toastify'
import { chtInstancesTemplates } from '../../config/config'

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
      await axios.post(
        '/api/cht-instances/create',
        data,
      )
      dispatch(flash({ text: 'Nouvelle instance rajoutée !' }))
      await router.push('/')
    } catch (error) {
      toast.error(`Une erreur s'est produite : \n${error?.message}`)
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

  useEffect(() => {
    if (!template || template === 'custom') {
      return
    }

    const selectedTemplate = chtInstancesTemplates.find((i) => i.code === template)

    if (selectedTemplate) {
      formik.setFieldValue('url', selectedTemplate.url)
      formik.setFieldValue('environment', selectedTemplate.environment)
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
              <Form.Group className="mb-4" controlId="template">
                <Form.Label>Template :</Form.Label>
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
              </Form.Group>

              <Form.Group className="mb-4" controlId="name">
                <Form.Label>Nom :</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  isInvalid={!!formik.errors?.name}
                  {...formik.getFieldProps('name')}
                />
                <Feedback type="invalid">{formik.errors?.name}</Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="description">
                <Form.Label>Description :</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Description"
                  isInvalid={!!formik.errors?.description}
                  {...formik.getFieldProps('description')}
                />
                <Feedback type="invalid">{formik.errors?.description}</Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="instanceUrl">
                <Form.Label>URL de l&apos;instance :</Form.Label>
                <Form.Control
                  className="mb-0"
                  type="text"
                  placeholder="https://muso-mali.medi..."
                  // readOnly={!template || template !== 'custom'}
                  isInvalid={!!formik.errors?.url}
                  {...formik.getFieldProps('url')}
                />
                <Feedback type="invalid">{formik.errors?.url}</Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="username">
                <Form.Label>Username :</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  isInvalid={!!formik.errors?.username}
                  {...formik.getFieldProps('username')}
                />
                <Feedback type="invalid">{formik.errors?.username}</Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Mot de passe :</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Mot de passe"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  isInvalid={!!formik.errors?.password}
                />
                <Feedback type="invalid">{formik.errors?.password}</Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="environment">
                <Form.Label>Environement :</Form.Label>
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