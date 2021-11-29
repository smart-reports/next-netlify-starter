/* eslint-disable no-void */
import Cors from 'micro-cors'
import { ApolloServer } from 'apollo-server-micro'
import httpHeadersPlugin from 'apollo-server-plugin-http-headers'
import typeDefs from '../api/lib/typeDefs'
import resolvers from '../api/lib/resolvers/index'
import connectDb from './lib/db'
import withSession from '../../apollo/session'
import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-errors'
import { PubSub } from 'graphql-subscriptions'
import { CountriesAPI } from './lib/resolvers/Countries/countries'

const cors = Cors()

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      countriesAPI: new CountriesAPI()
    }
  },
  plugins: [httpHeadersPlugin],
  context: withSession(async ({ req, connection, res, next }) => {
    const setCookies = []
    //  Initialize as empty arrays - resolvers will add items if required
    const setHeaders = []
    const pubsub = new PubSub()
    let error = false
    if (connection) {
      return connection.context
    } else {
      // check connection for metadata
      const idComp = req.headers.authorization?.split(' ')[1] || undefined
      // validate user in client
      const user = !!req.session && req.session?.get('user')
      const { token } = user || null
      const excluded = ['/login', '/forgotpassword', '/register']
      if (excluded.indexOf(req.session) > -1) return next()
      try {
        if (!token) return (error = { message: 'Invalid Token' })
        if (error) throw new AuthenticationError('Your session has ended.', 401)
        //  Create Apollo-server-Subscription
        const now = Date.now().valueOf() / 1000
        if (typeof token !== 'undefined') {
          // const deCodeToken = jwt.decode(token)
          // const { id: userId } = deCodeToken
        }
        if (token && jwt.decode(token?.token)?.exp < now) {
          req.session.destroy()
        }
        const User = await jwt.verify(token, process.env.AUTHO_USER_KEY)
        return { req, setCookies, setHeaders, User, pubsub, idComp }
      } catch (err) {
        return { setCookies, setHeaders, req, pubsub }
      }
    }
  }),
  subscriptions: {
    path: '/api/graphqlSubscriptions',
    keepAlive: 9000,
    onConnect: (connectionParams, webSocket, context) => console.log('connected'),
    onDisconnect: (webSocket, context) => console.log('disconnected')
  },
  playground: {
    subscriptionEndpoint: '/api/graphqlSubscriptions',
    settings: {
      'request.credentials': 'same-origin'
    }
  }
})
const graphqlWithSubscriptionHandler = (req, res, next) => {
  cors()
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }
  const oldOne = res.socket.server.apolloServer
  if (
    // we need compare old apolloServer with newOne, because after hot-reload are not equals
    oldOne && oldOne !== apolloServer) {
    console.warn('FIXING HOT RELOAD !!!!!!!!!!!!!!! ')
    delete res.socket.server.apolloServer
  }
  if (!res.socket.server.apolloServer) {
    console.log('* apolloServer (re)initialization *')
    apolloServer.installSubscriptionHandlers(res.socket.server)
    res.socket.server.apolloServer = apolloServer
    const handler = connectDb(apolloServer.createHandler({ path: '/api/graphql' }))
    res.socket.server.apolloServerHandler = handler
    // clients losts old connections, but clients are able to reconnect
    oldOne === null || oldOne === void 0 ? void 0 : oldOne.stop()
  }
  return res.socket.server.apolloServerHandler(req, res, next)
}
export default graphqlWithSubscriptionHandler
export const config = {
  api: {
    bodyParser: false
  }
}
