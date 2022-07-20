const bcrypt = require("bcryptjs")

// Model
const EventModel = require("../../models/event")
const UserModel = require("../../models/user")
const BookingModel = require("../../models/bookings")

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

const singleEvent = async (id) => {
  try {
    const event = await EventModel.findById(id)
    return {
      ...event._doc,
      creator: user.bind(this, event._doc.creator),
      date: new Date(event._doc.date).toISOString(),
    }
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
      creator: "62ae10c5f29078e76aa3a6c5",
    })

    let createdEvent
    try {
      const result = await eventModel.save()
      createdEvent = {
        ...result._doc,
        creator: user.bind(this, result._doc.creator),
        date: new Date(result._doc.date).toISOString(),
      }

      const creator = await UserModel.findById("62ae10c5f29078e76aa3a6c5")

      if (!creator) {
        throw new Error("User not found")
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
        throw new Error("User already exists")
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
  bookings: async () => {
    try {
      const allBookings = await BookingModel.find()
      return allBookings.map((booking) => {
        return {
          ...booking._doc,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        }
      })
    } catch (err) {
      throw err
    }
  },
  bookEvent: async (args) => {
    try {
      const myEvent = await EventModel.findOne({ _id: args.eventId })
      const myUser = await UserModel.findOne({ email: "test@test.com" })
      const bookingModel = new BookingModel({
        event: myEvent,
        user: myUser,
      })

      const result = await bookingModel.save()
      return { ...result._doc, user: user.bind(this, result._doc.user), event: singleEvent.bind(this, result._doc.event), createdAt: new Date(result._doc.createdAt).toISOString(), updatedAt: new Date(result._doc.updatedAt).toISOString() }
    } catch (err) {
      throw err
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await BookingModel.findById(args.bookingId).populate("event")
      const myEvent = { ...booking.event._doc, creator: user.bind(this, booking.event._doc.creator) }
      await BookingModel.deleteOne({ _id: args.bookingId })
      return myEvent
    } catch (err) {
      throw err
    }
  },
}
