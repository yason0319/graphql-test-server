const { ApolloServer, ApolloError } = require('apollo-server');

const typeDefs = `
  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
  }

  type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`

let _id = 0

// sample data
let users = [
  { "githubLogin": "ichi", "name": "ichi san" },
  { "githubLogin": "ni", "name": "ni san" },
  { "githubLogin": "san", "name": "san san" }
];

const photos = [
  {
    "id": "1",
    "name": "sample photo2",
    "url": "http://honyahonya/img/0.jpg",
    "description": "sample sample",
    "category": "PORTRAIT",
    "githubUser": "ichi"
  },
  {
    "id": "2",
    "name": "sample photo2",
    "url": "http://honyahonya/img/0.jpg",
    "description": "sample sample",
    "category": "PORTRAIT",
    "githubUser": "ni"
  },
  {
    "id": "3",
    "name": "sample photo2",
    "url": "http://honyahonya/img/0.jpg",
    "description": "sample sample",
    "category": "PORTRAIT",
    "githubUser": "ni"
  }
]

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos
  },

  Mutation: {
    postPhoto(parent, args) {
      let newPhoto = {
        id: _id++,
        ...args.input
      }
      photos.push(newPhoto)
      return newPhoto
    },
  },

  Photo: {
    url: parent => `http://honyahonya/img/${parent.id}.jpg`,
    postedBy: parent => {
      return users.find(u => u.githubLogin === parent.githubUser)
    }
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser === parent.githubLogin)
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