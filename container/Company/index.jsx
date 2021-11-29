import React, { useState, useContext, useEffect } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@apollo/client'
import { Context } from '../../context'
import { ALL_COMPANIES_BY_USER, CREATE_ONE_COMPANY, DELETE_ONE_COMPANY } from './queries'
import { updateCacheMod } from '../../utils'
import { CHANGE_COMPANY_STATE } from '../Profile/queries'
import { useUser } from '../Profile'
import { useSetState } from '../../components/hooks/useState'
import { useRouter } from 'next/dist/client/router'
import { IconDelete, IconEdit, IconPromo } from '../../public/icons'
import { PColor } from '../../public/colors'
import InputHooks from '../../components/InputHooks/InputHooks'
import { AwesomeModal } from '../../components/AwesomeModal'
import { LoadEllipsis, Loading } from '../../components/Loading'
import { ContainerCard, Form, Container, Text, CardCompany, ButtonCard, ActionName, Content } from './styled'
import { useFormTools } from '../../components/hooks/useForm'
import { RippleButton } from '../../components/Ripple'
import { Skeleton } from '../../components/Loading/skeleton'

export const CompanyC = ({ useCompany }) => {
  // State
  const HandleClickEdit = (item) => {
    setState(!state)
  }
  const router = useRouter()

  const [handleChange, handleSubmit, setForcedData, { dataForm, errorForm }] = useFormTools()

  useEffect(() => {
    console.log(dataForm)
    setForcedData({
      companyName: router.query.companyName,
      registeredOfficeAddress: router.query.registeredOfficeAddress,
      companyLegalStatus: router.query.companyLegalStatus,
      accounts: router.query.accounts,
      natureOfBusiness: router.query.natureOfBusiness,
      dissolvedOn: router.query.dissolvedOn
    })
  }, [router?.query])

  const [newCompany, { loading }] = useMutation(CREATE_ONE_COMPANY)
  const [lastCompanyMutation] = useMutation(CHANGE_COMPANY_STATE)
  const { data: dataCompany } = useQuery(ALL_COMPANIES_BY_USER)
  const { setAlertBox } = useContext(Context)
  const { state, setState } = useSetState(false)
  const [data] = useUser()
  console.log(data)
  const handleCompany = async index => {
    const { _id } = index
    const id = _id
    useCompany(id)
    router.push('/dashboard')
    await lastCompanyMutation({ variables: { lastCompany: _id } }).catch(err => setAlertBox({ message: `${err}`, duration: 300000 }))
  }

  const handleForm = (e) => handleSubmit({
    event: e,
    action: () => {
      if (!router.query.id) {
        return newCompany({
          variables: {
            input: {
              companyName: dataForm.companyName,
              registeredOfficeAddress: dataForm.registeredOfficeAddress,
              companyLegalStatus: dataForm.companyLegalStatus,
              companyType: dataForm.companyType,
              accounts: dataForm.accounts,
              natureOfBusiness: dataForm.accounts,
              dissolvedOn: dataForm.dissolvedOn,
              incorporatedOn: dataForm.incorporatedOn
            }
          },
          update: (cache, { data: { getAllCompany } }) => updateCacheMod({
            cache,
            query: ALL_COMPANIES_BY_USER,
            nameFun: 'getAllCompanyById',
            dataNew: getAllCompany
          })
        })
      } else if (router.query.id) {
        return console.log(handleForm)
      }
    },
    actionAfterSuccess: () => {
      setForcedData({
      })
    }
  })

  const [color, setColor] = useState('')
  useEffect(() => {
    setColor(`#${parseInt(Math.random() * 999)}`)
  }, [])

  const DUMMY_DATA = [
    {
      companyName: 'test company',
      registeredOfficeAddress: 'test company',
      companyLegalStatus: 'test company',
      companyType: 'test company',
      accounts: 'test company',
      natureOfBusiness: 'test company',
      dissolvedOn: 'test company',
      incorporatedOn: 'test company'
    }
  ]
  const [deleteCompany, { loading: loadDeleteBills }] = useMutation(DELETE_ONE_COMPANY, {
    update: (cache, { data: { getAllCompany } }) => updateCacheMod({
      cache,
      query: ALL_COMPANIES_BY_USER,
      nameFun: 'getAllCompanyById',
      dataNew: getAllCompany
    })
  })
  const handleDelete = async (_id) => {
    const results = await deleteCompany({
      variables: { id: _id },
      update(cache) {
        cache.modify({
          fields: {
            getAllCompanyById(dataOld = []) {
              return cache.writeQuery({ query: ALL_COMPANIES_BY_USER, data: dataOld })
            }
          }
        })
      }
    }).catch(err => setAlertBox({ message: `${err}`, duration: 8000 }))
    if (results) setAlertBox({ message: 'successfully removed', duration: 8000, color: 'success' })
  }
  return (
    <>
      <Container>
        {loading && <Loading />}
        <RippleButton widthButton='200px' standard onClick={() => setState(!state)}>
          Add Company
        </RippleButton>
        <Content>
          {<AwesomeModal show={state} backdrop onHide={() => { setState(false); router.replace(router.pathname) }} onCancel={() => true} btnCancel={false} btnConfirm={false} header={true} title={'Register New Company'} size="large" footer={false} >
            <ContainerCard>
              <div>
                <Form onSubmit={e => (handleForm(e))}>
                  <InputHooks title='Name Company' required name='companyName' errors={errorForm?.companyName} value={dataForm?.companyName} onChange={handleChange} defaultValue={DUMMY_DATA[0]?.companyName} />
                  <InputHooks title='Registered Office Address' required name='registeredOfficeAddress' errors={errorForm?.registeredOfficeAddress} value={dataForm?.registeredOfficeAddress} onChange={handleChange} />
                  <InputHooks title='Company Status' required name='companyLegalStatus' errors={dataForm?.companyLegalStatus} value={dataForm?.companyLegalStatus} onChange={handleChange} />
                  <InputHooks title='Company Type' required name='companyType' errors={errorForm?.companyType} value={dataForm?.companyType} onChange={handleChange} />
                  <InputHooks title='Accounts' required name='accounts' errors={errorForm?.accounts} value={dataForm?.accounts} onChange={handleChange} />
                  <InputHooks title='Nature Of Business (SIC)' required name='natureOfBusiness' errors={errorForm?.natureOfBusiness} value={dataForm?.natureOfBusiness} onChange={handleChange} />
                  <InputHooks width='50%' title='Dissolved On' type='date' required name='dissolvedOn' errors={errorForm?.dissolvedOn} value={dataForm?.dissolvedOn} onChange={handleChange} />
                  <InputHooks width='50%' title='Incorporated On' type='date' required name='incorporatedOn' errors={errorForm?.incorporatedOn} value={dataForm?.incorporatedOn} onChange={handleChange} />
                  <InputHooks width='10%' padding='0' type='color' required name='color' errors={errorForm?.color} value={dataForm?.color} onChange={handleChange} />
                  <RippleButton padding='10px' widthButton={'100%'} type='submit' >{loading ? <LoadEllipsis /> : 'Save'}</RippleButton>
                </Form>
              </div>
            </ContainerCard>
          </AwesomeModal>}
          {dataCompany
            ? dataCompany.getAllCompanyById?.map((x) => (
              <CardCompany key={x._id} hover>
                <ButtonCard onClick={() => handleDelete(x._id)}>
                  <IconDelete size={20} color={PColor} />
                  <ActionName >
                    Delete
                  </ActionName>
                </ButtonCard>

                <Link href={{ pathname: 'new-company', query: { companyName: x.companyName, accounts: x.accounts, companyLegalStatus: x.companyLegalStatus, dissolvedOn: x.dissolvedOn, incorporatedOn: x.incorporatedOn, id: x._id, natureOfBusiness: x.natureOfBusiness, registeredOfficeAddress: x.registeredOfficeAddress, edit: true } }}>
                  <ButtonCard delay='.1s' top={'80px'} color={1} onClick={() => HandleClickEdit({ ...x, view: 2 })}>
                    <IconEdit size={20} color={PColor} />
                    <ActionName>
                      Edit
                    </ActionName>
                  </ButtonCard>
                </Link>
                <ButtonCard delay='.2s' top={'140px'}>
                  <IconPromo size={20} color={PColor} />
                  <ActionName>
                    Change State
                  </ActionName>
                </ButtonCard>
                {<div style={{ backgroundColor: color }} onClick={() => handleCompany({ ...x })} >{x.companyName.slice(0, 2).toUpperCase()}
                </div>}
                <Text size='2em' >{x.companyName}</Text>
                <Text>{x.accounts}</Text>
                <Text>{x.companyLegalStatus}</Text>
                <Text>{x.dissolvedOn}</Text>
                <Text>{x.incorporatedOn}</Text>
                <Text>{x.natureOfBusiness}</Text>
                <Text>{x.registeredOfficeAddress}</Text>
              </CardCompany>
            ))
            : <Skeleton direction='row' />}
        </Content>
      </Container>
    </>
  )
}

CompanyC.propTypes = {
  useCompany: PropTypes.func
}
