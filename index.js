const { ApolloServer, ApolloError } = require('apollo-server');

const typeDefs = `
  type Query {
    totalPhotos: Int!
  }

  type Mutation {
    postPhoto(name: String! description: String): Boolean!
  }
`

let photos = [];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length
  },

  Mutation: {
    postPhoto(parent, args) {
      photos.push(args)
      return true
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server
  .listen()
  .then(({url}) => console.log(`graphql server running at ${url}`));