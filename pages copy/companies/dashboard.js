import React from 'react'
import withSession from '../../apollo/session'
import { CompaniesDashboard } from '../../container/Company/dashboard'

export default function Bills (token) {
  return <CompaniesDashboard />
}
export const getServerSideProps = withSession(async function ({ req, res }) {
  if (!req.cookies[process.env.SESSION_NAME]) return { redirect: { destination: '/login', permanent: false } }
  return {
    props: { }
  }
})
