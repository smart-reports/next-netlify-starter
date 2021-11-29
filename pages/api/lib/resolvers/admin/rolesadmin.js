import Roles from '../../../models/admin/admin'
import UserSchema from '../../../models/users/userLogin'
import { client } from '../../../presignedUrl'

export const getRoles = async (_, parent, context, info) => {
  const idUser = context.User.id
  try {
    const user = await UserSchema.findById({ _id: idUser })
    const data = await Roles.find({ _id: { $in: user.roles } })
    return data
  } catch (e) {
    const error = new Error('Your request could not be processed')
    return error
  }
}
export const removeBucketMinio = async (_, input, context, info, next) => {
  client.removeBucket('uploads', function (e) {
    if (e) {
      return console.log(e)
    }
    console.log('Success')
  })
}
export const bucketExistsQuery = async ({ BucketName }, context) => {
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
export const createOneBucket = async (_, input, context, info, next) => {
  client.makeBucket('mybucket', 'us-east-1', function (err) {
    if (err) return console.log('Error creating bucket.', err)
    console.log('Bucket created successfully in "us-east-1".')
  })
}
export const createRoleMutation = async (_, input, context, info, next) => {
  const { name } = input.input
  const idUser = context.User.id
  try {
    // Can only register the administrator
    const user = await UserSchema.findById({ _id: idUser })
    const roles = await Roles.find({ _id: { $in: user.roles } })
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === 'admin') {
        const data = await Roles.create({ name: name })
        return data
      }
    }
  } catch (e) {
    const error = new Error('Your request could not be processed')
    return error
  }
}
export const createRoles = async () => {
  try {
    // Count Documents
    const count = await Roles.estimatedDocumentCount()
    // check for existing roles
    if (count > 0) return
    // Create default Roles
    const values = await Promise.all([
      new Roles({ name: 'user' }).save(),
      new Roles({ name: 'moderator' }).save(),
      new Roles({ name: 'admin' }).save()
    ])

    console.log(values, 'Initial Roles')
  } catch (error) {
    console.error(error)
  }
}

export default {
  TYPES: {},
  QUERIES: {
    getRoles,
    bucketExistsQuery
  },
  MUTATIONS: {
    createRoleMutation,
    createOneBucket,
    removeBucketMinio
  }
}
