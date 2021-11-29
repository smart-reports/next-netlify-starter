'use strict'
import { ApolloError } from 'apollo-server-errors'
// import { isCompositeType } from 'graphql'
import CategoriesSchema from '../../../models/Categories/CategoriesSchema'
// import UserSchema from '../../../models/users/userLogin'
// import CompanySchema from '../../../models/Companies/CompanySchema'
export const newCategoriesForCompany = async (_, { input }, ctx) => {
  console.log(input)
  const idUser = ctx.User.id
  try {
    const data = await CategoriesSchema.create({ ...input, idComp: input.idComp, idUser: idUser })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}

export const getCategoryForCompany = async (_, { idComp }, ctx) => {
  const idUser = ctx.User.id
  try {
    const data = await CategoriesSchema.find({ idUser: idUser, idComp: idComp })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export const DeleteOneCategories = async (_, { id }, ctx) => {
  const idUser = ctx.User.id
  console.log(idUser)
  try {
    await CategoriesSchema.deleteOne({ _id: id, idUser: idUser })
    return true
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export const EditCategoriesForCompany = async (_, { input }, ctx) => {
  const idUser = ctx.User.id
  const { _id, idComp, cName, cDescription } = input

  try {
    const data = await CategoriesSchema.findOneAndUpdate({ _id: _id }, { idUser: idUser, idComp: idComp, cName: cName, cDescription: cDescription })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export default {
  TYPES: {
  },
  QUERIES: {
    getCategoryForCompany
  },
  MUTATIONS: {
    newCategoriesForCompany,
    DeleteOneCategories,
    EditCategoriesForCompany
  }
}
