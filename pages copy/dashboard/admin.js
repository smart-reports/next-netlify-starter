import React from 'react'
import PropTypes from 'prop-types'
import withSession from '../../apollo/session'
import { DashboardAmin } from '../../container/DashboardAdmin'

export default function Dashboard () {
  return (
    <DashboardAmin />
  )
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
Dashboard.propTypes = {
}
