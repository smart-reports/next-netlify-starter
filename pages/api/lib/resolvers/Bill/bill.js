'use strict'
import { ApolloError } from 'apollo-server-errors'
import BillSchema from '../../../models/Bills/BillSchema'
import UserSchema from '../../../models/users/userLogin'
import FileUploadSchema from '../../../models/FileUpload/FileUpload'
import CompanySchema from '../../../models/Companies/CompanySchema'
import SupplierSchema from '../../../models/Suppliers/SupplierSchema'
import { setFiles } from '../Upload/upload'
import Product from '../../../models/Products/ProductsSchema'

export const createBillMutation = async (_, { input, inputLineItems, setTagsInput, setFilesInput }, ctx) => {
  // const idComp = ctx.idComp
  console.log(input, inputLineItems, setTagsInput, setFilesInput)
  const { setData } = inputLineItems || {}
  const { setTags } = setTagsInput || {}
  // Files Data
  const { filesData, idFiles } = setFilesInput || {}
  const id = ctx.User.id
  try {
    const user = await UserSchema.findById({ _id: id })
    const data = await CompanySchema.find({ _id: { $in: user.idUser } })
    console.log(setData)
    if (!data) { return { success: false, message: 'You do not have access to the company' } }
    const bill = new BillSchema({ ...input, idUser: id, currencyBill: input.currencyBill })
    await bill.save(bill)
    for (let i = 0; i < setData.length; i++) {
      const data = setData[i]
      const { lineItemsQuantity, lineItemsDescription, lineItemsRate, lineItemsTotalVAT, lineItemsIdVAT, lineItemsIdClass, lineItemsIdPro, lineItemsIdAccount, lineItemsSubTotal } = setData[i]
      await BillSchema.findOneAndUpdate(
        { _id: bill._id },
        {
          $addToSet: {
            lineItems: {
              $each: [{ lineItemsQuantity, lineItemsDescription, lineItemsRate, lineItemsTotalVAT, lineItemsIdVAT, lineItemsIdClass, lineItemsIdPro, lineItemsIdAccount, lineItemsSubTotal, iva: [{ iPercentage: data.setDataIva[0].iPercentage }] }]
            }
          }
        }
      ).then(res => {
        if (res) { return { success: true } }
      }).catch(err => {
        console.error(err)
      })
    }
    for (let i = 0; i < setTags.length; i++) {
      const data = setTags[i]
      await BillSchema.findOneAndUpdate(
        { _id: bill._id },
        {
          $push: {
            tags: {
              $each: [{ TName: data.TName }]
            }
          }
        }
      )
    }
    setFiles(false, { bId: bill._id, input: filesData, idUser: id, idComp: input.idComp, bInvoiceRef: input.bInvoiceRef, idFiles: idFiles })
    return bill
  } catch (error) {
    throw new ApolloError(error)
  }
}
export const DeleteOneBill = async (_, { id }, ctx) => {
  const idUser = ctx.User.id
  try {
    await BillSchema.deleteOne({ _id: id, idUser: idUser })
    return true
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }// Delete One
}
export const stacks = async (_, { id }, ctx) => {
  const data = await BillSchema.find()
  return data
}
export const updateBill = async (_, { input, inputLineItems, setTagsInput, setFilesInput }, ctx) => {
  const idUser = ctx.User.id
  const { _id, idComp, idSupplier, bInvoiceDate, bDueDate, billSubTotal, billTotal, billNo, bDescription, VatType, currencyBill } = input
  const { setData } = inputLineItems || {}
  const { setTags } = setTagsInput || {}
  const { filesData } = setFilesInput || {}
  try {
    const data = await BillSchema.findOneAndUpdate(_id, { idUser: idUser, idComp: idComp, VatType: VatType, idSupplier: idSupplier, bInvoiceDate: bInvoiceDate, bDueDate: bDueDate, currencyBill, billSubTotal, billTotal: billTotal, billNo: billNo, bDescription: bDescription })
    // Edit Files
    setFiles(false, { bId: _id, input: filesData, idUser: idUser, idComp: input.idComp, bInvoiceRef: input.bInvoiceRef })
    // Edit Dynamic SubDocument
    for (let i = 0; i < setData.length; i++) {
      const data = setData[i]
      const mongoose = require('mongoose')
      const valid = mongoose.Types.ObjectId.isValid(data._id)
      if (valid === true) {
        const { lineItemsQuantity, lineItemsDescription, lineItemsRate, lineItemsTotalVAT, lineItemsIdVAT, lineItemsIdClass, lineItemsIdPro, lineItemsIdAccount, lineItemsSubTotal } = setData[i]
        await BillSchema.findOneAndUpdate({ _id: _id, 'lineItems._id': data._id },
          {
            $set: { 'lineItems.$.lineItemsDescription': lineItemsDescription, 'lineItems.$.lineItemsQuantity': lineItemsQuantity, 'lineItems.$.lineItemsTotalVAT': lineItemsTotalVAT, 'lineItems.$.lineItemsIdVAT': lineItemsIdVAT, 'lineItems.$.lineItemsRate': lineItemsRate, 'lineItems.$.lineItemsIdClass': lineItemsIdClass, 'lineItems.$.lineItemsIdPro': lineItemsIdPro, 'lineItems.$.lineItemsIdAccount': lineItemsIdAccount, 'lineItems.$.lineItemsSubTotal': lineItemsSubTotal, 'lineItems.$.iva': [{ iPercentage: data.setDataIva[0].iPercentage }] }
          })
      } else {
        const data = setData[i]
        const { lineItemsQuantity, lineItemsDescription, lineItemsRate, lineItemsTotalVAT, lineItemsIdVAT, lineItemsIdClass, lineItemsIdPro, lineItemsIdAccount, lineItemsSubTotal } = setData[i]
        await BillSchema.findOneAndUpdate(
          { _id: _id },
          {
            $addToSet: {
              lineItems: {
                $each: [{ lineItemsQuantity, lineItemsDescription, lineItemsRate, lineItemsTotalVAT, lineItemsIdVAT, lineItemsIdClass, lineItemsIdPro, lineItemsIdAccount, lineItemsSubTotal, iva: [{ iPercentage: data.setDataIva[0].iPercentage }] }]
              }
            }
          }
        )
      }
    }
    // TAGS
    for (let i = 0; i < setTags.length; i++) {
      const data = setTags[i]
      const mongoose = require('mongoose')
      const valid = mongoose.Types.ObjectId.isValid(data._id)
      if (valid === true) {
        await BillSchema.findOneAndUpdate({ _id: _id, 'tags._id': data._id },
          {
            $set: { 'tags.$.TName': data.TName }
          })
      } else {
        await BillSchema.findOneAndUpdate(
          { _id: _id },
          {
            $addToSet: {
              tags: {
                $each: [{ TName: data.TName }]
              }
            }
          }
        )
      }
    }
    // // Edit Dynamic Tags
    // for (let i = 0; i < setTags?.length; i++) {
    //   await BillSchema.findOneAndUpdate(
    //     { _id: _id },
    //     {
    //       $set: {
    //         tags: { _id: data._id, TName: data.TName }
    //       }
    //     }
    //   )
    // }
    return data
  } catch (error) {
    throw new ApolloError(error)
  }
}

