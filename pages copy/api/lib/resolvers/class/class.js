'use strict'
import { ApolloError } from 'apollo-server-errors'
import ClassSchema from '../../../models/class/classSchema'

export const createClassMutation = async (_, { input }, ctx) => {
  const idUser = ctx.User.id
  try {
    const Class = new ClassSchema({ ...input, idComp: input.idComp, idUser: idUser, SubClass: input.SubClass })
    await Class.save(Class)
    await ClassSchema.findOneAndUpdate(
      { _id: Class._id },
      {
        $set: { idClass: Class._id }
      }
    )
    return Class
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}

export const DeleteOneClass = async (_, { id }, ctx) => {
  const idUser = ctx.User.id
  try {
    await ClassSchema.deleteOne({ _id: id, idUser: idUser })
    return true
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export const getClass = async (_, { idComp }, ctx) => {
  const idUser = ctx.User.id
  try {
    const data = await ClassSchema.find({ idUser: idUser, idComp: idComp })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export const getOneClass = async (_, { idComp }, ctx) => {
  const idUser = ctx.User.id
  try {
    const data = await ClassSchema.findOne({ idUser: idUser, idComp: idComp })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}

export const EditClass = async (_, { input }, ctx) => {
  const idUser = ctx.User.id
  const { _id, idComp, className, SubClass } = input
  try {
    const data = await ClassSchema.findOneAndUpdate({ _id: _id }, { idUser: idUser, idComp: idComp, className: className, SubClass: SubClass })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export default {
  TYPES: {
  },
  QUERIES: {
    getClass
  },
  MUTATIONS: {
    createClassMutation,
    DeleteOneClass,
    EditClass
  }
}
