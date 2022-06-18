const express = require('express')
const bodyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')

// GraphQl schema import
const graphQlSchema = require('./graphql/schemas/index')
const graphQlResolver = require('./graphql/resolvers/index')

const app = express()

app.use(bodyParser.json())

app.use(
  '/api',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true,
  }),
)

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER_ADMIN}:${process.env.MONGO_PASSWORD_ADMIN}@eventmanagementgraphql.ngqth.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
  )
  .then(() => {
    app.listen(3001)
  })
  .catch((err) => {
    console.log(err)
  })
