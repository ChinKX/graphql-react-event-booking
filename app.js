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
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
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
  `), // define supported queries (graphql schema object),
    rootValue: {
      events: () => {
        return Event.find().then(events =>
          events.map(event => ({
            ...event._doc,
            _id: event.id
          }))
        ).catch(error => {
          console.log(error);
          throw error;
        });
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });
        return event.save().then(result => ({
          ...result._doc,
          _id: result.id
        })).catch(error => {
          console.log(error);
          throw error;
        });
      }
    }, // define the logic to process a particular query (bundle of all resolvers)
    graphiql: true
  })
);

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster1.quvat.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(_ =>
  app.listen(3000, () => {
    console.log('App listening at port 3000...');
  })
).catch(error => {
  console.log(error);
});

// mutation {
//   createEvent(eventInput: {
//     title: "Testing",
//     description:"Testing description",
//     price: 6,
//     date: "2020-07-22T08:32:54.823Z"
//   }) {
//     _id
//     title
//   }
// }