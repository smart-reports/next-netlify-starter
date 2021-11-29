import React from 'react'
import { Anchor, FooterComponent, Text } from './styled'
import ActiveLink from '../../common/Link'
import { IconConfig, IconHome, IconSearch, IconUser } from '../../../public/icons'
import { PColor } from '../../../public/colors'

export const Footer = () => {
  return (
    <>
      <FooterComponent>
        <>
          <ActiveLink activeClassName="active" href="/">
            <Anchor><IconHome color={PColor} size='20px' />&nbsp;<Text>Home</Text></Anchor>
          </ActiveLink>
          <ActiveLink activeClassName="active" href="/search">
            <Anchor><IconSearch color={PColor} size='20px' />&nbsp;<Text>Explore</Text></Anchor>
          </ActiveLink>
          <ActiveLink activeClassName="active" href="/config">
            <Anchor><IconConfig color={PColor} size='20px' />&nbsp;<Text>Config</Text></Anchor>
          </ActiveLink>
          <ActiveLink activeClassName="active" href="/profile">
            <Anchor><IconUser color={PColor} size='20px' />&nbsp;<Text>Profile</Text></Anchor>
          </ActiveLink>
        </>
      </FooterComponent>
    </>
  )
}
