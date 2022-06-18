const bcrypt = require('bcryptjs')

// Model
const EventModel = require('../../models/event')
const UserModel = require('../../models/user')

const user = async (userId) => {
  try {
    const creator = await UserModel.findById(userId)
    return {
      ...creator._doc,
      createdEvents: events.bind(this, creator._doc.createdEvents),
    }
  } catch (err) {
    throw err
  }
}

const events = async (eventIds) => {
  try {
    const events = await EventModel.find({ _id: { $in: eventIds } })
    return events.map((event) => {
      return {
        ...event._doc,
        creator: user.bind(this, event._doc.creator),
        date: new Date(event._doc.date).toISOString(),
      }
    })
  } catch (err) {
    throw err
  }
}

module.exports = {
  events: async () => {
    const events = await EventModel.find()
    try {
      return events.map((event) => {
        return {
          ...event._doc,
          creator: user.bind(this, event._doc.creator),
          date: new Date(event._doc.date).toISOString(),
        }
      })
    } catch (err) {
      throw err
    }
  },
  createEvent: async (args) => {
    const eventModel = new EventModel({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(),
      creator: '62ae10c5f29078e76aa3a6c5',
    })

    let createdEvent
    try {
      const result = await eventModel.save()
      createdEvent = {
        ...result._doc,
        creator: user.bind(this, result._doc.creator),
        date: new Date(result._doc.date).toISOString(),
      }

      const creator = await UserModel.findById('62ae10c5f29078e76aa3a6c5')

      if (!creator) {
        throw new Error('User not found')
      }
      creator.createdEvents.push(eventModel)
      await creator.save()

      return createdEvent
    } catch (err) {
      throw err
    }
  },

  createUser: async (args) => {
    try {
      const creator = await UserModel.findOne({ email: args.userInput.email })
      if (creator) {
        throw new Error('User already exists')
      }

      const encryptedPassword = await bcrypt.hash(args.userInput.password, 12)

      const userModel = new UserModel({
        email: args.userInput.email,
        password: encryptedPassword,
      })

      const savedUser = await userModel.save()

      return { ...savedUser._doc, password: null, _id: savedUser.id }
    } catch (err) {
      throw err
    }
  },
}
