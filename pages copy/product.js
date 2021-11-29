import React from 'react'
import withSession from '../apollo/session'
import { ProductsC } from '../container/Products'

export default function Bills (token) {
  return <ProductsC />
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  if (!req.cookies[process.env.SESSION_NAME]) return { redirect: { destination: '/login', permanent: false } }
  return {
    props: { }
  }
})
