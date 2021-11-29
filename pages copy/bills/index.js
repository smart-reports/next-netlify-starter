import React from 'react'
import { BillsC } from '../../container/Bills'
import withSession from '../../apollo/session'

export default function Bills (token) {
  return <BillsC />
}
export const getServerSideProps = withSession(async function ({ req, res }) {
  if (!req.cookies[process.env.SESSION_NAME]) return { redirect: { destination: '/login', permanent: false } }
  return {
    props: { }
  }
})
