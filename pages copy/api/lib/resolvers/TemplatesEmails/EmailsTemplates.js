'use strict'
import { ApolloError } from 'apollo-server-errors'
// import { isCompositeType } from 'graphql'
import EmailsTemplateSchema from '../../../models/TemplatesEmails/EmailTemplate'
// import UserSchema from '../../../models/users/userLogin'
// import CompanySchema from '../../../models/Companies/CompanySchema'

export const registerEmailsTemplate = async (_, { input }, ctx) => {
  const idUser = ctx.User.id
  try {
    const EmailsTemplate = new EmailsTemplateSchema({ ...input, idComp: input.idComp, idUser: idUser })
    await EmailsTemplate.save(EmailsTemplate)
    await EmailsTemplateSchema.findOneAndUpdate(
      { _id: EmailsTemplate._id },
      {
        $set: { idEmailsTemplate: EmailsTemplate._id }
      }
    )
    return EmailsTemplate
  } catch (error) {
    console.log(error)
    // throw new ApolloError('Your request could not be processed.', 500)
  }
}

export const getAllEmailsTemplate = async (_, { idComp }, ctx) => {
  const idUser = ctx.User.id
  try {
    const data = await EmailsTemplateSchema.find({ idUser: idUser, idComp: idComp })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export const DeleteOneEmailsTemplates = async (_, { id }, ctx) => {
  const idUser = ctx.User.id
  try {
    await EmailsTemplateSchema.deleteOne({ _id: id, idUser: idUser })
    return true
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export const EditEmailsTemplates = async (_, { input }, ctx) => {
  const idUser = ctx.User.id
  const { _id, idComp, aName, aBalance, aDescription, aType } = input

  try {
    const data = await EmailsTemplateSchema.findOneAndUpdate({ _id: _id }, { idUser: idUser, idComp: idComp, aName: aName, aBalance: aBalance, aDescription: aDescription, aType: aType })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getAllEmailsTemplate
  },
  MUTATIONS: {
    registerEmailsTemplate,
    EditEmailsTemplates,
    DeleteOneEmailsTemplates
  }
}
