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
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const auth = require('./middleware/auth');

const app = express();

app.use(bodyParser.json());
app.use(auth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema, // define supported queries (graphql schema object),
    rootValue: graphQlResolvers, // define the logic to process a particular query (bundle of all resolvers)
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster1.quvat.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(_ =>
    app.listen(3000, () => {
      console.log('App listening at port 3000...');
    })
  )
  .catch(error => {
    console.log(error);
  });
