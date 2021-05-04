import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import { authenticate } from './utils/auth'
import { merge } from 'lodash'
import config from './config'
import { connect } from './db'
import product from './types/product/product.resolvers'
import coupon from './types/coupon/coupon.resolvers'
import user from './types/user/user.resolvers'

const types = ['product', 'coupon', 'user']

export const start = async () => {
  const rootSchema = `
    type Cat {
      name: String
    }
    
    type _Query {
      myCat: Cat
    }
    
    schema {
      query: _Query
}
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema, ...schemaTypes],
    resolvers: {
      _Query: {
        myCat(){
          console.log('Hello there')
          return {name:'Ivar'}
        }
      },
      async context({req}) {
        return {user: null}
      },
    }
  })
  try {
    await connect(config.dbUrl)
  }catch(error){
    console.log(error)
  }
  let url=''
  try {
    const data = await server.listen({port: config.port})
    url= data.url
  }catch(error){
    url = 'http://localhost:3000'
    console.log(error)
  }
  console.log(`GQL server ready at ${url}`)
}