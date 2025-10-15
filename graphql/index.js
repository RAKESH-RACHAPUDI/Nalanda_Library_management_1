const { graphqlHTTP } = require('express-graphql');
const express = require('express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { authMiddleware } = require('./auth');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphqlRouter = express.Router();

// Apply auth middleware to GraphQL routes
graphqlRouter.use(authMiddleware);

// GraphQL endpoint
graphqlRouter.use('/graphql', graphqlHTTP({
  schema,
  context: ({ req }) => ({ user: req.user }),
  graphiql: true, 
}));

module.exports = graphqlRouter;
