import { gql } from '@apollo/client'

export const CREATE_ONE_TEAM = gql`
mutation RegisterOneTeam($idC: ID, $uEmail: String) {
  RegisterOneTeam(idC: $idC, uEmail: $uEmail ){
    success
    message
  }
}
`
