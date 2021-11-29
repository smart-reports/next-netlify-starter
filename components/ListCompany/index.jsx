import React from 'react'
import PropTypes from 'prop-types'
import { RippleButton } from '../Ripple'
import { IconEdit, IconSearch } from '../../public/icons'
import { BColor } from '../../public/colors'
import { CompanyC } from '../../container/Company'
import { useContextMenu } from '../hooks/usePosition'
import InputHooks from '../InputHooks/InputHooks'
import { dateFormat } from '../../utils'
import useIntersectionObserver from '../hooks/useIntersection'
import { Text, Container, Card, Content, Form, Overline, Menu, Input, ContentSearch, CtnSearch, Button, SearchFilterOption, Option, ContainerFooter, Logo, CardEntry, ButtonStatus } from './styled'
export const ListCompanyCo = ({ data, dataForm, handleClick, handleCompany, handleChange, handleSubmit, show, stopPropagation }) => {
  const { xPos, yPos, showMenu } = useContextMenu()
  return (
    <Content>
      <Menu showMenu={showMenu} style={{ top: yPos, left: xPos }}>
        <ul onClick={(e) => e.stopPropagation()}>
          <Option>My Companies</Option>
          <Option>Reload</Option>
          <Option>Save</Option>
          <Option>Save As</Option>
          <Option>Inspect</Option>
        </ul>
      </Menu>
      {data?.length > 0 && <ContentSearch>
        <Text margin='30px 0' size='3.5rem' font='PFont-Bold' color={BColor}>Select a company to continue</Text>
        <CtnSearch>
          <Button>
            <IconEdit size='20px' />
            <Text margin='30px 5px' size='12px' font='PFont-Regular' color={BColor}>Select a company</Text>
            <SearchFilterOption>
              <Option>My Companies</Option>
              <Option>Team Company</Option>
              <Option>Dashboard</Option>
            </SearchFilterOption>
          </Button>
          <Button>
            <IconSearch size='30px' color={`${BColor}98`} />
          </Button>
          <InputHooks width='100%' placeholder='search' required errors={dataForm?.uEmail} value={dataForm?.uEmail} onChange={handleChange} name='uEmail' />
        </CtnSearch>
      </ContentSearch>
      }
      <Container>
        <>
          {data?.length > 0
            ? <>
              {data?.map((x, i) => (
                <Card key={x._id} onClick={() => handleCompany({ ...x })} ref={x.ref}>
                  {/* <RippleButton widthButton='60px' bgColor={'transparent'} onClick={(e) => handleClick(i, e)}><IconUser size='20px' /></RippleButton> */}
                  <div>
                    <Logo>
                      {/* <Img src='https://st.depositphotos.com/1968353/2508/i/950/depositphotos_25081731-stock-photo-reflective-skyscrapers-business-office-buildings.jpg' /> */}
                    </Logo>
                    <LazyLoading>
                      <Text animation size='25px'>{x.companyName} </Text>
                      <Text animation size='15px'>{x.registeredOfficeAddress}</Text>
                    </LazyLoading>
                  </div>
                  <Overline onClick={(e) => stopPropagation(e)} show={show === i} />
                  <Form show={show === i} onSubmit={e => (handleSubmit(e))}>
                    <Input
                      placeholder={`to invite ${x.companyName}`}
                      key={x}
                      required
                      onClick={(e) => e.stopPropagation()}
                      errors={x?.x}
                      defaultValue={x.value}
                      name={x.name}
                      value={dataForm.name}
                      onChange={(e) => handleChange(e)}
                    />
                    <RippleButton widthButton='200px' standard onClick={() => handleClick({ ...x })}>
                      Add
                    </RippleButton>
                  </Form>
                  <>
                    <ContainerFooter>
                      <Text margin='10px' size='16px' >{dateFormat(x.incorporatedOn)}</Text>
                      <Text margin='10px' size='16px' >{x.natureOfBusiness}</Text>
                      {/* <CardFooter>asdas
                    </CardFooter> */}
                    </ContainerFooter>
                  </>
                </Card>
              ))}
            </>
            : <div>
              <Text margin='30px 0' size='3.5rem' font='PFont-Bold' color={BColor}>{`Add ${data?.length > 0 ? 'Another company' : 'new company'}`}</Text>
              <CompanyC />
            </div>
          }
        </>
      </Container>
      {data?.length > 0 && <ButtonStatus>Load more</ButtonStatus>}
    </Content>
  )
}
const LazyLoading = (props) => {
  const [isIntersected, setIsIntersected] = React.useState(false)
  const el = React.useRef()
  const onEnter = React.useCallback(() => {
    setIsIntersected(true)
  }, [setIsIntersected])
  useIntersectionObserver({ el, onEnter })
  return (
    <>
      {<CardEntry ref={el} active={isIntersected}>
        {props.children}
      </CardEntry>}
    </>
  )
}
LazyLoading.propTypes = {
  props: PropTypes.object,
  children: PropTypes.array
}
ListCompanyCo.propTypes = {
  setCompanyLink: PropTypes.func,
  handleCompany: PropTypes.func,
  isCompany: PropTypes.string,
  year: PropTypes.number,
  data: PropTypes.array,
  userdata: PropTypes.object,
  handleChange: PropTypes.object,
  dataForm: PropTypes.array,
  stopPropagation: PropTypes.array,
  error: PropTypes.array,
  onChange: PropTypes.object,
  handleSubmit: PropTypes.func,
  errorForm: PropTypes.func,
  handleClick: PropTypes.func,
  handleIdUser: PropTypes.object,
  show: PropTypes.number || PropTypes.bool,
  setShow: PropTypes.bool,
  loading: PropTypes.bool
}
