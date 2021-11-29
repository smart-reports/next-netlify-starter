/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { BGColor, PColor, SEGColor, SFColor } from '../../public/colors'
import { IconArrowBottom, IconArrowLeft, IconFolder } from '../../public/icons'
import { useRouter } from 'next/router'

export default function NewSelectCompany ({ options, secOptionName, icon, standard, onClick, disabled, id, idD, name, onChange, optionName, value, width, search, title, padding, margin, minWidth, error, required, accessor, fullName, defaultValue }) {
  const [select, setSelect] = useState(false)
  const [selectRef, setSelectRef] = useState(0)
  const [valueInput, setValueInput] = useState()
  const [selectBody, setSelectBody] = useState(0)
  const [newOption, setNewOption] = useState(false)
  const bodyHeight = window.screen.height
  const inputSearch = useRef(null)
  const [refSelect, setRefSelect] = useState(false)
  const router = useRouter()
  // Renderiza el valor
  const renderVal = data => {
    if (!data) return ''
    if (Array.isArray(optionName)) {
      let valueRender = ''
      optionName.forEach(x => valueRender = `${valueRender} ${(accessor && data[accessor]) ? data[accessor][x] : data[x]}`)
      return valueRender
    } else return data[optionName]
  }
  /** Use Effect */
  useEffect(() => {
    setNewOption(options)
  }, [options])

  /** Use Effect */
  useEffect(() => {
    if (search) { select && inputSearch.current.focus() }
  }, [select, search])

  const changeRef = v => {
    setSelectRef(v.offsetTop + selectBody)
    setRefSelect(v)
  }

  const changeValue = v => {
    setSelect(false)
    onChange({ target: { name, value: v[id] } }, !v[id], refSelect)
  }

  const changeSearch = v => {
    setValueInput(v.target.value)
    const fil = options.filter(x => renderVal(x).toUpperCase().indexOf(v.target.value.toUpperCase()) > -1)
    setNewOption(fil)
  }

  const handleClick = e => {
    e.preventDefault()
    setSelect(!select)
    setTimeout(() => setNewOption(options), 500)
  }

  const handleBlur = () => {
    setTimeout(() => setSelect(false), 400)
    setTimeout(() => setNewOption(options), 300)
  }
  return (
    <BoxSelect ref={v => !!v && changeRef(v)} id={idD} onClick={onClick}>
      <FixedBox onClick={() => setSelect(false)} active={select} />
      <Container>
        <Button onClick={() => router?.back()}>
          <IconArrowLeft size='20px' color={SEGColor} />
        </Button>
        <CustomButtonS type='button' onClick={handleClick} disabled={disabled}>
          <SpanText>{title}</SpanText>
          <Button position>
            <IconArrowBottom size='20px' color={SEGColor} />
          </Button>
        </CustomButtonS>
      </Container>
      {select &&
        <div style={{ zIndex: '9999999' }}>
          {search && <InputText placeholder='Buscar aquí...' value={valueInput || ''} ref={inputSearch} onChange={changeSearch} />}
          <BoxOptions style={{ width: '100%', overflowY: 'auto' }} onBlur={handleBlur} bottom={selectRef > bodyHeight} ref={v => setSelectBody(!!v && v.offsetHeight)} top={selectRef < bodyHeight} autoHideTimeout={1500} autoHideDuration={700} autoHeight autoHeightMin={0} autoHeightMax='200px'>
            {newOption.length
              ? newOption.map(x => <CustomButtonS option key={x[id]} type='button' onClick={() => changeValue(x)}>{renderVal(x)}</CustomButtonS>)
              : <TextNotResult><IconFolder size='40px' /> &nbsp; No results.</TextNotResult>
            }
          </BoxOptions>
        </div>}
      <input type='hidden' name={name} value={value || ''} id={id} data-required={required} />
    </BoxSelect>
  )
}

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    `
const BoxSelect = styled.div`
  height: 100%;
  z-index: 90;
  background-color: ${BGColor};

`
export const Button = styled.button`
    cursor: pointer;
    background-color: transparent;
    ${props => props.position && css`
      right: 0;
      position: absolute;
    `}
`
// Caja para ocultar al hacer click fuera del foco del select
const FixedBox = styled.div`
    display: ${props => props.active ? 'block' : 'none'};
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 100;
    top: 0;
    left: 0;
    z-index: ${({ active }) => active ? '9' : '-1'};
    background-color: transparent;
    overflow:hidden;
`
// Select
const CustomButtonS = styled.button`
    position: relative;
    display: block;
    background-color: ${({ bgColor, disabled }) => disabled ? 'rgba(239, 239, 239, 0.3)' : (bgColor || '#fff')};
    outline: 0;
    padding: 15px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: PFont-Light;
    text-align: left;
    display: flex;
    align-items: center;
    color: ${SFColor};
    width: 100%;
    &:hover {
        color: ${PColor};
        background-color: #f7f7f7;
        cursor: ${({ disabled }) => disabled ? 'no-drop' : 'pointer'};
    }
`
const BoxOptions = styled.div`
    position: absolute;
    left: 0px;
    width: 100%;
    background-color: ${BGColor};
    z-index: 100;
    height: min-content;
    border: 1px solid #cccccc50;
    overflow-y: auto;
    height: 300px;
`
const SpanText = styled.label`
    font-size: 1rem;
    font-family: PFont-Regular;
    color: ${SFColor};
`
const TextNotResult = styled.span`
    font-size: 20px;
    color: ${SEGColor};
    padding: 0 10px; 
    display: flex;
    align-items: center;
    justify-content: center;
`
export const InputText = styled.input`
    width: 100%;
    margin: 0;
    padding: 10px 8px;
    border: none;
    border-bottom: 1px solid #cccccc42;
    outline: none;
`
NewSelectCompany.propTypes = {
  options: PropTypes.array,
  disabled: PropTypes.bool,
  id: (PropTypes.string || PropTypes.number).isRequired,
  idD: (PropTypes.string || PropTypes.number),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string || PropTypes.number,
  width: PropTypes.string,
  search: PropTypes.bool,
  title: PropTypes.string,
  padding: PropTypes.string,
  margin: PropTypes.string,
  minWidth: PropTypes.string,
  error: PropTypes.bool,
  required: PropTypes.bool,
  accessor: PropTypes.string,
  fullName: PropTypes.bool
}
