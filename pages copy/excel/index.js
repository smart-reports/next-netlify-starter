import React from 'react'
import withSession from '../../apollo/session'
// import { Excel } from '../../container/Excel'

export default function Vat () {
  return (<div />)
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req?.session?.get('user')
  if (!user) {
    // res.next()
    return { props: {} }
  }
  if (!req.cookies[process.env.SESSION_NAME]) return { redirect: { destination: '/login' } }

  return {
    props: {}
  }
}
)
