import React from 'react'
import PropTypes from 'prop-types'
import { Button, Text } from './styled'
import { EColor, PColor } from '../../public/colors'
import { IconDelete } from '../../public/icons'
import styled, { css } from 'styled-components'
const AttachmentsList = ({
  data,
  modal,
  deleteSlot,
  setModal,
  filterLineItems,
  width,
  dataAccount,
  dispatch,
  state,
  handleDelete,
  dataForm,
  HandleClickEdit,
  onChange,
  billSubTotal,
  setShowLateral,
  dataIva,
  addMore,
  dataClass,
  setShow,
  calculateIva,
  showLateral,
  isEdit,
  DeleteAll,
  handleFileChange,
  dataFiles,
  show,
  Disable,
  dataProducts,
  getFileUrl,
  dataOneSupplier,
  handleMenu
}) => {
  return (
    <ContainerAttachment width={width}>
      <Text margin='10px 0 30px 0' size='20px'>Add to Bill</Text>
      <>
        {!!dataFiles?.length > 0 && dataFiles?.map(x => (
          <WrapperCard width={width} key={x._id}>
            <div>
              <a className='link' target="_blank" onClick={() => getFileUrl({ BillLink: x.BillLink })} >{x.BillLink}</a>
              &nbsp;&nbsp; &nbsp;
            </div>
            <Option>
              {dataFiles &&
                <Option>
                  <Button type="button" display='inline-grid' onClick={() => getFileUrl({ BillLink: x.BillLink, Delete: true, idFile: x._id })} >
                    <IconDelete size='20px' color={EColor} />
                  </Button>
                  <Button type="button" display='inline-grid' onClick={() => getFileUrl({ BillLink: x.BillLink, Delete: true, idFile: x._id })} >
                    <span className="link">Download</span>
                  </Button>
                </Option>}
            </Option>
          </WrapperCard>
        ))}
      </>
    </ContainerAttachment>
  )
}
export const Option = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 7px;
  text-align: center;
  cursor: pointer;

`
export const WrapperCard = styled.div`
    font-size: 14px;
    ${({ width }) => width
    ? css`
                width: 225px;
                  `
    : css`
                opacity: 0;
                width: 0%;
              `}
    display: grid;
    place-content: center;
    align-items: center;
    color: #393A3D;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 0 rgb(51 51 51 / 15%);
    border: 1px solid #c7c7c7;
    transform: translate3d(0, 0, 0);
`
export const ContainerAttachment = styled.div`
    position: relative;
    height: 100%;
    min-height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
    display: grid;
    justify-content: center;
    align-items: flex-start;
    transition: all 200ms ease-in-out;
    ${({ width }) => width
    ? css`
                width: 20%;
                  `
    : css`
                
                width: 0%;
              `}

`
AttachmentsList.propTypes = {
  state: PropTypes.func,
  dataFiles: PropTypes.array,
  dataClass: PropTypes.object,
  dataOneSupplier: PropTypes.object,
  data: PropTypes.array,
  isEdit: PropTypes.bool,
  width: PropTypes.bool,
  show: PropTypes.bool,
  errorForm: PropTypes.object,
  refs: PropTypes.element,
  onChange: PropTypes.func,
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
  dataForm: PropTypes.array,
  modal: PropTypes.bool,
  setModal: PropTypes.func,
  setsize: PropTypes.number,
  setTotalIva: PropTypes.number,
  handleDelete: PropTypes.func,
  addTag: PropTypes.func,
  LinkMinio: PropTypes.string,
  HandleClickEdit: PropTypes.func,
  filterLineItems: PropTypes.array,
  reset: PropTypes.bool,
  calculateAmount: PropTypes.func,
  calculateIva: PropTypes.func,
  handleTag: PropTypes.func,
  setReset: PropTypes.func,
  total: PropTypes.number,
  size: PropTypes.number,
  billSubTotal: PropTypes.number,
  setShowLateral: PropTypes.bool,
  showLateral: PropTypes.func,
  selectedTags: PropTypes.string,
  setShow: PropTypes.func,
  tagValue: PropTypes.string,
  dataAccount: PropTypes.array,
  dataProducts: PropTypes.array,
  dataSupplier: PropTypes.array,
  dataIva: PropTypes.array,
  deleteSlot: PropTypes.func,
  setForcedData: PropTypes.func,
  addMore: PropTypes.func,
  DeleteAll: PropTypes.func,
  handleFileChange: PropTypes.func,
  Disable: PropTypes.bool,
  handleMenu: PropTypes.func,
  setTags: PropTypes.func,
  tags: PropTypes.array,
  getFileUrl: PropTypes.func
}

export default AttachmentsList
