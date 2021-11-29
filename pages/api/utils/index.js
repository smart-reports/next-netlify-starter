// import nodemailer from 'nodemailer'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import { client } from '../presignedUrl'

function isString(arg) {
  return typeof (arg) === 'string'
}

function isValidBucketName(bucket) {
  console.log(bucket)

  if (!isString(bucket)) return false

  // bucket length should be less than and no more than 63
  // characters long.
  if (bucket.length < 3 || bucket.length > 63) {
    return false
  }
  // bucket with successive periods is invalid.
  if (bucket.indexOf('..') > -1) {
    return false
  }
  // bucket cannot have ip address style.
  if (bucket.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/)) {
    return false
  }
  // bucket should begin with alphabet/number and end with alphabet/number,
  // with alphabet/number/.- in the middle.
  if (bucket.match(/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/)) {
    return true
  }
  return false
}

// Email Transporter

export const transporter = (info) => nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.USER_EMAIL_POST,
    pass: process.env.USER_PASS_POST
  }
})

// Generate an ID
export const generateCode = async () => {
  const pass = Math.round(Math.random() * (99999 - 10000) + 10000)
  return pass
}

// Generate a token
export const generateToken = async dataUser => {
  const AccessToken = await jwt.sign(dataUser, process.env.AUTHO_USER_KEY, { expiresIn: parseInt(process.env.JWT_EXPIRY) })
  return AccessToken
}

// ***************************** MINIO - OBJECT DOCUMENT STORAGE ********************************

// CREATE ONE BUCKET
export const createOneBucket = async (bucketName) => {
  client.makeBucket(`smartreportzuploads${bucketName}`, 'us-east-1', function (err) {
    isValidBucketName(bucketName)
    if (err) return console.log('Error creating bucket.', err)
    console.log('Bucket created successfully in "us-east-1".')
  })
}
// CREATE ONE FILE
export const getOneLinkMinio = async ({ fileName }) => {
  const data = await client.presignedUrl('GET', 'uploads', fileName, 24 * 60 * 60)
  return { success: true, message: data }
}
// CREATE ONE FILE
export const deleteOneFileMinio = async ({ fileName }) => {
  client.removeObject('uploads', fileName, function (err) {
    if (err) {
      return {
        success: false,
        message: `'Unable to remove object', ${err}`
      }
    } else {
      return {
        success: false,
        message: 'Removed the object'
      }
    }
  })
}
// IS bucketExistsQuery
export const bucketExistsQuery = async (_, { BucketName }, context) => {
  console.log(BucketName)
  client.bucketExists('BucketName', function (err, exists) {
    if (err) {
      return console.log(err)
    }
    if (exists) {
      return console.log('Bucket exists.')
    }
  })
}
