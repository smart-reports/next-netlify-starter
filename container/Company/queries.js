import { gql } from '@apollo/client'

export const CREATE_ONE_COMPANY = gql`
    mutation newCompany($input: ICompany) {
        newCompany(input: $input) {
            companyName
            registeredOfficeAddress
            companyLegalStatus
            companyType
            accounts
            natureOfBusiness
            dissolvedOn
            incorporatedOn
            idUser
        }
    }
`

export const ALL_COMPANIES = gql`
    query getCompanies {
        getCompanies {
            _id
            companyName
            registeredOfficeAddress
            companyLegalStatus
            companyType
            accounts
            natureOfBusiness
            dissolvedOn
            incorporatedOn
        }
    }
`
export const ALL_COMPANIES_BY_USER = gql`
    query getAllCompanyById {
        getAllCompanyById {
            _id
            companyName
            registeredOfficeAddress
            companyLegalStatus
            companyType
            accounts
            natureOfBusiness
            dissolvedOn
            incorporatedOn
            idUser
        }
    }   
`

export const DELETE_ONE_COMPANY = gql`
mutation deleteCompany($id: ID!) {
    deleteCompany(id: $id)
}
`
