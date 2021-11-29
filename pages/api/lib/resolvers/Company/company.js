'use strict'
import CompanySchema from '../../../models/Companies/CompanySchema'
import UserSchema from '../../../models/users/userLogin'
import TemplateInvitation from '../../templates/index'
import { ApolloError } from 'apollo-server-errors'
// import bcrypt from 'bcryptjs'
import bcryptjs from 'bcryptjs'
import { createOneBucket, generateCode, transporter } from '../../../utils'

export const getCompanies = async (_root, _, ctx) => {
  try {
    const id = ctx.User.id
    // const user = await UserSchema.findById({ _id: id })
    // const data = await CompanySchema.find({ _id: { $in: user.idUser } })
    const data = await CompanySchema.aggregate([
      {
        $march: { _id: id }
      },
      {
        $lookup: {
          from: 'User',
          foreignField: 'idTeamComp',
          localField: '_id',
          as: 'alias_tablaB'
        }
      }
    ])
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}

export const deleteCompany = async (_, { id }, ctx) => {
  const idUser = ctx.User.id
  try {
    await CompanySchema.deleteOne({ _id: id, idUser: idUser })
    return true
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }// Delete One
}
export const newCompany = async (_, { input }, ctx) => {
  const userId = ctx.User.id
  const idUser = await UserSchema.findById({ _id: userId })
  if (!idUser) { throw new ApolloError('Your request could not be processed.', 500) }
  try {
    const company = new CompanySchema({ ...input, idUser: idUser })
    const idCom = company._id
    await company.save(company)
    const data = await UserSchema.findOneAndUpdate(
      { _id: idUser },
      { $push: { idComp: idCom } }
    )
    if (company) {
      // const BucketName = company?.companyName.split(' ').join('').toLowerCase()
      const BucketName = idCom.toString()
      await createOneBucket(BucketName)
    }
    return data
  } catch (error) {
    console.log(error)
    throw new ApolloError('Your request could not be processed.', 500)
  }
}

export const getAllCompanyById = async (_, __, ctx) => {
  if (!ctx.User.id) {
    throw new ApolloError(
      'Error, Your session has expired, please log in again.',
      500
    )
  }
  try {
    const idUser = ctx.User.id
    const data = await CompanySchema.find({ idUser: idUser })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}

export const getOneCompanyById = async (_, { idC }, ctx, info) => {
  if (!ctx.User.id) {
    throw new ApolloError(
      'Error, Your session has expired, please log in again.',
      500
    )
  }
  try {
    const data = await CompanySchema.findById({ _id: idC })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export const RegisterOneTeam = async (_, { idC, uEmail }, ctx, info) => {
  let uToken
  if (!ctx.User.id) {
    throw new ApolloError(
      'Error, Your session has expired, please log in again.',
      500
    )
  }
  try {
    const id = ctx.User.id
    const user = await UserSchema.findById({ _id: id })
    const data = await CompanySchema.find({ _id: { $in: user.idUser } })
    if (!data) {
      return {
        success: false,
        message: `You do not have access to the company ${data.companyName}`
      }
    }
    const existEmail = await UserSchema.findOne({ uEmail })
    // sed notification
    if (!existEmail) {
      const pass = await generateCode()
      const salt = await bcryptjs.genSaltSync(10)
      // Create new user
      uToken = await generateCode()
      const userRegister = new UserSchema({
        userName: '',
        uEmail: uEmail,
        uToken: uToken,
        idTeamComp: idC,
        uPassword: await bcryptjs.hash(`${pass}`, salt)
      })
      userRegister.save(userRegister)
      return {
        success: false,
        message: `${uEmail} has been successfully added as a member of ${data.companyName}.`
      }
    } else {
      if (existEmail) {
        const mailer = transporter()
        mailer.sendMail({
          from: 'company invitation <no-reply@smartaccountingonline.com/>',
          to: uEmail,
          text: 'Hello world?', // plain text body
          subject: 'Invitation.',
          html: TemplateInvitation({
            code: uToken,
            company: data.companyName,
            username: uEmail
          })
        })
        // const company = new CompanySchema({ ...input, idUser: idUser })
        // const idTeamComp = company._id
        // company.save(company)

        // const data = await UserSchema.findOneAndUpdate(
        //   { _id: idUser },
        //   { $push: { idTeamComp: idTeamComp } }
        // )
      }
      return {
        success: true,
        message: `We've sent an invitation email to ${uEmail} to add your new team member to the following company: ${data.companyName}`
      }
    }
    // sed notification
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}

export default {
  TYPES: {},
  QUERIES: {
    getCompanies,
    getAllCompanyById,
    getOneCompanyById
  },
  MUTATIONS: {
    deleteCompany,
    newCompany,
    RegisterOneTeam
  }
}
