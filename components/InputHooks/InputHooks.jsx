/* eslint-disable react/prop-types */
/* eslint no-console: "error" */
/* eslint no-console: ["error", { allow: ["warn"] }] */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { BoxInput, InputV, LabelInput, ShowPass, Tooltip, TextAreaInput } from './styled'
import { isEmail, isNull, isPassword, onlyLetters, passwordConfirm, rangeLength } from '../../utils'
import { IconNoShow, IconShowEye } from '../../public/icons'

const InputHooks = ({
  reference,
  title,
  disabled,
  onBlur,
  fontSize,
  paddingInput,
  width,
  minWidth,
  maxWidth,
  TypeTextarea,
  padding,
  radius,
  labelColor,
  placeholder,
  type,
  value,
  onChange,
  name,
  required,
  numeric,
  border,
  checked,
  letters,
  range,
  email,
  pass,
  passConfirm,
  error
}) => {
  // Declarando el estado
  const [errors, setError] = useState(error)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [message, setMessage] = useState('The field must not be empty')
  // Función para activar el error
  const errorFunc = (e, v, m) => {
    setError(v)
    v && setMessage(m)
    onChange(e, v)
  }
  useEffect(() => {
    setError(error)
  }, [error])
  /**
     * @description Función que para validar los campos de texto por el método onChange
     * @version 0.0.1
     * @param {object} e evento del metodo change
     * @return {boolean} devuleve true o false si la validación es correcta o incorrecta
     *
     */
  const validations = e => {
    // Valida que el campo no sea nulo
    if (required) {
      if (isNull(e.target.value)) { return errorFunc(e, true, 'El campo no debe estar vacío') } else errorFunc(e, false, '')
    }
    // Valida que el campo sea tipo numérico
    if (numeric) {
      if (isNaN(e.target.value)) { return errorFunc(e, true, 'El campo debe ser numérico') } else errorFunc(e, false, '')
    }
    // Valida que el campo sea solo letras
    if (letters) {
      if (onlyLetters(e.target.value)) { return errorFunc(e, true, 'El campo debe contener solo letras') } else errorFunc(e, false, '')
    }
    // Valida que el campo esté en el rango correcto
    if (range) {
      if (rangeLength(e.target.value, range.min, range.max)) {
        return errorFunc(
          e,
          true,
          `El rango de carácteres es de ${range.min} a ${range.max}`
        )
      } else errorFunc(e, false, '')
    }
    // Valida si el campo tiene un formato de email correcto
    if (email) {
      if (isEmail(e.target.value)) { return errorFunc(e, true, 'Formato de correo inválido') } else errorFunc(e, false, '')
    }
    // Valida si el campo tiene un formato de contraseña correcto
    if (pass) {
      if (isPassword(e.target.value)) { return errorFunc(e, true, 'La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula. Puede tener otros símbolos.') } else errorFunc(e, false, '')
    }
    // Valida que las contraseñas coincidan
    if (passConfirm?.validate) {
      if (passwordConfirm(e.target.value, passConfirm?.passValue)) { return errorFunc(e, true, 'Las contraseñas no coinciden.') } else errorFunc(e, false, '')
    }
  }
  return (
    <BoxInput width={width} maxWidth={maxWidth} padding={padding} minWidth={minWidth}>
      {pass && <ShowPass type='button' onClick={() => setIsPasswordShown(!isPasswordShown)}>
        {isPasswordShown ? <IconNoShow size='20px' /> : <IconShowEye size='20px' />}
      </ShowPass>}
      {!TypeTextarea
        ? <div>
          <InputV
            ref={reference}
            value={value || ''}
            onChange={validations}
            name={name}
            disabled={disabled}
            checked={checked}
            onBlur={onBlur}
            size={fontSize}
            radius={radius}
            border={border}
            error={errors}
            placeholder={placeholder}
            type={isPasswordShown ? 'text' : type}
            autoComplete={type === 'password' ? 'current-password' : 'true'}
            paddingInput={paddingInput}
          />
        </div>
        : <TextAreaInput
          ref={reference}
          value={value || ''}
          onChange={validations}
          name={name}
          disabled={disabled}
          width={width} maxWidth={maxWidth} minWidth={minWidth}
          onBlur={onBlur}
          border={border}
          size={fontSize}
          padding={padding}
          radius={radius}
          error={errors}
          placeholder={placeholder}
          paddingInput={paddingInput}
        />}

      {<LabelInput value={value} type={type} labelColor={labelColor} error={error}>{title}</LabelInput>}
      {errors && <Tooltip>{message}</Tooltip>}
    </BoxInput>
  )
}

InputHooks.propTypes = {
  onBlur: PropTypes.func,
  error: PropTypes.func || PropTypes.bool,
  onChange: PropTypes.func,
  minLenght: PropTypes.number,
  maxLenght: PropTypes.number,
  email: PropTypes.bool,
  numeric: PropTypes.bool,
  letters: PropTypes.bool,
  disabled: PropTypes.bool,
  autoComplete: PropTypes.bool,
  required: PropTypes.bool,
  pass: PropTypes.bool,
  TypeTextarea: PropTypes.bool,
  passConfirm: PropTypes.object,
  dataIgnore: PropTypes.bool,
  type: PropTypes.string,
  maxWidth: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.string,
  margin: PropTypes.string,
  placeholder: PropTypes.string,
  radius: PropTypes.string,
  range: PropTypes.object,
  fontSize: PropTypes.string,
  defaultValue: PropTypes.string,
  reference: PropTypes.object,
  minWidth: PropTypes.string || PropTypes.number,
  border: PropTypes.string || PropTypes.number,
  padding: PropTypes.string || PropTypes.number,
  labelColor: PropTypes.string || PropTypes.number,
  bgColor: PropTypes.string || PropTypes.number,
  value: PropTypes.string || PropTypes.number,
  paddingInput: PropTypes.string || PropTypes.number
}

export default InputHooks
