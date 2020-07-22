/**
 * GraphQL is an open-source data query and manipulation language for APIs,
 * and a runtime for fulfilling queries with existing data.
 * GraphQL queries => query, mutation and subscription
 * Explanation for express-graphql & graphql:
 * https://www.youtube.com/watch?v=LXTyzk2uud0&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_&index=3
 * Time around 2.30mins
 */

const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP  } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type RootQuery {
      events: [String!]!
    }

    type RootMutation {
      createEvent(name: String): String
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),// define supported queries (graphql schema object),
  rootValue: {
    events: () => {
      return [
        'Romantic Cooking',
        'Sailing',
        'All-Night Coding'
      ];
    },
    createEvent: (args) => {
      const eventName = args.name;
      return eventName;
    }
  },// define the logic to process a particular query (bundle of all resolvers)
  graphiql: true
}));

app.listen(3000, () => {
  console.log('App listening at port 3000...');
});