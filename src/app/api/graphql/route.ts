import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { createContext } from '@/graphql/context';
import { GraphQLFormattedError } from 'graphql';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError: GraphQLFormattedError) => {
    console.error('GraphQL Error:', {
      message: formattedError.message,
      path: formattedError.path,
      code: formattedError.extensions?.code,
      originalError: formattedError.extensions?.originalError,
      stacktrace: formattedError.extensions?.stacktrace
    });
    return {
      message: formattedError.message,
      path: formattedError.path,
      extensions: {
        code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR'
      }
    };
  },
  plugins: [
    {
      async requestDidStart(requestContext) {
        console.log('[GraphQL Server] Request started:', {
          operationName: requestContext.request.operationName,
          query: requestContext.request.query,
          variables: requestContext.request.variables
        });
        
        return {
          async didEncounterErrors(ctx) {
            console.error('[GraphQL Server] Errors encountered during execution:', {
              errors: ctx.errors,
              operationName: ctx.request.operationName
            });
          },
        };
      }
    }
  ]
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => createContext({ req, res}),
});

export { handler as GET, handler as POST };