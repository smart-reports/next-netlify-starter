'use strict'
import { ApolloError } from 'apollo-server-errors'
// import { isCompositeType } from 'graphql'
import Product from '../../../models/Products/ProductsSchema'
// import UserSchema from '../../../models/users/userLogin'
// import CompanySchema from '../../../models/Companies/CompanySchema'

export const newProductForCompany = async (_, { input }, ctx) => {
  console.log(input)
  const idUser = ctx.User.id
  try {
    const product = new Product({ ...input, idComp: input.idComp, idUser: idUser })
    await product.save(product)
    await Product.findOneAndUpdate(
      { _id: product._id },
      {
        $set: { idRef: product._id }
      }
    )
    return product
  } catch (error) {
    throw new ApolloError(error)
  }
}
export const DeleteOneProducts = async (_, { id }, ctx) => {
  const idUser = ctx.User.id
  try {
    await Product.deleteOne({ _id: id, idUser: idUser })
    return true
  } catch (error) {
    throw new ApolloError(error)
  }
}

export const getProductsForCompany = async (_, { idComp }, ctx) => {
  const idUser = ctx.User.id
  try {
    const data = await Product.find({ idUser: idUser, idComp: idComp })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}

export const getProductsOneForCompany = async (_, { idComp }, ctx) => {
  console.log([''])
}
export const editOneProduct = async (_, { input }, ctx) => {
  console.log(input)
  const idUser = ctx.User.id
  const { _id, idComp, pName, pServiceCode, pCategory, idRef, pClass, pDescription, pSalesPrice, pIncVAT, pIncomeAccount, pPurchasedOthers, pType, pSellToOthers, pVATCode, pPhoto } = input
  try {
    const data = await Product.findOneAndUpdate({ _id: _id }, { idUser: idUser, idComp, pName, pServiceCode, pCategory, idRef, pClass, pDescription, pSalesPrice, pIncVAT, pIncomeAccount, pPurchasedOthers, pType, pSellToOthers, pVATCode, pPhoto })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export default {
  TYPES: {
  },
  QUERIES: {
    getProductsForCompany,
    getProductsOneForCompany
  },
  MUTATIONS: {
    newProductForCompany,
    DeleteOneProducts,
    editOneProduct
  }
}
