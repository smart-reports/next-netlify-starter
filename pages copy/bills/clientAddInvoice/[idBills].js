import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { ClientAddInvoice } from '../../../container/Bills/ClientAddInvoice'

const clientAddInvoice = () => {
  const router = useRouter()
  return (
       <ClientAddInvoice idBills={router.query.idBills} />
  )
}

clientAddInvoice.propTypes = {

}

export default clientAddInvoice
