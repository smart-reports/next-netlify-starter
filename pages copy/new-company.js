import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { CompanyC } from '../container/Company'
import { Context } from '../context'
import withSession from '../apollo/session'
export default function newCompany (token) {
  const { setCompanyLink, isCompany, useCompany } = useContext(Context)
  return (<CompanyC setCompanyLink={setCompanyLink} isCompany={isCompany} useCompany={useCompany} />)
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  if (!req.cookies[process.env.SESSION_NAME]) return { redirect: { destination: '/login', permanent: false } }
  return {
    props: { }
  }
})

newCompany.propTypes = {
  setCompanyLink: PropTypes.func,
  isCompany: PropTypes.string
}
