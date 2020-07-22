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
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');
const e = require('express');

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

    type User {
      _id: ID!
      email: String!
      password: String
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
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
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: '5f18321e3e40295434f3f5a7'
        });
        let createdEvent;
        return event.save().then(result => {
          createdEvent = { ...result._doc, _id: result.id };
          return User.findById('5f18321e3e40295434f3f5a7');
        }).then(user => {
          if (!user) {
            throw new Error('User not found.');
          }
          user.createdEvents.push(event);
          return user.save();
        }).then(_ => createdEvent).catch(error => {
          console.log(error);
          throw error;
        });
      },
      createUser: args => {
        return User.findOne({ email: args.userInput.email }).then(user => {
          if (user) {
            throw new Error('User exists already');
          }
          return bcrypt.hash(args.userInput.password, 12);
        }).then(hashedPassword => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });
          return user.save();
        }).then(result => ({
          ...result._doc,
          _id: result.id,
          password: null
        })).catch(error => {
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