const { ApolloServer } = require('apollo-server-express')
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const { readFileSync } = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const { GraphQLScalarType } = require('graphql');

const typeDefs = readFileSync('./typeDefs.graphql', 'utf-8');

const app = express();

// let _id = 0

// // sample data
// const users = [
//   { "githubLogin": "ichi", "name": "ichi san" },
//   { "githubLogin": "ni", "name": "ni san" },
//   { "githubLogin": "san", "name": "san san" }
// ];

// const photos = [
//   {
//     "id": "1",
//     "name": "sample photo2",
//     "url": "http://honyahonya/img/0.jpg",
//     "description": "sample sample",
//     "category": "PORTRAIT",

//     "githubUser": "ichi",
//     "created": "3-28-1977",
//   },
//   {
//     "id": "2",
//     "name": "sample photo2",
//     "url": "http://honyahonya/img/0.jpg",
//     "description": "sample sample",
//     "category": "PORTRAIT",
//     "githubUser": "ni",
//     "created": "1-28-1977",
//   },
//   {
//     "id": "3",
//     "name": "sample photo2",
//     "url": "http://honyahonya/img/0.jpg",
//     "description": "sample sample",
//     "category": "PORTRAIT",
//     "githubUser": "ni",
//     "created": "2018-04-15T19:09:57.204Z",
//   }
// ];

// const tags = [
//   { "photoID": "1", "userID": "ichi" },
//   { "photoID": "2", "userID": "ichi" },
//   { "photoID": "2", "userID": "ni" },
//   { "photoID": "2", "userID": "san" },
// ]

// const resolvers = {
//   Query: {
//     totalPhotos: () => photos.length,
//     allPhotos: () => photos
//   },

//   Mutation: {
//     postPhoto(parent, args) {
//       let newPhoto = {
//         id: _id++,
//         ...args.input,
//         created: new Date(),
//       }
//       photos.push(newPhoto)
//       return newPhoto
//     },
//   },

//   Photo: {
//     url: parent => `http://honyahonya/img/${parent.id}.jpg`,
//     postedBy: parent => {
//       return users.find(u => u.githubLogin === parent.githubUser)
//     },
//     taggedUsers: parent => {
//       return tags
//         .filter(tag => tag.photoID === parent.id)
//         .map(tag => tag.userID)
//         .map(userID => users.find(u => u.githubLogin === userID))
//     }
//   },
//   User: {
//     postedPhotos: parent => {
//       return photos.filter(p => p.githubUser === parent.githubLogin)
//     },
//     inPhotos: parent => {
//       return tags
//         .filter(tag => tag.photoID === parent.id)
//         .map(tag => tag.userID)
//         .map(photoID => photos.find(p => p.id === photoID))
//     }
//   },
//   DateTime: new GraphQLScalarType({
//     name: 'DateTime',
//     description: 'A valid date time value',
//     parseValue: value => new Date(value),
//     serialize: value => new Date(value).toISOString(),
//     parseLiteral: ast => ast.value
//   })
// }

// const server = new ApolloServer({
//   typeDefs,
//   resolvers
// })

// server
//   .listen()
//   .then(({url}) => console.log(`graphql server running at ${url}`));

async function start() {
  const app = express();

  const MONGO_DB = process.env.DB_HOST;

  const client = await MongoClient.connect(
    MONGO_DB,
    { useNewUrlParser: true }
  )
  const db = client.db();

  const context = { db };

  const server = new ApolloServer({ typeDefs, resolvers, context });

  server.applyMiddleware({ app });
  
  app.get('/', (req, res) => res.end('welcome to the photoshare API'));
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
  
  app.listen({ port: 4000 }, () => 
    console.log(`graphql server running at http://localhost:4000${server.graphqlPath}`));
}

start();