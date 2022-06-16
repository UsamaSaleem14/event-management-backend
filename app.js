const express = require('express')
const bodyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')

// Model
const EventModel = require('./models/event')

const app = express()

app.use(bodyParser.json())

const events = []

app.use(
  '/api',
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

    type ApiQuery {
        events: [Event!]!
    }

    type ApiMutation {
        createEvent(eventInput: EventInput): Event
    }

    schema {
        query: ApiQuery
        mutation: ApiMutation
    }
    `),
    rootValue: {
      events: () => {
        return EventModel
          .find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc }
            })
          })
          .catch((err) => {
            throw err
          })
      },
      createEvent: (args) => {
        const eventModel = new EventModel({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(),
        })

        return eventModel
          .save()
          .then((result) => {
            return { ...result._doc }
          })
          .catch((err) => {
            throw err
          })
      },
    },
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
