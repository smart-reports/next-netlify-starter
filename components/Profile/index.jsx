/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { ShadowCard } from '../ShadowCard'
import { IconFacebook, IconInstagram, IconTwitter } from '../../public/icons'
import { PColor } from '../../public/colors'
import { RippleButton } from '../Ripple'
import { Circle, HorizontalBarChart } from '../Chart'
import InputHooks from '../InputHooks/InputHooks'
import { Avatar, CardPrimary, Container, Content, ContentInfo, CtnIcon, Text, Card, InputDate, ImgUser, Form } from './styled'
import { LateralMenu } from '../common/LateralMenu'

export const Profile = ({ data, state, setState, handleChange, handleSubmit, sessionActive, loading, dataForm, setStep, uploadImage, fileInputRef, onTargetClick, baseImage }) => {
  return (
    <Container>
      <Content><Card width='30%'>
        <ShadowCard>
          <CardPrimary bgColor='#d4dbf9' padding='15px 10px 40px'>
            <Text>Welcome Back ! </Text>
            <Text size='12px'>{data?.userName} </Text>
          </CardPrimary>
          <CardPrimary padding='15px 10px'>
            <Avatar src={data?.uAvatar} onClick={() => data?.uEmail === sessionActive.uEmail && setState(!state)} />
            <Text margin='25px 0px' size='12px'>Link to the useContext hook when authentication is working! </Text>
          </CardPrimary>
        </ShadowCard>
        <ShadowCard>
          <CardPrimary padding='15px 10px'>
            <Text>Social Source </Text>
            <Text size='12px'>Get the name from the JWT token.....when use is logged in </Text>
            <ContentInfo gap='10px'>
              <div><IconFacebook size='30px' color={PColor} /> </div>
              <div><IconTwitter size='30px' color={PColor} /> </div>
              <div><IconInstagram size='30px' color={PColor} /> </div>
            </ContentInfo>
          </CardPrimary>
        </ShadowCard>
        <ShadowCard>
          <CardPrimary padding='15px 10px'>
            <span>
            </span>
            <form onSubmit={e => (handleSubmit(e))}>
              <Text>Change password </Text>
              <InputHooks width='100%' title='currentPassword' required errors={dataForm?.currentPassword} value={dataForm?.currentPassword} onChange={handleChange} name='currentPassword' />
              <InputHooks width='100%' title='currentPassword' required errors={dataForm?.newPassword} value={dataForm?.newPassword} onChange={handleChange} name='newPassword' />
              <RippleButton widthButton='100%' type='submit'>Save</RippleButton>
            </form>
            <form onSubmit={e => (handleSubmit(e))}>
              <Text>Change LastName  </Text>
              <InputHooks width='100%' title='lastName' required errors={dataForm?.lastName} value={dataForm?.lastName} onChange={handleChange} name='lastName' />
              <InputHooks width='100%' title='Address' required errors={dataForm?.uAddress} defaultValue={`${data?.uEmail}`} value={data?.uAddress || dataForm?.uAddress} onChange={handleChange} name='uAddress' />
              <RippleButton widthButton='100%' type='submit' onClick={() => setStep(3)}>Save</RippleButton>
            </form>
            <form onSubmit={e => (handleSubmit(e))}>
              <Text>Change Number </Text>
              {/* <InputHooks width='100%' title='uPhone' numeric required errors={dataForm?.uPhone} value={dataForm?.uPhone} onChange={handleChange} name='uPhone' /> */}
              <InputHooks width='100%' type='date' title='uBirthday' required errors={dataForm?.uBirthday} value={dataForm?.uBirthday} onChange={handleChange} name='uBirthday' defaultValue={data?.uBirthday} />
              <RippleButton widthButton='100%' type='submit' onClick={() => setStep(4)}>Save</RippleButton>
            </form>
            <HorizontalBarChart />
          </CardPrimary>
        </ShadowCard>
        <ShadowCard>
          <CardPrimary padding='15px 10px'>
            <Text>Example </Text>
            <Circle />
          </CardPrimary>
        </ShadowCard>
        <ShadowCard>
          <CardPrimary padding='15px 10px'>
            <Text>Example </Text>
            <HorizontalBarChart />
          </CardPrimary>
        </ShadowCard>
        <ShadowCard>
          <CardPrimary padding='15px 10px'>
            <Text>Example </Text>
            <HorizontalBarChart />
          </CardPrimary>
        </ShadowCard>
      </Card>
        <Card width='65%'>
          <ContentInfo gap={'10px'}>
            <ShadowCard>
              <CardPrimary direction='row' padding='0.5rem'>
                <Text size='12px'>Last 30 Days Total Bills </Text>
                <Text size='12px'>Number of bills entered: </Text>
                <Text size='12px'>Total Amount of Bills entered: £</Text>
                <CtnIcon></CtnIcon>
              </CardPrimary>
            </ShadowCard>
            <ShadowCard>
              <CardPrimary direction='row' padding='0.5rem'>
                <Text size='12px'>Last 30 Days Total Sales </Text>
                <Text size='12px'>Number of sales entered: </Text>
                <Text size='12px'>Total Amount of Sales entered: £</Text>
                <CtnIcon></CtnIcon>
              </CardPrimary>
            </ShadowCard>
            <ShadowCard>
              <CardPrimary direction='row' padding='0.5rem'>
                <Text size='12px'>Top 10 Customers </Text>
                <Text size='12px'>Top 10 Suppliers</Text>
                <CtnIcon></CtnIcon>
              </CardPrimary>
            </ShadowCard>
          </ContentInfo>
          {/* <TableBilling /> */}
        </Card>
        <LateralMenu show={state} title={'Change photo'} onCancel={() => setState(false)} onHide={() => setState(false)} backdrop btnConfirm={false} header={false} footer={false} padding='20px'>
          <Form onSubmit={e => (handleSubmit(e))}>
            {/* {baseImage.length
              ? <ImgTaken src={baseImage} atl='Img User' onClick={onTargetClick} />
            : <ImgTaken src={data?.uAvatar} atl='Img User' onClick={onTargetClick} />} */}
            <InputDate
              img
              type="file"
              ref={fileInputRef}
              onClick={onTargetClick}
              accept="image/*"
              onChange={(e) => {
                uploadImage(e)
              }}
            />
                {/* <IconImg color='#ccc' size='200px'/> */}
            <ImgUser
              // loader={input}
              src={`${data?.uAvatar}`}
              // layout="responsive"
              objectFit="cover"
              alt="Picture of the author"
              width={500}
              onClick={onTargetClick}
              height={100}
              onChange={(e) => {
                uploadImage(e)
              }}
            />
            <RippleButton widthButton='100%' type='submit' onClick={() => setStep(5)}>Save</RippleButton>
          </Form>
          <Card width='100%' padding='20px'>
          </Card>
        </LateralMenu>
      </Content>
    </Container >
  )
}

Profile.propTypes = {
  handleChange: PropTypes.func,
  setState: PropTypes.func,
  changeState: PropTypes.func,
  userName: PropTypes.string,
  handleSubmit: PropTypes.func,
  data: PropTypes.object,
  values: PropTypes.string,
  state: PropTypes.bool
}
