'use strict'
import { ApolloError } from 'apollo-server-errors'
import SupplierSchema from '../../../models/Suppliers/SupplierSchema'
import CurrencySchema from '../../../models/Currency/CurrencySchema'

export const getSuppliersForCompany = async (_, { idC }, ctx) => {
  try {
    const data = await SupplierSchema.find({ idComp: idC }).populate({ path: 'sCurrency' })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}

export const getSuppliersAtSales = async (_, { idC }, ctx) => {
  const idUser = ctx.User.id
  console.log(idUser)
  if (!idUser) {
    throw new ApolloError(
      'Error, Your session has expired, please log in again.',
      500
    )
  }
  try {
    const id = idUser
    const data = await SupplierSchema.find({ idComp: idC, idUser: id })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export const getOneSuppliers = async (_, { id }, ctx) => {
  try {
    const data = await SupplierSchema.findOne({ _id: id }).populate({ path: 'sCurrency' })
    return data
  } catch (error) {
    console.log(error)
    throw new ApolloError('Your request could not be processed.', 500)
  }
}

export const newSupplierForCompany = async (_, { input }, ctx) => {
  const idUser = ctx.User.id
  if (!idUser) throw new ApolloError('Your request could not be processed.', 500)
  const { idComp } = input
  try {
    const data = await SupplierSchema.create({ ...input, idComp: idComp, idUser: idUser })
    return data
  } catch (error) {
    throw new ApolloError(error)
  }
}

export const getOneCurrency = async (_, parent, ctx, info) => {
  try {
    const data = await CurrencySchema.find({ _id: parent._id })
    return data
  } catch (e) {
    const error = new Error('Your request could not be processed')
    return error
  }
}
export const DeleteOneSupplier = async (_, { id }, ctx) => {
  const idUser = ctx.User.id
  try {
    await SupplierSchema.deleteOne({ _id: id, idUser: idUser })
    return true
  } catch (error) {
    throw new ApolloError(error)
  }
}
export const editSupplierForCompany = async (_, { input }, ctx) => {
  const idUser = ctx.User.id
  const { _id, idComp, sName, sCurrency } = input
  try {
    const data = await SupplierSchema.findOneAndUpdate({ _id: _id },
      {
        idUser: idUser,
        idComp: idComp,
        sCurrency: sCurrency,
        sName: sName
      })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export default {
  TYPES: {
    Supplier: {
      currency: getOneCurrency
    }
  },
  QUERIES: {
    getOneSuppliers,
    getSuppliersForCompany,
    getSuppliersAtSales
  },
  MUTATIONS: {
    newSupplierForCompany,
    DeleteOneSupplier,
    editSupplierForCompany
  }
}
