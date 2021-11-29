import React, { useContext, useEffect } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useFormTools } from '../../components/hooks/useForm'
import InputHooks from '../../components/InputHooks/InputHooks'
import { ALL_COMPANIES, CREATE_ONE_COMPANY } from '../Company/queries'
import { LoadEllipsis } from '../../components/Loading'
import { RippleButton } from '../../components/Ripple'
import { Form, Card } from './styled'
import { Context } from '../../context'

export const NewCompany = () => {
  const [handleChange, handleSubmit, setForcedData, { dataForm, errorForm }] = useFormTools()
  const { company, handleMenu } = useContext(Context)
  const [newCompany, { loading }] = useMutation(CREATE_ONE_COMPANY, {
    update (cache) {
      cache.modify({
        fields: {
          getCompanies (dataOld = []) {
            return cache.writeQuery({ query: ALL_COMPANIES, data: dataOld })
          }
        }
      })
    }
  })
  console.log(dataForm)
  const handleForm = e => handleSubmit({
    event: e,
    action: () => newCompany({
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
      }
    }),
    actionAfterSuccess: () => {
      setForcedData({})
      getCompanies()
      handleMenu(false)
    }
  })
  const [getCompanies] = useLazyQuery(ALL_COMPANIES, {
    variables: { idComp: company.idLasComp ? company.idLasComp : null },
    fetchPolicy: 'cache-and-network'
  })
  useEffect(() => getCompanies(), [company.idLasComp])

  return (
        <div>
              <Form onSubmit={e => (handleForm(e))}>
                <Card>
                  <InputHooks title='Name Company' required name='companyName' errors={errorForm?.companyName} value={dataForm?.companyName} onChange={handleChange} />
                  <InputHooks title='Registered Office Address' required name='registeredOfficeAddress' errors={errorForm?.registeredOfficeAddress} value={dataForm?.registeredOfficeAddress} onChange={handleChange} />
                  <InputHooks title='Company Status' required name='companyLegalStatus' errors={errorForm?.companyLegalStatus} value={dataForm?.companyLegalStatus} onChange={handleChange} />
                  <InputHooks title='Company Type' required name='companyType' errors={errorForm?.companyType} value={dataForm?.companyType} onChange={handleChange} />
                  <InputHooks title='Accounts' required name='accounts' errors={errorForm?.accounts} value={dataForm?.accounts} onChange={handleChange} />
                  <InputHooks title='Nature Of Business (SIC)' required name='natureOfBusiness' errors={errorForm?.natureOfBusiness} value={dataForm?.natureOfBusiness} onChange={handleChange} />
                  <InputHooks width='100%' title='Dissolved On' type='date' required name='dissolvedOn' errors={errorForm?.dissolvedOn} value={dataForm?.dissolvedOn} onChange={handleChange} />
                  <InputHooks width='100%' title='Incorporated On' type='date' required name='incorporatedOn' errors={errorForm?.incorporatedOn} value={dataForm?.incorporatedOn} onChange={handleChange} />
                  <InputHooks width='10%' padding='0' type='color' required name='color' errors={errorForm?.color} value={dataForm?.color} onChange={handleChange} />
                  <RippleButton padding='10px' widthButton={'100%'} type='submit' >{loading ? <LoadEllipsis /> : 'Save'}</RippleButton>
                </Card>
              </Form>
        </div>
  )
}

NewCompany.propTypes = {

}
