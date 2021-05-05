import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import { authenticate } from './utils/auth'
import { merge } from 'lodash'
import config from './config'
import { connect } from './db'
/*import product from './types/product/product.resolvers'
import coupon from './types/coupon/coupon.resolvers'
import user from './types/user/user.resolvers'*/

const types = ['product', 'coupon', 'user']

export const start = async () => {
  const rootSchema = /*SDL: Schema Definition Language*/`
    type Cat {
      name: String
      edad: Int
    }
    type Auto{
      modelo: String
    }
    type _Query {
      myCat: Cat
      myAuto: Auto
      hello: String
    }
    
    schema {
      query: _Query
      mutation: Mutation
}
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema, ...schemaTypes],
    resolvers: {
      _Query: {
        myCat(){
          console.log('Hello there')
          return {name:'Ivar', edad: 10}
        },
        myAuto(){
          return{modelo:'Yaris'}
        },
        hello(){
          return 'Hola'
        }
      }
      },
      async context({ req }) {

        return { user: null }
      }
    }

  )

  await connect(config.dbUrl)
  const {url} = await server.listen({port: config.port})
  console.log(`GQL server ready at ${url}`)
}