import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_ONE_COMPANY_BY_ID } from './queries'
import { useSetState } from '../../components/hooks/useState'
import { Context } from '../../context'
import { useUser } from '../Profile'
import { CHANGE_COMPANY_STATE } from '../Profile/queries'
import { Avatar, Card, CardPrimary, Container, Content, Text, Wrapper, WrapperRow } from './styled'
import { SECColor, TBGBColor } from '../../public/colors'
import { Loading } from '../../components/Loading'
import { HorizontalBarChart } from '../../components/Chart'
import { RippleButton } from '../../components/Ripple'
import { dateFormat } from '../../utils'
import Link from 'next/link'
import { useFormTools } from '../../components/hooks/useForm'
import { Section } from '../../components/Table/styled'
import { Table } from '../../components/Table'
import { GET_ALL_BILL } from '../Bills/queries'
import { SUPPLIER_FOR_COMPANY } from '../Supplier/queries'
import { GET_ALL_ATTACHMENTS } from '../Attachments/queries'

export const CompanyC = () => {
  // STATE
  const today = new Date()
  const [baseHandle, handleSubmit, setForcedData, { dataForm, errorForm, setForcedError }] = useFormTools()
  const { setAlertBox, handleMenu, menu, company } = useContext(Context)
  const [dataUser] = useUser()
  const [getAllAttachment, { data: dataFiles }] = useLazyQuery(GET_ALL_ATTACHMENTS, { variables: { idComp: company.idLasComp ? company.idLasComp : dataUser?.lastCompany }, fetchPolicy: 'cache-and-network' })

  const dateNow = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  const [dataComp, { loading }] = useCompanyHook()

  const [getAllBill, { data: dataBill, loading: loadingBills }] = useLazyQuery(GET_ALL_BILL, { variables: { idComp: company.idLasComp ? company.idLasComp : dataUser?.lastCompany }, fetchPolicy: navigator.onLine ? 'network-only' : 'cache-only' })
  const [getSuppliersForCompany, { data: dataSupplier }] = useLazyQuery(SUPPLIER_FOR_COMPANY, {
    variables: { idC: company.idLasComp ? company.idLasComp : dataUser?.lastCompany },
    fetchPolicy: 'cache-and-network'
  })
  useEffect(() => {
    getAllBill()
    getSuppliersForCompany()
  }, [company.idLasComp])
  useEffect(() => getAllAttachment(), [company.idLasComp])

  const HandleClickEdit = (item) => {
    // create func
    if (item.view === 1) {
      // setModal(true)
      // setDisable(true)
      // edit func
    } else if (item.view === 2) {
      // setDisable(false)
      // View func
    } else if (item.view === 3) {
      // isEdit.setState(true)
    }
    setForcedData({
      idBill: item._id,
      bDescription: item.bDescription,
      billNo: item.billNo,
      refCode: item.bInvoiceRef,
      bDueDate: item.bDueDate,
      _id: item?.idSupplier?._id,
      items: item?.lineItems?.map(x => { return { id: x._id, bDescription: x.description, quantity: parseInt(x.quantity), idAccount: x.idAccount, idRef: x.idPro, rate: parseInt(x.rate), iPercentage: x.iva[0].iPercentage } })
    })
  }
  const handleDelete = async (elem) => {
    const { _id } = elem
    const results = await null({
      variables: { id: _id },
      update(cache) {
        cache.modify({
          fields: {
            getAllBill(dataOld = []) {
              return cache.writeQuery({ query: 'GET_ALL_BILL', data: dataOld })
            }
          }
        })
      }
    }).catch(err => setAlertBox({ message: `${err}`, duration: 8000 }))
    if (results) setAlertBox({ message: 'successfully removed', duration: 8000, color: 'success' })
  }
  // EFFECT
  return (<>
    <Wrapper>
      <Container>
        {(loading || loadingBills) && <Loading />}
        <Content width="30%" direction="row">
          <Card padding='0' width='97%'>
            <CardPrimary radius='8px 8px 0px 0px' bgColor={TBGBColor} padding='30px 10px'>
              <Text size='22px' >Welcome Back !</Text>
              <Text size='20px' >{dataComp?.companyName}</Text>
            </CardPrimary>
            <CardPrimary padding=''>
              <Avatar />
              <Link activeClassName="active" href="/bills">
                <a>
                  <RippleButton margin='20px 0' widthButton='70px' size='10px' padding='5px'>View Bills</RippleButton>
                </a>
              </Link>
              <WrapperRow margin='0px 0px 15px'>
                <div>
                  <Text font='PFont-Medium' justify='center' align='center' size='17px' >{!!dataBill && dataBill?.getAllBill?.length}</Text>
                  <Text justify='center' align='center' size='14px' >Total Bills</Text>
                </div>
                <div>
                  <Text font='PFont-Medium' justify='center' align='center' size='17px' >{!!dataSupplier && dataSupplier?.getSuppliersForCompany?.length}</Text>
                  <Text justify='center' align='center' size='14px' >Vendors</Text>
                </div>
                <div>
                  <Text font='PFont-Medium' justify='center' align='center' size='17px' >{dataFiles?.getAllAttachment?.length}</Text>
                  <Text justify='center' align='center' size='14px' >Files</Text>
                </div>
              </WrapperRow>
            </CardPrimary>
          </Card>
          <Card width='97%'>
            AQUI ES 2
          </Card>
        </Content>
        <Content width="70%">
          <Content direction="row">
            <Card CardPrimary width='30%'>
              <Text font='PFont-Medium' size='17px' >10</Text>
              <Text size='14px' >Vendors</Text>
            </Card>
            <Card CardPrimary width='30%'>
              <Text font='PFont-Medium' size='17px' >10</Text>
              <Text size='14px' >Vendors</Text>
            </Card>
            <Card CardPrimary width='30%'>
              <Text font='PFont-Medium' size='17px' >{dataFiles?.getAllAttachment?.length}</Text>
              <Text size='14px' >Files</Text>
            </Card>
          </Content>
          <Card width='97%'>
            <HorizontalBarChart />
          </Card>
        </Content>
        <Content width="20%" direction="row">
          <Card width='97%'>
            asdkJASHDJ
          </Card>
          <Card width='97%'>
            asdkJASHDJ
          </Card>
        </Content>
        <Content width="80%">
          <Content direction="row">
            <Card width='30%'>
              <Text>Orders</Text>
              <Text>1,235</Text>
            </Card>
            <Card width='30%'>
              asdkJASHDJ
            </Card>
            <Card width='30%'>
              asdkJASHDJ
            </Card>
          </Content>
          <Card width='97%'>
            <Table
              titles={[
                { name: '#', width: '5%' },
                { name: '', width: '22%' },
                { name: 'bDueDate', width: '22%', arrow: true, key: 'bDescription' },
                { name: 'bInvoiceRef', width: '22%', arrow: true, key: 'bDescription' },
                { name: 'Action', width: '22%', arrow: true, key: 'bDescription' }
              ]}
              bgRow={2}
              pointer
              labelBtn='Reports'
              entryPerView
              buttonAdd={true}
              // handleAdd={() => isSettingModal()}
              data={[1, 2, 3]}
              renderBody={(dataB, titles) => dataB?.map((elem, i) => <Section columnWidth={titles} key={i}>
                <Content>
                  <Text>{i + 1}</Text>
                </Content>
                <Content>
                  <Text> {dateFormat(elem.bDueDate)}</Text>
                </Content>
                <Content>
                  <Text> {elem.bInvoiceRef}</Text>
                </Content>
                <Content>
                  <Text>{dateFormat(elem.bInvoiceDate)}</Text>
                </Content>
                <Content>
                  <div padding='0px' direction='row'>
                    <RippleButton onClick={(e) => HandleClickEdit({ ...elem, view: 1 })}>
                      View Details
                    </RippleButton>
                    <RippleButton onClick={() => handleDelete({ ...elem })}>
                      Delete
                    </RippleButton>
                  </div>
                </Content>
              </Section>)}
            />
          </Card>
        </Content>

      </Container>

    </Wrapper>
  </>
  )
}
export const useCompanyHook = initialState => {
  const id = initialState?._id
  const [dataUser] = useUser()
  const { isCompany, setAlertBox, useCompany, company } = useContext(Context)
  const [lastCompanyMutation] = useMutation(CHANGE_COMPANY_STATE)

  useEffect(async () => {
    useCompany(id)
    if (id) {
      await lastCompanyMutation({ variables: { lastCompany: company.idLasComp !== undefined ? company.idLasComp : dataUser?.lastCompany } }).catch(err => setAlertBox({ message: `${err}`, duration: 300000 }))
    }
  }, [id, dataUser])

  const [getOneCompanyById, { data, loading }] = useLazyQuery(GET_ONE_COMPANY_BY_ID, {
    variables: { idC: company.idLasComp ? company.idLasComp : dataUser?.lastCompany },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
    // onCompleted: data => {
    // }
  })
  useEffect(() => getOneCompanyById(), [isCompany, useCompany, id, initialState])
  return [data?.getOneCompanyById, { loading }]
}
CompanyC.propTypes = {
  id: PropTypes.string,
  setCompanyLink: PropTypes.func,
  isCompany: PropTypes.string,
  dataUser: PropTypes.array
}
