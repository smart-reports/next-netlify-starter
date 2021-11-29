import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { URL_BASE } from '../../apollo/urls'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/dist/client/router'
import { CREATE_CURRENT_SESSION } from './queries'
import fetchJson from '../../pages/api/lib/hooks/fetchJson'
import { validationSubmitHooks } from '../../utils'
import InputHooks from '../../components/InputHooks/InputHooks'
import { ButtonHook } from '../../components/ButtonHook'
import { Container, Figure, Form, Logo, Text, FooterComponent } from './styled'
import { IconLogo } from '../../public/icons'
import { BGColor, SCColor } from '../../public/colors'
import Link from 'next/link'
import { LoadEllipsis } from '../../components/Loading'

export const LoginC = ({ setAlertBox }) => {
  const [loginUser, { loading }] = useMutation(CREATE_CURRENT_SESSION, {
    onError: () => {
      setAlertBox({
        message: 'an internal error occurred',
        duration: 300000,
        color: 'error'
      })
    }
  })
  // State
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const handleChange = (e, error) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: error })
  }
  const router = useRouter()
  const [browser, setBrowser] = useState(false)
  //   Handles
  useEffect(() => {
    setBrowser(true)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    // Declarando variables
    let errorSubmit = false
    for (const x in errors) {
      if (errors[x]) errorSubmit = true
    }
    // Validando todos los campos que no sean nulos
    const errorForm = validationSubmitHooks(e.target.elements)
    for (const x in errorForm) {
      if (errorForm[x]) errorSubmit = true
    }
    setErrors({ ...errorForm })
    if (errorSubmit) {
      return setAlertBox({
        message: 'Please verify that the fields are correct.',
        duration: 300000,
        color: 'warning'
      })
    }
    const body = {
      uEmail: values.uEmail,
      uPassword: values.uPassword
    }
    if (!errorSubmit) {
      await fetchJson(`${URL_BASE}auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
        .then(res => {
          if (res.success) {
            loginUser({ variables: { uEmail: values.uEmail, uPassword: values.uPassword } })
              .then(res => {
                router.push('/switch-options')
              })
          }
          if (res.success === 0) {
            setAlertBox({
              message: 'Usuario o contraseña incorrectas',
              duration: 300000,
              color: 'error'
            })
          }
        })
        .catch(e => {
          setAlertBox({
            message: `${e}`,
            duration: 300000,
            color: 'error'
          })
        })
    }
  }
  return (
    <Container>
    <Form onSubmit={handleSubmit}>
    <Text>Login Form
    </Text>
      <InputHooks
        title='Email'
        autoComplete
        required
        email
        errors={errors?.uEmail}
        value={values?.uEmail}
        onChange={handleChange}
        name='uEmail'
        padding='15px 0px'
      />
      <InputHooks
        title='Password'
        required
        pass
        // autoComplete
        type='password'
        errors={errors?.uPassword}
        value={values?.uPassword}
        onChange={handleChange}
        name='uPassword'
        padding='15px 0px'
      />
      <ButtonHook bgColor={SCColor} padding='10px' width={'100%'} type='submit' >{!loading ? 'Login' : <LoadEllipsis />}</ButtonHook>
      {/* <Autho /> */}
      <Text size='15px'>Not a member? &nbsp; <Link href="/register"><a> Signup now</a></Link>
      </Text>
      <Text size='15px'>Forgot password ? &nbsp; <Link href="/forgotpassword"><a>Reset</a></Link>
      </Text>
    </Form>
    <FooterComponent>
          <Link href='/'>
            <a>
              <IconLogo size='100px' />
            </a>
          </Link>
        </FooterComponent>
  </Container>
  )
}

LoginC.propTypes = {
  setAlertBox: PropTypes.func
}
