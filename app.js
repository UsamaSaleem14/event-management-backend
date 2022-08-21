const express = require('express')
const bodyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')
const isAuth = require('./middleware/is-auth')

// GraphQl schema import
const graphQlSchema = require('./graphql/schemas/index')
const graphQlResolver = require('./graphql/resolvers/index')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

app.use(isAuth)

app.use(
  '/api',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true,
  })
)

mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER_ADMIN}:${process.env.MONGO_PASSWORD_ADMIN}@eventmanagementgraphql.ngqth.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(8000)
  })
  .catch((err) => {
    console.log(err)
  })