export const getOneBillById = async (_, { id }, ctx) => {
  const idUser = ctx.User.id
  const idComp = ctx.idComp

  try {
    const data = await BillSchema.findOne({ idUser: idUser, idComp: idComp })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export const deleteOneLineItem = async (_, { id, idLine }, ctx) => {
  try {
    await BillSchema.update({
      _id: id
    }, {
      $pull: {
        lineItems: {
          _id: idLine
        }
      }
    })
    return true
  } catch (error) {
    return false
  }
}
export const deleteOneTagLineItem = async (_, { id, idLine }, ctx) => {
  try {
    await BillSchema.update({
      _id: id
    }, {
      $pull: {
        tags: {
          _id: idLine
        }
      }
    })
    return true
  } catch (error) {
    return false
  }
}
export const getLineItem = async (_, { idComp }, ctx) => {
  console.log(idComp)
  // const idUser = ctx.User.id
  try {
    const data = await BillSchema.find({ 'lineItems.idPro': '6192f6e9c2776c3c6433066e' })
    return data
  } catch (error) {
    return error
  }
}

export const getIva = async (_, args, context) => {
  if (!context.User.id) throw new ApolloError('Error, Your session has expired, please log in again.', 500)
  try {
    const idUser = context.User.id
    const data = await BillSchema.find({ _id: idUser })
    return data
  } catch (error) {
    throw new ApolloError('Your request could not be processed.', 500)
  }
}

export const getOneSupplier = async (_, parent, ctx, info) => {
  try {
    const data = await SupplierSchema.find({ _id: parent._id })
    return data
  } catch (e) {
    const error = new Error('Your request could not be processed')
    return error
  }
}
export const getAllBill = async (_, { idComp }, ctx) => {
  const idUser = ctx.User.id
  try {
    const data = await BillSchema.find({ idUser: idUser, idComp: idComp })
      .populate({
        path: 'idSupplier',
        model: 'Suppliers',
        select: 'idSupplier',
        populate: {
          path: 'sCurrency'
        }
      })
      .populate('idSupplier')
      .populate('IdBills')
      .populate({
        path: 'lineItems',
        select: 'idPro',
        model: 'Products'
        // populate: {
        //   path: 'idPro'
        // }
      }).exec()
    return data
  } catch (error) {
    console.log(error)
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export const statistics = async (_, { idComp }, ctx) => {
  const idUser = ctx.User.id
  try {
    const data = await BillSchema.find({ idUser: idUser, idComp: idComp })
    return data
  } catch (error) {
    console.log(error)
    throw new ApolloError('Your request could not be processed.', 500)
  }
}
export const getAllFiles = async (_, parent, ctx, info) => {
  try {
    const data = await FileUploadSchema.find({ _id: parent._id }).populate('IdBills')
    return data
  } catch (e) {
    const error = new Error('Your request could not be processed')
    return error
  }
}
export const getProducts = async (_, parent, ctx, info) => {
  try {
    const data = await Product.find({ _id: parent._id })
    return data
  } catch (e) {
    const error = new Error('Your request could not be processed')
    return error
  }
}
export default {
  TYPES: {
    Bill: {
      filesBills: getAllFiles,
      supplier: getOneSupplier,
      products: getProducts
    }
  },
  QUERIES: {
    statistics,
    getAllBill,
    getOneBillById
  },
  MUTATIONS: {
    createBillMutation,
    DeleteOneBill,
    deleteOneLineItem,
    deleteOneTagLineItem,
    updateBill
  }
}
