const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { authMiddleware } = require('./auth');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
});

const setupGraphQL = async (app) => {
  await apolloServer.start();

  app.use('/graphql', expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      
      await new Promise((resolve) => {
        authMiddleware(req, {}, resolve);
      });
      return { user: req.user };
    },
  }));
};

module.exports = { setupGraphQL };
