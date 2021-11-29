import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@apollo/client'
import { ListCompanyCo } from '../../components/ListCompany'
import { Context } from '../../context'
import { ALL_COMPANIES_BY_USER } from '../Company/queries'
import { CREATE_ONE_TEAM } from './queries'
import { useRouter } from 'next/dist/client/router'
import { CHANGE_COMPANY_STATE } from '../Profile/queries'
import { Loading } from '../../components/Loading'
import { useFormTools } from '../../components/hooks/useForm'
import { useUser } from '../Profile'

export const ListCompanyC = ({ isCompany, useCompany }) => {
  // State
  const [year, setYear] = useState('')
  const { data } = useQuery(ALL_COMPANIES_BY_USER)
  const [handleChange, handleSubmit, setForcedData, { dataForm, errorForm, setForcedError }] = useFormTools()
  const [RegisterOneTeam, { error, loading }] = useMutation(CREATE_ONE_TEAM)
  const [show, setShow] = useState(false)
  const { setAlertBox } = useContext(Context)
  const [lastCompanyMutation] = useMutation(CHANGE_COMPANY_STATE)
  const [idUser, setIdUser] = useState({})
  const [idComp, setIdComp] = useState({})
  const router = useRouter()

  const handleForm = e => handleSubmit({
    event: e,
    action: () => RegisterOneTeam({
      variables: {
        idC: idComp,
        id: idUser,
        uEmail: dataForm.uEmail
      }
    }),
    // update: (cache, { data: { getDataAllById } }) => updateCache({
    //   cache,
    //   query: GET_ALL_BILL,
    //   nameFun: 'getAllBill',
    //   dataNew: getDataAllById
    // }),
    actionAfterSuccess: () => {
      setForcedData({})
    }
  })
  const handleClick = (index, e) => {
    e.stopPropagation()
    setIdUser(index?.idUser)
    setIdComp(index?._id)
    setShow(index === show ? false : index)
  }
  const stopPropagation = e => {
    e.preventDefault()
    e.stopPropagation()
    setShow(!show)
  }
  const handleCompany = async index => {
    const { _id } = index
    const id = _id
    await lastCompanyMutation({ variables: { lastCompany: _id } }).catch(err => setAlertBox({ message: `${err}`, duration: 300000 }))
    useCompany(id)
    router.push('/dashboard')
  }
  useEffect(() => {
    const date = new Date()
    const year = date.getFullYear()
    setYear(year)
  }, [])
  useEffect(() => lastCompanyMutation(), [])
  const [dataUser, { loading: LoadingUser }] = useUser()

  if (loading || LoadingUser) return <Loading />
  return (
    <ListCompanyCo
      data={data?.getAllCompanyById}
      handleClick={handleClick}
      year={year}
      handleSubmit={handleForm}
      setAlertBox={setAlertBox}
      handleChange={handleChange}
      dataForm={dataForm}
      handleCompany={handleCompany}
      errorForm={errorForm}
      error={error}
      userdata={dataUser}
      show={show}
      setShow={setShow}
      stopPropagation={stopPropagation}
    />
  )
}
ListCompanyC.propTypes = {
  setCompanyLink: PropTypes.func,
  useCompany: PropTypes.func,
  isCompany: PropTypes.string
}
