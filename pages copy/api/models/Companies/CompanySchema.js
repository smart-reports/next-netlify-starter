import mongoose from 'mongoose'
const { Schema } = mongoose

mongoose.Promise = global.Promise

const CompanySchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  sCurrency: {
    type: Schema.Types.ObjectId,
    ref: 'Currencys'
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  registeredOfficeAddress: {
    type: String,
    required: true,
    trim: true
  },
  companyLegalStatus: {
    type: String,
    required: true,
    trim: true
  },
  companyType: {
    type: String,
    required: true,
    trim: true
  },
  accounts: {
    type: String,
    required: true,
    trim: true
  },
  natureOfBusiness: {
    type: String,
    required: true,
    trim: true
  },
  dissolvedOn: {
    type: String,
    required: true
  },
  incorporatedOn: {
    type: String,
    required: true
  },
  lineItems: [{
    description: String,
    authorization: Number,
    idUser: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }],
  createAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.models.Companies || mongoose.model('Companies', CompanySchema)
