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
const events = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),// define supported queries (graphql schema object),
  rootValue: {
    events: () => {
      return events;
    },
    createEvent: (args) => {
      const event = {
        _id: Math.random().toString(),
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date
      };
      events.push(event);
      return event;
    }
  },// define the logic to process a particular query (bundle of all resolvers)
  graphiql: true
}));

app.listen(3000, () => {
  console.log('App listening at port 3000...');
});