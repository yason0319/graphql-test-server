const { ApolloServer } = require('apollo-server-express')
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const { readFileSync } = require('fs');
const { MongoClient } = require('mongodb');
const resolvers = require('./resolvers');
require('dotenv').config();

const { GraphQLScalarType } = require('graphql');

const typeDefs = readFileSync('./typeDefs.graphql', 'utf-8');

const app = express();

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