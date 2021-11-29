import React, { useContext, useEffect, useRef, useState } from 'react'
import { Profile } from '../../components/Profile'
import PropTypes from 'prop-types'
import { Context } from '../../context'
import { useMutation, useQuery } from '@apollo/client'
import { CHANGE_INFO_USER, GET_USER } from './queries'
import { validationSubmitHooks } from '../../utils'
import { useSetState } from '../../components/hooks/useState'

export const ProfileC = ({ login, token }) => {
  // State
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(0)
  const { setAlertBox, sessionActive } = useContext(Context)
  const [UpdateUser, { loading: loadingUpdate }] = useMutation(CHANGE_INFO_USER)
  const { state, changeState, setState } = useSetState(false)
  const [baseImage, setBaseImage] = useState('')
  const fileInputRef = useRef(null)
  const handleChange = (e, error) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: error })
  }

  const [data, { loading }] = useUser()
  // EFFECT
  useEffect(() => {
    for (let i = 0; i < data?.role?.length; i++) {
      // eslint-disable-next-line no-constant-condition
      if (data?.role[i].name === 'admin' || 'Admin2') {
        // router.push('/dashboard/admin')
      }
    }
  }, [data])
  // useEffect(() => data?.role?.name !== 1 && router.push('/dashboard/admin'), [data])
  const onTargetClick = () => {
    fileInputRef?.current?.click()
  }
  const uploadImage = async (e) => {
    const file = e.target.files[0]
    const base64 = await convertBase64(file)
    const array = base64.split(',')
    setBaseImage(array[1])
    setBaseImage(base64)
  }
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader?.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }
  const handleChangePass = async (e) => {
    e.preventDefault()
    const { currentPassword, newPassword, lastName, uAddress, uBirthday } = values
    let errorSubmit = false
    for (const x in errors) {
      if (errors[x]) errorSubmit = true
    }
    const errorForm = validationSubmitHooks(e.target.elements)
    for (const x in errorForm) {
      if (errorForm[x]) errorSubmit = true
    }
    setErrors({ ...errorForm })
    try {
      if (!errorSubmit) {
        const response = await UpdateUser({
          variables: {
            input: {
              step: step,
              currentPassword,
              newPassword,
              lastName,
              uAddress,
              // uPhone,
              uBirthday
            }
          }
        })
        setAlertBox({ message: response?.data?.UpdateUser?.message, duration: 8000 })
      }
    } catch (error) {
      setAlertBox({ message: `${error}`, duration: 8000 })
    }
  }
  return (
    <>
      {<Profile
        handleSubmit={handleChangePass}
        handleChange={handleChange}
        loading={loading || loadingUpdate}
        dataForm={values}
        setStep={setStep}
        step={step}
        data={data}
        baseImage={baseImage}
        fileInputRef={fileInputRef}
        uploadImage={uploadImage}
        onTargetClick={onTargetClick}
        sessionActive={sessionActive}
        // Show modal
        changeState={changeState}
        state={state}
        setState={setState}
      />}
    </>
  )
}

export const useUser = (token) => {
  const { setAlertBox, setSessionActive } = useContext(Context)
  const { data, loading } = useQuery(GET_USER, {
    onError: _err => setAlertBox({
      message: '',
      duration: 8000,
      color: 'warning'
    }),
    onCompleted: data => {
      setSessionActive({ data })
    }
  })
  return [data?.getUser, { loading }]
}

ProfileC.propTypes = {
  login: PropTypes.string,
  token: PropTypes.string
}

ProfileC.getInitialProps = async ctx => {
  console.log(ctx)

  return {}
}
